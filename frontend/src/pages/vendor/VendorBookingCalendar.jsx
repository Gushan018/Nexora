import React, { useEffect, useMemo, useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { api } from '../../utils/api';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const normalizeDate = (dateString) => {
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0);
  return date;
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const VendorBookingCalendar = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewDate, setViewDate] = useState(() => new Date());

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/bookings/vendor');
      setBookings(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load vendor bookings.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const currentMonthStart = useMemo(() => new Date(viewDate.getFullYear(), viewDate.getMonth(), 1), [viewDate]);
  const currentMonthLabel = useMemo(() => viewDate.toLocaleString('default', { month: 'long', year: 'numeric' }), [viewDate]);
  const totalDaysInMonth = useMemo(() => new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate(), [viewDate]);
  const startOffset = useMemo(() => currentMonthStart.getDay(), [currentMonthStart]);

  const normalizedBookings = useMemo(
    () => bookings.map((booking) => ({
      ...booking,
      normalizedDate: normalizeDate(booking.eventDate),
    })),
    [bookings]
  );

  const calendarGrid = useMemo(() => {
    const firstGridDate = new Date(currentMonthStart);
    firstGridDate.setDate(firstGridDate.getDate() - startOffset);

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(firstGridDate);
      date.setDate(firstGridDate.getDate() + index);
      const isoDate = date.toISOString().slice(0, 10);
      const events = normalizedBookings.filter((booking) => booking.normalizedDate.toISOString().slice(0, 10) === isoDate);
      return {
        date,
        events,
        isCurrentMonth: date.getMonth() === viewDate.getMonth(),
        isToday: date.toDateString() === new Date().toDateString(),
      };
    });
  }, [currentMonthStart, normalizedBookings, startOffset, viewDate]);

  const upcomingBookings = useMemo(() => {
    const today = normalizeDate(new Date().toISOString());
    return normalizedBookings
      .filter((booking) => booking.normalizedDate >= today)
      .sort((a, b) => a.normalizedDate - b.normalizedDate)
      .slice(0, 5);
  }, [normalizedBookings]);

  const monthStats = useMemo(() => {
    const monthStart = normalizeDate(currentMonthStart.toISOString());
    const monthEnd = normalizeDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).toISOString());
    const daysWithEvents = new Set();
    const events = normalizedBookings.filter((booking) => {
      const bookingDate = booking.normalizedDate;
      return bookingDate >= monthStart && bookingDate <= monthEnd;
    });
    events.forEach((booking) => daysWithEvents.add(booking.normalizedDate.toISOString().slice(0, 10)));

    return {
      total: events.length,
      bookedDays: daysWithEvents.size,
      nextEvent: upcomingBookings[0] || null,
    };
  }, [normalizedBookings, currentMonthStart, upcomingBookings, viewDate]);

  const changeMonth = (offset) => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="w-7 h-7 text-primary" />
            Booking Calendar
          </h1>
          <p className="text-slate-600 dark:text-slate-300">Manage your schedule and availability for upcoming events.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchBookings}>
            Refresh Schedule
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3">
          <CardContent className="p-0">
            {/* Calendar Header */}
            <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{currentMonthLabel}</h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => changeMonth(-1)}
                  className="p-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewDate(new Date())}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Today
                </button>
                <button 
                  onClick={() => changeMonth(1)}
                  className="p-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 border-b border-slate-200 dark:border-white/10">
              {DAYS.map(day => (
                <div key={day} className="p-3 text-center text-sm font-semibold text-slate-600 dark:text-slate-300 border-r border-slate-200 dark:border-white/10 last:border-0">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 bg-white dark:bg-[#1C2333]/50">
              {calendarGrid.map((cell, idx) => (
                <div 
                  key={idx} 
                  className={cn(
                    "min-h-[100px] p-2 border-r border-b border-slate-200 dark:border-white/10 last:border-r-0 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40",
                    !cell.isCurrentMonth && "opacity-40 bg-slate-100/50 dark:bg-slate-900/50"
                  )}
                >
                  <span className={cn(
                    "w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold mb-1",
                    cell.isToday 
                      ? "bg-primary text-slate-950 shadow-md" 
                      : cell.isCurrentMonth 
                        ? "text-slate-900 dark:text-slate-100" 
                        : "text-slate-400 dark:text-slate-500"
                  )}>
                    {cell.date.getDate()}
                  </span>
                  
                  {cell.events.map((evt) => (
                    <div key={evt.bookingId} className="bg-primary/20 border border-primary/40 rounded p-1 mb-1 truncate cursor-pointer hover:bg-primary/30 transition-colors">
                      <span className="text-[10px] text-primary font-bold block">{formatTime(evt.eventDate)}</span>
                      <span className="text-[11px] text-slate-900 dark:text-slate-100 font-semibold truncate block">{evt.service?.serviceName || evt.package?.packageName || 'Booking'}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-textPrimary/70">Total bookings</span>
                <span className="font-semibold text-textPrimary">{monthStats.total}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-textPrimary/70">Booked days</span>
                <span className="font-semibold text-textPrimary">{monthStats.bookedDays}</span>
              </div>
              {monthStats.nextEvent && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 mt-4">
                  <p className="text-xs uppercase tracking-wider text-textPrimary/50 font-semibold mb-1">Next Event</p>
                  <p className="font-semibold text-textPrimary">{monthStats.nextEvent.service?.serviceName || monthStats.nextEvent.package?.packageName || 'Booking'}</p>
                  <p className="text-xs text-textPrimary/60 mt-1">{new Date(monthStats.nextEvent.eventDate).toLocaleDateString()}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

