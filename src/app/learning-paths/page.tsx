import { redirect } from "next/navigation";

export default function LearningPathsIndexPage() {
  // Default to our primary flagship learning path
  redirect("/learning-paths/web-development-foundations");
}
