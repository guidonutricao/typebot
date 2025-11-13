import { Outlet } from "react-router-dom";

export function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      <main className="flex-1 container py-8">
        <Outlet />
      </main>
    </div>
  );
}
