import Link from "next/link";
import { LegalCallout } from "./legal-callout";
import { routes } from "@/lib/routes";

interface LegalSectionData {
  id: string;
  title: string;
  content: string;
  callout?: {
    type: "info" | "important" | "transparency" | "security";
    title?: string;
    text: string;
  };
}

export function LegalSectionRenderer({ section }: { section: LegalSectionData }) {
  // Simple markdown renderer for clean readable prose
  const lines = section.content.trim().split("\n");

  return (
    <section
      id={section.id}
      aria-labelledby={`heading-${section.id}`}
      className="scroll-mt-24 pt-8 pb-10 border-b border-line/60 last:border-b-0"
    >
      <h2
        id={`heading-${section.id}`}
        className="text-2xl font-bold tracking-tight text-ink mb-4"
      >
        {section.title}
      </h2>

      {section.callout && (
        <LegalCallout
          type={section.callout.type}
          title={section.callout.title}
          text={section.callout.text}
        />
      )}

      <div className="space-y-4 text-[15px] sm:text-base leading-[1.75] text-muted">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return null;

          if (trimmed.startsWith("### ")) {
            return (
              <h3 key={idx} className="text-lg font-bold text-ink pt-3">
                {trimmed.replace("### ", "")}
              </h3>
            );
          }

          if (trimmed.startsWith("- ")) {
            return (
              <li key={idx} className="ml-5 list-disc text-muted pl-1">
                <span dangerouslySetInnerHTML={{ __html: formatBoldAndLinks(trimmed.replace("- ", "")) }} />
              </li>
            );
          }

          return (
            <p
              key={idx}
              dangerouslySetInnerHTML={{ __html: formatBoldAndLinks(trimmed) }}
            />
          );
        })}
      </div>
    </section>
  );
}

function formatBoldAndLinks(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-ink">$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="rounded bg-surface px-1.5 py-0.5 font-mono text-xs text-primary border border-line">$1</code>');
}
