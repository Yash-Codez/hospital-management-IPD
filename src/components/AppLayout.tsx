import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Activity, Bed, CalendarPlus, ClipboardList, FileText,
  FlaskConical, LayoutDashboard, LogOut, Menu, Pill,
  Receipt, Users, X, UserCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admissions", icon: ClipboardList, label: "Admissions" },
  { to: "/admit", icon: CalendarPlus, label: "New Admission" },
  { to: "/beds", icon: Bed, label: "Bed Management" },
  { to: "/doctors", icon: Users, label: "Doctors" },
  { to: "/medications", icon: Pill, label: "Medications" },
  { to: "/lab-orders", icon: FlaskConical, label: "Lab Orders" },
  { to: "/billing", icon: Receipt, label: "Billing" },
];

const AppLayout = () => {
  const { userName, userRole, signOut } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 gradient-sidebar flex flex-col transition-transform duration-200 lg:static lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 items-center gap-3 px-6 border-b border-sidebar-border">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary/20">
            <Activity className="h-5 w-5 text-sidebar-primary" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-sidebar-foreground">IPD Module</h1>
            <p className="text-[11px] text-sidebar-muted">Hospital Management</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-sidebar-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                location.pathname === item.to
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-accent">
              <UserCircle className="h-5 w-5 text-sidebar-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-sidebar-foreground">{userName || "Staff"}</p>
              <p className="truncate text-xs text-sidebar-muted capitalize">{userRole || "User"}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={signOut} className="shrink-0 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-foreground">
            <Menu className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-semibold text-foreground">
            {navItems.find(i => i.to === location.pathname)?.label || "IPD Management"}
          </h2>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
