import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  subject: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

type FormValues = z.infer<typeof schema>;

function ContactPage() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await fetch("/api/contact", {
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
          <h1 className="font-serif text-5xl sm:text-6xl font-medium">Get in Touch</h1>
          <p className="mt-4 text-[var(--color-muted)] text-lg max-w-xl leading-relaxed">
            Questions about our CSA, farm visits, or wholesale? We'd love to hear from you.
          </p>
        </Container>
      </div>

      <Container>
        <div className="py-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            {status === "success" ? (
              <div className="bg-[var(--color-sage)]/10 border border-[var(--color-sage)] p-8 text-center">
                <p className="font-serif text-xl text-[var(--color-sage)] mb-2">Message received!</p>
                <p className="text-sm text-[var(--color-muted)]">
                  Thanks for reaching out. We'll get back to you within a day or two.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Name <span className="text-[var(--color-terra)]">*</span>
                  </label>
                  <input
                    {...register("name")}
                    className="w-full border border-[var(--color-linen)] bg-white px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-sage)] transition-colors"
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
                  />
                  {errors.email && (
                    <p className="text-xs text-[var(--color-terra)] mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Subject (optional)</label>
                  <input
                    {...register("subject")}
                    className="w-full border border-[var(--color-linen)] bg-white px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-sage)] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Message <span className="text-[var(--color-terra)]">*</span>
                  </label>
                  <textarea
                    {...register("message")}
                    rows={5}
                    className="w-full border border-[var(--color-linen)] bg-white px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-sage)] transition-colors resize-none"
                  />
                  {errors.message && (
                    <p className="text-xs text-[var(--color-terra)] mt-1">{errors.message.message}</p>
                  )}
                </div>

                {status === "error" && (
                  <p className="text-sm text-[var(--color-terra)]">
                    Something went wrong. Please try again.
                  </p>
                )}

                <Button type="submit" disabled={isSubmitting} className="w-full py-4">
                  {isSubmitting ? "Sending…" : "Send Message"}
                </Button>
              </form>
            )}
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="font-serif text-xl mb-3">Sweet Source Farmstead</h3>
              <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                We're a small operation and do our best to respond within 1–2 business days.
                For urgent matters, feel free to call during farm hours.
              </p>
            </div>
            <div className="space-y-3 text-sm text-[var(--color-muted)]">
              <p>
                <span className="font-medium text-[var(--color-ink)]">Email:</span>{" "}
                hello@sweetsourcefarmstead.com
              </p>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
