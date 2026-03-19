import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Vapi from "@vapi-ai/web";

export const useConsultation = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  
  const [starting, setStarting] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string; isFinal?: boolean }[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [extraContext, setExtraContext] = useState<string | null>(null);
  const [fullHistoryEntry, setFullHistoryEntry] = useState<any>(null);
  const [awaitingFirstTranscript, setAwaitingFirstTranscript] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  
  const idParam = searchParams.get("id");
  const usporaParam = searchParams.get("uspora") || "0";
  const fixaceParam = searchParams.get("fixace") || "neuvedena";

  const vapiRef = useRef<any | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const historyData = localStorage.getItem("finance_history");
    if (historyData) {
      try {
        const history = JSON.parse(historyData);
        const matchingEntry =
          (idParam
            ? history.find((h: any) => String(h.id) === String(idParam))
            : null) ||
          history.find(
            (h: any) =>
              String(h.uspora) === String(usporaParam) &&
              String(h.fixace) === String(fixaceParam),
          );

        if (matchingEntry) {
          setFullHistoryEntry(matchingEntry);
          if (matchingEntry.analyticky_duvod) {
            setExtraContext(matchingEntry.analyticky_duvod);
          }
        } else if (history.length > 0 && history[0].analyticky_duvod) {
          setExtraContext(history[0].analyticky_duvod);
        }
      } catch (e) {
        console.error("Chyba při parsování historie:", e);
      }
    }
  }, [idParam, usporaParam, fixaceParam]);

  useEffect(() => {
    if (isAtBottom && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isAtBottom]);

  useEffect(() => {
    if (!isMounted) return;
    if (vapiRef.current) return;

    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    if (!publicKey) return;

    const vapi = new Vapi(publicKey);

    vapi.on("message", (message: any) => {
      if (message?.type === "transcript") {
        const role = message.role === "user" ? "user" : "assistant";
        const text = message.transcript || "";

        if (text.trim() !== "") setAwaitingFirstTranscript(false);

        setMessages((prev) => {
          const lastMsg = prev[prev.length - 1];
          if (lastMsg && lastMsg.role === role && !lastMsg.isFinal) {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = { 
              ...lastMsg, 
              text: text, 
              isFinal: message.transcriptType === "final" 
            };
            return newMessages;
          } 
          return [...prev, { role, text, isFinal: message.transcriptType === "final" }];
        });
      }
    });

    vapi.on("call-start", () => {
      setIsCalling(true);
      setIsAtBottom(true);
    });

    vapi.on("call-end", () => {
      setIsCalling(false);
      setAwaitingFirstTranscript(false);
      setMessages(prev => prev.map(m => ({ ...m, isFinal: true })));
    });

    vapiRef.current = vapi;
    return () => { vapi.stop(); };
  }, [isMounted]);

  const handleBackToAnalysis = () => {
    if (fullHistoryEntry) {
      localStorage.setItem("analysis_entry_data", JSON.stringify(fullHistoryEntry));
    }
    router.push("/analysis");
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const atBottom = scrollHeight - scrollTop - clientHeight < 15;
    setIsAtBottom(atBottom);
  };

  const handleStartCall = async () => {
    if (!vapiRef.current) return;
    try {
      setStarting(true);
      setAwaitingFirstTranscript(true);
      await vapiRef.current.start("4c32087f-c5e7-48db-b775-10a47b12e912", {
        variableValues: { 
          uspora: usporaParam, 
          fixace: fixaceParam,
          analyticky_duvod: extraContext || "Klient chce probrat možnosti úspor."
        },
      });
    } catch (error) {
      console.error("Vapi start error:", error);
      setIsCalling(false);
      setAwaitingFirstTranscript(false);
    } finally {
      setStarting(false);
    }
  };

  const handleStopCall = () => {
    vapiRef.current?.stop();
    setIsCalling(false);
    setAwaitingFirstTranscript(false);
  };

  const handleSendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    const text = inputValue.trim();
    if (!text || !vapiRef.current) return;
    
    setIsAtBottom(true);
    setMessages((prev) => [...prev, { role: "user", text, isFinal: true }]);
    setInputValue("");
    
    vapiRef.current.send({
      type: "add-message",
      message: { role: "user", content: text },
    });
  };

  const handleToHistory = () => {
    try {
      if (fullHistoryEntry?.id) {
        localStorage.setItem(
          "last_analysis_data",
          JSON.stringify({ id: fullHistoryEntry.id }),
        );
      }
    } catch (e) {
      console.error("Nepodařilo se uložit last_analysis_data pro návrat do historie z consultation:", e);
    }
    router.push("/history");
  };

  return {
    isMounted,
    starting,
    isCalling,
    messages,
    inputValue,
    setInputValue,
    awaitingFirstTranscript,
    usporaParam,
    fixaceParam,
    scrollContainerRef,
    fullHistoryEntry,
    handleScroll,
    handleStartCall,
    handleStopCall,
    handleSendMessage,
    handleBackToAnalysis,
    handleToHistory
  };
};
