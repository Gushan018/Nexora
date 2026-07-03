import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Users, TrendingUp, Search, Download, Map, Store } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

export const MarketplaceReports = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Globe className="w-7 h-7 text-primary" />
            Marketplace Liquidity & Health
          </h1>
          <p className="text-white/60">Analyze supply vs demand, search intent, and geographic coverage.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Download className="w-4 h-4"/>}>Export Dataset</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/80 mb-2">Supply/Demand Ratio</h3>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold text-primary">1 : 24</span>
            </div>
            <p className="text-xs text-primary/60 font-medium mt-2">1 Vendor for every 24 active Customers</p>
          </CardContent>
        </Card>

        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/60 mb-2">Zero-Result Searches</h3>
            <div className="flex justify-between items-end">
              <div>
                <span className="text-3xl font-bold text-white">4.2%</span>
                <p className="text-xs text-red-400 font-medium mt-1">Slight increase in missed searches</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                <Search className="w-5 h-5 text-white/40" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/60 mb-2">Vendor Density</h3>
            <div className="flex justify-between items-end">
              <div>
                <span className="text-3xl font-bold text-white">High</span>
                <p className="text-xs text-green-400 font-medium mt-1">In Top 5 Metro Areas</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                <Map className="w-5 h-5 text-white/40" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Liquidity */}
        <Card className="border-white/5">
          <CardHeader>
            <CardTitle>Category Liquidity</CardTitle>
            <CardDescription>Identifying underserved markets (High Demand, Low Supply)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {[
                { name: 'Photography', status: 'Oversupplied', ratio: '1:12', color: 'bg-yellow-500', bar: 'w-3/4' },
                { name: 'Venues', status: 'Balanced', ratio: '1:25', color: 'bg-green-400', bar: 'w-1/2' },
                { name: 'Specialty Catering', status: 'Underserved', ratio: '1:80', color: 'bg-red-400', bar: 'w-1/4' },
                { name: 'Live Entertainment', status: 'Balanced', ratio: '1:30', color: 'bg-green-400', bar: 'w-1/2' },
              ].map((cat, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-white">{cat.name}</span>
                    <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full border", 
                      cat.status === 'Underserved' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                      cat.status === 'Oversupplied' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                      'bg-green-500/10 text-green-400 border-green-500/20'
                    )}>
                      {cat.status} ({cat.ratio})
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: cat.bar.replace('w-', '') === '3/4' ? '75%' : cat.bar.replace('w-', '') === '1/2' ? '50%' : '25%' }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className={cn("h-full rounded-full", cat.color)} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Missed Search Terms */}
        <Card className="border-white/5">
          <CardHeader>
            <CardTitle>Top Unfulfilled Search Intents</CardTitle>
            <CardDescription>What customers want but cannot find</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-white/5">
              {[
                { term: 'Vegan Catering Options', volume: '12.5k', location: 'Kandy, Sri Lanka' },
                { term: 'Drone Light Shows', volume: '8.2k', location: 'Colombo, Sri Lanka' },
                { term: 'Ice Sculpture Artists', volume: '5.1k', location: 'Colombo, Sri Lanka' },
                { term: 'Pet-Friendly Venues', volume: '4.8k', location: 'Global' },
                { term: 'Silent Disco Equipment', volume: '3.2k', location: 'Colombo, Sri Lanka' },
              ].map((search, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                  <div>
                    <h4 className="text-sm font-bold text-white">"{search.term}"</h4>
                    <p className="text-xs text-white/50 flex items-center gap-1 mt-1">
                      <Map className="w-3 h-3" /> {search.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-white">{search.volume}</span>
                    <p className="text-[10px] text-white/40">Searches</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-white/5">
              <Button className="w-full" variant="outline">Run Campaign to Target These Verticals</Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};
