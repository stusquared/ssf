import { createRootRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

function RootLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // The admin section brings its own header and is not part of the public site,
  // so the farm navbar and footer would only duplicate navigation there.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return <Outlet />;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export const Route = createRootRoute({ component: RootLayout });
