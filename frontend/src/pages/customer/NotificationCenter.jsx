import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../utils/api';
import { Bell, Check, Clock } from 'lucide-react';
import { cn } from '../../utils/cn';

export const NotificationCenter = () => {
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await api.get('/notifications/my');
      return res.data;
    }
  });

  const markReadMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.put(`/notifications/${id}/read`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  return (
    <div className="pt-24 pb-12 container mx-auto px-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <Bell className="w-8 h-8 text-primary" />
              Notification Center
            </h1>
            <p className="text-slate-600 mt-2">Stay updated on your bookings, orders, and account activity.</p>
          </div>
        </div>

        <div className="space-y-4">
          {isLoading && <div className="text-center text-slate-900 py-12">Loading notifications...</div>}
          
          {!isLoading && notifications.length === 0 && (
            <Card className="border-slate-200 bg-surface/30">
              <CardContent className="p-12 text-center text-slate-600">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>You have no notifications yet.</p>
              </CardContent>
            </Card>
          )}

          {notifications.map((notification) => (
            <Card 
              key={notification.notificationId} 
              className={cn(
                "border-slate-200 transition-all hover:bg-surface",
                !notification.isRead ? "bg-primary/5 border-primary/20" : "bg-surface/30"
              )}
            >
              <CardContent className="p-6 flex flex-col sm:flex-row gap-4 items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {!notification.isRead && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                    <h3 className={cn("font-bold", !notification.isRead ? "text-slate-900" : "text-slate-800")}>
                      {notification.type}
                    </h3>
                  </div>
                  <p className={cn("text-sm", !notification.isRead ? "text-slate-800" : "text-slate-600")}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-2">
                    <Clock className="w-3 h-3" />
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                
                {!notification.isRead && (
                  <button 
                    onClick={() => markReadMutation.mutate(notification.notificationId)}
                    className="p-2 bg-slate-100 hover:bg-primary/20 text-slate-600 hover:text-primary rounded-lg transition-colors shrink-0"
                    title="Mark as read"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

      </motion.div>
    </div>
  );
};
