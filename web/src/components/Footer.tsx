import { Link } from "@tanstack/react-router";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="bg-[var(--color-ink)] text-[var(--color-parchment)] mt-auto">
      <Container>
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="flex items-start gap-4">
            <img src="/logo.png" alt="Sweet Source Farmstead" className="h-14 w-auto flex-shrink-0" />
            <div>
            <h3 className="font-serif text-lg font-medium mb-3">Sweet Source Farmstead</h3>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              Fresh, seasonal produce grown with care. Community-supported agriculture
              rooted in sustainable practices.
            </p>
            </div>
          </div>
          <div className="flex flex-col sm:items-end gap-4">
            <nav className="flex flex-wrap gap-x-6 gap-y-2">
              {[
                { to: "/about", label: "Our Story" },
                { to: "/csa", label: "CSA" },
                { to: "/blog", label: "Blog" },
                { to: "/contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col sm:items-end gap-1">
              <img
                src="/homegrown-by-heroes.png"
                alt="Homegrown By Heroes certified"
                className="h-16 w-auto"
              />
            </div>
            <p className="text-xs text-white/40">
              © {new Date().getFullYear()} Sweet Source Farmstead
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
