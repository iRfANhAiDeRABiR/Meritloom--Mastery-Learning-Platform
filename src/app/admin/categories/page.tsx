import type { Metadata } from "next";
import { getAdminCategories } from "@/lib/queries/admin";
import { CategoriesView } from "@/components/admin/categories-view";

export const metadata: Metadata = {
  title: "Categories | Meritloom Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return <CategoriesView categories={categories} />;
}
