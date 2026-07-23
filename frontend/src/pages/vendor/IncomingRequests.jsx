import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Inbox, CheckCircle2, XCircle, Calendar, MapPin, Users, MessageSquare, Loader2 } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { api } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

export const IncomingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchIncomingRequests();
  }, []);

  const fetchIncomingRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/bookings/vendor');
      const allBookings = Array.isArray(response.data) ? response.data : [];
      // Filter pending requests
      const pending = allBookings.filter(b => b.status === 'PENDING');
      setRequests(pending);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load incoming requests.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, status) => {
    try {
      setActionLoading(bookingId);
      await api.put(`/bookings/${bookingId}/status`, { status });
      setRequests(prev => prev.filter(b => b.bookingId !== bookingId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update booking status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleMessageCustomer = (customer) => {
    navigate('/vendor/chat-inbox', { state: { recipient: customer } });
  };

  const totalPotentialValue = requests.reduce((sum, r) => sum + parseFloat(r.totalPrice || 0), 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Inbox className="w-7 h-7 text-primary" />
            Incoming Requests
          </h1>
          <p className="text-slate-600 dark:text-slate-300">Review and respond to new booking inquiries.</p>
        </div>
        <Button variant="outline" onClick={fetchIncomingRequests} disabled={loading}>
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Pending Requests</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">{requests.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 dark:border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Potential Value</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">LKR {totalPotentialValue.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {loading ? (
          <Card className="border-slate-200 dark:border-white/10">
            <CardContent className="p-12 flex flex-col items-center justify-center text-center">
              <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
              <p className="text-slate-600 dark:text-slate-300">Loading incoming requests...</p>
            </CardContent>
          </Card>
        ) : requests.length === 0 ? (
          <Card className="border-dashed border-slate-300 dark:border-slate-700">
            <CardContent className="p-12 flex flex-col items-center justify-center text-center">
              <Inbox className="w-12 h-12 text-slate-400 dark:text-slate-500 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Inbox Zero</h3>
              <p className="text-slate-600 dark:text-slate-400">You have no pending booking requests right now.</p>
            </CardContent>
          </Card>
        ) : (
          requests.map((req) => (
            <Card key={req.bookingId} className="overflow-hidden border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1C2333]">
              <div className="bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider px-4 py-1.5 text-center border-b border-amber-500/20">
                Action Required: Pending Approval
              </div>
              <div className="p-6 flex flex-col lg:flex-row gap-6">
                
                {/* Left Col: Customer & Event Info */}
                <div className="flex-1 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{req.customer?.name || 'Customer Inquiry'}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Booking #{req.bookingId} • {req.customer?.email || ''}</p>
                    </div>
                    <div className="text-right">
                      <span className="block text-2xl font-bold text-primary">LKR {parseFloat(req.totalPrice || 0).toLocaleString()}</span>
                      <span className="text-sm text-slate-600 dark:text-slate-300">{req.service?.serviceName || req.package?.packageName || 'Event Service'}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-white/10">
                      <Calendar className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Event Date</p>
                        <p className="text-sm text-slate-900 dark:text-white font-medium">{new Date(req.eventDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-white/10">
                      <Users className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Guest Count</p>
                        <p className="text-sm text-slate-900 dark:text-white font-medium">{req.guestCount || 'N/A'} guests</p>
                      </div>
                    </div>
                    <div className="col-span-2 flex items-start gap-3 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-white/10">
                      <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Location</p>
                        <p className="text-sm text-slate-900 dark:text-white font-medium">{req.eventLocation || 'Location upon request'}</p>
                      </div>
                    </div>
                  </div>

                  {req.specialInstructions && (
                    <div className="bg-slate-100 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200 italic relative">
                      <MessageSquare className="w-4 h-4 absolute top-4 left-4 text-slate-400" />
                      <p className="pl-6">"{req.specialInstructions}"</p>
                    </div>
                  )}
                </div>

                {/* Right Col: Actions */}
                <div className="w-full lg:w-64 flex flex-col gap-3 shrink-0 lg:border-l lg:border-slate-200 dark:lg:border-white/10 lg:pl-6">
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl mb-auto">
                    <p className="text-xs text-primary leading-relaxed text-center font-medium">
                      Approving this request will accept the booking and notify the customer to proceed with deposit payment.
                    </p>
                  </div>
                  
                  <Button 
                    onClick={() => handleStatusChange(req.bookingId, 'ACCEPTED')}
                    isLoading={actionLoading === req.bookingId}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold border-none" 
                    leftIcon={<CheckCircle2 className="w-4 h-4"/>}
                  >
                    Approve Request
                  </Button>

                  <Button 
                    onClick={() => handleMessageCustomer(req.customer)}
                    variant="outline" 
                    className="w-full border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800" 
                    leftIcon={<MessageSquare className="w-4 h-4"/>}
                  >
                    Message Customer
                  </Button>

                  <Button 
                    onClick={() => handleStatusChange(req.bookingId, 'REJECTED')}
                    isLoading={actionLoading === req.bookingId}
                    variant="outline" 
                    className="w-full text-red-500 hover:text-red-400 hover:bg-red-500/10 border-red-500/30" 
                    leftIcon={<XCircle className="w-4 h-4"/>}
                  >
                    Decline Request
                  </Button>
                </div>

              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

