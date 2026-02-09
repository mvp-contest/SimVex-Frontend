import Header from "./Header";
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  username?: string;
}

export default function DashboardLayout({
  children,
  username = "Haeyoung",
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-(--color-page-bg)">
      <Header username={username} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
