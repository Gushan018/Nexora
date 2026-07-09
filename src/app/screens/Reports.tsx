import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, FileText, Download, Filter, Calendar, DollarSign, Package, Users, TrendingUp, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getReports, exportReport } from "../lib/api";

const reportTypes = [
  { id: "revenue", name: "Monthly Revenue Report", icon: DollarSign },
  { id: "booking", name: "Booking Report", icon: Calendar },
  { id: "package", name: "Package Performance Report", icon: Package },
  { id: "customer", name: "Customer Activity Report", icon: Users },
  { id: "payment", name: "Payment Report", icon: DollarSign },
  { id: "completion", name: "Event Completion Report", icon: TrendingUp },
];

export function Reports() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState<'pdf' | 'excel' | null>(null);
  const [dateFilter, setDateFilter] = useState("monthly");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [activeReportType, setActiveReportType] = useState<string | null>(null);

  const fetchReports = useCallback(async (year: string, type: string | null) => {
    setLoading(true);
    try {
      const result = await getReports(year, type || undefined);
      setData(result);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports(selectedYear, activeReportType);
  }, [selectedYear, activeReportType, fetchReports]);

  const handleSelectReportType = (id: string) => {
    setActiveReportType(prev => prev === id ? null : id);
    document.getElementById('charts-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleExport = async (format: 'pdf' | 'excel') => {
    setExporting(format);
    try {
      await exportReport(format, selectedYear, activeReportType || undefined);
    } catch {
      // silent
    } finally {
      setExporting(null);
    }
  };

  if (!data) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        {loading ? (
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading reports...</p>
          </div>
        ) : (
          <p className="text-muted-foreground">No report data available</p>
        )}
      </div>
    );
  }

  const { analyticsCards, revenueChart, bookingTrends, packagePerformance, customerGrowth, revenueBreakdown, topPackages, recentTransactions } = data;

  return (
    <div className="p-8">
      <div className="mb-8">
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-foreground mb-2">Reports & Analytics</h1>
        <p className="text-muted-foreground">Generate comprehensive business reports and insights</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Generate Report</h3>
          <div className="flex gap-3">
            <button onClick={() => handleExport('pdf')} disabled={exporting !== null} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50">
              {exporting === 'pdf' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {exporting === 'pdf' ? 'Exporting...' : 'Export PDF'}
            </button>
            <button onClick={() => handleExport('excel')} disabled={exporting !== null} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50">
              {exporting === 'excel' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {exporting === 'excel' ? 'Exporting...' : 'Export Excel'}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map((report) => (
            <button key={report.id} onClick={() => handleSelectReportType(report.id)} className={`flex items-center gap-3 p-4 bg-muted/50 hover:bg-muted border border-border rounded-lg transition-colors text-left ${activeReportType === report.id ? 'ring-2 ring-primary bg-primary/5' : ''}`}>
              <div className="p-2 bg-primary/10 rounded-lg">
                <report.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">{report.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="px-4 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="px-4 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
        </div>
      </div>

      <div id="charts-section" className="relative">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 rounded-xl">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {(analyticsCards || []).map((card: any) => (
          <div key={card.label} className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-[var(--status-accepted)]">{card.change}</span>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-1">{card.value}</h3>
            <p className="text-sm text-muted-foreground">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Revenue Chart</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueChart || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.1)" />
              <XAxis dataKey="month" stroke="#CBD5E1" fontSize={12} />
              <YAxis stroke="#CBD5E1" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "8px" }} labelStyle={{ color: "#F8FAFC" }} />
              <Bar dataKey="revenue" fill="#D4AF37" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Booking Trends Chart</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={bookingTrends || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.1)" />
              <XAxis dataKey="month" stroke="#CBD5E1" fontSize={12} />
              <YAxis stroke="#CBD5E1" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "8px" }} labelStyle={{ color: "#F8FAFC" }} />
              <Line type="monotone" dataKey="bookings" stroke="#D4AF37" strokeWidth={2} dot={{ fill: "#D4AF37" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Most Popular Packages</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={(packagePerformance || []).length > 0 ? packagePerformance : [{ name: 'No Data', value: 1, color: '#374151' }]} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} dataKey="value">
                {(packagePerformance || [{ name: 'No Data', value: 1, color: '#374151' }]).map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "8px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Customer Growth Chart</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={customerGrowth || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.1)" />
              <XAxis dataKey="month" stroke="#CBD5E1" fontSize={12} />
              <YAxis stroke="#CBD5E1" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "8px" }} labelStyle={{ color: "#F8FAFC" }} />
              <Line type="monotone" dataKey="customers" stroke="#C8A646" strokeWidth={2} dot={{ fill: "#C8A646" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Breakdown</h3>
          <div className="space-y-4">
            {(revenueBreakdown || []).length === 0 && <p className="text-sm text-muted-foreground">No revenue data</p>}
            {(revenueBreakdown || []).map((item: any) => (
              <div key={item.category} className="flex items-center justify-between pb-3 border-b border-border last:border-0">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{item.category}</p>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${item.percentage}%` }}></div>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="text-sm font-bold text-primary">{item.amount}</p>
                  <p className="text-xs text-muted-foreground">{item.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Top Performing Packages</h3>
          <div className="space-y-3">
            {(topPackages || []).length === 0 && <p className="text-sm text-muted-foreground">No package data</p>}
            {(topPackages || []).map((pkg: any, index: number) => (
              <div key={pkg.name} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{pkg.name}</p>
                    <p className="text-xs text-muted-foreground">{pkg.bookings} bookings</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-primary">{pkg.revenue}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Transaction ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Package</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {(recentTransactions || []).length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-4 text-sm text-muted-foreground text-center">No transactions yet</td></tr>
                )}
                {(recentTransactions || []).map((txn: any) => (
                  <tr key={txn.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-4 text-sm font-medium text-primary">{txn.id}</td>
                    <td className="px-4 py-4 text-sm text-foreground">{txn.customer}</td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">{txn.package}</td>
                    <td className="px-4 py-4 text-sm font-medium text-foreground">{txn.amount}</td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">{new Date(txn.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
