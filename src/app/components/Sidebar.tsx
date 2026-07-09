import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Package,
  CalendarCheck,
  MessageSquare,
  ShoppingCart,
  CreditCard,
  Star,
  FileBarChart,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useTheme } from "../lib/useTheme";
import { useAuth } from "../contexts/AuthContext";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Company Profile", href: "/profile", icon: Building2 },
  { name: "Package Management", href: "/packages", icon: Package },
  { name: "Booking Management", href: "/bookings", icon: CalendarCheck },
  { name: "Messages", href: "/messages", icon: MessageSquare },
  { name: "Orders", href: "/orders", icon: ShoppingCart },
  { name: "Payments", href: "/payments", icon: CreditCard },
  { name: "Reports & Analytics", href: "/reports", icon: FileBarChart },
  { name: "Reviews & Ratings", href: "/reviews", icon: Star },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col w-64 bg-sidebar border-r border-sidebar-border min-h-screen flex-shrink-0">
      <div className="flex items-center justify-between h-20 border-b border-sidebar-border px-4">
        <img src="/logo.jpg" alt="EventNest Logo" className="h-18 w-auto" />
        <button
          onClick={toggleTheme}
          className="p-2 text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition-colors"
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {user && (
        <div className="px-4 py-3 border-b border-sidebar-border">
          <p className="text-sm font-medium text-sidebar-foreground truncate">{user.businessName}</p>
          <p className="text-xs text-sidebar-foreground/60 truncate">{user.email}</p>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto py-6 px-3">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href ||
              (item.href !== "/dashboard" && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-destructive hover:bg-sidebar-accent rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
