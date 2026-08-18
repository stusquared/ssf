import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { setToken, isTokenValid } from "@/lib/admin";
import { useEffect } from "react";

export const Route = createFileRoute("/admin/login")({
  component: LoginPage,
});

const schema = z.object({
  username: z.string().min(1, "Required"),
  password: z.string().min(1, "Required"),
});

type FormValues = z.infer<typeof schema>;

function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isTokenValid()) navigate({ to: "/admin/dashboard" });
  }, [navigate]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      // A 500 means the server is misconfigured, not that the password is wrong —
      // pass its message through so the real cause is visible.
      const detail = (await res.json().catch(() => null)) as { error?: string } | null;
      setError("root", {
        message:
          res.status >= 500 && detail?.error
            ? detail.error
            : "Invalid username or password.",
      });
      return;
    }
    const { token } = (await res.json()) as { token: string };
    setToken(token);
    navigate({ to: "/admin/dashboard" });
  };

  return (
    <div className="min-h-screen bg-[var(--color-linen)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-serif text-2xl text-[var(--color-ink)]">Sweet Source Farmstead</p>
          <p className="text-sm text-[var(--color-muted)] mt-1">Admin sign in</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 space-y-5 shadow-sm">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-[var(--color-ink)]">
              Username
            </label>
            <input
              {...register("username")}
              autoComplete="username"
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-ink)] transition-colors"
            />
            {errors.username && (
              <p className="text-xs text-red-600 mt-1">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-[var(--color-ink)]">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              autoComplete="current-password"
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-ink)] transition-colors"
            />
            {errors.password && (
              <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
            )}
          </div>

          {errors.root && (
            <p className="text-sm text-red-600">{errors.root.message}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[var(--color-ink)] text-white py-3 text-sm font-medium hover:bg-[var(--color-ink)]/90 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
