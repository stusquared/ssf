import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Container } from "@/components/Container";
import { WaitlistForm } from "@/components/WaitlistForm";

export const Route = createFileRoute("/csa")({
  component: CsaPage,
});

type Product = {
  id: number;
  name: string;
  description: string | null;
  price_cents: number;
  timeframe: string;
  spots_remaining: number;
  total_spots: number;
};

type ProductsResponse = { salesEnabled: boolean; products: Product[] };

function CsaPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [salesEnabled, setSalesEnabled] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/csa/products")
      .then((r) => r.json())
      .then((data) => {
        const res = data as ProductsResponse;
        setProducts(res.products ?? []);
        setSalesEnabled(res.salesEnabled !== false);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  // Sold-out packages still render above the waitlist — seeing what was offered
  // and at what price is what makes signing up for the next round worth doing.
  const hasBuyable = salesEnabled && products.some((p) => p.spots_remaining > 0);
  const showWaitlist = loaded && !hasBuyable;

  return (
    <>
      <div className="pt-32 pb-16 bg-[var(--color-linen)]">
        <Container>
          <h1 className="font-serif text-5xl sm:text-6xl font-medium">CSA Program</h1>
          <p className="mt-4 text-[var(--color-muted)] text-lg max-w-xl leading-relaxed">
            Community-supported agriculture — a direct partnership between our farm and your table.
          </p>
        </Container>
      </div>

      {/* Banner */}
      <div className="bg-[var(--color-linen)]">
        <img
          src="/farm/wildflower-field.jpg"
          alt="A field of daisies and wildflowers in front of the farm's tobacco barn, with a rainbow under a storm sky"
          className="w-full h-[280px] sm:h-[380px] lg:h-[440px] object-cover"
        />
      </div>

      <Container>
        <div className="py-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Info side */}
          <div>
            <h2 className="font-serif text-3xl mb-4">What to Expect</h2>
            <p className="text-[var(--color-muted)] leading-relaxed mb-8">
              Each week we harvest at our freshest and gather your share by hand. Our aim is
              to give you a wide variety of vegetables and herbs, while making sure the
              favorites you count on turn up consistently.
            </p>

            <dl className="m-0 divide-y divide-[var(--color-linen)] border-t border-b border-[var(--color-linen)]">
              {[
                {
                  term: "Your share",
                  desc: "Five to seven items each week.",
                },
                {
                  term: "Cost",
                  desc: "$35 per week, paid at sign-up. A four-pickup month comes to $140; a five-pickup month, $175.",
                },
                {
                  term: "Sign-ups",
                  desc: "Month to month. Registration opens on the 1st for the following month. If you had a share the month before, we hold your spot until the 5th.",
                },
                {
                  term: "Add-ons",
                  desc: "Eggs and chicken are available to purchase at pickup.",
                },
              ].map((row) => (
                <div key={row.term} className="grid grid-cols-1 sm:grid-cols-[8rem_1fr] gap-1 sm:gap-4 py-4">
                  <dt className="font-medium text-sm text-[var(--color-ink)]">{row.term}</dt>
                  <dd className="m-0 text-sm text-[var(--color-muted)] leading-relaxed">
                    {row.desc}
                  </dd>
                </div>
              ))}
            </dl>

            <h3 className="font-serif text-xl mt-10 mb-4">Pickup at the Farm</h3>
            <ul className="list-none m-0 p-0 space-y-2">
              {[
                { day: "Thursday", time: "3:00 – 6:00 pm" },
                { day: "Friday", time: "4:00 – 7:00 pm" },
                { day: "Saturday", time: "9:00 am – 12:00 pm" },
              ].map((slot) => (
                <li
                  key={slot.day}
                  className="flex items-baseline justify-between gap-4 text-sm border-b border-[var(--color-linen)] pb-2"
                >
                  <span className="font-medium text-[var(--color-ink)]">{slot.day}</span>
                  <span className="text-[var(--color-muted)]">{slot.time}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed mt-4">
              If none of those windows work for you, let us know — we'll talk it through and
              see what we can arrange.
            </p>

            <div className="mt-10 p-6 bg-[var(--color-linen)]">
              <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                <strong className="text-[var(--color-ink)]">Questions?</strong> Reach out via our{" "}
                <a href="/contact" className="text-[var(--color-sage)] hover:underline">
                  contact page
                </a>{" "}
                and we'll be happy to tell you more about the upcoming month.
              </p>
            </div>
          </div>

          {/* Packages side */}
          <div>
            <h2 className="font-serif text-3xl mb-4">
              {hasBuyable ? "Available Packages" : "Join the Waitlist"}
            </h2>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-6">
              {hasBuyable
                ? "Choose the share that works for you and sign up securely online."
                : !salesEnabled
                  ? "Sign-ups are closed at the moment. Leave your details and we'll let you know the moment they reopen."
                  : products.length > 0
                    ? "Every share has been claimed. Leave your details and you'll be first to hear when the next round opens."
                    : "There are no shares open right now. Leave your details and we'll be in touch when the next season opens."}
            </p>

            {!loaded && (
              <div className="space-y-4">
                {[1, 2].map((n) => (
                  <div key={n} className="animate-pulse border border-[var(--color-linen)] p-6">
                    <div className="h-5 bg-gray-200 rounded w-1/2 mb-3" />
                    <div className="h-4 bg-gray-100 rounded w-full mb-2" />
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                  </div>
                ))}
              </div>
            )}

            {loaded && products.length > 0 && (
              <div className="space-y-5">
                {products.map((p) => {
                  const soldOut = p.spots_remaining === 0;
                  const lowStock = !soldOut && p.spots_remaining <= 5;
                  return (
                    <div
                      key={p.id}
                      // White on the parchment page is what separates the card from the
                      // background; the page's own linen border all but disappears here.
                      className={`relative bg-white overflow-hidden transition-all duration-300 ${
                        soldOut
                          ? "opacity-65 shadow-sm"
                          : "shadow-[0_1px_3px_rgba(26,53,88,0.08)] hover:shadow-[0_14px_32px_rgba(26,53,88,0.14)] hover:-translate-y-1"
                      }`}
                    >
                      <div
                        className={`h-1 w-full ${soldOut ? "bg-[var(--color-muted)]/25" : "bg-[var(--color-terra)]"}`}
                      />

                      <div className="p-7">
                        <div className="flex items-start justify-between gap-5">
                          <div className="min-w-0">
                            <h3 className="font-serif text-2xl leading-tight text-[var(--color-ink)]">
                              {p.name}
                            </h3>
                            <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted)] mt-2">
                              {p.timeframe}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-serif text-3xl leading-none text-[var(--color-ink)]">
                              ${(p.price_cents / 100).toFixed(2)}
                            </p>
                            <p className="text-xs text-[var(--color-muted)] mt-1.5">per share</p>
                          </div>
                        </div>

                        {p.description && (
                          <p className="text-sm text-[var(--color-muted)] leading-relaxed mt-4">
                            {p.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between gap-4 mt-6 pt-5 border-t border-[var(--color-linen)]">
                          {/* Urgency reads from the dot's color plus the weight of the label —
                              terra text on white is too low-contrast to carry it alone. */}
                          <span
                            className={`inline-flex items-center gap-2 text-xs ${
                              lowStock
                                ? "font-medium text-[var(--color-ink)]"
                                : "text-[var(--color-muted)]"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                soldOut
                                  ? "bg-[var(--color-muted)]"
                                  : lowStock
                                    ? "bg-[var(--color-terra)]"
                                    : "bg-[var(--color-sage)]"
                              }`}
                            />
                            {soldOut
                              ? "Sold out"
                              : lowStock
                                ? `Only ${p.spots_remaining} spot${p.spots_remaining !== 1 ? "s" : ""} left`
                                : `${p.spots_remaining} of ${p.total_spots} spots remaining`}
                          </span>

                          {!soldOut && (
                            <Link
                              to="/checkout"
                              search={{ productId: p.id, cancelled: false }}
                              className="shrink-0 bg-[var(--color-sage)] text-white px-6 py-3 text-sm font-medium tracking-wide hover:bg-[var(--color-sage-dark)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-sage)] focus-visible:ring-offset-2"
                            >
                              Sign Up →
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {showWaitlist && (
              <div className={products.length > 0 ? "mt-8" : ""}>
                {products.length > 0 && (
                  <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-5 pt-6 border-t border-[var(--color-linen)]">
                    Shares for this season are spoken for — join the waitlist and we'll
                    reach out first when the next round opens.
                  </p>
                )}
                <WaitlistForm />
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* FAQ */}
      <Container>
        <div className="pb-16 border-t border-[var(--color-linen)] pt-16">
          <h2 className="font-serif text-3xl sm:text-4xl mb-10">Common Questions</h2>
          <div className="space-y-10 max-w-3xl">
            <div>
              <h3 className="font-serif text-xl mb-3">
                What is a CSA, and why would I want to join one?
              </h3>
              <p className="text-[var(--color-muted)] leading-relaxed mb-3">
                CSA stands for Community Supported Agriculture. It's a commitment between the
                farmer and the eater for an agreed stretch of time, and it does good things
                for both sides of the exchange:
              </p>
              <ul className="list-none m-0 p-0 space-y-2">
                {[
                  "Our produce has a home before it ever comes out of the ground.",
                  "You get first choice of the freshest thing we pick that week.",
                  "It buffers us both from the swings of the market.",
                ].map((item) => (
                  <li
                    key={item}
                    className="text-[var(--color-muted)] text-sm leading-relaxed pl-5 relative before:absolute before:left-0 before:top-[0.6em] before:w-2 before:h-px before:bg-[var(--color-terra)]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-xl mb-3">
                What happens if weather or a natural disaster hurts the garden?
              </h3>
              <p className="text-[var(--color-muted)] leading-relaxed mb-3">
                There are parts of farming none of us control. That's where the S in CSA
                comes in — as a member you're on team Sweet Source Farmstead, in the thick of
                it with us, for the abundant weeks and the hard ones alike. We aren't able to
                offer refunds for losses that come down to nature.
              </p>
              <p className="text-[var(--color-muted)] leading-relaxed">
                Month-to-month sign-ups are part of how we keep that risk small for you. They
                also mean that when life happens — say you're travelling the whole of
                December — neither your money nor our produce goes to waste.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-xl mb-3">
                Help! The CSA is full and I need Sweet Source produce.
              </h3>
              <p className="text-[var(--color-muted)] leading-relaxed">
                Don't worry, friend. We're always growing and expanding what we're able to
                raise. Everything beyond our CSA shares is for sale at our market stand
                during open hours.
              </p>
            </div>
          </div>
        </div>
      </Container>

      {/* A taste of the season */}
      <div className="bg-[var(--color-linen)] py-16">
        <Container>
          <div className="text-center mb-10 max-w-xl mx-auto">
            <h2 className="font-serif text-3xl mb-3">A Taste of the Season</h2>
            <p className="text-[var(--color-muted)] leading-relaxed">
              Shares change with the calendar — here's a sample of what comes out of the
              fields and tunnels through the year.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { src: "/farm/tomatoes-green-vine.jpg", alt: "Green heirloom tomatoes ripening on the vine" },
              { src: "/farm/peppers-harvest.jpg", alt: "A basket of freshly cut sweet peppers" },
              { src: "/farm/lettuce-green.jpg", alt: "A head of frilly green lettuce" },
              { src: "/farm/carrots.jpg", alt: "Freshly pulled carrots" },
              { src: "/farm/peas.jpg", alt: "Shelled green peas" },
              { src: "/farm/beets-turnips.jpg", alt: "Beets and turnips with their roots still on" },
              { src: "/farm/onions.jpg", alt: "White onions stacked at the market" },
              { src: "/farm/strawberries.jpg", alt: "Pints of freshly picked strawberries" },
            ].map((img) => (
              <div key={img.src} className="aspect-square overflow-hidden bg-[var(--color-muted)]/10">
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </Container>
      </div>
    </>
  );
}
