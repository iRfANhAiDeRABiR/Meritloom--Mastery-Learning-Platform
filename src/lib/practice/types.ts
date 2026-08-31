export type PracticeLanguage = "html" | "css" | "javascript";

export type SafeCheckType =
  | "element_exists"
  | "element_count"
  | "attribute_exists"
  | "text_not_empty"
  | "css_selector_exists"
  | "css_property_exists";

export interface PracticeRequirementCheck {
  id: string;
  label: string;
  checkType: SafeCheckType;
  selector?: string;
  attribute?: string;
  property?: string;
  expectedValue?: string;
  minCount?: number;
}

export interface PracticeStarterCode {
  html: string;
  css: string;
  javascript: string;
}

export interface PracticeConfig {
  practiceType: "code";
  languages: PracticeLanguage[];
  instructions: string;
  requirements: PracticeRequirementCheck[];
  starterCode: PracticeStarterCode;
  hints?: string[];
  expectedPreviewDescription?: string;
  estimatedMinutes?: number;
}

export interface PracticeCheckResultItem {
  id: string;
  label: string;
  passed: boolean;
  feedback?: string;
}

export interface PracticeCheckEvaluation {
  passed: boolean;
  score: number;
  total: number;
  summaryMessage: string;
  checks: PracticeCheckResultItem[];
}

export interface ConsoleLogMessage {
  id: string;
  type: "log" | "warn" | "error" | "info";
  content: string;
  timestamp: number;
}

export interface PracticeDraftState {
  html: string;
  css: string;
  javascript: string;
  hasDraft: boolean;
  lastSavedAt?: string;
}
