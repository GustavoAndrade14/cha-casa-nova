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



function useReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;

    if (!el) return;

    // fallback mobile
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
  return (
    <>
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
          {image && !imageError ? (
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
    name: "Liquidificador L-99 Fb Turbo Power 2,2l 550w - Preto",
    price: "R$ 172,00",
    image: "/liquidificador.png",
    link: "https://www.mercadolivre.com.br/liquidificador-l99-fb-turbo-power-22l-550w-preto-mondial/up/MLBU1091958427#polycard_client=search-desktop&be_origin=backend&search_layout=grid&position=2&type=product&tracking_id=3e678582-189a-40f3-a0f8-96d155928ca5&wid=MLB1658926276&sid=search",
    pixKey: "00020101021126330014br.gov.bcb.pix0111634915073245204000053039865406172.005802BR5917GUSTAVO L ANDRADE6009FORTALEZA62070503***63041332",
  },
  {
    name: "Jogo Toalhas Banho E Rosto 4 Peças - Preto e Branco",
    price: "R$ 150,00",
    image: "/toalhas.png",
    link: "https://produto.mercadolivre.com.br/MLB-5599269086-jogo-toalhas-banho-e-rosto-grossas-macias-100-algodo-4pcs-_JM?attributes=PATTERN_NAME%3AQXJhYmVzY28%3D%2CCOLOR_SECONDARY_COLOR%3AUHJldG8vQnJhbmNv&picker=true&matt_tool=38524122&quantity=1",
    pixKey: "00020101021126330014br.gov.bcb.pix0111634915073245204000053039865406150.005802BR5917GUSTAVO L ANDRADE6009FORTALEZA62070503***63042F10",
  },
  {
    name: "Ventilador de Coluna Mallory Chronos Com Controle Remoto - Preto",
    price: "R$ 235,00",
    image: "/ventilador.png",
    link: "https://www.amazon.com.br/Ventilador-Mallory-Coluna-Chronos-Preto/dp/B0BTQY3GMZ/ref=sr_1_2_sspa?__mk_pt_BR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=3U3BN7NKJ9QER&dib=eyJ2IjoiMSJ9.89seQuyfIHCStyLgOztPIbk6xapN-FCRSUDqLUzpS8RWhsakizW5MexsParx6EwiYJO-HIBby3AQjCgsP2ixscZlxtasyXqFnyinJoCDm16_nkfHLc7O8qXYCuQsc2fVOu9TmhCdvoN-2d3McIFehQCADLKcT7fUJXHp9SQdXXq8ZHfaq_kOnKL6sUDVy5poDnyrjYSjKgz-BX868sl-4KbxFCeToT1ejGF6_q7TSTo.r5n0A9avXDfTIQBrXZNvDftuycjGesZawCgWV6P3N2s&dib_tag=se&keywords=ventilador&qid=1778780924&s=home&sprefix=ventilador%2Chome%2C230&sr=1-2-spons&ufe=app_do%3Aamzn1.fos.fcd6d665-32ba-4479-9f21-b774e276a678&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1",
    pixKey: "00020101021126330014br.gov.bcb.pix0111634915073245204000053039865406235.005802BR5917GUSTAVO L ANDRADE6009FORTALEZA62070503***63047E65",
  },
  {
    name: "Lixeira de Aço Inox 5 Litros",
    price: "R$ 52,00",
    image: "/lixeira.png",
    link: "https://www.amazon.com.br/dp/B0F8R6DP31?ref=cm_sw_r_cso_cp_mwn_dp_7JK10XBAEW3C6TRGA1VP&ref_=cm_sw_r_cso_cp_mwn_dp_7JK10XBAEW3C6TRGA1VP&social_share=cm_sw_r_cso_cp_mwn_dp_7JK10XBAEW3C6TRGA1VP",
    pixKey: "00020101021126580014br.gov.bcb.pix013619114de7-276c-408a-bd7e-904260b40e13520400005303986540552.005802BR5917GUSTAVO L ANDRADE6009FORTALEZA62070503***63049C01",
  },
  {
    name: "Micro-ondas Electrolux 23L - Preto",
    price: "R$ 640,00",
    image: "/micro.png",
    link: "https://www.amazon.com.br/dp/B0B8LCYYX7",
    pixKey: "00020101021126330014br.gov.bcb.pix0111634915073245204000053039865406640.005802BR5917GUSTAVO L ANDRADE6009FORTALEZA62070503***6304086E",
  },
  {
    name: "Britânia Sanduicheira e Grill Press - Preto",
    price: "R$ 125,00",
    image: "/sanduicheira.png",
    link: "https://www.amazon.com.br/Brit%C3%A2nia-SANDUICHEIRA-GRILL-PRESS-BGR27I/dp/B09WWY48B7",
    pixKey: "00020101021126330014br.gov.bcb.pix0111634915073245204000053039865406125.005802BR5917GUSTAVO L ANDRADE6009FORTALEZA62070503***63042FFA",
  },
  {
    name: "Kit 6 Copos de Vidro Canelado 420ml Transparente",
    price: "R$ 45,00",
    image: "/copos.png",
    link: "https://www.amazon.com.br/dp/B0FTT7W8HB?ref=cm_sw_r_cso_cp_mwn_dp_ZPPHNQSFN4Q32NE48VHE&ref_=cm_sw_r_cso_cp_mwn_dp_ZPPHNQSFN4Q32NE48VHE&social_share=cm_sw_r_cso_cp_mwn_dp_ZPPHNQSFN4Q32NE48VHE",
    pixKey: "00020101021126580014br.gov.bcb.pix013619114de7-276c-408a-bd7e-904260b40e13520400005303986540545.005802BR5917GUSTAVO L ANDRADE6009FORTALEZA62070503***63046DB7",
  },
  {
    name: "Jogo com 8 Panelas Antiaderentes de Revestimento Cerâmica com Tampa de Vidro Terrara - Bege",
    price: "R$ 650,00",
    image: "/jgo-panelas.png",
    link: "https://www.amazon.com.br/dp/B0DLY6SLL2?ref=cm_sw_r_cso_cp_mwn_dp_RWZZFPXECP1S8N1JERFT&ref_=cm_sw_r_cso_cp_mwn_dp_RWZZFPXECP1S8N1JERFT&social_share=cm_sw_r_cso_cp_mwn_dp_RWZZFPXECP1S8N1JERFT&th=1",
    pixKey: "00020101021126580014br.gov.bcb.pix013619114de7-276c-408a-bd7e-904260b40e135204000053039865406650.005802BR5917GUSTAVO L ANDRADE6009FORTALEZA62070503***630451F8",
  },
  {
    name: "Lixeira de Aço Inox 5 Litros",
    price: "R$ 52,00",
    image: "/lixeira.png",
    link: "https://www.amazon.com.br/dp/B0F8R6DP31?ref=cm_sw_r_cso_cp_mwn_dp_7JK10XBAEW3C6TRGA1VP&ref_=cm_sw_r_cso_cp_mwn_dp_7JK10XBAEW3C6TRGA1VP&social_share=cm_sw_r_cso_cp_mwn_dp_7JK10XBAEW3C6TRGA1VP",
    pixKey: "00020101021126580014br.gov.bcb.pix013619114de7-276c-408a-bd7e-904260b40e13520400005303986540552.005802BR5917GUSTAVO L ANDRADE6009FORTALEZA62070503***63049C01",
  },
  {
    name: "Air Fryer Philco - Preto",
    price: "R$ 300,00",
    image: "/fryer.png",
    link: "https://www.amazon.com.br/dp/B0CD14V4RQ?ref=cm_sw_r_cso_cp_mwn_dp_SP2S6HE2PECQC4TZW10Z&ref_=cm_sw_r_cso_cp_mwn_dp_SP2S6HE2PECQC4TZW10Z&social_share=cm_sw_r_cso_cp_mwn_dp_SP2S6HE2PECQC4TZW10Z&th=1",
    pixKey: "00020101021126580014br.gov.bcb.pix013619114de7-276c-408a-bd7e-904260b40e135204000053039865406300.005802BR5917GUSTAVO L ANDRADE6009FORTALEZA62070503***63040898",
  },
  {
    name: "Garrafa Térmica 1L Premium - Preto",
    price: "R$ 42,00",
    image: "/garrafa-termica.png",
    link: "https://www.amazon.com.br/dp/B0GV4LDL88?ref=cm_sw_r_cso_cp_mwn_dp_QFDB4NA85DPBN3GNFKSF&ref_=cm_sw_r_cso_cp_mwn_dp_QFDB4NA85DPBN3GNFKSF&social_share=cm_sw_r_cso_cp_mwn_dp_QFDB4NA85DPBN3GNFKSF",
    pixKey: "00020101021126580014br.gov.bcb.pix013619114de7-276c-408a-bd7e-904260b40e13520400005303986540542.005802BR5917GUSTAVO L ANDRADE6009FORTALEZA62070503***6304274E",
  },
  {
    name: "Lixeira de Aço Inox 5 Litros",
    price: "R$ 52,00",
    image: "/lixeira.png",
    link: "https://www.amazon.com.br/dp/B0F8R6DP31?ref=cm_sw_r_cso_cp_mwn_dp_7JK10XBAEW3C6TRGA1VP&ref_=cm_sw_r_cso_cp_mwn_dp_7JK10XBAEW3C6TRGA1VP&social_share=cm_sw_r_cso_cp_mwn_dp_7JK10XBAEW3C6TRGA1VP",
    pixKey: "00020101021126580014br.gov.bcb.pix013619114de7-276c-408a-bd7e-904260b40e13520400005303986540552.005802BR5917GUSTAVO L ANDRADE6009FORTALEZA62070503***63049C01",
  },
  {
    name: "Kit 15 Potes Tampa Hermético",
    price: "R$ 105,00",
    image: "/potes-tampas.png",
    link: "https://www.amazon.com.br/dp/B0GX7FVTPB?ref=cm_sw_r_cso_cp_mwn_dp_W97P5WC2A6G18QE2EKJJ&ref_=cm_sw_r_cso_cp_mwn_dp_W97P5WC2A6G18QE2EKJJ&social_share=cm_sw_r_cso_cp_mwn_dp_W97P5WC2A6G18QE2EKJJ",
    pixKey: "00020101021126580014br.gov.bcb.pix013619114de7-276c-408a-bd7e-904260b40e135204000053039865406105.005802BR5917GUSTAVO L ANDRADE6009FORTALEZA62070503***6304AB9C",
  },
  {
    name: "Kit 5 Potes de Vidro Herméticos 640ml",
    price: "R$ 53,00",
    image: "/potes-vidro.png",
    link: "https://www.amazon.com.br/dp/B0GXGTZF1M?ref=cm_sw_r_cso_cp_mwn_dp_01W1XHJWYMNT8382WSTD&ref_=cm_sw_r_cso_cp_mwn_dp_01W1XHJWYMNT8382WSTD&social_share=cm_sw_r_cso_cp_mwn_dp_01W1XHJWYMNT8382WSTD&th=1",
    pixKey: "00020101021126580014br.gov.bcb.pix013619114de7-276c-408a-bd7e-904260b40e13520400005303986540553.005802BR5917GUSTAVO L ANDRADE6009FORTALEZA62070503***6304395F",
  },
  {
    name: "Jogo de Talheres Faqueiro Inox 24 Peças",
    price: "R$ 120,00",
    image: "/jogo-talheres.png",
    link: "https://www.amazon.com.br/dp/B07WGQ64QR?ref=cm_sw_r_cso_cp_mwn_dp_KXGN2387A05C23VA7B83_1&ref_=cm_sw_r_cso_cp_mwn_dp_KXGN2387A05C23VA7B83_1&social_share=cm_sw_r_cso_cp_mwn_dp_KXGN2387A05C23VA7B83_1",
    pixKey: "00020101021126580014br.gov.bcb.pix013619114de7-276c-408a-bd7e-904260b40e135204000053039865406120.005802BR5917GUSTAVO L ANDRADE6009FORTALEZA62070503***6304DD47",
  },
  {
    name: "Electrolux Ferro de Passar Roupa Seco e Vapor",
    price: "R$ 120,00",
    image: "/ferro.png",
    link: "https://www.amazon.com.br/dp/B09LJYZWX7?ref=cm_sw_r_cso_cp_mwn_dp_5PWZ4DVH7AWZG3PBRH2P&ref_=cm_sw_r_cso_cp_mwn_dp_5PWZ4DVH7AWZG3PBRH2P&social_share=cm_sw_r_cso_cp_mwn_dp_5PWZ4DVH7AWZG3PBRH2P&th=1",
    pixKey: "00020101021126580014br.gov.bcb.pix013619114de7-276c-408a-bd7e-904260b40e135204000053039865406120.005802BR5917GUSTAVO L ANDRADE6009FORTALEZA62070503***6304DD47",
  },
  {
    name: "Cafeteira Elétrica Electrolux inox - Preto",
    price: "R$ 140,00",
    image: "/cafeteira.png",
    link: "https://www.amazon.com.br/dp/B09CB7MJMX?ref=cm_sw_r_cso_cp_mwn_dp_PB6ZVW9NP8KPM0GVYH9Q&ref_=cm_sw_r_cso_cp_mwn_dp_PB6ZVW9NP8KPM0GVYH9Q&social_share=cm_sw_r_cso_cp_mwn_dp_PB6ZVW9NP8KPM0GVYH9Q&th=1",
    pixKey: "00020101021126580014br.gov.bcb.pix013619114de7-276c-408a-bd7e-904260b40e135204000053039865406140.005802BR5917GUSTAVO L ANDRADE6009FORTALEZA62070503***63047686",
  },
  {
    name: "Espelho 100x50 Portal Corpo Inteiro - Preto",
    price: "R$ 170,00",
    image: "/espelho.png",
    link: "https://www.mercadolivre.com.br/espelho-100x50-portal-corpo-inteiro-grande-moldura-couro-moldura-preto/p/MLB66920225?pdp_filters=item_id%3AMLB4631655325&matt_tool=38524122#origin=share&sid=share&wid=MLB4631655325&action=copy",
    pixKey: "00020101021126580014br.gov.bcb.pix013619114de7-276c-408a-bd7e-904260b40e135204000053039865406170.005802BR5917GUSTAVO L ANDRADE6009FORTALEZA62070503***6304AB76",
  },
  {
    name: "3 Jarras de Vidro com Tampa em Aço Inox",
    price: "R$ 90,00",
    image: "/jarra.png",
    link: "https://www.amazon.com.br/dp/B0GP8JD35Z?ref=cm_sw_r_cso_cp_mwn_dp_ZA1S14A4CNDH23WMFKQB&ref_=cm_sw_r_cso_cp_mwn_dp_ZA1S14A4CNDH23WMFKQB&social_share=cm_sw_r_cso_cp_mwn_dp_ZA1S14A4CNDH23WMFKQB",
    pixKey: "00020101021126580014br.gov.bcb.pix013619114de7-276c-408a-bd7e-904260b40e13520400005303986540590.005802BR5917GUSTAVO L ANDRADE6009FORTALEZA62070503***6304813F",
  },
  {
    name: "Lixeira de Aço Inox 5 Litros",
    price: "R$ 52,00",
    image: "/lixeira.png",
    link: "https://www.amazon.com.br/dp/B0F8R6DP31?ref=cm_sw_r_cso_cp_mwn_dp_7JK10XBAEW3C6TRGA1VP&ref_=cm_sw_r_cso_cp_mwn_dp_7JK10XBAEW3C6TRGA1VP&social_share=cm_sw_r_cso_cp_mwn_dp_7JK10XBAEW3C6TRGA1VP",
    pixKey: "00020101021126580014br.gov.bcb.pix013619114de7-276c-408a-bd7e-904260b40e13520400005303986540552.005802BR5917GUSTAVO L ANDRADE6009FORTALEZA62070503***63049C01",
  },
  {
    name: "Kit 4 Tapetes De Banheiro 40x60 - Preto",
    price: "R$ 60,00",
    image: "/tapetes.png",
    link: "https://www.mercadolivre.com.br/kit-4-tapetes-de-banheiro-40x60-antiderrapante-bolinha-macio-preto/p/MLB67449010",
    pixKey: "00020101021126580014br.gov.bcb.pix013619114de7-276c-408a-bd7e-904260b40e13520400005303986540560.005802BR5917GUSTAVO L ANDRADE6009FORTALEZA62070503***63041B6C",
  },
  {
    name: "Kit Com 12 Utensílios De Cozinha Silicone Premium Com Cabo De Madeira - Preto",
    price: "R$ 130,00",
    image: "/utensilios.png",
    link: "https://www.mercadolivre.com.br/kit-utensilios-de-cozinha-preto-silicone-19-pecas-com-cabo-de-madeira-colheres-de-silicone-escumadeira-concha-facas-e-tabua-completo-e-pratico-e-duravel-e-resistente-shokki/p/MLB67276478",
    pixKey: "00020101021126580014br.gov.bcb.pix013619114de7-276c-408a-bd7e-904260b40e135204000053039865406130.005802BR5917GUSTAVO L ANDRADE6009FORTALEZA62070503***63046608",
  },
  {
    name: "Lixeira de Aço Inox 5 Litros",
    price: "R$ 52,00",
    image: "/lixeira.png",
    link: "https://www.amazon.com.br/dp/B0F8R6DP31?ref=cm_sw_r_cso_cp_mwn_dp_7JK10XBAEW3C6TRGA1VP&ref_=cm_sw_r_cso_cp_mwn_dp_7JK10XBAEW3C6TRGA1VP&social_share=cm_sw_r_cso_cp_mwn_dp_7JK10XBAEW3C6TRGA1VP",
    pixKey: "00020101021126580014br.gov.bcb.pix013619114de7-276c-408a-bd7e-904260b40e13520400005303986540552.005802BR5917GUSTAVO L ANDRADE6009FORTALEZA62070503***63049C01",
  },
];