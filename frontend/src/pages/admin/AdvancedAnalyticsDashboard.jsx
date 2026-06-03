import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, LineChart, Target, Zap, ChevronRight, Activity, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

export const AdvancedAnalyticsDashboard = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BrainCircuit className="w-7 h-7 text-primary" />
            AI Analytics & Forecasting
          </h1>
          <p className="text-white/60">Machine learning models for revenue prediction, churn forecasting, and cohort analysis.</p>
        </div>
      </div>

      {/* AI Insights Banner */}
      <Card className="border-primary/30 bg-primary/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full pointer-events-none" />
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Nexora AI Insight</h3>
              <p className="text-sm text-white/80 mt-1 max-w-2xl">
                Our predictive model indicates a <strong>15% surge in Photography bookings</strong> for the upcoming spring season in the Los Angeles metro area. Consider launching targeted ad campaigns to acquire more photography vendors in this region.
              </p>
            </div>
          </div>
          <Button className="shrink-0">Create Campaign <ChevronRight className="w-4 h-4 ml-1" /></Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/60 mb-2">Q4 Revenue Forecast</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-white">LKR 4.2M</span>
            </div>
            <p className="text-xs text-green-400 font-bold mt-2">High Confidence (92%)</p>
          </CardContent>
        </Card>
        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/60 mb-2">Predicted Churn Risk</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-white">124</span>
            </div>
            <p className="text-xs text-red-400 font-bold mt-2">Vendors at risk next 30d</p>
          </CardContent>
        </Card>
        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/60 mb-2">LTV Projection</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-white">LKR 2,850</span>
            </div>
            <p className="text-xs text-green-400 font-bold mt-2">+15% over historical avg</p>
          </CardContent>
        </Card>
        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/60 mb-2">Demand Anomalies</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-yellow-500">3</span>
            </div>
            <p className="text-xs text-yellow-500/60 font-bold mt-2">Unusual spikes detected</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Forecast Chart */}
        <Card className="border-white/5 h-[400px] flex flex-col">
          <CardHeader>
            <CardTitle>GMV Forecast (Next 6 Months)</CardTitle>
            <CardDescription>Historical data vs ML predicted trajectory</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center border-t border-white/5 relative">
            <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none opacity-20">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-full h-px bg-white/20" />
              ))}
            </div>
            <div className="text-center z-10">
              <LineChart className="w-16 h-16 text-primary/20 mx-auto mb-4" />
              <p className="text-white/40 font-medium">Recharts Predictive Line Graph</p>
              <p className="text-xs text-white/30">Showing confidence intervals (Upper/Lower bounds)</p>
            </div>
          </CardContent>
        </Card>

        {/* Cohort Analysis */}
        <Card className="border-white/5 h-[400px] flex flex-col">
          <CardHeader>
            <CardTitle>Customer Cohort Retention</CardTitle>
            <CardDescription>Percentage of users returning to book again</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center pt-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-white/40 pb-2">
                    <th className="font-medium pb-4">Cohort</th>
                    <th className="font-medium pb-4">Month 1</th>
                    <th className="font-medium pb-4">Month 2</th>
                    <th className="font-medium pb-4">Month 3</th>
                    <th className="font-medium pb-4">Month 4</th>
                  </tr>
                </thead>
                <tbody className="font-bold">
                  <tr>
                    <td className="py-2 text-white/80">Jan 2026</td>
                    <td className="py-2"><div className="bg-primary/80 text-white px-2 py-1 rounded w-fit">100%</div></td>
                    <td className="py-2"><div className="bg-primary/60 text-white px-2 py-1 rounded w-fit">42%</div></td>
                    <td className="py-2"><div className="bg-primary/40 text-white/80 px-2 py-1 rounded w-fit">28%</div></td>
                    <td className="py-2"><div className="bg-primary/20 text-white/60 px-2 py-1 rounded w-fit">21%</div></td>
                  </tr>
                  <tr>
                    <td className="py-2 text-white/80">Feb 2026</td>
                    <td className="py-2"><div className="bg-primary/80 text-white px-2 py-1 rounded w-fit">100%</div></td>
                    <td className="py-2"><div className="bg-primary/60 text-white px-2 py-1 rounded w-fit">45%</div></td>
                    <td className="py-2"><div className="bg-primary/40 text-white/80 px-2 py-1 rounded w-fit">31%</div></td>
                    <td className="py-2"><div className="bg-surface text-white/40 px-2 py-1 rounded w-fit border border-white/5">-</div></td>
                  </tr>
                  <tr>
                    <td className="py-2 text-white/80">Mar 2026</td>
                    <td className="py-2"><div className="bg-primary/80 text-white px-2 py-1 rounded w-fit">100%</div></td>
                    <td className="py-2"><div className="bg-primary/60 text-white px-2 py-1 rounded w-fit">48%</div></td>
                    <td className="py-2"><div className="bg-surface text-white/40 px-2 py-1 rounded w-fit border border-white/5">-</div></td>
                    <td className="py-2"><div className="bg-surface text-white/40 px-2 py-1 rounded w-fit border border-white/5">-</div></td>
                  </tr>
                  <tr>
                    <td className="py-2 text-white/80">Apr 2026</td>
                    <td className="py-2"><div className="bg-primary/80 text-white px-2 py-1 rounded w-fit">100%</div></td>
                    <td className="py-2"><div className="bg-surface text-white/40 px-2 py-1 rounded w-fit border border-white/5">-</div></td>
                    <td className="py-2"><div className="bg-surface text-white/40 px-2 py-1 rounded w-fit border border-white/5">-</div></td>
                    <td className="py-2"><div className="bg-surface text-white/40 px-2 py-1 rounded w-fit border border-white/5">-</div></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-white/40 mt-4 italic text-center">Reading this chart: Cohorts are improving over time, with Feb & Mar showing better Month 2 retention than Jan.</p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};
