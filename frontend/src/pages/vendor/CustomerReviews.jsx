import React from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, Filter, Search, ThumbsUp, Flag, Reply } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

const REVIEWS = [
  { 
    id: 1, 
    customer: 'Sarah Jenkins', 
    date: 'Oct 20, 2026', 
    rating: 5, 
    text: 'Absolutely breathtaking photos! The team captured every moment perfectly.', 
    event: 'Wedding Reception',
    reply: 'Thank you so much Sarah! It was an absolute honor capturing your special day.' 
  },
  { 
    id: 2, 
    customer: 'Michael Chen', 
    date: 'Oct 15, 2026', 
    rating: 4, 
    text: 'Great work overall, but it took a bit longer than expected to receive the final gallery.', 
    event: 'Corporate Gala',
    reply: null 
  },
  { 
    id: 3, 
    customer: 'Emily Davis', 
    date: 'Sep 28, 2026', 
    rating: 5, 
    text: 'Professional, punctual, and the drone shots were incredible!', 
    event: 'Engagement Party',
    reply: null 
  },
];

export const CustomerReviews = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Star className="w-7 h-7 text-yellow-400" />
            Customer Reviews
          </h1>
          <p className="text-white/60">Manage your reputation and respond to client feedback.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        
        {/* Rating Overview */}
        <Card className="md:col-span-2 border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="p-6 flex items-center gap-6">
            <div className="text-center">
              <span className="text-5xl font-bold text-white">4.8</span>
              <div className="flex text-yellow-400 my-2 justify-center">
                <Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current opacity-50"/>
              </div>
              <span className="text-xs text-white/50">Based on 128 reviews</span>
            </div>
            
            <div className="flex-1 space-y-1.5">
              {[5,4,3,2,1].map(star => (
                <div key={star} className="flex items-center gap-2 text-xs text-white/60">
                  <span className="w-2">{star}</span>
                  <Star className="w-3 h-3 text-white/40" />
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 rounded-full" 
                      style={{ width: star === 5 ? '85%' : star === 4 ? '10%' : star === 3 ? '3%' : '1%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-white/10">
          <CardContent className="p-6 flex flex-col justify-center h-full">
            <h3 className="text-sm font-medium text-white/60 mb-2">Response Rate</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-white">92%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10">
          <CardContent className="p-6 flex flex-col justify-center h-full">
            <h3 className="text-sm font-medium text-white/60 mb-2">Pending Replies</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-primary">2</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input 
              type="text" 
              placeholder="Search reviews by name or keyword..." 
              className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary/50 transition-colors" 
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50 cursor-pointer">
              <option>All Reviews</option>
              <option>5 Stars</option>
              <option>Needs Reply</option>
            </select>
            <Button variant="outline" leftIcon={<Filter className="w-4 h-4"/>}>Filter</Button>
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {REVIEWS.map((review) => (
            <div key={review.id} className="p-6 hover:bg-white/[0.02] transition-colors">
              <div className="flex flex-col sm:flex-row gap-4">
                
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary shrink-0">
                  {review.customer.charAt(0)}
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-white">{review.customer}</h4>
                      <div className="flex items-center gap-2 text-xs text-white/50 mt-1">
                        <span>{review.date}</span>
                        <span>•</span>
                        <span>{review.event}</span>
                      </div>
                    </div>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={cn("w-4 h-4", i < review.rating ? "fill-current" : "text-white/20")} />
                      ))}
                    </div>
                  </div>

                  <p className="text-white/80 text-sm leading-relaxed">"{review.text}"</p>

                  {/* Vendor Reply Block */}
                  {review.reply ? (
                    <div className="mt-4 bg-surface/50 border-l-2 border-primary p-4 rounded-r-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        <span className="text-xs font-bold text-primary">Your Reply</span>
                      </div>
                      <p className="text-sm text-white/70 italic">"{review.reply}"</p>
                    </div>
                  ) : (
                    <div className="pt-2">
                      <Button variant="outline" size="sm" leftIcon={<Reply className="w-4 h-4"/>}>Reply to Review</Button>
                    </div>
                  )}
                </div>
                
                <div className="shrink-0 flex sm:flex-col gap-2">
                  <button className="p-2 text-white/40 hover:text-white rounded-lg transition-colors" title="Helpful">
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-white/40 hover:text-red-400 rounded-lg transition-colors" title="Report">
                    <Flag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
