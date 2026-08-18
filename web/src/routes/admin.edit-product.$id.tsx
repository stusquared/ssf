import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ProductForm, type ProductFormValues } from "@/components/admin/ProductForm";
import { adminFetch } from "@/lib/admin";

export const Route = createFileRoute("/admin/edit-product/$id")({
  component: EditProductPage,
});

type Product = {
  id: number;
  name: string;
  description: string | null;
  price_cents: number;
  timeframe: string;
  total_spots: number;
  spots_remaining: number;
  is_active: number;
};

function EditProductPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch(`/api/admin/products/${id}`)
      .then((r) => r.json())
      .then((data) => { setProduct(data as Product); setLoading(false); })
      .catch(() => { navigate({ to: "/admin/dashboard" }); });
  }, [id, navigate]);

  async function handleSubmit(values: ProductFormValues) {
    const res = await adminFetch(`/api/admin/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(values),
    });
    if (!res.ok) throw new Error("Failed to update package.");
    navigate({ to: "/admin/dashboard" });
  }

  if (loading) return <p className="text-sm text-gray-400">Loading…</p>;
  if (!product) return null;

  const defaultValues: ProductFormValues = {
    name: product.name,
    description: product.description ?? "",
    price_cents: product.price_cents,
    timeframe: product.timeframe,
    total_spots: product.total_spots,
    spots_remaining: product.spots_remaining,
    is_active: Boolean(product.is_active),
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-serif text-[var(--color-ink)] mb-8">Edit Package</h1>
      <ProductForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
      />
    </div>
  );
}
