import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Paperclip, MoreVertical, ChevronLeft, Phone, Calendar, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { Link, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../utils/api';
import { PageLoader } from '../../components/common/PageLoader';

export const VendorChat = () => {
  const { conversationId } = useParams();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const bottomRef = useRef(null);

  const { data: chatData, isLoading } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      if (!conversationId) return { messages: [] };
      const res = await api.get(`/chat/messages/${conversationId}`);
      return res.data;
    },
    enabled: !!conversationId,
    refetchInterval: 3000 // Poll every 3 seconds
  });

  const rawMessages = chatData?.messages || (Array.isArray(chatData) ? chatData : []);
  const participant = chatData?.participant;

  const messages = React.useMemo(() => {
    return rawMessages.map(m => ({
      id: m.id || m.messageId,
      senderId: m.senderId,
      senderType: m.senderType,
      isMe: m.isMe,
      text: m.text || m.content || '',
      createdAt: m.createdAt
    }));
  }, [rawMessages]);

  const sendMutation = useMutation({
    mutationFn: async (text) => {
      const res = await api.post('/chat/messages', { conversationId, text });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['messages', conversationId]);
      queryClient.invalidateQueries(['conversations']);
      setMessage('');
    }
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!message.trim() || sendMutation.isPending) return;
    sendMutation.mutate(message);
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-6rem)] pt-4 flex flex-col pb-6">
      <Card className="flex-1 overflow-hidden flex flex-col border-slate-200 dark:border-white/10 bg-white dark:bg-[#1C2333]">
        
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex justify-between items-center shrink-0 z-10">
          <div className="flex items-center gap-4">
            <Link to="../chat-inbox" className="p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors flex items-center gap-1 text-sm font-medium">
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Inbox</span>
            </Link>
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                {participant?.name ? participant.name.charAt(0) : 'U'}
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">{participant?.name || 'Chat'}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Online
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {participant?.phone && (
              <a href={`tel:${participant.phone}`}>
                <Button variant="outline" size="sm" className="hidden sm:flex text-slate-900 dark:text-white border-slate-300 dark:border-slate-700" leftIcon={<Phone className="w-4 h-4"/>}>Call</Button>
              </a>
            )}
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar bg-slate-50/50 dark:bg-slate-950/40">
          <div className="text-center">
            <span className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs px-3 py-1 rounded-full font-medium">Today</span>
          </div>

          {messages.map((msg) => {
            const isMe = msg.isMe;
            const timeStr = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return (
              <div key={msg.id} className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[80%] sm:max-w-[70%] rounded-2xl p-4 shadow-sm",
                  isMe ? "bg-primary text-slate-950 font-medium rounded-tr-sm" : "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-tl-sm"
                )}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <div className={cn(
                    "text-[10px] mt-2 flex items-center gap-1",
                    isMe ? "text-slate-800 font-medium justify-end" : "text-slate-500 dark:text-slate-400 justify-start"
                  )}>
                    {timeStr}
                  </div>
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2 pr-3 focus-within:border-primary transition-colors">
            <input 
              type="text" 
              placeholder="Type your message..." 
              className="flex-1 bg-transparent border-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none text-sm px-3 py-1"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button size="sm" className="px-4 shrink-0 font-bold" onClick={handleSend} disabled={!message.trim() || sendMutation.isPending}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

      </Card>
    </div>
  );
};

