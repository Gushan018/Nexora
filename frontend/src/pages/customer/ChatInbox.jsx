import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Search, Filter, MoreVertical, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../utils/api';
import { PageLoader } from '../../components/common/PageLoader';

export const ChatInbox = () => {
  const { data: conversations, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const res = await api.get('/chat/conversations');
      return res.data;
    }
  });

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-6 max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <div>
<<<<<<< HEAD
          <h1 className="text-2xl font-bold text-textPrimary flex items-center gap-2">
=======
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
            <MessageSquare className="w-7 h-7 text-primary" />
            Messages
          </h1>
        </div>
      </div>

      <Card className="flex-1 overflow-hidden flex border-slate-300 bg-surface/30">
        
        {/* Sidebar */}
        <div className="w-full md:w-96 border-r border-slate-200 flex flex-col bg-surface/50">
          <div className="p-4 border-b border-slate-200 space-y-4 shrink-0">
            <div className="relative">
<<<<<<< HEAD
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-textPrimary/40" />
              <input 
                type="text" 
                placeholder="Search messages..." 
                className="w-full bg-surface border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-textPrimary focus:outline-none focus:border-primary transition-colors"
=======
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search messages..." 
                className="w-full bg-surface border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-primary transition-colors"
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
              />
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full cursor-pointer">All</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {conversations?.map((conv) => {
              const lastMessage = conv.messages?.[0];
              const timeStr = lastMessage ? new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
              
              return (
              <Link to={`/customer/vendor-chat/${conv.id}`} key={conv.id}>
                <div className="p-4 border-b border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors flex gap-4">
                  <div className="relative shrink-0">
<<<<<<< HEAD
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center font-bold text-lg text-textPrimary">
=======
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-lg text-slate-900">
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                      {conv.vendor.businessName.charAt(0)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
<<<<<<< HEAD
                      <h4 className="font-bold text-textPrimary truncate pr-2">{conv.vendor.businessName}</h4>
                      <span className={cn("text-xs shrink-0 text-textPrimary/40")}>
=======
                      <h4 className="font-bold text-slate-900 truncate pr-2">{conv.vendor.businessName}</h4>
                      <span className={cn("text-xs shrink-0 text-slate-500")}>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                        {timeStr}
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
<<<<<<< HEAD
                      <p className={cn("text-sm truncate text-textPrimary/50")}>
=======
                      <p className={cn("text-sm truncate text-slate-500")}>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                        {lastMessage ? lastMessage.text : 'No messages yet'}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            )})}
          </div>
        </div>

        {/* Empty State Area (Visible on Desktop) */}
        <div className="hidden md:flex flex-1 flex-col items-center justify-center p-8 text-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed bg-center opacity-80 mix-blend-overlay">
<<<<<<< HEAD
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <MessageSquare className="w-10 h-10 text-textPrimary/20" />
          </div>
          <h2 className="text-xl font-bold text-textPrimary mb-2">Your Inbox</h2>
          <p className="text-textPrimary/40 max-w-sm">Select a conversation from the sidebar to view details, or start a new chat with a vendor from their profile.</p>
=======
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <MessageSquare className="w-10 h-10 text-slate-300" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Your Inbox</h2>
          <p className="text-slate-500 max-w-sm">Select a conversation from the sidebar to view details, or start a new chat with a vendor from their profile.</p>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
        </div>

      </Card>
    </div>
  );
};
