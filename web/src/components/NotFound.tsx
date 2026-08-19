import { Link } from "@tanstack/react-router";
import { Container } from "@/components/Container";

/**
 * Without this the router renders nothing for an unmatched path, so a mistyped
 * URL — or the right path on a deployment that predates that route — is an
 * unexplained white screen.
 */
export function NotFound() {
  return (
    <div className="pt-32 pb-24">
      <Container>
        <div className="max-w-lg">
          <p className="text-xs uppercase tracking-[0.15em] text-[var(--color-muted)]">
            404
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-medium mt-3 text-[var(--color-ink)]">
            We couldn't find that page
          </h1>
          <p className="mt-4 text-[var(--color-muted)] leading-relaxed">
            The link may be out of date, or the address may have a typo in it.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/"
              className="inline-block bg-[var(--color-sage)] text-white px-6 py-3 text-sm font-medium hover:bg-[var(--color-sage-dark)] transition-colors"
            >
              Back to the Farm
            </Link>
            <Link
              to="/csa"
              className="inline-block border border-[var(--color-linen)] px-6 py-3 text-sm font-medium text-[var(--color-muted)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)] transition-colors"
            >
              CSA Program
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
