import { useState, useEffect } from "react";
import { ArrowLeft, DollarSign, TrendingUp, CreditCard, Wallet, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getVendorPayments } from "../lib/api";

const iconMap: Record<string, any> = { DollarSign, TrendingUp, CreditCard, Wallet };

export function Payments() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVendorPayments()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <p className="text-muted-foreground">No payment data available</p>
      </div>
    );
  }

  const { analyticsCards, revenueChart, revenueBreakdown, recentTransactions } = data;

  return (
    <div className="p-8">
      <div className="mb-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-foreground mb-2">Payments & Revenue</h1>
        <p className="text-muted-foreground">Track payments, revenue, and financial reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {(analyticsCards || []).map((stat: any) => {
          const Icon = iconMap[stat.icon] || DollarSign;
          return (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-[var(--status-accepted)]">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">{stat.value}</h3>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueChart || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.1)" />
              <XAxis dataKey="month" stroke="#CBD5E1" fontSize={12} />
              <YAxis stroke="#CBD5E1" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: "#111827", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "8px" }}
                labelStyle={{ color: "#F8FAFC" }}
              />
              <Bar dataKey="revenue" fill="#D4AF37" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Earnings by Category</h3>
          <div className="space-y-4">
            {(revenueBreakdown || []).length === 0 && (
              <p className="text-sm text-muted-foreground">No revenue data yet</p>
            )}
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
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Transaction ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Package</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Method</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {(recentTransactions || []).length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-sm text-muted-foreground text-center">No transactions yet</td></tr>
              )}
              {(recentTransactions || []).map((txn: any) => (
                <tr key={txn.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-4 text-sm font-medium text-primary">{txn.id}</td>
                  <td className="px-4 py-4 text-sm text-foreground">{txn.customer}</td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">{txn.package}</td>
                  <td className="px-4 py-4 text-sm font-medium text-foreground">{txn.amount}</td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">{txn.method}</td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">
                    {new Date(txn.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${
                      txn.status === "Completed"
                        ? "bg-[var(--status-accepted)]/10 text-[var(--status-accepted)] border-[var(--status-accepted)]/20"
                        : "bg-[var(--status-pending)]/10 text-[var(--status-pending)] border-[var(--status-pending)]/20"
                    }`}>
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
