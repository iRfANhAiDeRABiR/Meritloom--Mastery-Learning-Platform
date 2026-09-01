import { AlertCircle, ExternalLink, Info, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface LegalCalloutProps {
  type?: "info" | "important" | "transparency" | "security";
  title?: string;
  text: string;
}

export function LegalCallout({
  type = "info",
  title,
  text,
}: LegalCalloutProps) {
  const getIcon = () => {
    switch (type) {
      case "security":
        return <ShieldCheck className="size-5 text-emerald-500 shrink-0" aria-hidden="true" />;
      case "important":
        return <AlertCircle className="size-5 text-amber-500 shrink-0" aria-hidden="true" />;
      case "transparency":
        return <ExternalLink className="size-5 text-primary shrink-0" aria-hidden="true" />;
      case "info":
      default:
        return <Info className="size-5 text-mint-ink shrink-0" aria-hidden="true" />;
    }
  };

  const getContainerStyle = () => {
    switch (type) {
      case "security":
        return "border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 text-ink";
      case "important":
        return "border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 text-ink";
      case "transparency":
        return "border-primary/30 bg-primary/5 dark:bg-primary/10 text-ink";
      case "info":
      default:
        return "border-mint-ink/30 bg-mint/20 dark:bg-mint/10 text-ink";
    }
  };

  return (
    <div className={cn("my-6 flex items-start gap-3.5 rounded-2xl border p-5 shadow-xs", getContainerStyle())}>
      {getIcon()}
      <div className="space-y-1 text-sm leading-relaxed">
        {title && <p className="font-bold text-ink">{title}</p>}
        <p className="text-muted leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
