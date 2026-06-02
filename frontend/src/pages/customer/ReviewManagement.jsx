import React from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, ExternalLink, ThumbsUp, MoreVertical, Calendar } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

const REVIEWS = [
  { id: 1, vendor: 'Lumiere Photography', date: 'Oct 20, 2026', rating: 5, text: 'Absolutely breathtaking photos! The team captured every moment perfectly.', likes: 12 },
  { id: 2, vendor: 'Grand Azure Resort', date: 'Oct 18, 2026', rating: 4, text: 'Beautiful venue. The catering staff was slightly delayed during cocktail hour, but overall a wonderful experience.', likes: 4 },
  { id: 3, vendor: 'DJ Velocity', date: 'Sep 02, 2026', rating: 5, text: 'Kept the dance floor packed all night!', likes: 23 },
];

export const ReviewManagement = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Star className="w-7 h-7 text-yellow-400" />
            My Reviews
          </h1>
          <p className="text-white/60">Manage feedback you've left for vendors and sellers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/80 mb-2">Total Reviews Written</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-white">14</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/60 mb-2">Helpful Votes Received</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-white">89</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {REVIEWS.map((review) => (
          <Card key={review.id} className="border-white/5 hover:border-white/10 transition-colors">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-lg text-white">{review.vendor}</h3>
                    <div className="flex bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={cn("w-3.5 h-3.5", i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-white/20")} />
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-white/80 leading-relaxed text-sm">"{review.text}"</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs text-white/40">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5"/> {review.date}</span>
                    <span className="flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5"/> {review.likes} people found this helpful</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                  <Button variant="outline" size="sm" className="flex-1 sm:flex-none" leftIcon={<ExternalLink className="w-4 h-4"/>}>View Public</Button>
                  <button className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
