import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";

export default function AuthIndexPage() {
  redirect(routes.auth.signIn);
}

