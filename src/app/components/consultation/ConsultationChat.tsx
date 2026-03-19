import React from "react";
import { MessageSquare, Mic } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  text: string;
  isFinal?: boolean;
}

interface ConsultationChatProps {
  messages: Message[];
  isCalling: boolean;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  onScroll: () => void;
}

export const ConsultationChat: React.FC<ConsultationChatProps> = ({ 
  messages, 
  isCalling, 
  scrollContainerRef, 
  onScroll 
}) => (
  <main className="flex flex-1 flex-col overflow-hidden rounded-[2.5rem] border border-white/5 bg-slate-900/30 backdrop-blur-xl shadow-2xl min-h-0 ring-1 ring-white/5 animate-fade-in-up">
    <div className="flex shrink-0 items-center justify-between border-b border-white/5 bg-white/5 px-8 py-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#020617] shadow-inner ring-1 ring-white/10">
          <MessageSquare size={16} className={`transition-colors ${isCalling ? 'text-fuchsia-400' : 'text-cyan-400'}`} />
        </div>
        <div className="text-left">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">AI Neural Dialogue</span>
          <span className="text-[8px] font-bold text-indigo-500 uppercase tracking-widest">Encrypted Stream</span>
        </div>
      </div>
      
      {isCalling && (
        <div className="flex items-center gap-4">
          <div className="flex items-end gap-1 h-4">
             {[1,2,3,4,5,6].map(i => (
               <div key={i} className={`w-1 bg-cyan-500 rounded-full animate-visualizer shadow-[0_0_8px_#22d3ee]`} style={{ animationDelay: `${i*0.1}s` }} />
             ))}
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-fuchsia-500 px-3 py-1 shadow-[0_0_15px_#d946ef] animate-pulse">
             <span className="text-[9px] font-black text-white uppercase tracking-tighter">Live</span>
          </div>
        </div>
      )}
    </div>

    <div 
      ref={scrollContainerRef}
      onScroll={onScroll}
      className="flex-1 bg-transparent p-8 space-y-6 overflow-y-auto scrollbar-hide"
    >
      {messages.length === 0 && (
        <div className="flex h-full flex-col items-center justify-center text-center opacity-20 group">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/10 rotate-3 group-hover:rotate-12 transition-transform duration-700">
             <Mic size={40} className="text-indigo-400 animate-pulse" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
            Awaiting Uplink Connection...
          </p>
        </div>
      )}
      
      {messages.map((message, index) => {
        const isTyping = !message.isFinal && message.text.trim() === "" && message.role === "assistant";
        
        if (isTyping) {
          return (
            <div key={index} className="flex justify-start animate-fade-in-up">
              <div className="bg-slate-800/80 rounded-[1.8rem] rounded-bl-none px-6 py-4 border border-white/5 flex gap-1 items-center shadow-2xl shadow-indigo-500/10">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
              </div>
            </div>
          );
        }

        if (message.text.trim() === "") return null;

        return (
          <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}>
            <div className={`relative max-w-[80%] rounded-[1.8rem] px-6 py-4 text-sm font-medium leading-relaxed shadow-2xl transition-all ${
              message.role === "user" 
                ? "bg-gradient-to-br from-cyan-500 to-cyan-600 text-[#020617] rounded-br-none font-bold shadow-cyan-500/20" 
                : "bg-slate-800/80 text-white rounded-bl-none border border-white/5 backdrop-blur-sm"
            }`}>
              {message.text}
              {!message.isFinal && <span className="ml-1 inline-block w-1.5 h-4 bg-current animate-pulse align-middle" />}
            </div>
          </div>
        );
      })}
    </div>
  </main>
);
