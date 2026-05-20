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
import { useState, useEffect, useRef } from "react";

/* ─── Animations via <style> tag ─── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap');

  * { box-sizing: border-box; }

  body { font-family: 'Lato', sans-serif; }

  .font-display { font-family: 'Playfair Display', serif; }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-8px); }
  }
  @keyframes pulse-ring {
    0%   { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(250,204,21,0.4); }
    70%  { transform: scale(1);    box-shadow: 0 0 0 14px rgba(250,204,21,0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(250,204,21,0); }
  }
  @keyframes borderGlow {
    0%, 100% { border-color: rgba(250,204,21,0.3); }
    50%       { border-color: rgba(250,204,21,0.8); }
  }
  @keyframes gradientMove {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .animate-fade-in-up { animation: fadeInUp 0.8s ease forwards; }
  .animate-fade-in    { animation: fadeIn   1s   ease forwards; }

  .shimmer-text {
    background: linear-gradient(90deg, #fbbf24, #fde68a, #f59e0b, #fde68a, #fbbf24);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 4s linear infinite;
  }

  .floating { animation: float 4s ease-in-out infinite; }

  .avatar-ring { animation: pulse-ring 2.5s ease-in-out infinite; }

  .border-glow { animation: borderGlow 3s ease-in-out infinite; }

  .gradient-bg {
    background: linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #0d0d0d 100%);
  }

  .gold-line {
    background: linear-gradient(90deg, transparent, #fbbf24, transparent);
    height: 1px;
  }

  .card-hover {
    transition: transform 0.35s cubic-bezier(.22,.68,0,1.2), box-shadow 0.35s ease, border-color 0.35s ease;
  }
  .card-hover:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 20px 40px rgba(250,204,21,0.15);
    border-color: rgba(250,204,21,0.7) !important;
  }

  .step-circle {
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
    box-shadow: 0 0 20px rgba(250,204,21,0.4);
  }

  .info-card {
    background: linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01));
    backdrop-filter: blur(12px);
    transition: all 0.3s ease;
  }
  .info-card:hover {
    background: linear-gradient(135deg, rgba(250,204,21,0.08), rgba(255,255,255,0.02));
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(250,204,21,0.1);
  }

  .photo-card {
    transition: all 0.4s cubic-bezier(.22,.68,0,1.2);
    overflow: hidden;
  }
  .photo-card:hover {
    transform: scale(1.03);
    box-shadow: 0 20px 40px rgba(250,204,21,0.2);
    border-color: rgba(250,204,21,0.8) !important;
  }
  .photo-card img {
    transition: transform 0.5s ease;
  }
  .photo-card:hover img {
    transform: scale(1.06);
  }

  .pix-btn {
    background: linear-gradient(135deg, #16a34a, #15803d);
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(22,163,74,0.25);
  }
  .pix-btn:hover {
    background: linear-gradient(135deg, #15803d, #166534);
    box-shadow: 0 6px 20px rgba(22,163,74,0.4);
    transform: translateY(-1px);
  }

  .buy-btn {
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(250,204,21,0.25);
  }
  .buy-btn:hover {
    background: linear-gradient(135deg, #f59e0b, #d97706);
    box-shadow: 0 6px 20px rgba(250,204,21,0.4);
    transform: translateY(-1px);
  }

  .section-reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .section-reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .noise-overlay {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  }

  .gold-dot {
    width: 6px; height: 6px;
    background: #fbbf24;
    border-radius: 50%;
    box-shadow: 0 0 8px #fbbf24;
    flex-shrink: 0;
    margin-top: 6px;
  }

  .ornament { color: #fbbf24; opacity: 0.4; font-size: 1.5rem; line-height: 1; user-select: none; }
`;

/* ─── Scroll reveal hook ─── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ─── Main Page ─── */
export default function Home() {
  return (
    <>
      <style>{styles}</style>
      <div className="noise-overlay" />

      <div className="min-h-screen gradient-bg text-white relative">

        {/* ── HERO ── */}
        <section className="relative overflow-hidden pt-20 pb-16 text-center px-4">
          {/* background glow blobs */}
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

            {/* avatars */}
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
            {giftItems.length === 0 ? (
              <div className="text-center text-yellow-400 py-10">
                <p>Carregando itens...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {giftItems.map((item, i) => (
                  <GiftCard key={i} {...item} />
                ))}
              </div>
            )}
          </div>
        </RevealSection><RevealSection>
          <div className="container mx-auto px-4 pb-16 max-w-6xl">
            <SectionTitle>Nossos Itens Desejados</SectionTitle>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {giftItems.map((item, i) => (
                <GiftCard key={i} {...item} />
              ))}
            </div>
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
  const ref = useReveal();
  return <div ref={ref} className="section-reveal">{children}</div>;
}

/* ─── Gift Card ─── */
function GiftCard({ name, price, image, link, pixKey }: {
  name: string; price: string; image: string; link: string; pixKey: string;
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
      <div className="card-hover rounded-2xl border border-yellow-400/25 bg-black/60 overflow-hidden flex flex-col" style={{ backdropFilter: "blur(10px)" }}>
        {/* image */}
        <div className="relative w-full h-52 bg-gray-900 flex items-center justify-center overflow-hidden">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
            </div>
          )}
          {!imageError ? (
            <Image
              src={image}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-contain p-5 transition-all duration-300"
              onError={() => {
                setImageError(true);
                setImageLoading(false);
              }}
              onLoad={() => setImageLoading(false)}
              unoptimized // Adicione isso para imagens externas
            />
          ) : (
            <div className="flex flex-col items-center text-yellow-400/50 gap-2">
              <Gift className="w-10 h-10" />
              <span className="text-xs">Imagem ilustrativa</span>
            </div>
          )}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, rgba(250,204,21,0.5), transparent)" }} />
        </div>

        {/* body */}
        <div className="p-4 flex flex-col flex-1 gap-3">
          <div>
            <h3 className="font-display text-yellow-300 text-sm font-semibold leading-snug mb-1 line-clamp-2 min-h-[40px]">{name}</h3>
            <p className="text-yellow-400 font-bold text-lg">{price}</p>
          </div>

          <div className="flex gap-3 mt-auto">
            <button
              onClick={() => window.open(link, "_blank", "noopener,noreferrer")}
              className="buy-btn flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-black font-bold text-xs sm:text-sm cursor-pointer"
            >
              <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Comprar</span>
              <ExternalLink className="w-3 h-3" />
            </button>

            <button
              onClick={() => setShowPixDialog(true)}
              className="pix-btn flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-white font-bold text-xs sm:text-sm cursor-pointer"
            >
              <QrCode className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Pix</span>
            </button>
          </div>
        </div>
      </div >

      {/* ── Pix Dialog ── */}
      < AlertDialog open={showPixDialog} onOpenChange={setShowPixDialog} >
        <AlertDialogContent className="flex flex-col items-center gap-6 rounded-2xl border border-yellow-400/30 bg-gray-900 p-6 md:p-10">
          <AlertDialogHeader className="relative z-10 space-y-5 w-full max-w-md mx-auto text-center">
            <div className="text-center">
              <span className="ornament block mb-1">✦</span>
              <AlertDialogTitle className="font-display text-3xl text-yellow-400">Doação via Pix</AlertDialogTitle>
              <p className="text-gray-400 text-sm mt-1">Ajude a tornar nosso lar ainda mais especial</p>
            </div>

            <div className="space-y-3">
              {/* item */}
              <div className="rounded-2xl border border-white/8 bg-white/3 p-4 text-left">
                <span className="text-xs uppercase tracking-widest text-gray-500 flex items-center gap-1.5 mb-2">
                  <Gift className="w-3 h-3" /> Item escolhido
                </span>
                <p className="text-white font-medium leading-snug">{name}</p>
              </div>

              <div className="rounded-2xl border border-white/8 bg-white/3 p-4 text-left">
                <span className="text-xs uppercase tracking-widest text-gray-500 flex items-center gap-1.5 mb-2">
                  <Gift className="w-3 h-3" /> Imformação importante
                </span>
                <p className="text-white font-medium leading-snug">Após efetuar o pix, envie o comprovante para o nós</p>
              </div>

              {/* pix key */}
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
      </AlertDialog >
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
      {/* QR Code */}
      <div className="text-center">
        <div className="inline-block p-4 rounded-2xl mb-4 shadow-lg shadow-yellow-400/10">
          <Image
            src={qrCodeImage}
            alt="QR Code Pix"
            width={200}
            height={200}
            suppressHydrationWarning
            className="mx-auto"
          />
        </div>
        <p className="text-sm text-gray-400">
          Escaneie o QR Code pelo seu banco ou aplicativo de pagamento
        </p>
      </div>

      {/* Divider */}
      <div className="relative flex items-center gap-3">
        <div className="flex-1 border-t border-yellow-400/20" />
        <span className="text-xs text-gray-500 px-2">ou</span>
        <div className="flex-1 border-t border-yellow-400/20" />
      </div>

      {/* Pix Key */}
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

