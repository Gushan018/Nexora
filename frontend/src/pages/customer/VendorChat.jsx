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

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      if (!conversationId) return [];
      const res = await api.get(`/chat/messages/${conversationId}`);
      return res.data;
    },
    enabled: !!conversationId,
    refetchInterval: 3000 // Poll every 3 seconds
  });

  const sendMutation = useMutation({
    mutationFn: async (text) => {
      const res = await api.post('/chat/messages', { conversationId, text });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['messages', conversationId]);
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
    <div className="max-w-4xl mx-auto h-[calc(100vh-6rem)] pt-6 flex flex-col">
      <Card className="flex-1 overflow-hidden flex flex-col border-white/10 bg-surface/30">
        
        {/* Chat Header */}
        <div className="p-4 border-b border-white/5 bg-surface/80 backdrop-blur-md flex justify-between items-center shrink-0 z-10">
          <div className="flex items-center gap-4">
            <Link to="/customer/chat" className="md:hidden p-2 -ml-2 text-white/60 hover:text-white">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                L
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-surface" />
            </div>
            <div>
              <h2 className="font-bold text-white">Lumiere Photography</h2>
              <p className="text-xs text-white/50 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Online
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="hidden sm:flex" leftIcon={<Phone className="w-4 h-4"/>}>Call Vendor</Button>
            <Button variant="outline" size="sm" className="hidden sm:flex" leftIcon={<Calendar className="w-4 h-4"/>}>View Booking</Button>
            <button className="p-2 text-white/40 hover:text-white rounded-lg">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar bg-gradient-to-b from-surface/30 to-background/50">
          <div className="text-center">
            <span className="bg-white/5 text-white/40 text-xs px-3 py-1 rounded-full">Today</span>
          </div>

          {messages.map((msg) => {
            const isMe = msg.senderType === 'customer';
            const timeStr = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return (
              <div key={msg.id} className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[80%] sm:max-w-[70%] rounded-2xl p-4",
                  isMe ? "bg-primary text-white rounded-tr-sm" : "bg-surface border border-white/5 text-white/90 rounded-tl-sm"
                )}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <div className={cn(
                    "text-[10px] mt-2 flex items-center gap-1",
                    isMe ? "text-white/60 justify-end" : "text-white/40 justify-start"
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
        <div className="p-4 border-t border-white/5 bg-surface/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3 bg-background border border-white/10 rounded-xl p-2 pr-3 focus-within:border-primary/50 transition-colors">
            <button className="p-2 text-white/40 hover:text-primary transition-colors">
              <Paperclip className="w-5 h-5" />
            </button>
            <button className="p-2 text-white/40 hover:text-primary transition-colors">
              <ImageIcon className="w-5 h-5" />
            </button>
            <input 
              type="text" 
              placeholder="Type your message..." 
              className="flex-1 bg-transparent border-none text-white focus:outline-none text-sm px-2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button size="sm" className="px-4 shrink-0" onClick={handleSend} disabled={!message.trim() || sendMutation.isPending}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

      </Card>
    </div>
  );
};
