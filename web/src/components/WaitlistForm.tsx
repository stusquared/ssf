import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/Button";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const inputClass =
  "w-full border border-[var(--color-linen)] bg-white px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-sage)] transition-colors";

export function WaitlistForm() {
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

  if (status === "success") {
    return (
      <div className="bg-white shadow-[0_1px_3px_rgba(26,53,88,0.08)] overflow-hidden">
        <div className="h-1 w-full bg-[var(--color-sage)]" />
        <div className="p-8 text-center">
          <p className="font-serif text-xl text-[var(--color-ink)] mb-2">
            You're on the list
          </p>
          <p className="text-sm text-[var(--color-muted)] leading-relaxed">
            We'll email you as soon as shares open up. Thank you for supporting
            Sweet Source Farmstead.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-[0_1px_3px_rgba(26,53,88,0.08)] overflow-hidden">
      <div className="h-1 w-full bg-[var(--color-terra)]" />
      <form onSubmit={handleSubmit(onSubmit)} className="p-7 space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Full Name <span className="text-[var(--color-terra)]">*</span>
          </label>
          <input {...register("name")} className={inputClass} placeholder="Jane Smith" />
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

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Anything you'd like us to know? (optional)
          </label>
          <textarea
            {...register("message")}
            rows={4}
            className={`${inputClass} resize-none`}
            placeholder="Household size, dietary notes, questions about pickup..."
          />
        </div>

        {status === "error" && (
          <p className="text-sm text-[var(--color-terra)]">
            Something went wrong. Please try again or reach out directly.
          </p>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full py-4">
          {isSubmitting ? "Adding you…" : "Join the Waitlist"}
        </Button>
      </form>
    </div>
  );
}
