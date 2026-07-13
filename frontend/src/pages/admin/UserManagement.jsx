<<<<<<< HEAD
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Filter, MoreVertical, UserCheck, UserX, Shield, Mail, Loader2, AlertCircle, RefreshCcw } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
=======
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Lock, Unlock, Eye, AlertTriangle, X, Trash2, Plus, Edit, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { cn } from '../../utils/cn';
<<<<<<< HEAD
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const navigate = useNavigate();
=======
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export const UserManagement = () => {
  const { loginAsUser } = useAuth();
  const navigate = useNavigate();
  const [impersonating, setImpersonating] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formState, setFormState] = useState({ name: '', email: '', contactNumber: '', isBlocked: false });
  const [errorMessage, setErrorMessage] = useState('');

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data.map((user) => ({
        id: user.customerId,
        name: user.name,
        email: user.email,
        phone: user.contactNumber || '-',
        status: user.isBlocked ? 'Blocked' : 'Active',
        joinDate: new Date(user.registrationDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        isBlocked: user.isBlocked,
        raw: user,
      })));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45

  useEffect(() => {
    fetchUsers();
  }, []);

<<<<<<< HEAD
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/admin/users');
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('Failed to load users. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
=======
  const openCreateModal = () => {
    setIsEditMode(false);
    setFormState({ name: '', email: '', contactNumber: '', isBlocked: false });
    setSelectedUser(null);
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setIsEditMode(true);
    setFormState({
      name: user.name,
      email: user.email,
      contactNumber: user.phone,
      isBlocked: user.isBlocked,
    });
    setSelectedUser(user);
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleFormChange = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleViewUser = async (userId) => {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      const user = response.data;
      setSelectedUser({
        id: user.customerId,
        name: user.name,
        email: user.email,
        phone: user.contactNumber || '-',
        status: user.isBlocked ? 'Blocked' : 'Active',
        joinDate: new Date(user.registrationDate).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        isBlocked: user.isBlocked,
        orders: user.orders || [],
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        name: formState.name,
        email: formState.email,
        contactNumber: formState.contactNumber,
        isBlocked: formState.isBlocked,
      };

      if (isEditMode && selectedUser) {
        await api.put(`/admin/users/${selectedUser.id}`, payload);
      } else {
        await api.post('/admin/users', payload);
      }

      closeModal();
      fetchUsers();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Unable to save user.');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      if (selectedUser?.id === userId) {
        setSelectedUser(null);
      }
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleBlock = async (user) => {
    try {
      await api.put(`/admin/users/${user.id}`, {
        name: user.name,
        email: user.email,
        contactNumber: user.phone === '-' ? null : user.phone,
        isBlocked: !user.isBlocked,
      });
      fetchUsers();
      if (selectedUser?.id === user.id) {
        setSelectedUser((prev) => prev && ({ ...prev, isBlocked: !prev.isBlocked }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLoginAsUser = async (userId) => {
    setImpersonating(true);
    try {
      const response = await api.post(`/admin/impersonate/customer/${userId}`);
      loginAsUser(response.data.token, response.data.user);
      navigate('/customer/dashboard');
    } catch (error) {
      console.error(error);
      setImpersonating(false);
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
    }
  };

  const filteredUsers = useMemo(() => {
<<<<<<< HEAD
    return users.filter(user => {
      const query = searchTerm.trim().toLowerCase();
      if (roleFilter !== 'All' && user.role?.toLowerCase() !== roleFilter.toLowerCase()) {
        return false;
      }
      if (!query) return true;
      return [user.name, user.email, user.id].some(val => val?.toString().toLowerCase().includes(query));
    });
  }, [users, searchTerm, roleFilter]);

  const stats = useMemo(() => {
    const total = users.length;
    const customers = users.filter(u => u.type === 'customer').length;
    const vendors = users.filter(u => u.type === 'vendor').length;
    const suspended = users.filter(u => u.status === 'Suspended').length;
    return { total, customers, vendors, suspended };
  }, [users]);

  const getStatusIcon = (status) => {
    if (status === 'Active') return <UserCheck className="w-3.5 h-3.5" />;
    return <UserX className="w-3.5 h-3.5" />;
  };
=======
    return users.filter((user) => {
      const matchesSearch = [user.name, user.email, user.phone].some((value) =>
        value.toLowerCase().includes(searchQuery.toLowerCase())
      );

      const matchesStatus = statusFilter === 'All Status' || user.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter, users]);

  const selectedUserOrders = selectedUser?.orders ?? [];
  const completedEvents = selectedUserOrders.filter((order) => order.status === 'COMPLETED').length;
  const activeOrders = selectedUserOrders.filter((order) => order.status === 'PROCESSING').length;
  const pendingBookings = selectedUserOrders.filter((order) => order.status === 'PENDING').length;
  const totalAmountSpent = selectedUserOrders.reduce((sum, order) => {
    const value = Number(order.amount?.toString().replace(/[^0-9\.]/g, ''));
    return sum + (Number.isNaN(value) ? 0 : value);
  }, 0);

  const pendingEscrowOrders = selectedUserOrders.filter(
    (order) => order.status === 'PROCESSING' && order.escrow === 'HELD'
  );
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
<<<<<<< HEAD
          <h1 className="text-2xl font-bold text-textPrimary flex items-center gap-2">
=======
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
            <Users className="w-7 h-7 text-primary" />
            User Management
          </h1>
<<<<<<< HEAD
          <p className="text-textPrimary/60">View, modify, and enforce policies across all platform accounts.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<RefreshCcw className="w-4 h-4"/>} onClick={fetchUsers}>Refresh</Button>
          <Button leftIcon={<Shield className="w-4 h-4"/>}>Add Admin</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-textPrimary/60 mb-2">Total Users</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-textPrimary">{stats.total.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-textPrimary/60 mb-2">Customers</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-textPrimary">{stats.customers.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-textPrimary/60 mb-2">Vendors</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-textPrimary">{stats.vendors.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-textPrimary/80 mb-2">Inactive / Pending</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-red-400">{stats.suspended}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-textPrimary/40" />
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-4 py-2 text-textPrimary focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-textPrimary focus:outline-none focus:border-primary/50 cursor-pointer"
            >
              <option value="All">All Types</option>
              <option value="admin">Admin</option>
              <option value="vendor">Vendor</option>
              <option value="customer">Customer</option>
            </select>
            <Button variant="outline" leftIcon={<Filter className="w-4 h-4"/>}>Filters</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center text-textPrimary/40 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p>Loading users...</p>
            </div>
          ) : error ? (
            <div className="p-12 flex flex-col items-center justify-center text-red-400 gap-3 text-center">
              <AlertCircle className="w-8 h-8" />
              <p>{error}</p>
              <Button onClick={fetchUsers} variant="outline" size="sm">Try Again</Button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-textPrimary/40 gap-3 text-center">
              <Users className="w-12 h-12 opacity-20" />
              <p>No users found.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-sm font-medium text-textPrimary/50 bg-white/[0.02]">
                  <th className="p-4 pl-6">User / Email</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Joined</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredUsers.map((user, i) => (
                  <tr key={user.id || i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary shrink-0">
                          {user.name?.charAt(0) || '?'}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-textPrimary">{user.name}</span>
                          <span className="text-xs text-textPrimary/50">{user.email} • {user.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        user.type === 'admin' ? "bg-accent/20 text-accent border border-accent/20" :
                        user.type === 'vendor' ? "bg-primary/20 text-primary border border-primary/20" :
                        "bg-white/10 text-textPrimary/70 border border-white/10"
                      )}>
                        {user.type || user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "flex items-center gap-1.5 text-xs font-medium w-fit",
                        user.status === 'Active' ? "text-green-400" :
                        user.status === 'Pending' ? "text-yellow-500" :
                        "text-red-400"
                      )}>
                        {getStatusIcon(user.status)}
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-textPrimary/80">{user.joined ? new Date(user.joined).toLocaleDateString() : 'N/A'}</td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => navigate(`/admin/user/${user.originalId || user.id}?type=${user.type}`)}
                      >
                        Manage
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
=======
          <p className="text-gray-600 dark:text-white/60">Review customer accounts, manage access, and view booking history.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export Users</Button>
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={openCreateModal}>Add New User</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          type="text"
          placeholder="Search by name, email or phone..."
          className="px-4 py-2 bg-light-surface dark:bg-surface border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/40 focus:outline-none focus:border-primary"
        />
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="px-4 py-2 bg-light-surface dark:bg-surface border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-primary"
        >
          <option>All Status</option>
          <option>Active</option>
          <option>Pending</option>
          <option>Blocked</option>
        </select>
        <div className="md:col-span-2 flex gap-2">
          <Button variant="outline">Reset Filters</Button>
          <Button>Sync Status</Button>
        </div>
      </div>

      <Card className="border-gray-200 dark:border-white/5 overflow-hidden">
        <CardHeader>
          <div>
            <CardTitle>Platform Users</CardTitle>
            <CardDescription>{filteredUsers.length} users found</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Phone</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Join Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  return (
                    <tr
                      key={user.id}
                      className="border-b border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{user.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-white/60">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-white/60">{user.phone}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-white/60">{user.joinDate}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={cn(
                            'px-2 py-1 rounded-full text-xs font-semibold',
                            user.status === 'Active'
                              ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400'
                              : user.status === 'Pending'
                              ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
                              : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
                          )}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            leftIcon={<Eye className="w-4 h-4" />}
                            onClick={() => handleViewUser(user.id)}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            leftIcon={<Edit className="w-4 h-4" />}
                            onClick={() => openEditModal(user)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant={user.status === 'Blocked' ? 'secondary' : 'danger'}
                            leftIcon={user.status === 'Blocked' ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                            onClick={() => handleToggleBlock(user)}
                          >
                            {user.status === 'Blocked' ? 'Unblock' : 'Block'}
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            leftIcon={<Trash2 className="w-4 h-4" />}
                            onClick={() => handleDelete(user.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {selectedUser && (
          <motion.div
            className="fixed inset-0 z-[90] flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.button
              type="button"
              className="absolute inset-0 bg-black/40"
              onClick={() => setSelectedUser(null)}
              aria-label="Close drawer"
            />
            <motion.div
              className="relative ml-auto h-full w-full max-w-[640px] bg-white dark:bg-surface shadow-2xl overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center justify-between gap-4 border-b border-gray-200 dark:border-white/5 p-5">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedUser.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-white/50">Customer profile overview</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<LogIn className="w-4 h-4" />}
                    onClick={() => handleLoginAsUser(selectedUser.id)}
                    isLoading={impersonating}
                    title="Temporarily view the platform as this user, without their password"
                  >
                    Login as User
                  </Button>
                  <button
                    type="button"
                    className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-white/60 dark:hover:bg-white/5"
                    onClick={() => setSelectedUser(null)}
                    aria-label="Close drawer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-6 p-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-light-surface dark:bg-surface p-5">
                    <p className="text-sm text-gray-500 dark:text-white/50">Name</p>
                    <p className="mt-2 text-base font-semibold text-gray-900 dark:text-white">{selectedUser.name}</p>
                  </div>
                  <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-light-surface dark:bg-surface p-5">
                    <p className="text-sm text-gray-500 dark:text-white/50">Email</p>
                    <p className="mt-2 text-base font-semibold text-gray-900 dark:text-white">{selectedUser.email}</p>
                  </div>
                  <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-light-surface dark:bg-surface p-5">
                    <p className="text-sm text-gray-500 dark:text-white/50">Phone</p>
                    <p className="mt-2 text-base font-semibold text-gray-900 dark:text-white">{selectedUser.phone}</p>
                  </div>
                  <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-light-surface dark:bg-surface p-5">
                    <p className="text-sm text-gray-500 dark:text-white/50">Joined</p>
                    <p className="mt-2 text-base font-semibold text-gray-900 dark:text-white">{selectedUser.joinDate}</p>
                    <span className={cn(
                      'mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold',
                      selectedUser.status === 'Active'
                        ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300'
                        : selectedUser.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300'
                        : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300'
                    )}
                    >
                      {selectedUser.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <StatCard title="Completed Events" value={completedEvents} />
                  <StatCard title="Active Orders" value={activeOrders} />
                  <StatCard title="Pending Bookings" value={pendingBookings} />
                  <StatCard title="Total Spent" value={`LKR ${totalAmountSpent.toLocaleString()}`} badge="Admin" />
                </div>

                {pendingEscrowOrders.length > 0 && (
                  <div className="rounded-3xl border border-red-200 bg-red-50/80 px-4 py-4 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="mt-0.5 h-5 w-5" />
                      <div>
                        <p className="font-semibold">Action Required</p>
                        <p>
                          User has {pendingEscrowOrders.length} pending Escrow confirmation for Order{' '}
                          <span className="font-semibold">{pendingEscrowOrders[0].id}</span>.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-light-surface dark:bg-surface p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">Order & Booking History</h3>
                      <p className="text-sm text-gray-500 dark:text-white/50">Detailed customer orders and escrow status.</p>
                    </div>
                    <Button size="sm" variant="outline">View All</Button>
                  </div>

                  <div className="mt-5 space-y-4">
                    {selectedUserOrders.length > 0 ? (
                      selectedUserOrders.map((order) => (
                        <div key={order.id} className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-4 shadow-sm">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="text-sm text-gray-500 dark:text-white/50">Order</p>
                              <p className="mt-1 font-semibold text-gray-900 dark:text-white">{order.id} {order.item}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                              <InfoLabel label="Vendor" value={order.vendor} />
                              <InfoLabel label="Amount" value={order.amount} />
                              <InfoLabel label="Status" value={order.status} />
                              <InfoLabel label="Escrow" value={order.escrow} />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-white/50">No order history available for this customer.</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={isEditMode ? 'Edit User' : 'Add New User'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white/80">Name</label>
            <input
              type="text"
              value={formState.name}
              onChange={(e) => handleFormChange('name', e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-200 bg-light-surface px-4 py-2 text-gray-900 dark:border-white/10 dark:bg-surface dark:text-white"
              placeholder="Full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white/80">Email</label>
            <input
              type="email"
              value={formState.email}
              onChange={(e) => handleFormChange('email', e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-200 bg-light-surface px-4 py-2 text-gray-900 dark:border-white/10 dark:bg-surface dark:text-white"
              placeholder="Email address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white/80">Phone</label>
            <input
              type="text"
              value={formState.contactNumber}
              onChange={(e) => handleFormChange('contactNumber', e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-200 bg-light-surface px-4 py-2 text-gray-900 dark:border-white/10 dark:bg-surface dark:text-white"
              placeholder="Phone number"
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              id="blocked"
              type="checkbox"
              checked={formState.isBlocked}
              onChange={(e) => handleFormChange('isBlocked', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="blocked" className="text-sm text-gray-700 dark:text-white/80">Blocked</label>
          </div>
          {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
            <Button onClick={handleSubmit}>{isEditMode ? 'Save Changes' : 'Create User'}</Button>
          </div>
        </div>
      </Modal>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
    </div>
  );
};

const StatCard = ({ title, value, badge }) => (
  <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-light-surface dark:bg-surface p-4 text-center">
    <p className="text-sm text-gray-500 dark:text-white/50">{title}</p>
    <p className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
    {badge && <span className="mt-2 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{badge}</span>}
  </div>
);

const InfoLabel = ({ label, value }) => (
  <div>
    <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500 dark:text-white/50">{label}</p>
    <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{value}</p>
  </div>
);
