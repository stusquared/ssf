import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Container } from "./Container";

const navLinks = [
  { to: "/about", label: "Our Story" },
  { to: "/csa", label: "CSA" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-parchment)] shadow-sm">
      <Container>
        <nav className="flex items-center justify-between h-16 sm:h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="Sweet Source Farmstead"
              className="h-10 sm:h-12 w-auto"
            />
            <span className="hidden sm:block font-serif text-base font-medium tracking-wide text-[var(--color-ink)] group-hover:text-[var(--color-sage)] transition-colors">
              Sweet Source Farmstead
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-sage)] transition-colors tracking-wide"
                  activeProps={{ className: "text-[var(--color-sage)]" }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-[var(--color-ink)]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="block w-6 h-0.5 bg-current mb-1.5 transition-all" />
            <span className="block w-6 h-0.5 bg-current mb-1.5 transition-all" />
            <span className="block w-6 h-0.5 bg-current transition-all" />
          </button>
        </nav>
      </Container>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[var(--color-parchment)] border-t border-[var(--color-linen)] px-4 py-6">
          <ul className="flex flex-col gap-4 list-none m-0 p-0">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="block text-base font-medium text-[var(--color-muted)] hover:text-[var(--color-sage)] transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
