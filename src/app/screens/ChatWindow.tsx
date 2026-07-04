import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getMessages, sendMessage as sendMessageApi } from "../lib/api";

export function ChatWindow() {
  const { id: conversationId } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [participantName, setParticipantName] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!conversationId) return;
    const parts = conversationId.split('-');
    setParticipantName(parts[0] === 'cust' ? 'Customer' : 'Vendor');

    const fetchMessages = async () => {
      try {
        const data = await getMessages(conversationId);
        setMessages(data.messages || []);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [conversationId]);

  const getReceiverId = (): number | null => {
    if (!conversationId) return null;
    const parts = conversationId.split('-');
    return parseInt(parts[1]);
  };

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;
    const receiverId = getReceiverId();
    if (!receiverId) return;

    setSending(true);
    try {
      await sendMessageApi(receiverId, newMessage.trim());
      setNewMessage("");
      const data = await getMessages(conversationId!);
      setMessages(data.messages || []);
    } catch {
      // silent
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col h-[calc(100vh-8rem)]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-4">
            <Link to="/messages" className="p-1 -ml-1 hover:bg-muted rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                {participantName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-foreground">{participantName}</h3>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
              No messages yet. Start a conversation!
            </div>
          )}
          {messages.map((msg: any) => {
            const isMine = msg.senderType === 'vendor';
            return (
              <div key={msg.messageId} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%]`}>
                  <div className={`rounded-2xl px-4 py-3 ${
                    isMine
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  }`}>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                  <p className={`text-xs text-muted-foreground mt-1 ${isMine ? "text-right" : "text-left"}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 px-4 py-2.5 bg-input-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              onClick={handleSend}
              disabled={sending || !newMessage.trim()}
              className="p-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
