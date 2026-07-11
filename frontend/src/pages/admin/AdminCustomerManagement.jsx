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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-7 h-7 text-primary" />
            Customer Accounts
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Monitor buyer behavior, LTV (Lifetime Value), and risk factors.</p>
        </div>
        <Button variant="outline" leftIcon={<RefreshCcw className="w-4 h-4"/>} onClick={fetchCustomers}>Refresh</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-slate-300 dark:border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Total Customer Accounts</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">{customers.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-500/20 bg-green-500/5">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">Active Customers with Bookings</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-green-500">{stats.active}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-300 dark:border-white/10">
          <CardContent className="p-6 flex justify-between items-center h-full">
            <div>
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Blocked Accounts</h3>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-red-500">{customers.filter(c => c.isBlocked).length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-200 dark:border-white/10 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search customers by name or email..." 
              className="w-full bg-light-surface dark:bg-surface border border-slate-300 dark:border-white/10 rounded-xl pl-10 pr-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors" 
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" leftIcon={<Filter className="w-4 h-4"/>} onClick={fetchCustomers}>Refresh</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-300 dark:border-white/10 text-xs font-bold bg-slate-200/80 dark:bg-slate-800/90 uppercase tracking-wider">
                <th className="p-4 pl-6 text-slate-900 dark:text-slate-100">Customer</th>
                <th className="p-4 text-slate-900 dark:text-slate-100">Activity</th>
                <th className="p-4 text-slate-900 dark:text-slate-100">Join Date</th>
                <th className="p-4 text-slate-900 dark:text-slate-100">Status</th>
                <th className="p-4 pr-6 text-right text-slate-900 dark:text-slate-100">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.customerId} className="border-b border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 dark:text-white">{customer.name}</span>
                        <span className="text-xs text-slate-500 dark:text-white/50">{customer.email} • CUS-{customer.customerId}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-white/80">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-medium">{customer._count?.bookings || 0} bookings • {customer._count?.orders || 0} orders</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-700 dark:text-white/80 text-xs">
                      {customer.registrationDate ? new Date(customer.registrationDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                    </td>
                    <td className="p-4">
                      <span className={cn("text-xs font-bold px-2.5 py-1 rounded-full", customer.isBlocked ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500")}>
                        {customer.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/user/${customer.customerId}?type=customer`)}
                      >
                        View Profile
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
    </div>
  );
};

