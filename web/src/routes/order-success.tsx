import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@/components/Container";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/order-success")({
  validateSearch: (search: Record<string, unknown>) => ({
    session_id: String(search.session_id ?? ""),
  }),
  component: OrderSuccessPage,
});

function OrderSuccessPage() {
  return (
    <>
      <div className="pt-32 pb-16 bg-[var(--color-linen)]">
        <Container>
          <div className="max-w-xl">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-medium text-[var(--color-ink)]">
              You're in!
            </h1>
            <p className="mt-4 text-[var(--color-muted)] text-lg leading-relaxed">
              Your payment was received and your CSA share is reserved. Welcome to the Sweet
              Source Farmstead family.
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-12 max-w-xl">
          <div className="space-y-6">
            <div className="border-l-4 border-[var(--color-sage)] pl-5">
              <h2 className="font-medium text-[var(--color-ink)] mb-1">What happens next?</h2>
              <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                You'll receive a confirmation email shortly. We'll be in touch before your first
                pickup with details on timing and what to expect in your share.
              </p>
            </div>

            <div className="border-l-4 border-[var(--color-sage)] pl-5">
              <h2 className="font-medium text-[var(--color-ink)] mb-1">Pickup schedule</h2>
              <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                Shares are available for pickup Thursday 3–6 pm, Friday 4–7 pm, and
                Saturday 9 am–12 pm. If none of those work, reach out and we'll figure
                something out.
              </p>
            </div>

            <div className="border-l-4 border-[var(--color-sage)] pl-5">
              <h2 className="font-medium text-[var(--color-ink)] mb-1">Questions?</h2>
              <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                Don't hesitate to reach out through our{" "}
                <Link to="/contact" className="text-[var(--color-ink)] underline hover:no-underline">
                  contact page
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/"
              className="inline-block bg-[var(--color-ink)] text-white px-6 py-3 text-sm font-medium hover:bg-[var(--color-ink)]/90 transition-colors"
            >
              Back to the Farm
            </Link>
            <Link
              to="/csa"
              className="inline-block border border-[var(--color-linen)] px-6 py-3 text-sm font-medium text-[var(--color-muted)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)] transition-colors"
            >
              View CSA page
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}
