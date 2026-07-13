import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Filter, MoreVertical, CreditCard, Calendar, ShieldAlert, Loader2, AlertCircle, RefreshCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';

export const AdminCustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/admin/customers');
      setCustomers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('Failed to load customers. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return customers;
    return customers.filter(c =>
      [c.name, c.email, `CUS-${c.customerId}`].some(val => val?.toString().toLowerCase().includes(query))
    );
  }, [customers, searchTerm]);

  const stats = useMemo(() => ({
    active: customers.filter(c => c._count?.bookings > 0 || c._count?.orders > 0).length,
    totalBookings: customers.reduce((sum, c) => sum + (c._count?.bookings || 0), 0),
    highRisk: 0,
  }), [customers]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
<<<<<<< HEAD
          <h1 className="text-2xl font-bold text-textPrimary flex items-center gap-2">
            <Users className="w-7 h-7 text-primary" />
            Customer Accounts
          </h1>
          <p className="text-textPrimary/60">Monitor buyer behavior and account activity.</p>
=======
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-7 h-7 text-primary" />
            Customer Accounts
          </h1>
          <p className="text-slate-600">Monitor buyer behavior, LTV (Lifetime Value), and risk factors.</p>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
        </div>
        <Button variant="outline" leftIcon={<RefreshCcw className="w-4 h-4"/>} onClick={fetchCustomers}>Refresh</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-slate-300">
          <CardContent className="p-6">
<<<<<<< HEAD
            <h3 className="text-sm font-medium text-textPrimary/60 mb-2">Total Customers</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-textPrimary">{customers.length.toLocaleString()}</span>
=======
            <h3 className="text-sm font-medium text-slate-600 mb-2">Active Customers (30d)</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-slate-900">12,400</span>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-500/20 bg-green-500/5">
          <CardContent className="p-6">
<<<<<<< HEAD
            <h3 className="text-sm font-medium text-textPrimary/80 mb-2">Active (with bookings/orders)</h3>
=======
            <h3 className="text-sm font-medium text-slate-800 mb-2">Avg. Lifetime Value</h3>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-green-400">{stats.active}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-300">
          <CardContent className="p-6 flex justify-between items-center h-full">
            <div>
<<<<<<< HEAD
              <h3 className="text-sm font-medium text-textPrimary/60 mb-2">Total Bookings</h3>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-textPrimary">{stats.totalBookings}</span>
=======
              <h3 className="text-sm font-medium text-slate-600 mb-2">High Risk Accounts</h3>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-slate-900">14</span>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
<<<<<<< HEAD
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-textPrimary/40" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-4 py-2 text-textPrimary focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center text-textPrimary/40 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p>Loading customers...</p>
            </div>
          ) : error ? (
            <div className="p-12 flex flex-col items-center justify-center text-red-400 gap-3 text-center">
              <AlertCircle className="w-8 h-8" />
              <p>{error}</p>
              <Button onClick={fetchCustomers} variant="outline" size="sm">Try Again</Button>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-textPrimary/40 gap-3 text-center">
              <Users className="w-12 h-12 opacity-20" />
              <p>No customers found.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-sm font-medium text-textPrimary/50 bg-white/[0.02]">
                  <th className="p-4 pl-6">Customer</th>
                  <th className="p-4">Activity</th>
                  <th className="p-4">Joined</th>
                  <th className="p-4 pr-6"></th>
=======
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search customers..." 
              className="w-full bg-surface border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-slate-900 focus:outline-none focus:border-primary/50 transition-colors" 
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-surface border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-primary/50 cursor-pointer">
              <option>Sort: Highest LTV</option>
              <option>Sort: Newest</option>
              <option>Sort: Most Bookings</option>
            </select>
            <Button variant="outline" leftIcon={<Filter className="w-4 h-4"/>}>Filter</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-sm font-medium text-slate-500 bg-slate-50">
                <th className="p-4 pl-6">Customer</th>
                <th className="p-4">Financials</th>
                <th className="p-4">Activity</th>
                <th className="p-4">Risk Score</th>
                <th className="p-4 pr-6"></th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {CUSTOMERS.map((customer, i) => (
                <tr key={i} className="border-b border-slate-200 hover:bg-slate-50 transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">{customer.name}</span>
                      <span className="text-xs text-slate-500">{customer.email} • {customer.id}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900 flex items-center gap-1"><CreditCard className="w-3.5 h-3.5 text-slate-500"/> {customer.totalSpent}</span>
                      <span className="text-xs text-slate-500">{customer.bookings} total bookings</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs">{customer.lastActive}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "flex items-center gap-1.5 text-xs font-bold w-fit px-2.5 py-1 rounded-full",
                      customer.riskScore === 'Low' ? "bg-green-500/10 text-green-400" :
                      customer.riskScore === 'High' ? "bg-red-500/20 text-red-400 border border-red-500/20" :
                      "bg-yellow-500/10 text-yellow-500"
                    )}>
                      {customer.riskScore === 'High' && <ShieldAlert className="w-3.5 h-3.5" />}
                      {customer.riskScore} Risk
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right space-x-2">
                    <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      View Profile
                    </Button>
                    <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors" title="Actions">
                      <MoreVertical className="w-5 h-5"/>
                    </button>
                  </td>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.customerId} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-textPrimary">{customer.name}</span>
                        <span className="text-xs text-textPrimary/50">{customer.email} • CUS-{customer.customerId}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-textPrimary/60">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs">{customer._count?.bookings || 0} bookings • {customer._count?.orders || 0} orders</span>
                      </div>
                    </td>
                    <td className="p-4 text-textPrimary/80 text-xs">
                      {customer.registrationDate ? new Date(customer.registrationDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => navigate(`/admin/user/${customer.customerId}?type=customer`)}
                      >
                        View Profile
                      </Button>
                      <button className="p-2 text-textPrimary/40 hover:text-textPrimary hover:bg-white/10 rounded-lg transition-colors" title="Actions">
                        <MoreVertical className="w-5 h-5"/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
};
