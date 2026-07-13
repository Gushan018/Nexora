import React, { useEffect, useMemo, useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, User } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
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
<<<<<<< HEAD
          <h1 className="text-2xl font-bold text-textPrimary flex items-center gap-2">
            <CalendarIcon className="w-7 h-7 text-primary" />
            Booking Calendar
          </h1>
          <p className="text-textPrimary/60">Manage your schedule and availability for upcoming events.</p>
=======
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarIcon className="w-7 h-7 text-primary" />
            Booking Calendar
          </h1>
          <p className="text-slate-600">Manage your schedule and availability for upcoming events.</p>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => alert('Integration coming soon')}>
            Sync with Google Calendar
          </Button>
          <Button variant="secondary" onClick={() => alert('Manual block feature coming soon')}>
            Add Manual Block
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3">
          <CardContent className="p-0">
<<<<<<< HEAD
            <div className="p-4 border-b border-white/5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-textPrimary">{currentMonthLabel}</h2>
                <p className="text-sm text-textPrimary/60">View your vendor bookings by day and manage event load.</p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => changeMonth(-1)}
                  className="p-2 bg-surface border border-white/10 rounded-lg text-textPrimary hover:bg-white/5 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewDate(new Date())}
                  className="px-4 py-2 bg-surface border border-white/10 rounded-lg text-textPrimary text-sm font-medium hover:bg-white/5 transition-colors"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => changeMonth(1)}
                  className="p-2 bg-surface border border-white/10 rounded-lg text-textPrimary hover:bg-white/5 transition-colors"
                >
