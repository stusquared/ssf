import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin";

export const Route = createFileRoute("/admin/dashboard")({
  component: Dashboard,
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

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [salesEnabled, setSalesEnabled] = useState(true);
  const [savingSales, setSavingSales] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const [productsRes, settingsRes] = await Promise.all([
      adminFetch("/api/admin/products"),
      adminFetch("/api/admin/settings"),
    ]);
    if (productsRes.ok) setProducts(await productsRes.json());
    else setError("Failed to load packages.");
    if (settingsRes.ok) {
      const { salesEnabled: enabled } = (await settingsRes.json()) as {
        salesEnabled: boolean;
      };
      setSalesEnabled(enabled);
    }
    setLoading(false);
  }

  useEffect(() => { void load(); }, []);

  async function toggleSales() {
    const next = !salesEnabled;
    if (
      !next &&
      !confirm(
        "Close CSA sales?\n\nEvery package will be hidden from the CSA page and replaced with the waitlist form. Nobody can check out until you turn sales back on.",
      )
    ) {
      return;
    }
    setSavingSales(true);
    const res = await adminFetch("/api/admin/settings", {
      method: "PUT",
      body: JSON.stringify({ salesEnabled: next }),
    });
    if (res.ok) setSalesEnabled(next);
    else setError("Failed to update sales setting.");
    setSavingSales(false);
  }

  async function toggleActive(product: Product) {
    const updated = { ...product, is_active: product.is_active ? false : true };
    const body = {
      name: updated.name,
      description: updated.description ?? undefined,
      price_cents: updated.price_cents,
      timeframe: updated.timeframe,
      total_spots: updated.total_spots,
      spots_remaining: updated.spots_remaining,
      is_active: Boolean(updated.is_active),
    };
    await adminFetch(`/api/admin/products/${product.id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
    await load();
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await adminFetch(`/api/admin/products/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif text-[var(--color-ink)]">CSA Packages</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage the packages shown on the CSA page.
          </p>
        </div>
        <Link
          to="/admin/new-product"
          className="bg-[var(--color-ink)] text-white px-5 py-2.5 text-sm font-medium hover:bg-[var(--color-ink)]/90 transition-colors"
        >
          + New Package
        </Link>
      </div>

      {!loading && (
        <div
          className={`mb-8 border p-5 flex items-start justify-between gap-6 transition-colors ${
            salesEnabled ? "bg-white border-gray-100" : "bg-amber-50 border-amber-200"
          }`}
        >
          <div>
            <p className="text-sm font-medium text-[var(--color-ink)]">
              {salesEnabled ? "Sales are open" : "Sales are closed"}
            </p>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed max-w-lg">
              {salesEnabled
                ? "Customers can see every active package and check out. Close sales to pause all purchases at once — the CSA page will show the waitlist form instead."
                : "All packages are hidden from the CSA page and checkout is blocked. Visitors see the waitlist form. Your packages and their spot counts are untouched."}
            </p>
          </div>
          <button
            onClick={toggleSales}
            disabled={savingSales}
            aria-pressed={salesEnabled}
            className={`relative w-12 h-6 rounded-full shrink-0 mt-0.5 transition-colors disabled:opacity-50 ${
              salesEnabled ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                salesEnabled ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      )}

      {loading && <p className="text-sm text-gray-400">Loading…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && products.length === 0 && (
        <div className="border-2 border-dashed border-gray-200 rounded p-12 text-center">
          <p className="text-gray-400 text-sm">No packages yet.</p>
          <Link to="/admin/new-product" className="text-[var(--color-ink)] text-sm underline mt-2 inline-block">
            Create your first package
          </Link>
        </div>
      )}

      {products.length > 0 && (
        <div className="bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Package</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Timeframe</th>
                <th className="text-right px-5 py-3 font-medium text-gray-600">Price</th>
                <th className="text-right px-5 py-3 font-medium text-gray-600">Spots</th>
                <th className="text-center px-5 py-3 font-medium text-gray-600">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-medium text-[var(--color-ink)]">{p.name}</span>
                    {p.description && (
                      <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{p.description}</p>
                    )}
                  </td>
                  <td className="px-5 py-4 text-gray-600">{p.timeframe}</td>
                  <td className="px-5 py-4 text-right text-gray-700">{formatPrice(p.price_cents)}</td>
                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    <span
                      className={
                        p.spots_remaining === 0
                          ? "text-red-500 font-medium"
                          : "text-gray-700"
                      }
                    >
                      {p.spots_remaining}
                    </span>
                    <span className="text-gray-400"> / {p.total_spots}</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => toggleActive(p)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        p.is_active
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${p.is_active ? "bg-green-500" : "bg-gray-400"}`}
                      />
                      {p.is_active ? "Active" : "Inactive"}
                    </button>
                    {p.is_active && !salesEnabled && (
                      <p className="text-[10px] text-amber-700 mt-1">hidden — sales closed</p>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        to="/admin/edit-product/$id"
                        params={{ id: String(p.id) }}
                        className="text-[var(--color-ink)] hover:underline text-xs font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="text-red-400 hover:text-red-600 text-xs font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
