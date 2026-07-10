import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Lock, Unlock, Eye, AlertTriangle, X, Trash2, Plus, Edit, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { cn } from '../../utils/cn';
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

  useEffect(() => {
    fetchUsers();
  }, []);

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
    }
  };

  const filteredUsers = useMemo(() => {
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-7 h-7 text-primary" />
            User Management
          </h1>
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
