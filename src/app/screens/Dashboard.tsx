import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Package, CalendarCheck, Clock, CheckCircle, DollarSign, Users } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getDashboard } from "../lib/api";

const iconMap: Record<string, any> = { Package, CalendarCheck, Clock, CheckCircle, DollarSign, TrendingUp, Users };

export function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getDashboard().then(setData).catch(() => {});
  }, []);

  if (!data) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  const { stats, revenueChart, upcomingEvents, recentActivities } = data;
  const statCards = [
    { name: "Total Packages", value: String(stats.totalPackages), icon: Package, trend: "+0%", up: true },
    { name: "Total Bookings", value: String(stats.totalBookings), icon: CalendarCheck, trend: "+0%", up: true },
    { name: "Pending Requests", value: String(stats.pendingBookings), icon: Clock, trend: "0", up: false },
    { name: "Completed Events", value: String(stats.completedBookings), icon: CheckCircle, trend: "+0%", up: true },
    { name: "Total Revenue", value: `Rs. ${(stats.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, trend: "+0%", up: true },
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/30 p-8">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Manage your events and track performance</p>
        </div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-card border border-border rounded-xl p-6 hover:border-primary/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <span className={`text-sm font-medium ${stat.up ? "text-green-500" : "text-red-500"}`}>
                {stat.trend}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-1">{stat.value}</h3>
            <p className="text-sm text-muted-foreground">{stat.name}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Revenue Analytics</h3>
              <p className="text-sm text-muted-foreground">Monthly revenue overview</p>
            </div>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={revenueChart || []}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.1)" />
              <XAxis dataKey="month" stroke="#CBD5E1" fontSize={12} />
              <YAxis stroke="#CBD5E1" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "8px" }} labelStyle={{ color: "#F8FAFC" }} />
              <Area type="monotone" dataKey="revenue" stroke="#D4AF37" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Upcoming Events</h3>
          <div className="space-y-4">
            {(upcomingEvents || []).length === 0 && <p className="text-sm text-muted-foreground">No upcoming events</p>}
            {(upcomingEvents || []).map((event: any) => (
              <div key={event.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{event.event}</h4>
                  <p className="text-sm text-muted-foreground">{event.customer}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-primary">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  <p className="text-xs text-muted-foreground">{event.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Customer Activities</h3>
          <div className="space-y-4">
            {(recentActivities || []).length === 0 && <p className="text-sm text-muted-foreground">No recent activities</p>}
            {(recentActivities || []).map((activity: any) => (
              <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-border last:border-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{activity.customer}</p>
                  <p className="text-sm text-muted-foreground">{activity.action}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{new Date(activity.time).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors" onClick={() => navigate('/packages/new')}>
              Add New Package
            </button>
            <button className="w-full py-3 px-4 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors" onClick={() => navigate('/bookings')}>
              View All Bookings
            </button>
            <button className="w-full py-3 px-4 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors" onClick={() => navigate('/messages')}>
              Check Messages
            </button>
            <button className="w-full py-3 px-4 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors" onClick={() => navigate('/reports')}>
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
