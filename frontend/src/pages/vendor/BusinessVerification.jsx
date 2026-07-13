import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Upload, FileText, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

export const BusinessVerification = () => {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
<<<<<<< HEAD
          <h1 className="text-2xl font-bold text-textPrimary flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-primary" />
            Business Verification (KYC)
          </h1>
          <p className="text-textPrimary/60">Complete your verification to remove limits and get the "Verified" badge.</p>
=======
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-primary" />
            Business Verification (KYC)
          </h1>
          <p className="text-slate-600">Complete your verification to remove limits and get the "Verified" badge.</p>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
        </div>
      </div>

      {/* Progress Stepper */}
      <Card className="bg-surface/30 border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 rounded-full" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/3 h-1 bg-primary rounded-full" />
            
            {[
              { num: 1, label: 'Business Details', status: 'completed' },
              { num: 2, label: 'Identity Proof', status: 'current' },
              { num: 3, label: 'Under Review', status: 'pending' },
            ].map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center gap-2">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 border-background transition-colors",
                  step.status === 'completed' ? "bg-primary text-textPrimary" :
                  step.status === 'current' ? "bg-surface border-primary text-primary" :
<<<<<<< HEAD
                  "bg-surface border-white/5 text-textPrimary/40"
=======
                  "bg-surface border-slate-200 text-slate-500"
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                )}>
                  {step.status === 'completed' ? <CheckCircle2 className="w-5 h-5"/> : step.num}
                </div>
                <span className={cn(
                  "text-xs font-medium",
                  step.status === 'completed' ? "text-primary" :
<<<<<<< HEAD
                  step.status === 'current' ? "text-textPrimary" : "text-textPrimary/40"
=======
                  step.status === 'current' ? "text-slate-900" : "text-slate-500"
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                )}>{step.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Information Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6 space-y-4">
<<<<<<< HEAD
              <h3 className="font-bold text-textPrimary flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Why verify?
              </h3>
              <ul className="space-y-3 text-sm text-textPrimary/70">
=======
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Why verify?
              </h3>
              <ul className="space-y-3 text-sm text-slate-700">
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                  Get the coveted blue Verified badge on your profile.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                  Rank higher in customer search results.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                  Remove the LKR 1,000/month withdrawal limit.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Upload Form Area */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Identity Verification</CardTitle>
              <CardDescription>Upload a government-issued ID (Passport, National ID, or Driver's License).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="border-2 border-dashed border-slate-300 hover:border-primary/50 transition-colors rounded-xl p-8 flex flex-col items-center justify-center text-center bg-surface/30 cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
<<<<<<< HEAD
                <h4 className="text-textPrimary font-medium mb-2">Click to upload document</h4>
                <p className="text-sm text-textPrimary/50 mb-4">PNG, JPG, or PDF (Max 10MB)</p>
=======
                <h4 className="text-slate-900 font-medium mb-2">Click to upload document</h4>
                <p className="text-sm text-slate-500 mb-4">PNG, JPG, or PDF (Max 10MB)</p>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                <Button variant="outline" size="sm">Select File</Button>
              </div>

              <div className="space-y-4">
<<<<<<< HEAD
                <h4 className="text-sm font-medium text-textPrimary/80">Uploaded Documents</h4>
=======
                <h4 className="text-sm font-medium text-slate-800">Uploaded Documents</h4>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-300 bg-surface">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
<<<<<<< HEAD
                      <p className="text-sm font-medium text-textPrimary">Business_Registration_BR.pdf</p>
                      <p className="text-xs text-textPrimary/40">2.4 MB • Uploaded yesterday</p>
=======
                      <p className="text-sm font-medium text-slate-900">Business_Registration_BR.pdf</p>
                      <p className="text-xs text-slate-500">2.4 MB • Uploaded yesterday</p>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    Accepted
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-300 bg-surface">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
<<<<<<< HEAD
                      <p className="text-sm font-medium text-textPrimary">Owner_Passport_Scan.jpg</p>
                      <p className="text-xs text-textPrimary/40">1.1 MB • Uploaded 5 mins ago</p>
=======
                      <p className="text-sm font-medium text-slate-900">Owner_Passport_Scan.jpg</p>
                      <p className="text-xs text-slate-500">1.1 MB • Uploaded 5 mins ago</p>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-yellow-400 text-sm font-medium">
                    <Clock className="w-4 h-4" />
                    Pending
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 flex justify-end">
                <Button>Submit for Review</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
