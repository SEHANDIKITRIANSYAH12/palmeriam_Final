"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, RotateCcw, Sparkles } from "lucide-react";
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
  "Syarat SKTM",
  "Cara lapor pengaduan",
];

const botResponses: Record<string, string> = {
  "jam operasional kantor": "Kantor Kelurahan Palmeriam buka setiap hari Senin sampai Jumat, pukul 08:00 - 16:00 WIB. Kami tutup pada hari Sabtu, Minggu, dan hari libur nasional.",
  "syarat surat domisili": "Untuk mengurus Surat Keterangan Domisili, Anda memerlukan:\n\n1. Fotokopi KTP\n2. Fotokopi Kartu Keluarga\n3. Surat Pengantar RT/RW\n4. Pas foto 3x4 (2 lembar)\n\nProses pengurusan memakan waktu 1-2 hari kerja di kantor kelurahan.",
  "cara mengurus ktp": "Untuk mengurus KTP-el di Kelurahan Palmeriam, silakan membawa:\n\n1. Surat Pengantar RT/RW\n2. Kartu Keluarga asli/fotokopi\n3. Surat Kehilangan Kepolisian (jika hilang)\n4. KTP fisik lama (jika rusak)\n\nPelayanan KTP 100% gratis dan tidak dipungut biaya.",
  "syarat sktm": "Untuk mengajukan SKTM (Surat Keterangan Tidak Mampu):\n\n1. Surat Pengantar RT/RW\n2. Fotokopi KTP & KK\n3. Surat Pernyataan Tidak Mampu bermeterai (jika diminta)\n\nBiasanya digunakan untuk keperluan KJP Plus, BPJS PBI, atau keringanan biaya pendidikan/RS.",
  "cara lapor pengaduan": "Untuk membuat laporan pengaduan masyarakat:\n\n1. Buka menu 'Pengaduan' di website SIPALMI\n2. Isi formulir nama, kontak, lokasi, serta uraian pengaduan\n3. Simpan Nomor Tiket yang diberikan untuk melacak status penanganan.",
  "lokasi kantor kelurahan": "Kantor Kelurahan Palmeriam berlokasi di:\n\nJl. Palmeriam No. 1, Matraman\nJakarta Timur, DKI Jakarta 13420\nTelp: (021) 1234-5678",
  default: "Terima kasih atas pertanyaan Anda. Silakan tanyakan hal lain seputar layanan kelurahan, KTP, KK, SKTM, pengaduan online, atau hubungi kantor Kelurahan Palmeriam di (021) 1234-5678.",
};

