import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/admin/Navbar";

export function FlowLayout() {
  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      <Navbar />
      <main className="flex-1 container py-8">
        <Outlet />
      </main>
    </div>
  );
}
