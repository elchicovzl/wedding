import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div style={{ fontFamily: "'Montserrat', sans-serif", minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      <AdminSidebar email={session.email} />
      <main
        style={{
          marginLeft: "17rem",
          padding: "2.5rem 3rem",
          minHeight: "100vh",
        }}
      >
        {children}
      </main>
      {/* Mobile: override margin */}
      <style>{`
        @media (max-width: 767px) {
          main { margin-left: 0 !important; padding: 1.25rem 1rem !important; padding-top: 4.5rem !important; }
        }
      `}</style>
    </div>
  );
}
