import type { PracticeCheckEvaluation, PracticeCheckResultItem, PracticeRequirementCheck } from "./types";

/**
 * Deterministic safe client-side requirement checker.
 * Uses browser DOMParser to safely inspect HTML structure and regex for CSS rules.
 * Never uses eval or dynamic script execution.
 */
export function evaluatePracticeRequirements(
  html: string,
  css: string,
  requirements: PracticeRequirementCheck[],
): PracticeCheckEvaluation {
  if (!requirements || requirements.length === 0) {
    return {
      passed: true,
      score: 0,
      total: 0,
      summaryMessage: "No specific requirements configured for this practice.",
      checks: [],
    };
  }

  let doc: Document | null = null;
  if (typeof window !== "undefined" && typeof DOMParser !== "undefined") {
    try {
      const parser = new DOMParser();
      doc = parser.parseFromString(html, "text/html");
    } catch {
      doc = null;
    }
  }

  const results: PracticeCheckResultItem[] = [];
  let passedCount = 0;

  for (const req of requirements) {
    let passed = false;
    let feedback = "";

    switch (req.checkType) {
      case "element_exists": {
        if (doc && req.selector) {
          const el = doc.querySelector(req.selector);
          passed = Boolean(el);
          if (!passed) feedback = `Add a <${req.selector}> element`;
        } else {
          // Fallback string matching if DOMParser is unavailable
          passed = Boolean(req.selector && html.toLowerCase().includes(`<${req.selector.toLowerCase()}`));
        }
        break;
      }

      case "element_count": {
        if (doc && req.selector) {
          const count = doc.querySelectorAll(req.selector).length;
          const min = req.minCount ?? 1;
          passed = count >= min;
          if (!passed) feedback = `Found ${count} of ${min} required <${req.selector}> elements`;
        }
        break;
      }

      case "attribute_exists": {
        if (doc && req.selector && req.attribute) {
          const el = doc.querySelector(req.selector);
          if (el) {
            const attrVal = el.getAttribute(req.attribute);
            passed = attrVal !== null && attrVal.trim().length > 0;
            if (!passed) feedback = `Add the '${req.attribute}' attribute to <${req.selector}>`;
          } else {
            feedback = `Element <${req.selector}> not found`;
          }
        }
        break;
      }

      case "text_not_empty": {
        if (doc && req.selector) {
          const el = doc.querySelector(req.selector);
          passed = Boolean(el && el.textContent && el.textContent.trim().length > 0);
          if (!passed) feedback = `Add content inside <${req.selector}>`;
        }
        break;
      }

      case "css_selector_exists": {
        if (req.selector) {
          const cleanedCss = css.replace(/\s+/g, " ");
          const escaped = req.selector.replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&");
          const regex = new RegExp(`${escaped}\\s*[{,]`, "i");
          passed = regex.test(cleanedCss);
          if (!passed) feedback = `Add CSS rule for '${req.selector}'`;
        }
        break;
      }

      case "css_property_exists": {
        if (req.property) {
          const cleanedCss = css.toLowerCase();
          const propName = req.property.toLowerCase().trim();
          if (req.expectedValue) {
            const expVal = req.expectedValue.toLowerCase().trim();
            passed = cleanedCss.includes(propName) && cleanedCss.includes(expVal);
            if (!passed) feedback = `Set '${req.property}: ${req.expectedValue}' in your CSS`;
          } else {
            passed = cleanedCss.includes(propName);
            if (!passed) feedback = `Use the '${req.property}' property in your CSS`;
          }
        }
        break;
      }

      default:
        passed = true;
    }

    if (passed) passedCount++;

    results.push({
      id: req.id,
      label: req.label,
      passed,
      feedback: passed ? undefined : feedback,
    });
  }

  const total = requirements.length;
  let summaryMessage = "Nice progress";

  if (passedCount === total) {
    summaryMessage = "All suggestions completed! Great job.";
  } else if (passedCount === 0) {
    summaryMessage = `0 of ${total} suggestions found so far. Keep going!`;
  } else {
    summaryMessage = `${passedCount} of ${total} suggestions found.`;
  }

  return {
    passed: passedCount === total,
    score: passedCount,
    total,
    summaryMessage,
    checks: results,
  };
}
