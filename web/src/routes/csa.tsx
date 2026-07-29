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

      <Container>
        <div className="py-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Info side */}
          <div>
            <h2 className="font-serif text-2xl mb-6">How It Works</h2>
            <div className="space-y-6">
              {[
                {
                  step: "01",
                  title: "Sign Up for the Waitlist",
                  text: "Submit your information below and we'll reach out when shares for the upcoming season become available.",
                },
                {
                  step: "02",
                  title: "Choose Your Share",
                  text: "We'll offer options for share size to fit your household — from single and couple portions to full family shares.",
                },
                {
                  step: "03",
                  title: "Pick Up Weekly",
                  text: "Once the season begins, collect your box of freshly harvested produce each week at our farm pickup location.",
                },
              ].map((s) => (
                <div key={s.step} className="flex gap-4">
                  <span className="font-serif text-3xl text-[var(--color-terra)] leading-none mt-1 shrink-0">
                    {s.step}
                  </span>
                  <div>
                    <h3 className="font-serif text-lg mb-1">{s.title}</h3>
                    <p className="text-sm text-[var(--color-muted)] leading-relaxed">{s.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 bg-[var(--color-linen)]">
              <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                <strong className="text-[var(--color-ink)]">Questions?</strong> Reach out via our{" "}
                <a href="/contact" className="text-[var(--color-sage)] hover:underline">
                  contact page
                </a>{" "}
                and we'll be happy to tell you more about the upcoming season.
              </p>
            </div>
          </div>

          {/* Form side */}
          <div>
            <h2 className="font-serif text-2xl mb-6">Join the Waitlist</h2>

            {status === "success" ? (
              <div className="bg-[var(--color-sage)]/10 border border-[var(--color-sage)] p-8 text-center">
                <p className="font-serif text-xl text-[var(--color-sage)] mb-2">You're on the list!</p>
                <p className="text-sm text-[var(--color-muted)]">
                  We'll be in touch as the season approaches. Thank you for your interest in Sweet Source Farmstead.
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
