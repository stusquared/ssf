import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";

export const Route = createFileRoute("/checkout")({
  validateSearch: (search: Record<string, unknown>) => ({
    productId: Number(search.productId ?? 0),
    cancelled: search.cancelled === "1",
  }),
  component: CheckoutPage,
});

type Product = {
  id: number;
  name: string;
  description: string | null;
  price_cents: number;
  timeframe: string;
  spots_remaining: number;
};

const schema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().max(30).optional(),
  address_line1: z.string().min(1, "Street address is required"),
  address_line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "ZIP code is required"),
});

type FormValues = z.infer<typeof schema>;

const inputClass =
  "w-full border border-[var(--color-linen)] bg-white px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-ink)] transition-colors";

function CheckoutPage() {
  const { productId, cancelled } = Route.useSearch();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!productId) {
      navigate({ to: "/csa" });
      return;
    }
    fetch(`/api/csa/products/${productId}`)
      .then(async (r) => {
        if (!r.ok) {
          // 403 means the client closed sales while this tab was open — say so
          // rather than implying the package itself went away.
          const detail = (await r.json().catch(() => null)) as { error?: string } | null;
          throw new Error(
            r.status === 403 && detail?.error
              ? detail.error
              : "This package is no longer available.",
          );
        }
        return r.json();
      })
      .then((data) => setProduct(data as Product))
      .catch((e: Error) => setLoadError(e.message));
  }, [productId, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    setSubmitError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, customer: data }),
      });
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !json.url) {
        setSubmitError(json.error ?? "Something went wrong. Please try again.");
        return;
      }
      window.location.href = json.url;
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    }
  };

  if (loadError) {
    return (
      <div className="pt-32 pb-16">
        <Container>
          <p className="text-[var(--color-muted)]">{loadError}</p>
          <a href="/csa" className="text-[var(--color-ink)] underline text-sm mt-4 inline-block">
            ← Back to CSA packages
          </a>
        </Container>
      </div>
    );
  }

  return (
    <>
      <div className="pt-32 pb-10 bg-[var(--color-linen)]">
        <Container>
          <a href="/csa" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors">
            ← Back to CSA packages
          </a>
          <h1 className="font-serif text-4xl sm:text-5xl font-medium mt-4">Sign Up</h1>
          {product && (
            <p className="text-[var(--color-muted)] mt-2">
              {product.name} · {product.timeframe}
            </p>
          )}
        </Container>
      </div>

      <Container>
        <div className="py-12 grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-4xl">
          {/* Form */}
          <div className="lg:col-span-3">
            {cancelled && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-sm text-amber-800">
                Your payment was cancelled — your spot has not been reserved. Fill out the form
                and try again when you're ready.
              </div>
            )}

            <h2 className="font-serif text-2xl mb-6">Your Information</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Full Name <span className="text-[var(--color-terra)]">*</span>
                </label>
                <input {...register("name")} className={inputClass} placeholder="Jane Smith" />
                {errors.name && (
                  <p className="text-xs text-[var(--color-terra)] mt-1">{errors.name.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Email <span className="text-[var(--color-terra)]">*</span>
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    className={inputClass}
                    placeholder="jane@example.com"
                  />
                  {errors.email && (
                    <p className="text-xs text-[var(--color-terra)] mt-1">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Phone (optional)</label>
                  <input
                    {...register("phone")}
                    type="tel"
                    className={inputClass}
                    placeholder="(555) 000-0000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Street Address <span className="text-[var(--color-terra)]">*</span>
                </label>
                <input
                  {...register("address_line1")}
                  className={inputClass}
                  placeholder="123 Main St"
                />
                {errors.address_line1 && (
                  <p className="text-xs text-[var(--color-terra)] mt-1">{errors.address_line1.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Apartment, suite, etc. (optional)
                </label>
                <input
                  {...register("address_line2")}
                  className={inputClass}
                  placeholder="Apt 4B"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium mb-1.5">
                    City <span className="text-[var(--color-terra)]">*</span>
                  </label>
                  <input {...register("city")} className={inputClass} placeholder="Raleigh" />
                  {errors.city && (
                    <p className="text-xs text-[var(--color-terra)] mt-1">{errors.city.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    State <span className="text-[var(--color-terra)]">*</span>
                  </label>
                  <input {...register("state")} className={inputClass} placeholder="NC" maxLength={2} />
                  {errors.state && (
                    <p className="text-xs text-[var(--color-terra)] mt-1">{errors.state.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    ZIP <span className="text-[var(--color-terra)]">*</span>
                  </label>
                  <input {...register("zip")} className={inputClass} placeholder="27601" />
                  {errors.zip && (
                    <p className="text-xs text-[var(--color-terra)] mt-1">{errors.zip.message}</p>
                  )}
                </div>
              </div>

              {submitError && (
                <p className="text-sm text-[var(--color-terra)]">{submitError}</p>
              )}

              <div className="pt-4">
                <Button type="submit" disabled={isSubmitting} className="w-full py-4">
                  {isSubmitting ? "Redirecting to payment…" : "Continue to Payment →"}
                </Button>
                <p className="text-xs text-[var(--color-muted)] text-center mt-3">
                  You'll be taken to Stripe's secure checkout to complete your payment.
                </p>
              </div>
            </form>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-2">
            <div className="bg-[var(--color-linen)] p-6 sticky top-8">
              <h3 className="font-serif text-lg mb-4 text-[var(--color-ink)]">Order Summary</h3>
              {product ? (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-muted)]">{product.name}</span>
                    <span className="font-medium text-[var(--color-ink)]">
                      ${(product.price_cents / 100).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-muted)]">{product.timeframe}</p>
                  <div className="border-t border-[var(--color-muted)]/20 pt-3 flex justify-between">
                    <span className="text-sm font-medium text-[var(--color-ink)]">Total</span>
                    <span className="font-medium text-[var(--color-ink)]">
                      ${(product.price_cents / 100).toFixed(2)}
                    </span>
                  </div>
                  {product.spots_remaining <= 5 && product.spots_remaining > 0 && (
                    <p className="text-xs text-amber-700 bg-amber-50 px-3 py-2 mt-2">
                      Only {product.spots_remaining} spot{product.spots_remaining !== 1 ? "s" : ""} remaining!
                    </p>
                  )}
                </div>
              ) : (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
