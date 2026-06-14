import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Search, Filter, MoreVertical, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { Link } from 'react-router-dom';

const CHATS = [
  { id: 1, name: 'Lumiere Photography', role: 'Vendor', lastMessage: 'Yes, we can absolutely accommodate the drone shots for the sunset session.', time: '10:42 AM', unread: 2, online: true, type: '/customer/chat/vendor' },
  { id: 2, name: 'Bloom Catering', role: 'Vendor', lastMessage: 'Perfect. We will finalize the menu next week.', time: 'Yesterday', unread: 0, online: false, type: '/customer/chat/vendor' },
  { id: 3, name: 'Nexora Support', role: 'Admin', lastMessage: 'Your refund request has been processed successfully.', time: 'Oct 01', unread: 0, online: true, type: '/customer/chat/admin' },
  { id: 4, name: 'Luxe Decor Supply', role: 'Seller', lastMessage: 'The centerpieces have shipped! Here is your tracking...', time: 'Sep 28', unread: 1, online: false, type: '/customer/chat/seller' },
];

export const ChatInbox = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-primary" />
            Messages
          </h1>
        </div>
      </div>

      <Card className="flex-1 overflow-hidden flex border-white/10 bg-surface/30">
        
        {/* Sidebar */}
        <div className="w-full md:w-96 border-r border-white/5 flex flex-col bg-surface/50">
          <div className="p-4 border-b border-white/5 space-y-4 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input 
                type="text" 
                placeholder="Search messages..." 
                className="w-full bg-surface border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full cursor-pointer">All</span>
              <span className="px-3 py-1 bg-white/5 text-white/60 hover:text-white text-xs font-bold rounded-full cursor-pointer transition-colors">Unread (3)</span>
              <span className="px-3 py-1 bg-white/5 text-white/60 hover:text-white text-xs font-bold rounded-full cursor-pointer transition-colors">Vendors</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {CHATS.map((chat) => (
              <Link to={chat.type} key={chat.id}>
                <div className="p-4 border-b border-white/5 hover:bg-white/[0.02] cursor-pointer transition-colors flex gap-4">
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center font-bold text-lg text-white">
                      {chat.name.charAt(0)}
                    </div>
                    {chat.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-surface" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-white truncate pr-2">{chat.name}</h4>
                      <span className={cn("text-xs shrink-0", chat.unread > 0 ? "text-primary font-bold" : "text-white/40")}>
                        {chat.time}
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <p className={cn("text-sm truncate", chat.unread > 0 ? "text-white font-medium" : "text-white/50")}>
                        {chat.lastMessage}
                      </p>
                      {chat.unread > 0 && (
                        <div className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {chat.unread}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Empty State Area (Visible on Desktop) */}
        <div className="hidden md:flex flex-1 flex-col items-center justify-center p-8 text-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed bg-center opacity-80 mix-blend-overlay">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <MessageSquare className="w-10 h-10 text-white/20" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Your Inbox</h2>
          <p className="text-white/40 max-w-sm">Select a conversation from the sidebar to view details, or start a new chat with a vendor from their profile.</p>
        </div>

      </Card>
    </div>
  );
};
