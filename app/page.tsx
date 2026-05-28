"use client";

import Image from "next/image";
import { Gift, MapPin, Calendar, Heart, ShoppingBag, ExternalLink, QrCode, Copy, Check, Sparkles, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabaseClient';

const OnlineTracker = dynamic(
  () => import('@/components/OnlineTracker').then(mod => mod.OnlineTracker),
  { ssr: false }
);

// Interface para os produtos
interface Produto {
  id: number;
  name: string;
  price: string;
  image: string;
  link: string;
  pix_key: string;
  unavailable: boolean;
  created_at?: string;
}

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;

    if (!el) return;

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      el.classList.add("visible");
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    obs.observe(el);

    return () => obs.disconnect();
  }, []);

  return ref;
}

/* ─── Main Page ─── */
export default function Home() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isPollingActive, setIsPollingActive] = useState(true);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Função para buscar produtos
  const fetchProdutos = useCallback(async () => {
    try {
      const response = await axios.get('https://cha-casa-nova-back.vercel.app/api/produtos');

      if (response.data.success) {
        setProdutos(response.data.data);
        setError(null);
        setLastUpdate(new Date());
        console.log('✅ Produtos atualizados:', new Date().toLocaleTimeString());
      } else {
        setError('Erro ao carregar produtos');
      }
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
      setError('Não foi possível conectar ao servidor');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Inicialização do Supabase Presence apenas no cliente
    const initPresence = async () => {
      try {
        const sessionId = crypto.randomUUID();

        const channel = supabase.channel('site-visitors', {
          config: {
            presence: {
              key: sessionId,
            },
          },
        });

        await channel.subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channel.track({
              online_at: new Date().toISOString(),
              user_agent: navigator.userAgent,
              url: window.location.pathname,
            });
          }
        });

        return () => {
          channel.untrack();
          channel.unsubscribe();
        };
      } catch (error) {
        console.error('Erro ao conectar ao Supabase:', error);
      }
    };

    initPresence();
  }, []);

  // Função para controlar o polling
  const startPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    // Polling a cada 2 MINUTOS (120000 ms)
    pollingIntervalRef.current = setInterval(() => {
      if (!document.hidden) { // Só atualiza se a página estiver visível
        console.log('🔄 Buscando atualizações...', new Date().toLocaleTimeString());
        fetchProdutos();
      } else {
        console.log('⏸️ Polling pausado (página não visível)');
      }
    }, 6000); // 2 minutos

    setIsPollingActive(true);
  }, [fetchProdutos]);

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
      setIsPollingActive(false);
      console.log('⏹️ Polling parado');
    }
  }, []);

  // Configurar polling e visibilidade
  useEffect(() => {
    // Buscar produtos imediatamente
    fetchProdutos();

    // Iniciar polling
    startPolling();

    // Configurar listener de visibilidade da página
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling();
      } else {
        startPolling();
        // Buscar imediatamente ao reativar a página
        fetchProdutos();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchProdutos, startPolling, stopPolling]);

  return (
    <>
      <div className="noise-overlay" />

      <div className="min-h-screen gradient-bg text-white relative">

        {/* Indicador de atualização em tempo real */}
        <div className="fixed bottom-4 right-4 z-50">
          <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-full border border-yellow-400/30 shadow-lg">
            <div className={`w-2 h-2 rounded-full ${isPollingActive ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
            <span className="text-xs text-gray-300">
              Atualizado: {lastUpdate.toLocaleTimeString()}
            </span>
            {!isPollingActive && (
              <span className="text-xs text-yellow-400">(pausado)</span>
            )}
          </div>
        </div>

        <OnlineTracker />

        {/* ── HERO ── */}
        <section className="relative overflow-hidden pt-20 pb-16 text-center px-4">
          <div style={{ position: "absolute", top: "-80px", left: "50%", transform: "translateX(-50%)", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(250,204,21,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

          <div className="relative z-10 max-w-3xl mx-auto" style={{ animation: "fadeInUp 0.9s ease forwards" }}>
            <p className="font-display text-yellow-400/60 tracking-[0.3em] text-sm uppercase mb-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Bem-vindo ao nosso
            </p>

            <h1 className="font-display shimmer-text text-6xl md:text-8xl font-bold mb-3 leading-tight">
              Chá de Casa Nova
            </h1>

            <div className="flex justify-center items-center gap-4 text-2xl text-yellow-300 mb-10 font-display italic" style={{ animation: "fadeInUp 0.9s 0.2s ease both" }}>
              <span>Gustavo</span>
              <Heart className="text-yellow-400 w-6 h-6 fill-yellow-400 floating" />
              <span>Mirela</span>
            </div>

            <div className="gold-line w-48 mx-auto mb-12" />

            <div className="flex justify-center items-center gap-12 md:gap-20" style={{ animation: "fadeInUp 0.9s 0.35s ease both" }}>
              {[{ src: "/mesmo.png", name: "Gustavo" }, { src: "/mesma.png", name: "Mirela" }].map(p => (
                <div key={p.name} className="flex flex-col items-center gap-3">
                  <div className="avatar-ring w-36 h-36 md:w-52 md:h-52 rounded-full overflow-hidden border-2 border-yellow-400 shadow-2xl bg-gray-900">
                    <Image src={p.src} alt={p.name} width={800} height={800} className="w-full h-full object-cover" />
                  </div>
                  <span className="font-display text-yellow-400 text-lg font-semibold tracking-wide">{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SOBRE ── */}
        <RevealSection>
          <div className="container mx-auto px-4 pb-16 max-w-3xl">
            <div className="info-card border border-yellow-400/20 rounded-2xl p-8 md:p-10 text-center">
              <span className="ornament block mb-2">✦ ✦ ✦</span>
              <h2 className="font-display text-3xl text-yellow-400 mb-5">Sobre o Chá</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                Estamos muito felizes em anunciar que vamos morar juntos! 🏠✨
                <br /><br />
                Para celebrar esse novo capítulo, convidamos você para o nosso Chá de Casa Nova.
                Sua presença e carinho já são presentes especiais — mas se quiser nos ajudar
                a construir nosso lar, selecionamos alguns itens que serão muito bem-vindos.
              </p>
              <div className="gold-line w-32 mx-auto my-6" />
              <p className="font-display italic text-yellow-400/80 text-base">
                "Com a sabedoria se edifica a casa, e com a inteligência ela se firma."
                <br /><span className="text-yellow-400/50 text-sm not-italic">— Provérbios 24:3</span>
              </p>
            </div>
          </div>
        </RevealSection>

        {/* ── DATA & LOCAL ── */}
        <RevealSection>
          <div className="container mx-auto px-4 pb-16 max-w-4xl">
            <SectionTitle>Informações Importantes</SectionTitle>
            <div className="grid md:grid-cols-2 gap-6">

              <div className="info-card border border-yellow-400/20 rounded-2xl p-7 flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center flex-shrink-0">
                  <Calendar className="text-yellow-400 w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl text-yellow-400 mb-2">Data e Horário</h3>
                  <div className="space-y-1">
                    <div className="flex items-start gap-2 text-gray-300">
                      <span className="gold-dot" />
                      <span>dia de mês de ano</span>
                    </div>
                    <div className="flex items-start gap-2 text-gray-300">
                      <span className="gold-dot" />
                      <span>hora — hora</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="info-card border border-yellow-400/20 rounded-2xl p-7 flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-yellow-400 w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl text-yellow-400 mb-2">Local</h3>
                  <div className="space-y-1">
                    <div className="flex items-start gap-2 text-gray-300">
                      <span className="gold-dot" />
                      <span>Rua, número — complemento</span>
                    </div>
                    <div className="flex items-start gap-2 text-gray-300">
                      <span className="gold-dot" />
                      <span>Fortaleza — CE, CEP</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </RevealSection>

        {/* ── COMO USAR ── */}
        <RevealSection>
          <div className="container mx-auto px-4 pb-16 max-w-4xl">
            <div className="info-card border border-yellow-400/20 rounded-2xl p-8 md:p-10">
              <SectionTitle>Como Usar o Site</SectionTitle>
              <div className="grid md:grid-cols-5 gap-8">
                {[
                  "Navegue pelos itens abaixo. Cada um tem link direto para a loja onde está disponível para compra.",
                  "Clique em Comprar para ir à loja. Após comprar, avise-nos para evitar presentes duplicados.",
                  "Prefere contribuir com um valor? Clique em Pix para receber nossa chave e fazer sua doação.",
                  "Se quiser doar um valor diferente dos itens listados, temos uma opção de Pix livre no final da página.",
                  "Se Comprar ou doar via Pix, por favor nos avise para que possamos agradecer e atualizar a lista de presentes. Toda ajuda é muito bem-vinda!"
                ].map((text, i) => (
                  <div key={i} className="flex flex-col items-center text-center gap-4">
                    <div className="step-circle w-12 h-12 rounded-full flex items-center justify-center text-black font-bold text-xl font-display">
                      {i + 1}
                    </div>
                    <p className="text-gray-300 leading-relaxed text-sm">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </RevealSection>

        {/* ── PRESENTES ── */}
        <RevealSection>
          <div className="container mx-auto px-4 pb-16 max-w-6xl">
            <SectionTitle>Nossos Itens Desejados</SectionTitle>

            {/* Loading state */}
            {loading && (
              <div className="text-center text-yellow-400 py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mb-4"></div>
                <p>Carregando itens...</p>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="text-center text-red-400 py-10">
                <p>❌ {error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition"
                >
                  Tentar novamente
                </button>
              </div>
            )}

            {/* Produtos list */}
            {!loading && !error && produtos.length === 0 && (
              <div className="text-center text-yellow-400 py-10">
                <p>Nenhum produto encontrado.</p>
              </div>
            )}

            {!loading && !error && produtos.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {produtos.map((item) => (
                  <GiftCard
                    key={item.id}
                    name={item.name}
                    price={item.price}
                    image={item.image}
                    link={item.link}
                    pixKey={item.pix_key}
                    unavailable={item.unavailable}
                  />
                ))}
              </div>
            )}
          </div>
        </RevealSection>

        {/* ── PIX LIVRE ── */}
        <RevealSection>
          <div className="container mx-auto px-4 pb-16 max-w-3xl">
            <div
              className="rounded-2xl border-2 border-yellow-400/40 p-8 md:p-12 text-center"
              style={{ background: "linear-gradient(135deg, rgba(250,204,21,0.04) 0%, rgba(250,204,21,0.09) 50%, rgba(250,204,21,0.04) 100%)", boxShadow: "0 20px 60px rgba(250,204,21,0.06)" }}
            >
              <div className="inline-flex items-center justify-center p-3 bg-yellow-400/15 border border-yellow-400/30 rounded-full mb-5">
                <CreditCard className="w-8 h-8 text-yellow-400" />
              </div>
              <SectionTitle>Contribua com Qualquer Valor</SectionTitle>
              <p className="text-gray-300 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
                Se preferir, você pode fazer uma contribuição de qualquer valor para nos ajudar
                a conquistar nossos itens. Toda ajuda é bem-vinda e muito apreciada!
              </p>
              <div className="max-w-md mx-auto">
                <FreeValuePixCard pixKey={pixKeyFree} qrCodeImage="/pix.jpeg" />
              </div>
            </div>
          </div>
        </RevealSection>

        {/* ── FOTOS ── */}
        <RevealSection>
          <div className="container mx-auto px-4 pb-16 max-w-6xl">
            <SectionTitle>Nossos Momentos Juntos</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { src: "/foto8.png", alt: "Nós" },
                { src: "/foto3.png", alt: "Pedido de namoro" },
                { src: "/foto5.png", alt: "Natal" },
              ].map(({ src, alt }) => (
                <div key={src} className="photo-card relative rounded-2xl border-2 border-yellow-400/25 bg-gray-900 h-72 overflow-hidden">
                  <Image src={src} alt={alt} fill className="object-cover" />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)" }} />
                  <span style={{ position: "absolute", bottom: "12px", left: "16px", color: "rgba(250,204,21,0.8)", fontSize: "0.8rem", fontFamily: "Lato, sans-serif", letterSpacing: "0.1em", textTransform: "uppercase" }}>{alt}</span>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* ── FOOTER ── */}
        <footer className="border-t border-yellow-400/20 py-10 text-center px-4">
          <div className="gold-line w-24 mx-auto mb-6" />
          <div className="flex justify-center items-center gap-2 text-yellow-400/60 mb-2">
            <Heart className="w-4 h-4 fill-yellow-400/40" />
            <span className="font-display italic text-sm">Gustavo & Mirela</span>
            <Heart className="w-4 h-4 fill-yellow-400/40" />
          </div>
          <p className="text-gray-600 text-xs tracking-widest uppercase">
            © 2026 Chá de Casa Nova · Todos os direitos reservados
          </p>
        </footer>

      </div>
    </>
  );
}

/* ─── Helpers ─── */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center mb-10">
      <h2 className="font-display text-3xl md:text-4xl text-yellow-400 mb-3">{children}</h2>
      <div className="gold-line w-20 mx-auto" />
    </div>
  );
}

function RevealSection({ children }: { children: React.ReactNode }) {
  return <div className="visible">{children}</div>;
}

/* ─── Gift Card ─── */
function GiftCard({ name, price, image, link, pixKey, unavailable = false }: {
  name: string; price: string; image: string; link: string; pixKey: string; unavailable?: boolean;
}) {
  const [imageError, setImageError] = useState(false);
  const [showPixDialog, setShowPixDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imageLoading, setImageLoading] = useState(true)

  const copyPixKey = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <div
        className={`rounded-2xl border border-yellow-400/25 overflow-hidden flex flex-col transition-all duration-300 ${unavailable
          ? 'bg-black/30 opacity-60 grayscale-[0.3]'
          : 'bg-black/60 card-hover'
          }`}
        style={{ backdropFilter: "blur(10px)" }}
      >
        {unavailable && (
          <div className="absolute top-3 right-3 z-10 bg-red-600/90 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            INDISPONÍVEL
          </div>
        )}

        <div className="relative w-full h-52 bg-gray-900 flex items-center justify-center overflow-hidden">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
            </div>
          )}
          {image && !imageError ? (
            <Image
              src={image}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className={`object-contain p-5 transition-all duration-300 ${unavailable ? 'opacity-50' : ''}`}
              onError={() => {
                setImageError(true);
                setImageLoading(false);
              }}
              onLoad={() => setImageLoading(false)}
              unoptimized
            />
          ) : (
            <div className="flex flex-col items-center text-yellow-400/50 gap-2">
              <Gift className="w-10 h-10" />
              <span className="text-xs">Imagem ilustrativa</span>
            </div>
          )}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, rgba(250,204,21,0.5), transparent)" }} />
        </div>

        <div className="p-4 flex flex-col flex-1 gap-3">
          <div>
            <h3 className={`font-display text-sm font-semibold leading-snug mb-1 line-clamp-2 min-h-[40px] ${unavailable ? 'text-gray-500' : 'text-yellow-300'}`}>
              {name}
            </h3>
            <p className={`font-bold text-lg ${unavailable ? 'text-gray-500 line-through' : 'text-yellow-400'}`}>
              {price}
            </p>
          </div>

          <div className="flex gap-3 mt-auto">
            <button
              onClick={() => !unavailable && window.open(link, "_blank", "noopener,noreferrer")}
              disabled={unavailable}
              className={`buy-btn flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 font-bold text-xs sm:text-sm cursor-pointer transition-all duration-300 ${unavailable
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                : 'bg-yellow-400 text-black hover:bg-yellow-500'
                }`}
            >
              <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Comprar</span>
              <ExternalLink className="w-3 h-3" />
            </button>

            <button
              onClick={() => !unavailable && setShowPixDialog(true)}
              disabled={unavailable}
              className={`pix-btn flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 font-bold text-xs sm:text-sm cursor-pointer transition-all duration-300 ${unavailable
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-50'
                : 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 hover:bg-yellow-400/30'
                }`}
            >
              <QrCode className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Pix</span>
            </button>
          </div>
        </div>
      </div >

      <AlertDialog open={showPixDialog} onOpenChange={setShowPixDialog}>
        <AlertDialogContent className="flex flex-col items-center gap-6 rounded-2xl border border-yellow-400/30 bg-gray-900 p-6 md:p-10">
          <AlertDialogHeader className="relative z-10 space-y-5 w-full max-w-md mx-auto text-center">
            <div className="text-center">
              <span className="ornament block mb-1">✦</span>
              <AlertDialogTitle className="font-display text-3xl text-yellow-400">Doação via Pix</AlertDialogTitle>
              <p className="text-gray-400 text-sm mt-1">Ajude a tornar nosso lar ainda mais especial</p>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-white/8 bg-white/3 p-4 text-left">
                <span className="text-xs uppercase tracking-widest text-gray-500 flex items-center gap-1.5 mb-2">
                  <Gift className="w-3 h-3" /> Item escolhido
                </span>
                <p className="text-white font-medium leading-snug">{name}</p>
              </div>

              <div className="rounded-2xl border border-white/8 bg-white/3 p-4 text-left">
                <span className="text-xs uppercase tracking-widest text-gray-500 flex items-center gap-1.5 mb-2">
                  <Gift className="w-3 h-3" /> Informação importante
                </span>
                <p className="text-white font-medium leading-snug">Após efetuar o pix, envie o comprovante para nós</p>
              </div>

              <div className="rounded-2xl border border-white/8 bg-black/50 p-4 space-y-3 text-left">
                <div className="flex items-center gap-2">
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80", animation: "pulse-ring 2s infinite", flexShrink: 0 }} />
                  <span className="text-sm text-gray-300 font-semibold">Chave PIX</span>
                  {copied && (
                    <span className="ml-auto flex items-center gap-1 text-green-400 text-xs bg-green-400/10 px-2 py-1 rounded-full">
                      <Check className="w-3 h-3" /> Copiado!
                    </span>
                  )}
                </div>
                <button
                  onClick={copyPixKey}
                  className="w-full flex items-center justify-between gap-3 bg-black/40 hover:bg-yellow-400/8 border border-white/10 hover:border-yellow-400/40 rounded-xl p-3 transition-all duration-300 group cursor-pointer"
                >
                  <code className="text-yellow-400 text-sm font-mono break-all text-left flex-1">{pixKey}</code>
                  <div className="shrink-0 p-1.5 rounded-lg bg-white/5 group-hover:bg-yellow-400/15 transition-all">
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400 group-hover:text-yellow-400 transition-colors" />}
                  </div>
                </button>
                <p className="text-xs text-gray-600 text-center">👆 Toque para copiar a chave Pix</p>
              </div>
            </div>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-4 relative z-10 w-full max-w-md mx-auto">
            <AlertDialogCancel className="w-full bg-red-500/8 hover:bg-red-500/15 border border-red-500/20 hover:border-red-500/35 text-gray-400 hover:text-red-300 rounded-xl h-11 font-medium transition-all duration-300 cursor-pointer">
              Fechar
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

/* ─── Pix livre ─── */
const pixKeyFree = "634.915.073-24";

/* ─── Free Value Pix Card ─── */
function FreeValuePixCard({ pixKey, qrCodeImage }: { pixKey: string; qrCodeImage: string }) {
  const [copied, setCopied] = useState(false);

  const copyPixKey = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-block p-4 rounded-2xl mb-4 shadow-lg shadow-yellow-400/10">
          <Image
            src={qrCodeImage}
            alt="QR Code Pix"
            width={200}
            height={200}
            className="mx-auto"
          />
        </div>
        <p className="text-sm text-gray-400">
          Escaneie o QR Code pelo seu banco ou aplicativo de pagamento
        </p>
      </div>

      <div className="relative flex items-center gap-3">
        <div className="flex-1 border-t border-yellow-400/20" />
        <span className="text-xs text-gray-500 px-2">ou</span>
        <div className="flex-1 border-t border-yellow-400/20" />
      </div>

      <div className="space-y-3">
        <p className="text-sm text-gray-300 text-center">
          Copie nossa chave PIX e faça a transferência diretamente no seu aplicativo bancário
        </p>

        <div className="rounded-2xl border border-white/8 bg-black/50 p-4 space-y-3" style={{ backdropFilter: "blur(12px)" }}>
          <div className="flex items-center gap-2">
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80", flexShrink: 0 }} className="animate-pulse" />
            <span className="text-sm text-gray-300 font-semibold">Chave PIX (CPF)</span>
            {copied && (
              <span className="ml-auto flex items-center gap-1 text-green-400 text-xs bg-green-400/10 px-2 py-1 rounded-full">
                <Check className="w-3 h-3" /> Copiado!
              </span>
            )}
          </div>

          <button
            onClick={copyPixKey}
            className="w-full flex items-center justify-between gap-3 bg-black/40 hover:bg-yellow-400/8 border border-white/10 hover:border-yellow-400/40 rounded-xl p-3 transition-all duration-300 group cursor-pointer"
          >
            <code className="flex-1 text-left text-yellow-400 text-sm break-all font-mono tracking-wide">
              {pixKey}
            </code>
            <div className="shrink-0 p-1.5 rounded-lg bg-white/5 group-hover:bg-yellow-400/15 transition-all">
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400 group-hover:text-yellow-400 transition-colors" />
              )}
            </div>
          </button>

          <p className="text-xs text-gray-600 text-center">
            Qualquer valor é bem-vindo! Agradecemos sua generosidade
          </p>
        </div>
      </div>
    </div>
  );
}