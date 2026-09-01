import { redirect } from "next/navigation";

export default function AdminInstructorsPage() {
  redirect("/admin/staff?tab=instructors");
}

