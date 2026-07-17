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
  const [search, setSearch] = useState('');
  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const res = await api.get('/chat/conversations');
      return res.data;
    }
  });

  const filteredConversations = React.useMemo(() => {
    if (!search.trim()) return conversations;
    return conversations.filter(c => (c.participantName || '').toLowerCase().includes(search.toLowerCase()));
  }, [conversations, search]);

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-6 max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
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
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search messages..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-surface border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full cursor-pointer">All Conversations</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-sm">No conversations found.</div>
            ) : (
              filteredConversations.map((conv) => {
                const timeStr = conv.lastMessageTime ? new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
                
                return (
                  <Link to={`/customer/vendor-chat/${conv.conversationId}`} key={conv.conversationId}>
                    <div className="p-4 border-b border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors flex gap-4">
                      <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-lg">
                          {conv.participantAvatar || (conv.participantName ? conv.participantName.charAt(0) : 'V')}
                        </div>
                        {conv.unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-slate-900 font-bold text-xs rounded-full flex items-center justify-center">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                          <h4 className="font-bold text-slate-900 truncate pr-2">{conv.participantName}</h4>
                          <span className="text-xs shrink-0 text-slate-500">
                            {timeStr}
                          </span>
                        </div>
                        <p className="text-sm truncate text-slate-500">
                          {conv.lastMessage}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>

        {/* Empty State Area (Visible on Desktop) */}
        <div className="hidden md:flex flex-1 flex-col items-center justify-center p-8 text-center bg-surface/10">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <MessageSquare className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Your Inbox</h2>
          <p className="text-slate-500 max-w-sm">Select a conversation from the sidebar to start chatting with your event vendor.</p>
        </div>

      </Card>
    </div>
  );
};

