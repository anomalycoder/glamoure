import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomerAiService, type AiChatMessage } from '../../services/customerAiService';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, X, Send, Bot, User, ArrowRight, CornerDownLeft } from 'lucide-react';
import { Button } from '../ui/Button';

interface CustomerAiDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerAiDrawer: React.FC<CustomerAiDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Good day. I am the Glamouré Sanctuary Concierge. How may I assist your beauty itinerary today? You can inquire about ritual durations, live chair availability, or compare signature treatments.',
      timestamp: 'Just now',
    },
  ]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const prompt = (textToSend || input).trim();
    if (!prompt) return;

    const userMsg: AiChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await CustomerAiService.askConcierge(prompt, user?.id);
      setMessages(prev => [...prev, response]);
    } catch (e: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: 'I apologize, but our concierge intelligence is experiencing momentary delay. Please explore our live services catalog directly.',
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = (action: AiChatMessage['suggestedAction']) => {
    if (!action) return;
    onClose();
    if (action.type === 'book') {
      const params = new URLSearchParams();
      if (action.payload.serviceId) params.set('serviceId', action.payload.serviceId);
      if (action.payload.staffId) params.set('staffId', action.payload.staffId);
      if (action.payload.date) params.set('date', action.payload.date);
      if (action.payload.offerCode) params.set('offerCode', action.payload.offerCode);
      navigate(`/customer/book?${params.toString()}`);
    }
  };

  const quickPrompts = [
    'Available slots tomorrow?',
    'What is your cancellation policy?',
    'Compare Balayage and Head Spa',
    'Active salon offers & codes',
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-fade-in">
      <div 
        className="w-full max-w-md h-full bg-[#F5EFE7] border-l border-[#E8D8C7] shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E8D8C7] bg-[#E8D8C7]/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#41332B] text-[#F5EFE7] flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-[#B99470]" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium text-[#41332B]">Sanctuary Concierge</h3>
              <p className="text-[11px] font-mono uppercase tracking-wider text-[#806B5C]">Grounded Live Intelligence</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-[#806B5C] hover:text-[#41332B] rounded-lg transition-colors cursor-pointer"
            aria-label="Close Concierge"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m) => (
            <div 
              key={m.id} 
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-xs ${
                  m.sender === 'user' 
                    ? 'bg-[#41332B] text-[#F5EFE7] rounded-tr-xs' 
                    : 'bg-white text-[#41332B] border border-[#E8D8C7] rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-line font-sans">{m.text}</div>
                {m.suggestedAction && (
                  <div className="mt-3 pt-2.5 border-t border-[#E8D8C7]/60">
                    <button
                      onClick={() => handleAction(m.suggestedAction)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#B99470] hover:bg-[#a3805d] text-white font-medium text-[11px] transition-all cursor-pointer shadow-xs"
                    >
                      {m.suggestedAction.label}
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-[#806B5C]/70 mt-1 px-1 font-mono">
                {m.timestamp}
              </span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-[#806B5C] italic pl-2">
              <span className="w-2 h-2 rounded-full bg-[#B99470] animate-pulse"></span>
              Consulting atelier registry...
            </div>
          )}
        </div>

        {/* Quick Prompts Chips */}
        <div className="px-5 py-2 overflow-x-auto flex gap-2 border-t border-[#E8D8C7]/60 bg-white/40 no-scrollbar">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp)}
              className="text-[11px] whitespace-nowrap px-3 py-1 rounded-full border border-[#E8D8C7] bg-[#F5EFE7] hover:bg-[#E8D8C7] text-[#41332B] transition-colors cursor-pointer"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-[#E8D8C7]">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about rituals, stylists, durations..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-[#F5EFE7]/50 border border-[#E8D8C7] rounded-xl text-xs text-[#41332B] placeholder:text-[#806B5C]/60 focus:outline-none focus:border-[#B99470]"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-xl bg-[#41332B] text-[#F5EFE7] disabled:opacity-40 hover:bg-[#2e231d] transition-colors cursor-pointer"
              aria-label="Send query"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