const initialWelcomeMessage: Message = {
  id: 1,
  text: "Selamat datang di SIPALMI! 👋\n\nSaya asisten virtual AI Kelurahan Palmeriam. Silakan tanyakan seputar syarat surat kependudukan, jam operasional, atau pilih pertanyaan cepat di bawah.",
  isBot: true,
  timestamp: new Date(),
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([initialWelcomeMessage]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load chat history from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("chatMessages");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(
            parsed.map((msg: Message) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            }))
          );
        }
      }
    } catch {
      // Ignore localStorage parse error
    }
  }, []);

  // Save messages to localStorage and auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    try {
      if (messages.length > 0) {
        localStorage.setItem("chatMessages", JSON.stringify(messages));
      }
    } catch (error) {
      console.error("Gagal menyimpan riwayat chat ke localStorage", error);
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const [isOfficeOpen, setIsOfficeOpen] = useState(true);

  // Check office operational hours (Asia/Jakarta, Senin-Jumat 08:00 - 16:00)
  useEffect(() => {
    try {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Jakarta",
        weekday: "short",
        hour: "numeric",
        hour12: false,
      }).formatToParts(new Date());
      const weekday = parts.find((p) => p.type === "weekday")?.value || "";
      const hour = parseInt(parts.find((p) => p.type === "hour")?.value || "0", 10);
      const open = !["Sat", "Sun"].includes(weekday) && hour >= 8 && hour < 16;
      setIsOfficeOpen(open);
    } catch {
      // Default to true if not supported
    }
  }, []);

  const getBotFallbackResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    let base = botResponses.default;

    for (const [key, value] of Object.entries(botResponses)) {
      if (key !== "default" && lowerMessage.includes(key)) {
        base = value;
        break;
      }
    }
    if (lowerMessage.includes("jam") || lowerMessage.includes("buka") || lowerMessage.includes("operasional")) {
      base = botResponses["jam operasional kantor"];
    } else if (lowerMessage.includes("domisili")) {
      base = botResponses["syarat surat domisili"];
    } else if (lowerMessage.includes("ktp") || lowerMessage.includes("identitas")) {
      base = botResponses["cara mengurus ktp"];
    } else if (lowerMessage.includes("sktm") || lowerMessage.includes("tidak mampu")) {
      base = botResponses["syarat sktm"];
    } else if (lowerMessage.includes("lapor") || lowerMessage.includes("aduan") || lowerMessage.includes("pengaduan")) {
      base = botResponses["cara lapor pengaduan"];
    } else if (lowerMessage.includes("lokasi") || lowerMessage.includes("alamat") || lowerMessage.includes("dimana")) {
      base = botResponses["lokasi kantor kelurahan"];
    }

    if (!isOfficeOpen) {
      return `Halo, terima kasih telah menghubungi SIPALMI. 🙏\n\nSaat ini kantor fisik Kelurahan Palmeriam sedang **di luar jam operasional** (Jam kerja: Senin - Jumat, 08:00 - 16:00 WIB).\n\nNamun, asisten AI kami tetap siap memberikan informasi awal berikut:\n\n${base}\n\n*(Untuk pengurusan tatap muka langsung, silakan datang ke kantor saat jam kerja dimulai kembali).*`;
    }

    return base;
  };

  const handleResetChat = () => {
    setMessages([
      {
        ...initialWelcomeMessage,
        id: Date.now(),
        timestamp: new Date(),
      },
    ]);
    try {
      localStorage.removeItem("chatMessages");
    } catch {
      // Ignore
    }
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const userMessage: Message = {
      id: Date.now(),
      text: trimmed,
      isBot: false,
      timestamp: new Date(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInputValue("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: nextMessages.slice(-8).map((m) => ({
            role: m.isBot ? "model" : "user",
            content: m.text,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();
      if (typeof data.isWorkHours === "boolean") {
        setIsOfficeOpen(data.isWorkHours);
      }
      const botReply = data.reply || getBotFallbackResponse(trimmed);

      const botMessage: Message = {
        id: Date.now() + 1,
        text: botReply,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.warn("Gagal terhubung ke API AI, beralih ke offline fallback:", error);
      const fallbackReply = getBotFallbackResponse(trimmed);
      const botMessage: Message = {
        id: Date.now() + 1,
        text: fallbackReply,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  return (
    <>
      {/* Tombol Floating Chat */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center ${
          isOpen
            ? "bg-slate-800 hover:bg-slate-900 text-white"
            : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/30"
        }`}
        aria-label={isOpen ? "Tutup chat" : "Buka chat asisten AI"}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <div className="relative">
            <MessageCircle className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full" />
          </div>
        )}
      </Button>

      {/* Jendela Chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[400px] h-[540px] max-h-[80vh] bg-card rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 px-4 py-3 flex items-center justify-between text-white shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-sm leading-tight text-white">SIPALMI AI</h3>
                  <span className="inline-flex items-center gap-0.5 text-[10px] bg-white/20 backdrop-blur-sm font-medium px-1.5 py-0.2 rounded-full border border-white/20">
                    <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                    Gemini
                  </span>
                </div>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1.5 truncate">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      isOfficeOpen ? "bg-emerald-300" : "bg-amber-300 animate-pulse"
                    }`}
                  />
                  <span className="truncate">
                    {isOfficeOpen
                      ? "Kantor Buka (08:00 - 16:00)"
                      : "Luar Jam Operasional • AI Aktif 24 Jam"}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleResetChat}
                className="w-8 h-8 rounded-full text-white/80 hover:text-white hover:bg-white/10"
                title="Hapus riwayat chat"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full text-white/80 hover:text-white hover:bg-white/10"
                title="Tutup chat"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages List */}
          <ScrollArea className="flex-1 p-4 bg-slate-50/50 dark:bg-slate-900/40" ref={scrollRef}>
            <div className="space-y-3.5">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2.5 ${message.isBot ? "" : "flex-row-reverse"}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs ${
                      message.isBot
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-700 text-white"
                    }`}
                  >
                    {message.isBot ? (
                      <Bot className="w-3.5 h-3.5" />
                    ) : (
                      <User className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div
                    className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm ${
                      message.isBot
                        ? "bg-card border border-border text-foreground rounded-tl-none leading-relaxed"
                        : "bg-emerald-600 text-white rounded-tr-none"
                    }`}
                  >
                    <p className="whitespace-pre-line break-words">{message.text}</p>
                    <span
                      className={`block text-[10px] mt-1 text-right ${
                        message.isBot ? "text-muted-foreground" : "text-emerald-100"
                      }`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2.5 items-end">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-card border border-border rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                    <div className="flex gap-1.5 items-center">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Replies */}
          <div className="px-3 py-2 border-t border-border bg-card/60 backdrop-blur-sm">
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  type="button"
                  disabled={isTyping}
                  onClick={() => sendMessage(reply)}
                  className="px-3 py-1.5 border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 text-xs font-medium rounded-full whitespace-nowrap hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors disabled:opacity-50"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSubmit}
            className="p-3 border-t border-border bg-card flex gap-2 items-center"
          >
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Tanyakan layanan atau syarat surat..."
              disabled={isTyping}
              className="flex-1 text-sm bg-background border-border focus-visible:ring-emerald-500"
              aria-label="Pesan untuk asisten AI"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!inputValue.trim() || isTyping}
              className="bg-emerald-600 hover:bg-emerald-700 text-white w-9 h-9 shrink-0 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
