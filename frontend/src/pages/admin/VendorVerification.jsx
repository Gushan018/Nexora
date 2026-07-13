import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowLeft, FileText, UserCheck, AlertTriangle, Check, X, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { Link } from 'react-router-dom';

export const VendorVerification = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link to="/admin/business-approvals" className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-1 w-fit mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Queue
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            Verification: APP-1042
          </h1>
          <p className="text-slate-600">Review submitted documents for Apex Catering LLC.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-red-400 border-red-400/20 hover:bg-red-400/10" leftIcon={<X className="w-4 h-4"/>}>
            Reject Application
          </Button>
          <Button className="bg-green-500 hover:bg-green-600 text-slate-900 border-none" leftIcon={<Check className="w-4 h-4"/>}>
            Approve Business
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
        
        {/* Left Col: AI Risk Assessment & Identity */}
        <div className="space-y-6">
          <Card className="border-green-500/20 bg-green-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-green-400 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" /> AI Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-slate-900 mb-2">Low Risk</div>
              <p className="text-sm text-slate-700">The submitted identity documents match public records. No red flags detected.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Applicant Identity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-surface overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80" alt="Selfie" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">James Wilson</h4>
                  <p className="text-xs text-slate-500">Owner / CEO</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div>
                  <span className="text-xs text-slate-500 uppercase font-bold block mb-1">Email Address</span>
                  <span className="text-sm text-slate-900">james@apexcatering.com</span>
                  <span className="ml-2 text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded font-bold">Verified</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 uppercase font-bold block mb-1">Phone Number</span>
                  <span className="text-sm text-slate-900">+1 (555) 123-4567</span>
                  <span className="ml-2 text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded font-bold">Verified</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Documents Viewer */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Submitted Documents</CardTitle>
              <CardDescription>Click to expand and verify manually.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div className="p-4 rounded-xl border border-slate-300 bg-surface/30 flex justify-between items-center group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Government ID (Passport)</h4>
                    <p className="text-xs text-slate-500">Submitted Oct 24, 2026</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" leftIcon={<Eye className="w-4 h-4"/>}>Inspect</Button>
              </div>

              <div className="p-4 rounded-xl border border-slate-300 bg-surface/30 flex justify-between items-center group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 text-accent">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Business License (LLC)</h4>
                    <p className="text-xs text-slate-500">Issued by State of California</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" leftIcon={<Eye className="w-4 h-4"/>}>Inspect</Button>
              </div>

              <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 flex justify-between items-center group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center shrink-0 text-yellow-500">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Certificate of Insurance (COI)</h4>
                    <p className="text-xs text-slate-500">Requires manual review for liability coverage limits.</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" leftIcon={<Eye className="w-4 h-4"/>}>Inspect</Button>
              </div>

            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Internal Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea 
                rows="4" 
                placeholder="Leave notes for other admins..."
                className="w-full bg-surface/50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary/50 transition-colors resize-none"
              />
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};
