import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AFIU Admin Dashboard",
  description: "Admin dashboard for AFIU website management",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