=======
            {/* Calendar Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">October 2026</h2>
              <div className="flex gap-2">
                <button className="p-2 bg-surface border border-slate-300 rounded-lg text-slate-900 hover:bg-slate-100 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="px-4 py-2 bg-surface border border-slate-300 rounded-lg text-slate-900 text-sm font-medium hover:bg-slate-100 transition-colors">
                  Today
                </button>
                <button className="p-2 bg-surface border border-slate-300 rounded-lg text-slate-900 hover:bg-slate-100 transition-colors">
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

<<<<<<< HEAD
            <div className="grid grid-cols-7 border-b border-white/5 bg-surface/10">
              {DAYS.map((day) => (
                <div key={day} className="p-3 text-center text-sm font-medium text-textPrimary/50 border-r border-white/5 last:border-0">
=======
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 border-b border-slate-200">
              {DAYS.map(day => (
                <div key={day} className="p-3 text-center text-sm font-medium text-slate-500 border-r border-slate-200 last:border-0">
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                  {day}
                </div>
              ))}
            </div>
<<<<<<< HEAD

            <div className="grid grid-cols-7 gap-px bg-white/5">
              {calendarGrid.map((cell) => (
                <div
                  key={cell.date.toISOString()}
                  className={cn(
                    'min-h-[110px] p-3 bg-surface/60 text-textPrimary transition-colors',
                    !cell.isCurrentMonth && 'opacity-30 bg-black/20 text-white/40',
                    cell.isToday && 'ring-2 ring-primary/40',
                  )}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className={cn(
                      'inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold',
                      cell.isToday ? 'bg-primary text-slate-950' : 'text-textPrimary/80'
                    )}>
                      {cell.date.getDate()}
                    </span>
                    {cell.events.length > 0 && (
                      <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        {cell.events.length} {cell.events.length === 1 ? 'event' : 'events'}
                      </span>
=======
            
            <div className="grid grid-cols-7 grid-rows-5 bg-surface/30">
              {[...Array(35)].map((_, i) => {
                const dayNumber = i - 3; // Offset to simulate month starting on Thu
                const isCurrentMonth = dayNumber > 0 && dayNumber <= 31;
                const hasEvent = MOCK_EVENTS[dayNumber];
                
                return (
                  <div key={i} className={cn(
                    "min-h-[100px] p-2 border-r border-b border-slate-200 last:border-r-0 transition-colors hover:bg-slate-50",
                    !isCurrentMonth && "opacity-30 bg-black/20"
                  )}>
                    {isCurrentMonth && (
                      <>
                        <span className={cn(
                          "w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium mb-1",
                          dayNumber === 24 ? "bg-primary text-white" : "text-slate-800"
                        )}>
                          {dayNumber}
                        </span>
                        
                        {hasEvent && hasEvent.map((evt, idx) => (
                          <div key={idx} className="bg-primary/20 border border-primary/30 rounded p-1 mb-1 truncate cursor-pointer hover:bg-primary/30 transition-colors">
                            <span className="text-[10px] text-primary font-bold block">{evt.time}</span>
                            <span className="text-[11px] text-slate-900 truncate">{evt.title}</span>
                          </div>
                        ))}
                      </>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                    )}
                  </div>

                  <div className="space-y-1">
                    {cell.events.slice(0, 2).map((booking, index) => (
                      <div key={booking.bookingId ?? index} className="rounded-xl border border-white/10 bg-white/5 p-2 text-[11px] text-textPrimary/80">
                        <div className="font-semibold text-textPrimary truncate">{booking.customer?.name || 'Customer'}</div>
                        <div className="truncate">{booking.service?.serviceName || booking.package?.packageName || 'Booking'}</div>
                        <div className="flex items-center gap-1 text-textPrimary/50">
                          <Clock className="w-3.5 h-3.5" />
                          {formatTime(booking.eventDate)}
                        </div>
                      </div>
                    ))}
                    {cell.events.length > 2 && (
                      <div className="text-[11px] text-textPrimary/50">+{cell.events.length - 2} more</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
<<<<<<< HEAD
          <div className="rounded-3xl border border-white/5 bg-surface/50 p-5">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div>
                <p className="text-sm font-medium text-textPrimary/70">Month summary</p>
                <h3 className="text-xl font-bold text-textPrimary">{viewDate.toLocaleString('default', { month: 'long' })} stats</h3>
=======
          <h3 className="font-bold text-slate-900 mb-2">Upcoming this week</h3>
          
          <Card className="border-primary/50 relative overflow-hidden group hover:border-primary transition-colors cursor-pointer">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
            <CardContent className="p-4 pl-5">
              <h4 className="text-slate-900 font-bold mb-3 group-hover:text-primary transition-colors">TechNova Corporate Gala</h4>
              <div className="space-y-2 text-sm text-slate-700">
                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-slate-500"/> Oct 14, 18:00 - 23:00</div>
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-500"/> Grand Hyatt Ballroom</div>
                <div className="flex items-center gap-2"><User className="w-4 h-4 text-slate-500"/> Contact: Michael Chen</div>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
              </div>
              <span className="text-xs text-textPrimary/50">{monthStats.total} bookings</span>
            </div>
            <div className="space-y-3 text-sm text-textPrimary/70">
              <div className="flex items-center justify-between">
                <span>Total booked days</span>
                <span className="font-semibold text-textPrimary">{monthStats.bookedDays}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Upcoming events</span>
                <span className="font-semibold text-textPrimary">{upcomingBookings.length}</span>
              </div>
              {monthStats.nextEvent && (
                <div className="rounded-3xl border border-white/10 bg-white/5 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-textPrimary/40">Next event</p>
                  <p className="mt-2 font-semibold text-textPrimary">{monthStats.nextEvent.service?.serviceName || monthStats.nextEvent.package?.packageName || 'Booking'}</p>
                  <p className="text-sm text-textPrimary/60">{new Date(monthStats.nextEvent.eventDate).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>

<<<<<<< HEAD
          <div className="rounded-3xl border border-white/5 bg-surface/50 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-textPrimary">Upcoming bookings</h3>
              <span className="text-xs text-textPrimary/50">Next 5</span>
            </div>

            {loading ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center text-textPrimary/60">Loading bookings…</div>
            ) : error ? (
              <div className="rounded-3xl border border-red-400/20 bg-red-500/5 p-6 text-center text-red-200">{error}</div>
            ) : upcomingBookings.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center text-textPrimary/60">No upcoming bookings found.</div>
            ) : (
              <div className="space-y-3">
                {upcomingBookings.map((booking) => (
                  <Card key={booking.bookingId} className="border-white/10 bg-white/5">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <p className="font-semibold text-textPrimary">{booking.customer?.name || 'Customer'}</p>
                          <p className="text-sm text-textPrimary/60">{booking.service?.serviceName || booking.package?.packageName || 'Booking'}</p>
                        </div>
                        <span className="text-sm text-textPrimary/50">{new Date(booking.eventDate).toLocaleDateString()}</span>
                      </div>
                      <div className="mt-3 flex items-center gap-3 text-sm text-textPrimary/60">
                        <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{formatTime(booking.eventDate)}</span>
                        <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{booking.location || 'No location'}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
=======
          <Card className="border-slate-300 hover:border-slate-400 transition-colors cursor-pointer">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-300" />
            <CardContent className="p-4 pl-5">
              <h4 className="text-slate-900 font-bold mb-3">Sarah & John Wedding</h4>
              <div className="space-y-2 text-sm text-slate-700">
                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-slate-500"/> Oct 18, 14:00 - 22:00</div>
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-500"/> Beachfront Resort</div>
                <div className="flex items-center gap-2"><User className="w-4 h-4 text-slate-500"/> Contact: Sarah Jenkins</div>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
