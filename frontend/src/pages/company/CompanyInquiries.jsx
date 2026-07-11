import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, User, CheckCircle2, XCircle, Clock, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { api } from '../../utils/api';

export const CompanyInquiries = () => {
  const { data: bookingsData } = useQuery({
    queryKey: ['companyBookings'],
    queryFn: async () => {
      const res = await api.get('/bookings/my');
      return res.data;
    },
  });

  const bookingsList = Array.isArray(bookingsData) ? bookingsData : bookingsData?.bookings || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <FileText className="w-8 h-8 text-primary" />
          Client Inquiries & Event Proposals
        </h1>
        <p className="text-gray-600 dark:text-white/60">Review incoming event customization requests, accept bookings, or issue custom quotes.</p>
      </div>

      <Card className="border-gray-200 dark:border-white/5">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/10 text-xs font-bold text-gray-700 dark:text-white/70 bg-gray-50 dark:bg-white/5 uppercase tracking-wider">
                  <th className="p-4 pl-6">Client</th>
                  <th className="p-4">Requested Event Package</th>
                  <th className="p-4">Event Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {bookingsList.map((b) => (
                  <tr key={b.bookingId} className="border-b border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                    <td className="p-4 pl-6">
                      <span className="font-bold text-gray-900 dark:text-white block">{b.customer?.name || 'Client'}</span>
                      <span className="text-xs text-gray-500 dark:text-white/50">{b.customer?.email}</span>
                    </td>
                    <td className="p-4 font-semibold text-gray-900 dark:text-white">
                      {b.package?.packageName || b.service?.serviceName || 'Custom Gala Package'}
                    </td>
                    <td className="p-4 text-xs text-gray-600 dark:text-white/70">
                      {b.eventDate ? new Date(b.eventDate).toLocaleDateString() : 'TBD'}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400">
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <Button variant="outline" size="sm">Review Details</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
