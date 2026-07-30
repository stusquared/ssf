import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";

export const Route = createFileRoute("/csa")({
  component: CsaPage,
});

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

function CsaPage() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await fetch("/api/csa-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

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

          {/* Form side */}
          <div>
            <h2 className="font-serif text-3xl mb-4">Sign Up for a Share</h2>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-6">
              Send us your details and we'll be in touch to confirm your spot for the coming
              month and arrange payment.
            </p>

            {status === "success" ? (
              <div className="bg-[var(--color-sage)]/10 border border-[var(--color-sage)] p-8 text-center">
                <p className="font-serif text-xl text-[var(--color-sage)] mb-2">Thanks — we've got it!</p>
                <p className="text-sm text-[var(--color-muted)]">
                  We'll be in touch shortly to confirm your spot and arrange payment. Thank you
                  for supporting Sweet Source Farmstead.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Full Name <span className="text-[var(--color-terra)]">*</span>
                  </label>
                  <input
                    {...register("name")}
                    className="w-full border border-[var(--color-linen)] bg-white px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-sage)] transition-colors"
                    placeholder="Jane Smith"
                  />
                  {errors.name && (
                    <p className="text-xs text-[var(--color-terra)] mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Email <span className="text-[var(--color-terra)]">*</span>
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    className="w-full border border-[var(--color-linen)] bg-white px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-sage)] transition-colors"
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
                    className="w-full border border-[var(--color-linen)] bg-white px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-sage)] transition-colors"
                    placeholder="(555) 000-0000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Anything you'd like us to know? (optional)
                  </label>
                  <textarea
                    {...register("message")}
                    rows={4}
                    className="w-full border border-[var(--color-linen)] bg-white px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-sage)] transition-colors resize-none"
                    placeholder="Household size, dietary notes, questions about pickup..."
                  />
                </div>

                {status === "error" && (
                  <p className="text-sm text-[var(--color-terra)]">
                    Something went wrong. Please try again or reach out directly.
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4"
                >
                  {isSubmitting ? "Submitting…" : "Submit Interest"}
                </Button>
              </form>
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
