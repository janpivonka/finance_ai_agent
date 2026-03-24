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
  onStopCall?: () => void;
}

export const ConsultationChat: React.FC<ConsultationChatProps> = ({ 
  messages, 
  isCalling, 
  scrollContainerRef, 
  onScroll,
  onStopCall
}) => (
  <div className="flex flex-1 flex-col overflow-hidden gap-4 md:gap-6 min-h-0 animate-fade-in-right">
    {/* Header Card */}
    <div className="flex shrink-0 items-center justify-between rounded-[1.5rem] md:rounded-[2rem] border border-[color:var(--panel-border)] bg-[var(--panel-strong)] px-4 py-3 md:px-8 md:py-5 shadow-lg ring-1 ring-[color:var(--panel-border)]">
      <div className="flex items-center gap-3 md:gap-4">
        <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl md:rounded-2xl bg-[var(--background)] shadow-inner ring-1 ring-[color:var(--panel-border)]">
          <div className="relative">
            <MessageSquare size={18} className={`transition-colors duration-500 md:w-5 md:h-5 ${isCalling ? 'text-fuchsia-500' : 'text-cyan-500'}`} />
            {isCalling && <div className="absolute -top-1 -right-1 h-2 w-2 md:h-3 md:w-3 rounded-full bg-fuchsia-500 animate-ping" />}
          </div>
        </div>
        <div className="text-left">
          <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] text-[color:var(--foreground)] block">AI Neural Dialogue</span>
          <span className="text-[8px] md:text-[9px] font-bold text-indigo-500 uppercase tracking-widest opacity-80">Encrypted Stream 2.0</span>
        </div>
      </div>
      
      {isCalling && (
        <div className="flex items-center gap-3 md:gap-5">
          <div className="hidden sm:flex items-end gap-1.5 h-5 px-3 py-1.5 bg-cyan-500/5 rounded-lg border border-cyan-500/10">
             {[1,2,3,4,5].map(i => (
               <div key={i} className={`w-1 bg-cyan-500 rounded-full animate-visualizer shadow-[0_0_8px_#22d3ee]`} style={{ animationDelay: `${i*0.15}s`, height: '60%' }} />
             ))}
          </div>
          
          {/* Mobile Only Stop Button */}
          <button 
            onClick={onStopCall}
            className="lg:hidden flex items-center gap-2 rounded-xl bg-rose-500 px-3 py-2 shadow-[0_5px_15px_rgba(244,63,94,0.3)] animate-pulse border border-rose-400/50 cursor-pointer active:scale-95"
          >
             <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
             <span className="text-[9px] font-black text-white uppercase tracking-wider">Stop</span>
          </button>

          <div className="hidden lg:flex items-center gap-2 rounded-xl bg-fuchsia-500 px-4 py-1.5 shadow-[0_5px_15px_rgba(217,70,219,0.3)] animate-pulse border border-fuchsia-400/50">
             <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
             <span className="text-[10px] font-black text-white uppercase tracking-wider">Live</span>
          </div>
        </div>
      )}
    </div>

    {/* Messages Card */}
    <div className="flex-1 rounded-[2rem] md:rounded-[2.5rem] border border-[color:var(--panel-border)] bg-[var(--panel)] backdrop-blur-xl shadow-2xl ring-1 ring-[color:var(--panel-border)] overflow-hidden flex flex-col relative group transition-all duration-500 hover:border-indigo-500/20">
      <div 
        ref={scrollContainerRef}
        onScroll={onScroll}
        className="flex-1 bg-transparent p-4 md:p-8 space-y-6 md:space-y-8 overflow-y-auto scrollbar-hide"
      >
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center opacity-30 group/empty">
            <div className="mb-6 md:mb-8 flex h-20 w-20 md:h-28 md:w-28 items-center justify-center rounded-[2.5rem] md:rounded-[3rem] bg-[var(--panel-strong)] border border-[color:var(--panel-border)] group-hover/empty:rotate-12 group-hover/empty:scale-110 group-hover/empty:bg-indigo-500/10 transition-all duration-700 shadow-inner cursor-default">
               <Mic size={32} className="md:w-12 md:h-12 text-indigo-500 animate-pulse group-hover/empty:animate-none" />
            </div>
            <p className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] text-[color:var(--foreground)] animate-pulse group-hover/empty:opacity-100 group-hover/empty:tracking-[0.6em] transition-all duration-700">
              Awaiting Neural Uplink...
            </p>
          </div>
        )}
        
        {messages.map((message, index) => {
          const isTyping = !message.isFinal && message.text.trim() === "" && message.role === "assistant";
          
          if (isTyping) {
            return (
              <div key={index} className="flex justify-start animate-fade-in-up">
                <div className="bg-[var(--panel-strong)] dark:bg-slate-800/80 rounded-[1.5rem] md:rounded-[2rem] rounded-bl-none px-5 py-3 md:px-7 md:py-5 border border-[color:var(--panel-border)] flex gap-2 items-center shadow-xl bg-tint-blue">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-indigo-500 rounded-full animate-bounce" />
                </div>
              </div>
            );
          }

          if (message.text.trim() === "") return null;

          return (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}>
              <div className={`relative max-w-[90%] md:max-w-[85%] rounded-[1.5rem] md:rounded-[2rem] px-5 py-3 md:px-7 md:py-5 text-[13px] md:text-[14px] font-bold leading-relaxed shadow-xl transition-all border ${
                message.role === "user" 
                  ? "bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-br-none shadow-indigo-500/20 border-indigo-400/30" 
                  : "bg-[var(--panel-strong)] dark:bg-slate-800/80 text-[color:var(--foreground)] dark:text-white rounded-bl-none border-[color:var(--panel-border)] backdrop-blur-sm bg-tint-blue"
              }`}>
                {message.text}
                {!message.isFinal && <span className="ml-1 inline-block w-2 h-4 md:h-5 bg-indigo-500 animate-pulse align-middle rounded-full" />}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Subtle bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[var(--panel)] to-transparent pointer-events-none" />
    </div>
  </div>
);
