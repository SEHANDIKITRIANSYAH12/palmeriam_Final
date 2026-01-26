"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const quickReplies = [
  "Jam operasional kantor",
  "Syarat surat domisili",
  "Cara mengurus KTP",
  "Lokasi kantor kelurahan",
];

const botResponses: Record<string, string> = {
  "jam operasional kantor": "Kantor Kelurahan Palmeriam buka setiap hari Senin sampai Jumat, pukul 08:00 - 16:00 WIB. Kami tutup pada hari Sabtu, Minggu, dan hari libur nasional.",
  "syarat surat domisili": "Untuk mengurus Surat Keterangan Domisili, Anda memerlukan:\n\n1. Fotokopi KTP\n2. Fotokopi Kartu Keluarga\n3. Surat Pengantar RT/RW\n4. Pas foto 3x4 (2 lembar)\n\nProses pengurusan memakan waktu 1-2 hari kerja.",
  "cara mengurus ktp": "Untuk mengurus KTP, silakan datang ke kantor kelurahan dengan membawa:\n\n1. Surat Pengantar RT/RW\n2. Kartu Keluarga asli\n3. Akta Kelahiran\n4. Pas foto 3x4 (3 lembar)\n\nPelayanan KTP gratis dan tidak dipungut biaya.",
  "lokasi kantor kelurahan": "Kantor Kelurahan Palmeriam berlokasi di:\n\nJl. Palmeriam No. 1\nJakarta Timur\nDKI Jakarta 13420\n\nTelp: (021) 1234-5678",
  default: "Terima kasih atas pertanyaan Anda. Untuk informasi lebih lanjut, silakan:\n\n1. Kunjungi halaman Layanan kami\n2. Hubungi kantor di (021) 1234-5678\n3. Atau ajukan pengaduan melalui form online\n\nAda yang bisa saya bantu lagi?",
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === "undefined") {
      return [
        {
          id: 1,
          text: "Selamat datang di SIPALMI! 👋\n\nSaya asisten virtual Kelurahan Palmeriam. Silakan tanyakan tentang layanan kami atau pilih pertanyaan di bawah.",
          isBot: true,
          timestamp: new Date(),
        },
      ];
    }
    try {
      const storedMessages = localStorage.getItem("chatMessages");
      if (storedMessages) {
        // Need to convert string timestamps back to Date objects
        return JSON.parse(storedMessages).map((msg: Message) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
      }
    } catch (error) {
      console.error("Failed to parse messages from localStorage", error);
    }
    return [
      {
        id: 1,
        text: "Selamat datang di SIPALMI! 👋\n\nSaya asisten virtual Kelurahan Palmeriam. Silakan tanyakan tentang layanan kami atau pilih pertanyaan di bawah.",
        isBot: true,
        timestamp: new Date(),
      },
    ];
  });
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Scroll to bottom
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    // Save messages to localStorage
    try {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
    } catch (error) {
      console.error("Failed to save messages to localStorage", error);
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    for (const [key, value] of Object.entries(botResponses)) {
      if (key !== "default" && lowerMessage.includes(key)) {
        return value;
      }
    }

    if (lowerMessage.includes("jam") || lowerMessage.includes("buka") || lowerMessage.includes("operasional")) {
      return botResponses["jam operasional kantor"];
    }
    if (lowerMessage.includes("domisili")) {
      return botResponses["syarat surat domisili"];
    }
    if (lowerMessage.includes("ktp") || lowerMessage.includes("identitas")) {
      return botResponses["cara mengurus ktp"];
    }
    if (lowerMessage.includes("lokasi") || lowerMessage.includes("alamat") || lowerMessage.includes("dimana")) {
      return botResponses["lokasi kantor kelurahan"];
    }

    return botResponses.default;
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: text.trim(),
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot thinking
    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now() + 1,
        text: getBotResponse(text),
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ${
          isOpen 
            ? "bg-destructive hover:bg-destructive/90" 
            : "bg-gradient-to-r from-accent via-accent/90 to-accent hover:from-accent/90 hover:to-accent text-white"
        }`}
        aria-label={isOpen ? "Tutup chat" : "Buka chat bantuan"}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-[350px] sm:w-[400px] h-[500px] bg-card rounded-2xl shadow-government-lg border border-border flex flex-col animate-slide-up overflow-hidden">
          {/* Header */}
          <div className="bg-primary px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <Bot className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-primary-foreground">Asisten SIPALMI</h3>
              <p className="text-xs text-primary-foreground/70">Online • Siap membantu</p>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${message.isBot ? "" : "flex-row-reverse"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      message.isBot ? "bg-primary" : "bg-secondary"
                    }`}
                  >
                    {message.isBot ? (
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    ) : (
                      <User className="w-4 h-4 text-secondary-foreground" />
                    )}
                  </div>
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                      message.isBot
                        ? "bg-secondary text-secondary-foreground rounded-tl-none"
                        : "bg-blue-100 text-blue-900 rounded-tr-none"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="bg-secondary rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Replies */}
          <div className="px-4 py-2 border-t border-border">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  onClick={() => sendMessage(reply)}
                  className="px-4 py-2 border border-blue-300 bg-blue-50 text-blue-800 text-sm font-medium rounded-full whitespace-nowrap hover:bg-blue-100 transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-border bg-background/95 backdrop-blur-sm shadow-sm">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ketik pesan Anda..."
                className="flex-1"
                aria-label="Pesan"
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={!inputValue.trim()} 
                className="bg-gradient-to-r from-accent via-accent/90 to-accent hover:from-accent/90 hover:to-accent text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
