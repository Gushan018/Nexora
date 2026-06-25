import React from 'react';
import { motion } from 'framer-motion';
import { Inbox, CheckCircle2, XCircle, Calendar, MapPin, Users, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { Link } from 'react-router-dom';

const REQUESTS = [
  {
    id: 'REQ-9921',
    customer: 'Sarah Jenkins',
    date: 'Oct 14, 2026',
    package: 'Premium Full Day',
    guests: 150,
    location: 'Grand Azure Resort, Malibu',
    value: 'LKR 3,200',
    message: 'We loved your portfolio! We are looking for lots of candid shots and drone coverage of the venue.',
    timeAgo: '2 hours ago',
    urgent: true
  },
  {
    id: 'REQ-9918',
    customer: 'Michael Chen',
    date: 'Nov 02, 2026',
    package: 'Essential Coverage',
    guests: 50,
    location: 'Downtown Loft, LA',
    value: 'LKR 1,500',
    message: 'Intimate ceremony. Just need the basics covered.',
    timeAgo: '1 day ago',
    urgent: false
  }
];

export const IncomingRequests = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Inbox className="w-7 h-7 text-primary" />
            Incoming Requests
          </h1>
          <p className="text-slate-600">Review and respond to new booking inquiries.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-slate-800 mb-2">Pending Requests</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-slate-900">2</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-300">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-slate-600 mb-2">Potential Value</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-slate-900">LKR 4,700</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {REQUESTS.length === 0 ? (
          <Card className="border-dashed border-slate-400 bg-surface/30">
            <CardContent className="p-12 flex flex-col items-center justify-center text-center">
              <Inbox className="w-12 h-12 text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Inbox Zero</h3>
              <p className="text-slate-500">You have no pending booking requests right now.</p>
            </CardContent>
          </Card>
        ) : (
          REQUESTS.map((req) => (
            <Card key={req.id} className={cn(
              "overflow-hidden transition-all duration-300",
              req.urgent ? "border-accent/30 shadow-[0_0_20px_rgba(212,175,55,0.1)]" : "border-slate-300"
            )}>
              {req.urgent && (
                <div className="bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider px-4 py-1.5 text-center border-b border-accent/20">
                  Responds needed within 24 hours
                </div>
              )}
              <div className="p-6 flex flex-col lg:flex-row gap-6">
                
                {/* Left Col: Customer & Event Info */}
                <div className="flex-1 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-1">{req.customer}</h3>
                      <p className="text-sm text-slate-500">Request {req.id} • Received {req.timeAgo}</p>
                    </div>
                    <div className="text-right">
                      <span className="block text-2xl font-bold text-primary">{req.value}</span>
                      <span className="text-sm text-slate-600">{req.package}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 bg-surface/50 p-3 rounded-lg border border-slate-200">
                      <Calendar className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase font-bold">Event Date</p>
                        <p className="text-sm text-slate-900 font-medium">{req.date}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-surface/50 p-3 rounded-lg border border-slate-200">
                      <Users className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase font-bold">Guest Count</p>
                        <p className="text-sm text-slate-900 font-medium">{req.guests} people</p>
                      </div>
                    </div>
                    <div className="col-span-2 flex items-start gap-3 bg-surface/50 p-3 rounded-lg border border-slate-200">
                      <MapPin className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase font-bold">Location</p>
                        <p className="text-sm text-slate-900 font-medium">{req.location}</p>
                      </div>
                    </div>
                  </div>

                  {req.message && (
                    <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 text-sm text-slate-800 italic relative">
                      <MessageSquare className="w-4 h-4 absolute top-4 left-4 text-slate-300" />
                      <p className="pl-6">"{req.message}"</p>
                    </div>
                  )}
                </div>

                {/* Right Col: Actions */}
                <div className="w-full lg:w-64 flex flex-col gap-3 shrink-0 lg:border-l lg:border-slate-200 lg:pl-6">
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl mb-auto">
                    <p className="text-xs text-primary leading-relaxed text-center">
                      Approving this request will automatically send a payment link to the customer to collect the 20% deposit.
                    </p>
                  </div>
                  
                  <Link to="/vendor/booking-approval">
                    <Button className="w-full bg-green-500 hover:bg-green-600 text-slate-900 border-none" leftIcon={<CheckCircle2 className="w-4 h-4"/>}>
                      Approve & Collect
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full" leftIcon={<MessageSquare className="w-4 h-4"/>}>
                    Message Customer
                  </Button>
                  <Button variant="outline" className="w-full text-red-400 hover:text-red-300 hover:bg-red-400/10 border-red-400/20 mt-4" leftIcon={<XCircle className="w-4 h-4"/>}>
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
