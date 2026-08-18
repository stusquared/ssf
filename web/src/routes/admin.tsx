import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { clearToken, isTokenValid } from "@/lib/admin";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (pathname === "/admin" || pathname === "/admin/") {
      navigate({ to: isTokenValid() ? "/admin/dashboard" : "/admin/login" });
      return;
    }
    if (!isLoginPage && !isTokenValid()) {
      navigate({ to: "/admin/login" });
    }
  }, [pathname, isLoginPage, navigate]);

  if (isLoginPage) return <Outlet />;
  if (pathname === "/admin" || pathname === "/admin/") return null;
  if (!isTokenValid()) return null;

  function handleLogout() {
    clearToken();
    navigate({ to: "/admin/login" });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[var(--color-ink)] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-serif text-lg tracking-wide">Sweet Source Farmstead</span>
          <span className="text-white/40 text-xs uppercase tracking-widest">Admin</span>
        </div>
        <nav className="flex items-center gap-6">
          <Link
            to="/admin/dashboard"
            className="text-sm text-white/70 hover:text-white transition-colors"
            activeProps={{ className: "text-sm text-white font-medium" }}
          >
            Packages
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm text-white/50 hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}
