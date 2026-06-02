import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Download, DollarSign, TrendingUp, Filter, Calendar, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

export const PurchaseReports = () => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <PieChart className="w-7 h-7 text-primary" />
            Purchase Analytics
          </h1>
          <p className="text-white/60">Visualize your marketplace spending and physical product orders.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Calendar className="w-4 h-4"/>}>2026</Button>
          <Button leftIcon={<Download className="w-4 h-4"/>}>Export PDF</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/80 mb-2">Total Marketplace Spend</h3>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold text-white">$2,450.00</span>
            </div>
            <p className="text-xs text-white/50 mt-4">For the year 2026</p>
          </CardContent>
        </Card>

        <Card className="border-accent/20">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/60 mb-2">Items Purchased</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-white">18</span>
              <span className="text-sm text-accent mb-1 flex items-center"><TrendingUp className="w-3 h-3 mr-1"/> 12%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/60 mb-2">Avg. Order Value</h3>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-white">$136.11</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart Visualization */}
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-48 h-48 rounded-full border-[16px] border-surface relative mb-6 flex items-center justify-center shadow-lg">
              <div 
                className="absolute inset-0 rounded-full transition-all duration-1000"
                style={{
                  background: `conic-gradient(
                    #5B7CFA 0% 60%, 
                    #7C3AED 60% 85%, 
                    #22c55e 85% 100%
                  )`,
                  margin: '-16px'
                }}
              />
              <div className="absolute inset-0 bg-card rounded-full m-2 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">100%</span>
              </div>
            </div>
            
            <div className="w-full space-y-3">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary"/> <span className="text-white/80">Decor & Lighting</span></div>
                <span className="font-bold text-white">60%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-accent"/> <span className="text-white/80">Favors & Gifts</span></div>
                <span className="font-bold text-white">25%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"/> <span className="text-white/80">Stationery</span></div>
                <span className="font-bold text-white">15%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Significant Purchases */}
        <Card>
          <CardHeader className="flex flex-row justify-between items-center border-b border-white/5 pb-4">
            <CardTitle>Largest Purchases</CardTitle>
            <Button variant="outline" size="sm">View All</Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-white/5">
              {[
                { name: 'Rustic Table Centerpieces (Set of 12)', seller: 'Luxe Decor Supply', date: 'Sep 27, 2026', price: '$850.00' },
                { name: 'Custom Engraved Wine Glasses (150x)', seller: 'Crystal Creations', date: 'Aug 15, 2026', price: '$600.00' },
                { name: 'Fairy Light Canopies (4x)', seller: 'Glow Events', date: 'Jul 02, 2026', price: '$450.00' },
              ].map((item, i) => (
                <div key={i} className="p-4 sm:p-6 hover:bg-white/[0.02] transition-colors flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 text-white/40" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-white/50">{item.seller} • {item.date}</p>
                    </div>
                  </div>
                  <span className="font-bold text-primary shrink-0">{item.price}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};
