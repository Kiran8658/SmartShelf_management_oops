import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  AlertTriangle,
  Settings,
  Store,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppSidebarProps {
  onLogout: () => void;
  isAuthenticated: boolean;
}

const navigationItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Inventory", url: "/inventory", icon: Package },
  { title: "Orders", url: "/orders", icon: ShoppingCart },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Alerts", url: "/alerts", icon: AlertTriangle },
  { title: "Stores", url: "/stores", icon: Store },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar({ onLogout, isAuthenticated }: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setCollapsed((prev) => !prev);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const getNavClasses = (path: string) => {
    const baseClasses =
      "flex items-center w-full justify-start px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium";
    if (isActive(path)) {
      return `${baseClasses} bg-gradient-to-r from-[#d8272d] to-[#b81e23] text-white shadow-md`;
    }
    return `${baseClasses} hover:bg-[#feeaea] text-[#d8272d] hover:text-[#b81e23]`;
  };

  return (
    <div
      className={`border-r border-gray-200 ${
        collapsed ? "w-16" : "w-64"
      } transition-all duration-300 flex flex-col bg-white h-screen`}
    >
      {/* Logo & Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#d8272d] to-[#b81e23] rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-[#d8272d] to-[#b81e23] bg-clip-text text-transparent">
              SmartShelf
            </span>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={toggleSidebar} className="p-2">
          {collapsed ? <Menu className="w-4 h-4 text-[#d8272d]" /> : <X className="w-4 h-4 text-[#d8272d]" />}
        </Button>
      </div>

      {/* Sidebar Content */}
      <div className="p-4 flex-1 overflow-y-auto">
        {/* Main Navigation */}
        <div className="mb-4">
          {!collapsed && (
            <div className="text-xs font-semibold text-[#d8272d] mb-2">
              Navigation
            </div>
          )}
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <NavLink key={item.title} to={item.url} className={getNavClasses(item.url)}>
                <item.icon className={`w-5 h-5 ${collapsed ? "mx-auto" : "mr-3"}`} />
                {!collapsed && <span>{item.title}</span>}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Logout */}
        {isAuthenticated && (
          <div className="mt-4">
            <button onClick={onLogout} className={getNavClasses("")}>
              <LogOut className={`w-5 h-5 ${collapsed ? "mx-auto" : "mr-3"}`} />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
