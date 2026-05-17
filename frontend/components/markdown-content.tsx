import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let key = 0;

  for (const match of text.matchAll(pattern)) {
    const token = match[0];
    const index = match.index ?? 0;

    if (index > lastIndex) {
      nodes.push(text.slice(lastIndex, index));
    }

    if (token.startsWith("**") && token.endsWith("**")) {
      nodes.push(
        <strong key={`strong-${key++}`} className="font-semibold text-[hsl(var(--foreground))]">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      nodes.push(
        <code
          key={`code-${key++}`}
          className="rounded-md bg-[hsl(var(--muted))] px-1.5 py-0.5 font-mono text-[0.95em] text-[hsl(var(--foreground))]"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else {
      const label = token.match(/\[([^\]]+)\]/)?.[1] ?? token;
      const href = token.match(/\(([^)]+)\)/)?.[1] ?? "#";
      nodes.push(
        <a
          key={`link-${key++}`}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-[hsl(var(--accent))] underline underline-offset-4"
        >
          {label}
        </a>
      );
    }

    lastIndex = index + token.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function isTableLine(line: string) {
  return line.includes("|") && line.split("|").filter((cell) => cell.trim().length > 0).length >= 2;
}

function parseTable(lines: string[], start: number) {
  const rows: string[][] = [];
  let index = start;

  while (index < lines.length && isTableLine(lines[index])) {
    const row = lines[index]
      .split("|")
      .map((cell) => cell.trim())
      .filter((cell, cellIndex, all) => !(cellIndex === 0 && cell === "") && !(cellIndex === all.length - 1 && cell === ""));

    const isDivider = row.every((cell) => /^:?-{3,}:?$/.test(cell));
    if (!isDivider) {
      rows.push(row);
    }

    index += 1;
  }

  return { rows, nextIndex: index };
}

export function MarkdownContent({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const rawLine = lines[index];
    const line = rawLine.trim();

    if (!line) {
      index += 1;
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const HeadingTag: "h2" | "h3" | "h4" | "h5" | "h6" =
        ({ 1: "h2", 2: "h3", 3: "h4", 4: "h5", 5: "h6", 6: "h6" } as const)[level as 1 | 2 | 3 | 4 | 5 | 6] ?? "h6";
      const sizeClass =
        level === 1 ? "text-2xl md:text-[1.95rem]" : level === 2 ? "text-xl md:text-[1.45rem]" : "text-lg md:text-xl";

      blocks.push(
        <HeadingTag key={`heading-${index}`} className={cn("font-semibold tracking-tight text-[hsl(var(--foreground))]", sizeClass)}>
          {renderInline(headingMatch[2].trim())}
        </HeadingTag>
      );
      index += 1;
      continue;
    }

    if (/^(-{3,}|\*{3,})$/.test(line)) {
      blocks.push(<hr key={`hr-${index}`} className="border-0 border-t border-[hsl(var(--border))]" />);
      index += 1;
      continue;
    }

    if (isTableLine(rawLine)) {
      const { rows, nextIndex } = parseTable(lines, index);
      if (rows.length > 0) {
        const [header, ...body] = rows;
        blocks.push(
          <div key={`table-${index}`} className="overflow-x-auto rounded-xl border border-[hsl(var(--border))]">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]">
                <tr>
                  {header.map((cell, cellIndex) => (
                    <th key={`th-${index}-${cellIndex}`} className="px-4 py-3 font-medium">
                      {renderInline(cell)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {body.map((row, rowIndex) => (
                  <tr key={`tr-${index}-${rowIndex}`} className="border-t border-[hsl(var(--border))]">
                    {row.map((cell, cellIndex) => (
                      <td key={`td-${index}-${rowIndex}-${cellIndex}`} className="px-4 py-3 text-[hsl(var(--panel-foreground))]">
                        {renderInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      index = nextIndex;
      continue;
    }

    const bulletMatch = rawLine.match(/^\s*[-*]\s+(.*)$/);
    if (bulletMatch) {
      const items: string[] = [];
      while (index < lines.length) {
        const listMatch = lines[index].match(/^\s*[-*]\s+(.*)$/);
        if (!listMatch) {
          break;
        }
        items.push(listMatch[1].trim());
        index += 1;
      }

      blocks.push(
        <ul key={`ul-${index}`} className="space-y-2 pl-5 text-[hsl(var(--panel-foreground))]">
          {items.map((item, itemIndex) => (
            <li key={`li-${index}-${itemIndex}`} className="list-disc pl-1 leading-7 marker:text-[hsl(var(--accent))]">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    const orderedMatch = rawLine.match(/^\s*\d+\.\s+(.*)$/);
    if (orderedMatch) {
      const items: string[] = [];
      while (index < lines.length) {
        const listMatch = lines[index].match(/^\s*\d+\.\s+(.*)$/);
        if (!listMatch) {
          break;
        }
        items.push(listMatch[1].trim());
        index += 1;
      }

      blocks.push(
        <ol key={`ol-${index}`} className="space-y-2 pl-5 text-[hsl(var(--panel-foreground))]">
          {items.map((item, itemIndex) => (
            <li key={`oli-${index}-${itemIndex}`} className="list-decimal pl-1 leading-7 marker:font-medium marker:text-[hsl(var(--accent))]">
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    const paragraphLines: string[] = [];
    while (index < lines.length && lines[index].trim()) {
      const nextLine = lines[index].trim();
      if (
        /^(#{1,6})\s+/.test(nextLine) ||
        /^(-{3,}|\*{3,})$/.test(nextLine) ||
        /^\s*[-*]\s+/.test(lines[index]) ||
        /^\s*\d+\.\s+/.test(lines[index]) ||
        isTableLine(lines[index])
      ) {
        break;
      }
      paragraphLines.push(nextLine);
      index += 1;
    }

    if (paragraphLines.length > 0) {
      blocks.push(
        <p key={`p-${index}`} className="leading-7 text-[hsl(var(--panel-foreground))]">
          {renderInline(paragraphLines.join(" "))}
        </p>
      );
      continue;
    }

    index += 1;
  }

  return <div className={cn("space-y-4 text-[15px]", className)}>{blocks}</div>;
}
