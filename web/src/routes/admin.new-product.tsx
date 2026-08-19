import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProductForm, type ProductFormValues } from "@/components/admin/ProductForm";
import { adminFetch, describeError } from "@/lib/admin";

export const Route = createFileRoute("/admin/new-product")({
  component: NewProductPage,
});

function NewProductPage() {
  const navigate = useNavigate();

  async function handleSubmit(values: ProductFormValues) {
    const res = await adminFetch("/api/admin/products", {
      method: "POST",
      body: JSON.stringify(values),
    });
    if (!res.ok) throw new Error(await describeError(res, "Failed to create package."));
    navigate({ to: "/admin/dashboard" });
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-serif text-[var(--color-ink)] mb-8">New CSA Package</h1>
      <ProductForm onSubmit={handleSubmit} submitLabel="Create Package" />
    </div>
  );
}
