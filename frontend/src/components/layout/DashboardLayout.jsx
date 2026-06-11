import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, ShoppingBag, Settings, LogOut, Bell, Menu, X, User, Heart, MessageSquare, List } from 'lucide-react';
import { cn } from '../../utils/cn';

export const DashboardLayout = ({ role = 'admin' }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const getLinks = () => {
    switch (role) {
      case 'admin':
        return [
          { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard /> },
          { name: 'Users', path: '/admin/user-management', icon: <User /> },
          { name: 'Vendors', path: '/admin/admin-vendor-management', icon: <ShoppingBag /> },
          { name: 'Settings', path: '/admin/system-settings', icon: <Settings /> },
        ];
      case 'vendor':
        return [
          { name: 'Dashboard', path: '/vendor/dashboard', icon: <LayoutDashboard /> },
          { name: 'Services', path: '/vendor/service-listing', icon: <ShoppingBag /> },
          { name: 'Bookings', path: '/vendor/booking-management', icon: <Calendar /> },
          { name: 'Settings', path: '/vendor/vendor-settings', icon: <Settings /> },
        ];
      case 'customer':
        return [
          { name: 'Dashboard', path: '/customer/dashboard', icon: <LayoutDashboard /> },
          { name: 'My Orders', path: '/customer/order-history', icon: <ShoppingBag /> },
          { name: 'My Events', path: '/customer/event-dashboard', icon: <Calendar /> },
          { name: 'Wishlist', path: '/customer/wishlist', icon: <Heart /> },
          { name: 'Messages', path: '/customer/chat-inbox', icon: <MessageSquare /> },
          { name: 'Settings', path: '/customer/account-settings', icon: <Settings /> },
        ];
      case 'seller':
        return [
          { name: 'Dashboard', path: '/seller/dashboard', icon: <LayoutDashboard /> },
          { name: 'Products', path: '/seller/seller-product-management', icon: <ShoppingBag /> },
          { name: 'Orders', path: '/seller/order-management', icon: <List /> },
          { name: 'Settings', path: '/seller/seller-settings', icon: <Settings /> },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:sticky top-0 left-0 z-40 w-64 h-screen bg-surface border-r border-white/5 transition-transform duration-300",
          !isSidebarOpen && "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="h-24 flex items-center justify-center px-6 border-b border-white/5">
            <Link to="/" className="flex items-center justify-center group w-full">
              <img 
                src="/logo.png" 
                alt="Nexora" 
                className="h-16 md:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
              />
            </Link>
          </div>
          
          <nav className="flex-1 py-6 px-4 space-y-2">
            {getLinks().map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                  location.pathname === link.path 
                    ? "bg-primary/10 text-primary" 
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                {React.cloneElement(link.icon, { className: 'w-5 h-5' })}
                <span className="font-medium">{link.name}</span>
              </Link>
            ))}
          </nav>
          
          <div className="p-4 border-t border-white/5">
            <button className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-6 bg-surface/50 backdrop-blur-md border-b border-white/5 sticky top-0 z-30">
          <button 
            className="md:hidden text-white/60 hover:text-white"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu />
          </button>
          
          <div className="flex items-center gap-4 ml-auto">
            <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-premium border border-white/20" />
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