const giftItems = [
  {
    name: "Liquidificador Turbo Power Mondial - Preto",
    price: "R$ 172,00",
    image: "",
    link: "https://www.mercadolivre.com.br/liquidificador-turbo-power-mondial-550w-l-99-fb/p/MLB15578948?pdp_filters=item_id%3AMLB1793491599&attributes=COLOR%3APreto%2CVOLTAGE%3A220V_177c66_vpp&matt_tool=38524122#origin=share&sid=share&wid=MLB1793491599&action=copy",
    pixKey: "00020101021126330014br.gov.bcb.pix0111634915073245204000053039865406172.005802BR5917GUSTAVO L ANDRADE6009FORTALEZA62070503***63041332",
  },
  {
    name: "Jogo Toalhas Banho E Rosto 4 Peças - Preto e Branco",
    price: "R$ 150,00",
    image: "",
    link: "https://produto.mercadolivre.com.br/MLB-5599269086-jogo-toalhas-banho-e-rosto-grossas-macias-100-algodo-4pcs-_JM?attributes=PATTERN_NAME%3AQXJhYmVzY28%3D%2CCOLOR_SECONDARY_COLOR%3AUHJldG8vQnJhbmNv&picker=true&matt_tool=38524122&quantity=1",
    pixKey: "00020101021126330014br.gov.bcb.pix0111634915073245204000053039865406150.005802BR5917GUSTAVO L ANDRADE6009FORTALEZA62070503***63042F10",
  },
  {
    name: "Ventilador de Coluna Mallory Chronos Com Controle Remoto - Preto",
    price: "R$ 235,00",
    image: "",
    link: "https://www.amazon.com.br/Ventilador-Mallory-Coluna-Chronos-Preto/dp/B0BTQY3GMZ/ref=sr_1_2_sspa?__mk_pt_BR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=3U3BN7NKJ9QER&dib=eyJ2IjoiMSJ9.89seQuyfIHCStyLgOztPIbk6xapN-FCRSUDqLUzpS8RWhsakizW5MexsParx6EwiYJO-HIBby3AQjCgsP2ixscZlxtasyXqFnyinJoCDm16_nkfHLc7O8qXYCuQsc2fVOu9TmhCdvoN-2d3McIFehQCADLKcT7fUJXHp9SQdXXq8ZHfaq_kOnKL6sUDVy5poDnyrjYSjKgz-BX868sl-4KbxFCeToT1ejGF6_q7TSTo.r5n0A9avXDfTIQBrXZNvDftuycjGesZawCgWV6P3N2s&dib_tag=se&keywords=ventilador&qid=1778780924&s=home&sprefix=ventilador%2Chome%2C230&sr=1-2-spons&ufe=app_do%3Aamzn1.fos.fcd6d665-32ba-4479-9f21-b774e276a678&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1",
    pixKey: "00020101021126330014br.gov.bcb.pix0111634915073245204000053039865406235.005802BR5917GUSTAVO L ANDRADE6009FORTALEZA62070503***63047E65",
  },
  {
    name: "Micro-ondas Electrolux 23L - Preto",
    price: "R$ 640,00",
    image: "https://m.media-amazon.com/images/I/51WgDVXQpxL._AC_SX679_.jpg",
    link: "https://www.amazon.com.br/dp/B0B8LCYYX7",
    pixKey: "00020101021126330014br.gov.bcb.pix0111634915073245204000053039865406640.005802BR5917GUSTAVO L ANDRADE6009FORTALEZA62070503***6304086E",
  },
  {
    name: "Britânia Sanduicheira e Grill Press - Preto",
    price: "R$ 125,00",
    image: "https://m.media-amazon.com/images/I/5136pVcmWhL._AC_SX679_.jpg",
    link: "https://www.amazon.com.br/Brit%C3%A2nia-SANDUICHEIRA-GRILL-PRESS-BGR27I/dp/B09WWY48B7",
    pixKey: "00020101021126330014br.gov.bcb.pix0111634915073245204000053039865406125.005802BR5917GUSTAVO L ANDRADE6009FORTALEZA62070503***63042FFA",
  },
  {
    name: "Kit 6 Copos de Vidro Canelado 420ml Transparente",
    price: "R$ 45,00",
    image: "https://m.media-amazon.com/images/I/61DqMDmYbfL._AC_SX679_.jpg",
    link: "https://www.amazon.com.br/dp/B0FTT7W8HB?ref=cm_sw_r_cso_cp_mwn_dp_ZPPHNQSFN4Q32NE48VHE&ref_=cm_sw_r_cso_cp_mwn_dp_ZPPHNQSFN4Q32NE48VHE&social_share=cm_sw_r_cso_cp_mwn_dp_ZPPHNQSFN4Q32NE48VHE",
    pixKey: "00020101021126580014br.gov.bcb.pix013619114de7-276c-408a-bd7e-904260b40e13520400005303986540545.005802BR5917GUSTAVO L ANDRADE6009FORTALEZA62070503***63046DB7",
  },
  {
    name: "Jogo com 8 Panelas Antiaderentes de Revestimento Cerâmica com Tampa de Vidro Terrara - Bege",
    price: "R$ 650,00",
    image: "https://m.media-amazon.com/images/I/51lEScBIRDL._AC_SX679_.jpg",
    link: "https://www.amazon.com.br/dp/B0DLY6SLL2?ref=cm_sw_r_cso_cp_mwn_dp_RWZZFPXECP1S8N1JERFT&ref_=cm_sw_r_cso_cp_mwn_dp_RWZZFPXECP1S8N1JERFT&social_share=cm_sw_r_cso_cp_mwn_dp_RWZZFPXECP1S8N1JERFT&th=1",
    pixKey: "00020101021126580014br.gov.bcb.pix013619114de7-276c-408a-bd7e-904260b40e135204000053039865406650.005802BR5917GUSTAVO L ANDRADE6009FORTALEZA62070503***630451F8",
  },
  {
    name: "Air Fryer Philco - Preto",
    price: "R$ 300,00",
    image: "https://m.media-amazon.com/images/I/51QJNzNg7lL._AC_SX679_.jpg",
    link: "https://www.amazon.com.br/dp/B0CD14V4RQ?ref=cm_sw_r_cso_cp_mwn_dp_SP2S6HE2PECQC4TZW10Z&ref_=cm_sw_r_cso_cp_mwn_dp_SP2S6HE2PECQC4TZW10Z&social_share=cm_sw_r_cso_cp_mwn_dp_SP2S6HE2PECQC4TZW10Z&th=1",
    pixKey: "00020101021126580014br.gov.bcb.pix013619114de7-276c-408a-bd7e-904260b40e135204000053039865406300.005802BR5917GUSTAVO L ANDRADE6009FORTALEZA62070503***63040898",
  },
];