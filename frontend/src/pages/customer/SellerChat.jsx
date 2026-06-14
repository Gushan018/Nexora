import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Paperclip, MoreVertical, ChevronLeft, Package, MapPin, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { Link } from 'react-router-dom';

const CHAT_HISTORY = [
  { id: 1, sender: 'seller', time: 'Sep 27, 2:30 PM', text: 'Hi! Thank you for ordering the "Rustic Centerpiece Set" from Luxe Decor Supply.' },
  { id: 2, sender: 'customer', time: 'Sep 27, 4:15 PM', text: 'Hi! Do you have an estimated shipping date? I need these before the 14th.' },
  { id: 3, sender: 'seller', time: 'Sep 28, 9:00 AM', text: 'Absolutely. The centerpieces have shipped! Here is your tracking...' },
  { id: 4, sender: 'seller', time: 'Sep 28, 9:01 AM', text: 'FedEx Tracking: FX-9923841. They should arrive by Oct 5th, well before your event.' },
];

export const SellerChat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(CHAT_HISTORY);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: 'customer', time: 'Just now', text: message }]);
    setMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-6rem)] pt-6 flex flex-col">
      <Card className="flex-1 overflow-hidden flex flex-col border-white/10 bg-surface/30">
        
        {/* Chat Header */}
        <div className="p-4 border-b border-white/5 bg-surface/80 backdrop-blur-md flex justify-between items-center shrink-0 z-10">
          <div className="flex items-center gap-4">
            <Link to="/customer/chat" className="md:hidden p-2 -ml-2 text-white/60 hover:text-white">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div className="w-10 h-10 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold">
              LD
            </div>
            <div>
              <h2 className="font-bold text-white">Luxe Decor Supply</h2>
              <p className="text-xs text-white/50 flex items-center gap-1">
                Last seen 2 hours ago
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="hidden sm:flex" leftIcon={<Package className="w-4 h-4"/>}>View Order</Button>
            <button className="p-2 text-white/40 hover:text-white rounded-lg">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] bg-fixed bg-center">
          <div className="text-center">
            <span className="bg-white/5 border border-white/10 text-white/60 text-xs px-3 py-1 rounded-full backdrop-blur-sm">Sep 27, 2026</span>
          </div>

          {messages.map((msg) => {
            const isMe = msg.sender === 'customer';
            return (
              <div key={msg.id} className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[80%] sm:max-w-[70%] rounded-2xl p-4 shadow-lg backdrop-blur-md",
                  isMe ? "bg-primary text-white rounded-tr-sm" : "bg-surface/90 border border-white/10 text-white/90 rounded-tl-sm"
                )}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  
                  {/* Mock tracking block if tracking is mentioned */}
                  {msg.text.includes('FX-') && (
                    <div className="mt-3 bg-black/20 p-3 rounded-lg border border-white/5 flex items-center justify-between cursor-pointer hover:bg-black/30 transition-colors">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-accent" />
                        <span className="text-xs font-mono">FX-9923841</span>
                      </div>
                      <span className="text-xs text-accent">Track</span>
                    </div>
                  )}

                  <div className={cn(
                    "text-[10px] mt-2 flex items-center gap-1",
                    isMe ? "text-white/60 justify-end" : "text-white/40 justify-start"
                  )}>
                    {msg.time}
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
            <input 
              type="text" 
              placeholder="Ask about your order..." 
              className="flex-1 bg-transparent border-none text-white focus:outline-none text-sm px-2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button size="sm" className="px-4 shrink-0" onClick={handleSend} disabled={!message.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

      </Card>
    </div>
  );
};
