import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Calendar, Shield, Star, Package, ShoppingBag, Loader2, AlertCircle, RefreshCcw, MapPin, Phone, Store, User as UserIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { api } from '../../utils/api';

export const UserDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const userType = searchParams.get('type');
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/admin/users/${id}`);
      setUser(response.data);
    } catch (err) {
      setError('Failed to load user details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-textPrimary/40 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-lg">Loading user details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-red-400 gap-4 text-center p-6">
        <AlertCircle className="w-12 h-12" />
        <p className="text-lg">{error}</p>
        <Button onClick={fetchUser} variant="outline">Try Again</Button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-textPrimary/40 gap-4">
        <UserIcon className="w-16 h-16 opacity-20" />
        <p className="text-lg">User not found</p>
        <Button onClick={() => navigate('/admin/user-management')} variant="outline">Back to Users</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-white/5 transition-colors text-textPrimary/60 hover:text-textPrimary">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-textPrimary flex items-center gap-2">
            {user.businessName || user.name || 'User Details'}
          </h1>
          <p className="text-textPrimary/60">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center font-bold text-3xl text-primary mb-4">
                {(user.businessName || user.name || 'U').charAt(0)}
              </div>
              <h2 className="text-xl font-bold text-textPrimary">{user.businessName || user.name}</h2>
              <p className="text-sm text-textPrimary/60">{user.email}</p>
              <span className="mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/20">
                {user.type || user.role}
              </span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {user.contactNumber && (
                <div className="flex items-center gap-2 text-sm text-textPrimary/70">
                  <Phone className="w-4 h-4 text-textPrimary/40" />
                  {user.contactNumber}
                </div>
              )}
              {user.location && (
                <div className="flex items-center gap-2 text-sm text-textPrimary/70">
                  <MapPin className="w-4 h-4 text-textPrimary/40" />
                  {user.location}
                </div>
              )}
              {user.vendorType && (
                <div className="flex items-center gap-2 text-sm text-textPrimary/70">
                  <Store className="w-4 h-4 text-textPrimary/40" />
                  {user.vendorType}
                </div>
              )}
              {user.registrationDate && (
                <div className="flex items-center gap-2 text-sm text-textPrimary/70">
                  <Calendar className="w-4 h-4 text-textPrimary/40" />
                  Joined {new Date(user.registrationDate).toLocaleDateString()}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {user.type === 'vendor' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Business Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 rounded-xl bg-white/5">
                      <p className="text-2xl font-bold text-primary">{user._count?.services || 0}</p>
                      <p className="text-xs text-textPrimary/60 mt-1">Services</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-white/5">
                      <p className="text-2xl font-bold text-accent">{user._count?.products || 0}</p>
                      <p className="text-xs text-textPrimary/60 mt-1">Products</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-white/5">
                      <p className="text-2xl font-bold text-green-400">{user._count?.eventPackages || 0}</p>
                      <p className="text-xs text-textPrimary/60 mt-1">Packages</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-white/5">
                      <p className="text-2xl font-bold text-yellow-500">{user.averageRating || 0}</p>
                      <p className="text-xs text-textPrimary/60 mt-1">Avg Rating</p>
                    </div>
                  </div>
                  {user.description && (
                    <p className="mt-4 text-sm text-textPrimary/60 p-3 rounded-lg bg-white/5">{user.description}</p>
                  )}
                  <div className="mt-4 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium text-green-400">Verified</span>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {user.type === 'customer' && (
            <Card>
              <CardHeader>
                <CardTitle>Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-xl bg-white/5">
                    <p className="text-2xl font-bold text-primary">{user._count?.bookings || 0}</p>
                    <p className="text-xs text-textPrimary/60 mt-1">Bookings</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-white/5">
                    <p className="text-2xl font-bold text-accent">{user._count?.orders || 0}</p>
                    <p className="text-xs text-textPrimary/60 mt-1">Orders</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-white/5">
                    <p className="text-2xl font-bold text-green-400">{user._count?.reviews || 0}</p>
                    <p className="text-xs text-textPrimary/60 mt-1">Reviews</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {user.type === 'admin' && (
            <Card>
              <CardContent className="p-6 text-center text-textPrimary/40">
                <Shield className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Admin account with system-level access.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};


