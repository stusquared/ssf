import { type ButtonHTMLAttributes, type ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
  as?: "button" | "a";
  href?: string;
}

export function Button({
  variant = "primary",
  children,
  className = "",
  as: Tag = "button",
  href,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center px-6 py-3 text-sm font-medium tracking-wide transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

  const variants = {
    primary:
      "bg-[var(--color-sage)] text-white hover:bg-[var(--color-sage-dark)] focus-visible:ring-[var(--color-sage)]",
    secondary:
      "border border-[var(--color-sage)] text-[var(--color-sage)] hover:bg-[var(--color-sage)] hover:text-white focus-visible:ring-[var(--color-sage)]",
    ghost:
      "text-[var(--color-ink)] hover:text-[var(--color-sage)] underline-offset-4 hover:underline",
  };

  if (Tag === "a") {
    return (
      <a href={href} className={`${base} ${variants[variant]} ${className}`}>
        {children}
      </a>
    );
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
