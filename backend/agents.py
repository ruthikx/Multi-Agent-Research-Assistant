import asyncio
from typing import Any

from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_mistralai import ChatMistralAI

from backend.settings import get_settings
from backend.tools import SearchResult, format_search_results, scrape_url, web_search


def _get_llm() -> ChatMistralAI:
    settings = get_settings()
    if not settings.mistral_api_key:
        raise RuntimeError("Missing MISTRAL_API_KEY. Add it to backend/.env before running research.")

    return ChatMistralAI(
        api_key=settings.mistral_api_key,
        model=settings.mistral_model,
        temperature=0.2,
    )


search_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are the Search Agent in a research team. Summarize web search results clearly, "
            "highlight source quality, and keep source URLs visible.",
        ),
        (
            "human",
            "Research topic: {topic}\n\n"
            "Raw search results:\n{results}\n\n"
            "Return:\n"
            "1. A short overview of the result set\n"
            "2. Key source highlights\n"
            "3. A bullet list of source URLs",
        ),
    ]
)

reader_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are the Reader Agent. Synthesize scraped source material into a concise but detailed "
            "research briefing grounded in the provided content.",
        ),
        (
            "human",
            "Research topic: {topic}\n\n"
            "Scraped source material:\n{documents}\n\n"
            "Produce a source-grounded briefing with:\n"
            "- Main findings\n"
            "- Important evidence or data points\n"
            "- Any caveats or disagreements across sources",
        ),
    ]
)

writer_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are an expert research writer. Write polished, structured, factual reports for a "
            "professional audience.",
        ),
        (
            "human",
            "Write a detailed research report on the topic below.\n\n"
            "Topic: {topic}\n\n"
            "Research gathered:\n{research}\n\n"
            "Structure the report as:\n"
            "- Executive Summary\n"
            "- Introduction\n"
            "- Key Findings\n"
            "- Strategic Takeaways\n"
            "- Conclusion\n"
            "- Sources\n\n"
            "Use crisp headings, strong synthesis, and a confident but evidence-based tone.",
        ),
    ]
)

critic_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are a rigorous research critic. Evaluate clarity, factual grounding, structure, and "
            "whether the report overstates its claims.",
        ),
        (
            "human",
            "Review the report below and respond in this exact format:\n\n"
            "Score: X/10\n\n"
            "Strengths:\n"
            "- ...\n"
            "- ...\n\n"
            "Areas to Improve:\n"
            "- ...\n"
            "- ...\n\n"
            "One line verdict:\n"
            "...\n\n"
            "Report:\n{report}",
        ),
    ]
)


async def run_search_agent(topic: str) -> dict[str, Any]:
    llm = _get_llm()
    results = await web_search(topic)
    results_text = format_search_results(results)
    summary = await (search_prompt | llm | StrOutputParser()).ainvoke(
        {"topic": topic, "results": results_text}
    )
    return {
        "results": results,
        "formatted_results": results_text,
        "summary": summary,
    }


async def run_reader_agent(topic: str, results: list[SearchResult]) -> dict[str, Any]:
    llm = _get_llm()
    settings = get_settings()
    top_results = [result for result in results if result.get("url")][: settings.scrape_source_limit]

    if not top_results:
        return {
            "documents": [],
            "synthesis": "No valid source URLs were available to scrape.",
        }

    scrape_tasks = [scrape_url(result["url"]) for result in top_results]
    scraped_chunks = await asyncio.gather(*scrape_tasks, return_exceptions=True)

    documents = []
    for result, content in zip(top_results, scraped_chunks, strict=False):
        if isinstance(content, Exception):
            text = f"Scrape failed: {content}"
        else:
            text = content

        documents.append(
            {
                "title": result["title"],
                "url": result["url"],
                "content": text,
            }
        )

    document_text = "\n\n".join(
        [
            f"Title: {document['title']}\nURL: {document['url']}\nContent: {document['content']}"
            for document in documents
        ]
    )

    synthesis = await (reader_prompt | llm | StrOutputParser()).ainvoke(
        {"topic": topic, "documents": document_text}
    )

    return {"documents": documents, "synthesis": synthesis}


async def run_writer_chain(topic: str, search_summary: str, reader_summary: str) -> str:
    llm = _get_llm()
    research = (
        f"Search Agent Summary:\n{search_summary}\n\n"
        f"Reader Agent Briefing:\n{reader_summary}"
    )
    return await (writer_prompt | llm | StrOutputParser()).ainvoke(
        {"topic": topic, "research": research}
    )


async def run_critic_chain(report: str) -> str:
    llm = _get_llm()
    return await (critic_prompt | llm | StrOutputParser()).ainvoke({"report": report})
