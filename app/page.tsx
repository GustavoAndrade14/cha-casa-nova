"use client";

import axios from "axios";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import {
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  CreditCard,
  ExternalLink,
  Gift,
  Heart,
  HouseHeart,
  MapPin,
  PackageCheck,
  QrCode,
  Search,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/lib/supabaseClient";

const OnlineTracker = dynamic(
  () =>
    import("@/components/OnlineTracker").then(
      (module) => module.OnlineTracker,
    ),
  { ssr: false },
);

const HeroThreeScene = dynamic(
  () =>
    import("@/components/HeroThreeScene").then(
      (module) => module.HeroThreeScene,
    ),
  {
    ssr: false,
    loading: () => <ThreeSceneLoading />,
  },
);

const PRODUCTS_ENDPOINT =
  process.env.NEXT_PUBLIC_PRODUCTS_API_URL ??
  "https://cha-casa-nova-back.vercel.app/api/produtos";

const POLLING_INTERVAL_MS = 2 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 15_000;
const FREE_PIX_KEY = "634.915.073-24";

const EVENT_DETAILS = {
  date: "dia de mês de ano",
  time: "hora — hora",
  address: "Rua, número — complemento",
  city: "Fortaleza — CE, CEP",
} as const;

const HERO_PEOPLE = [
  { src: "/mesmo.png", name: "Gustavo" },
  { src: "/mesma.png", name: "Mirela" },
] as const;

const HOW_TO_USE_STEPS = [
  {
    icon: Gift,
    title: "Escolha um presente",
    description: "Veja a lista e escolha um item que combine com você.",
  },
  {
    icon: ShoppingBag,
    title: "Compre na loja",
    description: "Toque em Comprar para abrir o produto em uma nova aba.",
  },
  {
    icon: QrCode,
    title: "Ou contribua via Pix",
    description: "Use a chave do item ou envie qualquer valor no Pix livre.",
  },
  {
    icon: CheckCircle2,
    title: "Avise a gente",
    description: "Depois da compra ou do Pix, envie o comprovante para nós.",
  },
] as const;

const GALLERY_PHOTOS = [
  { src: "/foto8.png", alt: "Nós" },
  { src: "/foto3.png", alt: "Pedido de namoro" },
  { src: "/casamento.png", alt: "Pedido de casamento" },
] as const;

type ProductFilter = "all" | "available" | "unavailable";

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  link: string;
  pix_key: string;
  unavailable: boolean;
  created_at?: string;
}

interface ProductsApiResponse {
  success: boolean;
  data?: Product[];
  message?: string;
}

interface RefreshOptions {
  showLoading?: boolean;
}

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  lastUpdate: Date | null;
  isPollingActive: boolean;
  refresh: (options?: RefreshOptions) => Promise<void>;
}

export default function Home() {
  const {
    products,
    loading,
    error,
    lastUpdate,
    isPollingActive,
    refresh,
  } = useProducts();

  useVisitorPresence();

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#070704] pb-[calc(6.5rem+env(safe-area-inset-bottom))] text-white selection:bg-amber-300 selection:text-black md:pb-0">
      <ScrollProgress />
      <CursorGlow />
      <BackgroundDecoration />
      <OnlineTracker />
      <SiteHeader />

      <div className="relative z-10">
        <HeroSection />
        <AboutSection />
        <EventInformationSection />
        <HowToUseSection />

        <ProductsSection
          products={products}
          loading={loading}
          error={error}
          lastUpdate={lastUpdate}
          isPollingActive={isPollingActive}
          onRetry={() => void refresh({ showLoading: true })}
        />

        <FreePixSection />
        <GallerySection />
        <SiteFooter />
      </div>

      <MobileDock />
    </main>
  );
}


function ThreeSceneLoading() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative flex h-20 w-20 items-center justify-center">
        <div className="absolute inset-0 animate-ping rounded-full border border-amber-300/15" />
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-300/15 border-t-amber-300" />
      </div>
    </div>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-100"
      style={{ scaleX: scrollYProgress }}
      aria-hidden="true"
    />
  );
}

function CursorGlow() {
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const springX = useSpring(x, { stiffness: 100, damping: 24, mass: 0.25 });
  const springY = useSpring(y, { stiffness: 100, damping: 24, mass: 0.25 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const handlePointerMove = (event: PointerEvent) => {
      x.set(event.clientX - 190);
      y.set(event.clientY - 190);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [x, y]);

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[1] hidden h-[380px] w-[380px] rounded-full bg-amber-300/[0.045] blur-[90px] lg:block"
      style={{ x: springX, y: springY }}
      aria-hidden="true"
    />
  );
}

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function MobileDock() {
  const links = [
    { href: "#inicio", label: "Início", icon: HouseHeart },
    { href: "#informacoes", label: "Evento", icon: CalendarDays },
    { href: "#presentes", label: "Presentes", icon: Gift },
    { href: "#pix-livre", label: "Pix", icon: QrCode },
  ] as const;

  return (
    <nav
      className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-4 gap-1 rounded-[1.35rem] border border-white/10 bg-[#0e0d09]/88 p-1.5 shadow-2xl shadow-black/50 backdrop-blur-2xl md:hidden"
      aria-label="Navegação rápida"
    >
      {links.map(({ href, label, icon: Icon }) => (
        <a
          key={href}
          href={href}
          className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-semibold text-zinc-500 transition active:bg-amber-300/10 active:text-amber-200"
        >
          <Icon className="h-4 w-4" />
          {label}
        </a>
      ))}
    </nav>
  );
}

function BackgroundDecoration() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 72% 4%, rgba(250, 204, 21, 0.14), transparent 28%), radial-gradient(circle at 8% 38%, rgba(245, 158, 11, 0.075), transparent 24%), radial-gradient(circle at 88% 72%, rgba(217, 119, 6, 0.055), transparent 25%), linear-gradient(180deg, #0c0b07 0%, #070704 48%, #050503 100%)",
        }}
      />

      <motion.div
        className="absolute -right-28 top-20 h-[32rem] w-[32rem] rounded-full bg-amber-300/[0.035] blur-[110px]"
        animate={{ x: [0, -42, 0], y: [0, 32, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -left-40 top-[42%] h-[28rem] w-[28rem] rounded-full bg-orange-500/[0.03] blur-[100px]"
        animate={{ x: [0, 55, 0], y: [0, -38, 0] }}
        transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
      />

      <div
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,.72), transparent 78%)",
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.032] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.7'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6 sm:pt-4">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-[#0b0a07]/78 px-3 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:px-4">
        <a
          href="#inicio"
          className="group flex min-w-0 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          aria-label="Ir para o início"
        >
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-amber-300/25 bg-amber-300/10">
            <span className="absolute inset-0 bg-gradient-to-br from-amber-200/20 to-transparent opacity-0 transition group-hover:opacity-100" />
            <HouseHeart className="relative h-5 w-5 text-amber-300" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-extrabold tracking-tight text-white">
              Gustavo <span className="text-amber-300">&</span> Mirela
            </span>
            <span className="block truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
              Chá de Casa Nova
            </span>
          </span>
        </a>

        <nav
          className="hidden items-center gap-1 rounded-xl border border-white/[0.06] bg-white/[0.025] p-1 lg:flex"
          aria-label="Navegação principal"
        >
          <HeaderLink href="#sobre">Nossa história</HeaderLink>
          <HeaderLink href="#informacoes">O evento</HeaderLink>
          <HeaderLink href="#como-funciona">Como funciona</HeaderLink>
          <HeaderLink href="#momentos">Momentos</HeaderLink>
        </nav>

        <a
          href="#presentes"
          className="group inline-flex min-h-11 shrink-0 items-center justify-center gap-2 overflow-hidden rounded-xl bg-amber-300 px-4 text-sm font-black text-black shadow-[0_10px_35px_rgba(250,204,21,0.16)] transition hover:-translate-y-0.5 hover:bg-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090805]"
        >
          <Gift className="h-4 w-4 transition group-hover:-rotate-6 group-hover:scale-110" />
          <span className="hidden sm:inline">Ver presentes</span>
          <span className="sm:hidden">Presentes</span>
        </a>
      </div>
    </header>
  );
}

function HeaderLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="rounded-lg px-3 py-2 text-xs font-semibold text-zinc-500 transition hover:bg-white/[0.055] hover:text-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
    >
      {children}
    </a>
  );
}

function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative scroll-mt-24 px-4 pb-14 pt-10 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8 lg:pb-24 lg:pt-20"
    >
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center xl:gap-16">
        <Reveal>
          <div className="relative z-10 mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/[0.07] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200/75 shadow-lg shadow-amber-950/10 lg:mx-0">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              Um novo capítulo começa aqui
            </div>

            <h1 className="mt-6 text-balance text-4xl font-black leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl xl:text-[5.4rem]">
              Nosso lar começa com um
              <span className="relative ml-2 inline-block bg-gradient-to-r from-amber-100 via-yellow-300 to-amber-500 bg-clip-text text-transparent sm:ml-3">
                sonho.
                <span className="absolute -bottom-1 left-0 h-px w-full bg-gradient-to-r from-transparent via-amber-300/80 to-transparent" />
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8 lg:mx-0">
              Estamos construindo uma nova fase da nossa história e queremos
              celebrar esse momento ao lado de quem torna a caminhada mais
              especial.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-3.5 text-left backdrop-blur-sm">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-300 text-black">
                  <CalendarDays className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-600">
                    Quando
                  </span>
                  <span className="mt-1 block text-sm font-bold text-white">
                    {EVENT_DETAILS.date}
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-3.5 text-left backdrop-blur-sm">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-300/10 text-amber-300">
                  <MapPin className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-600">
                    Onde
                  </span>
                  <span className="mt-1 block truncate text-sm font-bold text-white">
                    {EVENT_DETAILS.city}
                  </span>
                </span>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="#presentes"
                className="group inline-flex min-h-[3.25rem] flex-1 items-center justify-center gap-2 rounded-2xl bg-amber-300 px-5 text-sm font-black text-black shadow-[0_16px_50px_rgba(250,204,21,0.16)] transition hover:-translate-y-1 hover:bg-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090805] sm:flex-none"
              >
                <Gift className="h-5 w-5 transition group-hover:-rotate-6" />
                Escolher um presente
              </a>

              <a
                href="#pix-livre"
                className="inline-flex min-h-[3.25rem] flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] px-5 text-sm font-bold text-white backdrop-blur-sm transition hover:-translate-y-1 hover:border-amber-300/30 hover:bg-amber-300/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 sm:flex-none"
              >
                <QrCode className="h-5 w-5 text-amber-300" />
                Contribuir via Pix
              </a>
            </div>

            <div className="mt-8 flex items-center justify-center gap-4 lg:justify-start">
              <div className="flex -space-x-3">
                {HERO_PEOPLE.map((person, index) => (
                  <PersonAvatar
                    key={person.name}
                    person={person}
                    position={index === 0 ? "left" : "right"}
                  />
                ))}
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-white">Gustavo & Mirela</p>
                <p className="text-xs text-zinc-600">Com carinho, para você.</p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="relative">
          <div className="relative mx-auto min-h-[470px] max-w-2xl overflow-hidden rounded-[2.25rem] border border-amber-300/15 bg-gradient-to-br from-white/[0.07] via-white/[0.025] to-amber-300/[0.035] shadow-[0_40px_100px_rgba(0,0,0,0.45)] sm:min-h-[580px] sm:rounded-[3rem]">
            <div className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] ring-1 ring-inset ring-white/[0.06]" />
            <div className="pointer-events-none absolute left-8 top-8 z-20 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-100/[0.65] backdrop-blur-xl">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-300" />
              Uma casa feita de sonhos
            </div>

            <div className="absolute inset-0">
              <HeroThreeScene />
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-48 bg-gradient-to-t from-[#080704] via-[#080704]/60 to-transparent" />

            <div className="absolute inset-x-4 bottom-4 z-30 rounded-[1.5rem] border border-white/10 bg-black/35 p-4 backdrop-blur-2xl sm:inset-x-6 sm:bottom-6 sm:p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300/[0.65]">
                    Chá de Casa Nova
                  </p>
                  <p className="mt-1 text-lg font-black text-white sm:text-xl">
                    Nosso novo capítulo
                  </p>
                </div>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-300 text-black shadow-lg shadow-amber-300/15">
                  <Heart className="h-5 w-5 fill-black" />
                </span>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute -right-4 -top-4 -z-10 h-32 w-32 rounded-full border border-amber-300/10" />
          <div className="pointer-events-none absolute -bottom-7 -left-7 -z-10 h-44 w-44 rounded-full bg-amber-300/[0.055] blur-3xl" />
        </Reveal>
      </div>

      <a
        href="#sobre"
        className="mx-auto mt-10 flex w-fit flex-col items-center gap-1.5 rounded-xl px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-600 transition hover:text-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 lg:mt-14"
      >
        Descubra nossa história
        <ChevronDown className="h-4 w-4 animate-bounce" />
      </a>
    </section>
  );
}

function PersonAvatar({
  person,
  position,
}: {
  person: (typeof HERO_PEOPLE)[number];
  position: "left" | "right";
}) {
  return (
    <div
      className={`relative h-11 w-11 overflow-hidden rounded-full border-2 border-[#090805] bg-zinc-900 shadow-xl sm:h-12 sm:w-12 ${position === "left" ? "z-20" : "z-10"
        }`}
    >
      <Image
        src={person.src}
        alt={person.name}
        fill
        sizes="48px"
        priority
        className="object-cover"
      />
    </div>
  );
}

function AboutSection() {
  return (
    <PageSection id="sobre" className="max-w-7xl">
      <SectionHeading
        eyebrow="Nossa história"
        title="Um lar para viver tudo o que sonhamos"
        description="Mais do que uma lista de presentes, este site é um convite para fazer parte de um momento que ficará para sempre na nossa história."
      />

      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.032] p-5 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-amber-300/[0.045] blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div>
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-300/10">
                <HouseHeart className="h-5 w-5 text-amber-300" />
              </div>

              <p className="max-w-2xl text-lg font-medium leading-8 text-zinc-300 sm:text-xl sm:leading-9">
                Estamos muito felizes em anunciar que vamos morar juntos! Para
                celebrar esse novo capítulo, convidamos você para o nosso Chá de
                Casa Nova. Sua presença e carinho já são presentes especiais,
                mas selecionamos alguns itens para quem desejar nos ajudar a
                construir o nosso lar.
              </p>

              <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-3">
                {[
                  ["01", "novo lar"],
                  ["02", "sonhos juntos"],
                  ["∞", "memórias"],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/[0.07] bg-black/20 p-3 text-center sm:p-4"
                  >
                    <p className="text-2xl font-black text-amber-300 sm:text-3xl">
                      {value}
                    </p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-600 sm:text-xs">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <blockquote className="relative overflow-hidden rounded-[1.75rem] border border-amber-300/15 bg-gradient-to-br from-amber-300/[0.09] to-white/[0.025] p-6 sm:p-8">
              <span className="absolute -right-2 -top-10 text-[10rem] font-serif leading-none text-amber-300/[0.055]">
                “
              </span>
              <Sparkles className="mb-5 h-5 w-5 text-amber-300" />
              <p className="relative text-xl font-semibold italic leading-relaxed text-amber-50/90 sm:text-2xl">
                “Com a sabedoria se edifica a casa, e com a inteligência ela se
                firma.”
              </p>
              <cite className="mt-6 block text-sm font-semibold not-italic text-amber-300/60">
                Provérbios 24:3
              </cite>
            </blockquote>
          </div>
        </div>
      </Reveal>
    </PageSection>
  );
}

function EventInformationSection() {
  return (
    <PageSection id="informacoes" className="max-w-7xl">
      <SectionHeading
        eyebrow="Anote na agenda"
        title="O dia em que vamos celebrar juntos"
        description="Tudo o que você precisa saber para compartilhar esse momento com a gente."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Reveal>
          <InformationCard
            icon={<CalendarDays className="h-6 w-6" />}
            title="Data e horário"
            primary={EVENT_DETAILS.date}
            secondary={EVENT_DETAILS.time}
          />
        </Reveal>
        <Reveal delay={0.08}>
          <InformationCard
            icon={<MapPin className="h-6 w-6" />}
            title="Local"
            primary={EVENT_DETAILS.address}
            secondary={EVENT_DETAILS.city}
          />
        </Reveal>
      </div>
    </PageSection>
  );
}

function InformationCard({
  icon,
  title,
  primary,
  secondary,
}: {
  icon: ReactNode;
  title: string;
  primary: string;
  secondary: string;
}) {
  return (
    <article className="group relative min-h-52 overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-white/[0.032] p-6 transition duration-500 hover:-translate-y-1 hover:border-amber-300/20 hover:bg-white/[0.05] sm:p-8">
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-amber-300/[0.04] blur-3xl transition duration-700 group-hover:bg-amber-300/[0.075]" />
      <div className="relative flex h-full flex-col justify-between gap-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-300 text-black shadow-lg shadow-amber-300/10 transition duration-500 group-hover:rotate-3 group-hover:scale-105">
            {icon}
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-700">
            Gustavo & Mirela
          </span>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.17em] text-amber-300/[0.65]">
            {title}
          </h3>
          <p className="mt-3 break-words text-xl font-black tracking-tight text-white sm:text-2xl">
            {primary}
          </p>
          <p className="mt-2 break-words text-sm leading-relaxed text-zinc-500 sm:text-base">
            {secondary}
          </p>
        </div>
      </div>
    </article>
  );
}

function HowToUseSection() {
  return (
    <PageSection id="como-funciona" className="max-w-7xl">
      <SectionHeading
        eyebrow="É simples"
        title="Escolha como quer participar"
        description="Em poucos passos você encontra o presente ideal ou contribui da forma que preferir."
      />

      <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-8 hidden h-px bg-gradient-to-r from-transparent via-amber-300/25 to-transparent lg:block" />

        {HOW_TO_USE_STEPS.map((step, index) => {
          const Icon = step.icon;

          return (
            <Reveal key={step.title} delay={index * 0.07}>
              <article className="group relative h-full overflow-hidden rounded-[1.6rem] border border-white/[0.08] bg-white/[0.028] p-5 transition duration-500 hover:-translate-y-1 hover:border-amber-300/20 hover:bg-white/[0.045] sm:p-6">
                <span className="absolute right-4 top-3 text-6xl font-black text-white/[0.025] transition group-hover:text-amber-300/[0.04]">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border-4 border-[#080704] bg-amber-300 text-black shadow-[0_0_0_1px_rgba(250,204,21,0.22)] transition duration-500 group-hover:-rotate-3 group-hover:scale-105">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="text-base font-black text-white sm:text-lg">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  {step.description}
                </p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </PageSection>
  );
}

function ProductsSection({
  products,
  loading,
  error,
  lastUpdate,
  isPollingActive,
  onRetry,
}: {
  products: Product[];
  loading: boolean;
  error: string | null;
  lastUpdate: Date | null;
  isPollingActive: boolean;
  onRetry: () => void;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ProductFilter>("all");

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");

    return products.filter((product) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        product.name.toLocaleLowerCase("pt-BR").includes(normalizedQuery);

      const matchesFilter =
        filter === "all" ||
        (filter === "available" && !product.unavailable) ||
        (filter === "unavailable" && product.unavailable);

      return matchesSearch && matchesFilter;
    });
  }, [filter, products, query]);

  const availableCount = products.filter(
    (product) => !product.unavailable,
  ).length;

  return (
    <PageSection id="presentes" className="max-w-7xl">
      <SectionHeading
        eyebrow="Lista de presentes"
        title="Escolha algo para fazer parte do nosso lar"
        description="Você pode comprar pela loja ou contribuir via Pix com o valor do item escolhido."
      />

      <Reveal>
        <div className="mb-7 overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-white/[0.035] p-3 shadow-2xl shadow-black/15 backdrop-blur-xl sm:p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <label className="group relative block flex-1 lg:max-w-lg">
              <span className="sr-only">Buscar presente</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600 transition group-focus-within:text-amber-300" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por um presente..."
                className="h-[3.25rem] w-full rounded-2xl border border-white/[0.08] bg-black/30 pl-11 pr-4 text-sm font-medium text-white outline-none transition placeholder:text-zinc-700 focus:border-amber-300/[0.35] focus:bg-black/40 focus:ring-4 focus:ring-amber-300/[0.07]"
              />
            </label>

            <div
              className="grid grid-cols-3 gap-2"
              role="group"
              aria-label="Filtrar presentes"
            >
              <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
                Todos
              </FilterButton>
              <FilterButton
                active={filter === "available"}
                onClick={() => setFilter("available")}
              >
                Disponíveis
              </FilterButton>
              <FilterButton
                active={filter === "unavailable"}
                onClick={() => setFilter("unavailable")}
              >
                Escolhidos
              </FilterButton>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/[0.05] bg-black/15 px-3 py-2.5 text-xs text-zinc-600">
            <span>
              <strong className="text-amber-300">{availableCount}</strong>{" "}
              {availableCount === 1 ? "item disponível" : "itens disponíveis"}
            </span>
            <SyncStatus isPollingActive={isPollingActive} lastUpdate={lastUpdate} />
          </div>
        </div>
      </Reveal>

      {loading && <ProductsSkeleton />}

      {!loading && error && (
        <Reveal>
          <div
            className="rounded-[1.75rem] border border-red-400/15 bg-red-400/[0.055] px-5 py-12 text-center"
            role="alert"
          >
            <p className="font-bold text-red-200">
              Não foi possível carregar os presentes.
            </p>
            <p className="mt-2 text-sm text-red-200/60">{error}</p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-5 min-h-11 rounded-xl bg-white px-5 text-sm font-black text-black transition hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Tentar novamente
            </button>
          </div>
        </Reveal>
      )}

      {!loading && !error && products.length === 0 && (
        <EmptyProductsState
          title="A lista ainda está vazia"
          description="Os presentes aparecerão aqui assim que forem cadastrados."
        />
      )}

      {!loading && !error && products.length > 0 && filteredProducts.length === 0 && (
        <EmptyProductsState
          title="Nenhum presente encontrado"
          description="Tente buscar por outro nome ou mudar o filtro selecionado."
        />
      )}

      {!loading && !error && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <GiftCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </PageSection>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-11 rounded-xl px-2.5 text-[11px] font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 sm:px-4 sm:text-sm ${active
        ? "bg-amber-300 text-black shadow-lg shadow-amber-300/10"
        : "border border-white/[0.08] bg-white/[0.025] text-zinc-500 hover:bg-white/[0.06] hover:text-white"
        }`}
    >
      {children}
    </button>
  );
}

function SyncStatus({
  isPollingActive,
  lastUpdate,
}: {
  isPollingActive: boolean;
  lastUpdate: Date | null;
}) {
  return (
    <span className="inline-flex items-center gap-1.5" aria-live="polite">
      <span
        className={`h-1.5 w-1.5 rounded-full ${isPollingActive ? "bg-emerald-400" : "bg-zinc-600"
          }`}
        aria-hidden="true"
      />
      Atualizado {formatUpdateTime(lastUpdate)}
    </span>
  );
}

function ProductsSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3"
      role="status"
      aria-label="Carregando presentes"
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[1.5rem] border border-white/[0.07] bg-white/[0.025]"
        >
          <div className="grid grid-cols-[112px_minmax(0,1fr)] sm:block">
            <div className="aspect-square animate-pulse bg-white/[0.055] sm:aspect-[4/3]" />
            <div className="space-y-3 p-4">
              <div className="h-4 w-4/5 animate-pulse rounded bg-white/[0.06]" />
              <div className="h-5 w-2/5 animate-pulse rounded bg-white/[0.06]" />
            </div>
            <div className="col-span-2 grid grid-cols-2 gap-2 p-3 pt-0 sm:p-4 sm:pt-0">
              <div className="h-11 animate-pulse rounded-xl bg-white/[0.06]" />
              <div className="h-11 animate-pulse rounded-xl bg-white/[0.06]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyProductsState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.02] px-5 py-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.05]">
        <Gift className="h-5 w-5 text-zinc-500" />
      </div>
      <h3 className="mt-4 font-bold text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-zinc-500">
        {description}
      </p>
    </div>
  );
}

function GiftCard({ product }: { product: Product }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(Boolean(product.image));
  const [showPixDialog, setShowPixDialog] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setImageError(false);
    setImageLoading(Boolean(product.image));
  }, [product.image]);

  const isUnavailable = product.unavailable;

  return (
    <>
      <motion.article
        layout
        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        whileHover={
          shouldReduceMotion || isUnavailable
            ? undefined
            : { y: -7, rotateX: 1.2, rotateY: -1.2 }
        }
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        className={`group relative overflow-hidden rounded-[1.75rem] border [transform-style:preserve-3d] ${isUnavailable
          ? "border-white/[0.055] bg-white/[0.018] opacity-65"
          : "border-white/[0.08] bg-white/[0.034] shadow-xl shadow-black/10 hover:border-amber-300/[0.22] hover:bg-white/[0.05] hover:shadow-2xl hover:shadow-black/30"
          }`}
      >
        {!isUnavailable && (
          <div className="pointer-events-none absolute -right-20 -top-20 z-0 h-52 w-52 rounded-full bg-amber-300/[0.04] blur-3xl transition duration-700 group-hover:bg-amber-300/[0.08]" />
        )}

        <div className="relative z-10 grid grid-cols-[118px_minmax(0,1fr)] sm:block">
          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#15130c] to-[#0d0c08] sm:aspect-[4/3]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(250,204,21,0.08),transparent_55%)]" />

            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-300/15 border-t-amber-300" />
              </div>
            )}

            {product.image && !imageError ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 118px, (max-width: 1280px) 50vw, 33vw"
                className={`object-contain p-3 transition duration-700 sm:p-7 ${isUnavailable
                  ? "grayscale-[0.45] opacity-40"
                  : "drop-shadow-[0_18px_24px_rgba(0,0,0,0.35)] group-hover:scale-[1.055] group-hover:-rotate-1"
                  }`}
                onError={() => {
                  setImageError(true);
                  setImageLoading(false);
                }}
                onLoad={() => setImageLoading(false)}
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-amber-300/30">
                <Gift className="h-9 w-9" />
                <span className="hidden text-xs sm:block">Sem imagem</span>
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent sm:h-28" />

            {isUnavailable ? (
              <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/70 px-2.5 py-1.5 text-[9px] font-black uppercase tracking-[0.1em] text-zinc-300 backdrop-blur-md sm:left-3 sm:top-3 sm:text-[10px]">
                <PackageCheck className="h-3 w-3" />
                Já escolhido
              </span>
            ) : (
              <span className="absolute left-3 top-3 hidden rounded-full border border-amber-300/15 bg-amber-300/[0.08] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.13em] text-amber-200/70 backdrop-blur-md sm:inline-flex">
                Disponível
              </span>
            )}
          </div>

          <div className="flex min-w-0 flex-col justify-center p-4 sm:min-h-32 sm:p-5 sm:pb-4">
            <h3
              className={`line-clamp-2 text-sm font-black leading-snug sm:text-base ${isUnavailable ? "text-zinc-500" : "text-white"
                }`}
            >
              {product.name}
            </h3>
            <p
              className={`mt-2 text-lg font-black sm:text-2xl ${isUnavailable ? "text-zinc-600 line-through" : "text-amber-300"
                }`}
            >
              {product.price}
            </p>
            <p className="mt-1.5 hidden text-xs leading-relaxed text-zinc-600 sm:block">
              {isUnavailable
                ? "Este item já foi escolhido por alguém especial."
                : "Compre na loja ou contribua pelo Pix."}
            </p>
          </div>

          <div className="col-span-2 grid grid-cols-2 gap-2 border-t border-white/[0.06] p-3 sm:border-t-0 sm:px-5 sm:pb-5 sm:pt-0">
            {isUnavailable ? (
              <button
                type="button"
                disabled
                className="inline-flex min-h-11 cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-white/[0.04] px-3 text-sm font-bold text-zinc-600"
              >
                <Check className="h-4 w-4" />
                Escolhido
              </button>
            ) : (
              <a
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Comprar ${product.name} na loja`}
                className="group/button inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-amber-300 px-3 text-sm font-black text-black transition hover:bg-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
              >
                <ShoppingBag className="h-4 w-4 transition group-hover/button:-rotate-6" />
                Comprar
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}

            <button
              type="button"
              onClick={() => setShowPixDialog(true)}
              disabled={isUnavailable}
              aria-label={`Abrir Pix para ${product.name}`}
              className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${isUnavailable
                ? "cursor-not-allowed border-white/[0.04] bg-white/[0.018] text-zinc-700"
                : "border-amber-300/20 bg-amber-300/[0.075] text-amber-200 hover:border-amber-300/[0.35] hover:bg-amber-300/[0.13]"
                }`}
            >
              <QrCode className="h-4 w-4" />
              Pix
            </button>
          </div>
        </div>
      </motion.article>

      <ProductPixDialog
        product={product}
        open={showPixDialog}
        onOpenChange={setShowPixDialog}
      />
    </>
  );
}

function ProductPixDialog({
  product,
  open,
  onOpenChange,
}: {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className="
    fixed
    left-1/2
    top-1/2
    w-[calc(100%-2rem)]
    max-w-lg
    max-h-[90dvh]
    -translate-x-1/2
    -translate-y-1/2
    overflow-y-auto
    rounded-[1.75rem]
    border
    border-amber-300/20
    bg-[#11100c]
    p-0
    text-white
    shadow-2xl
  "
      >
        <div className="p-5 sm:p-7">
          <AlertDialogHeader className="items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-300 text-black">
              <QrCode className="h-6 w-6" />
            </div>

            <AlertDialogTitle className="text-center text-2xl font-black tracking-tight text-white sm:text-3xl">
              Contribuir via Pix
            </AlertDialogTitle>

            <AlertDialogDescription className="max-w-sm text-center text-sm leading-relaxed text-zinc-400">
              Copie a chave abaixo e faça a transferência pelo aplicativo do seu
              banco.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="mt-6 space-y-3">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Presente escolhido
              </span>

              <div className="mt-2 flex items-start justify-between gap-4">
                <p className="font-semibold leading-snug text-white">
                  {product.name}
                </p>

                <span className="shrink-0 font-black text-amber-300">
                  {product.price}
                </span>
              </div>
            </div>

            <PixKeyBox
              pixKey={product.pix_key}
              label="Chave Pix"
              hint="Toque no campo para copiar"
            />

            <div className="flex items-start gap-3 rounded-2xl border border-amber-300/15 bg-amber-300/[0.06] p-4 text-sm leading-relaxed text-amber-100/75">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />

              <p>
                Depois de realizar o Pix, envie o comprovante para nós para que
                possamos agradecer e atualizar a lista.
              </p>
            </div>
          </div>

          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel className="min-h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] text-sm font-semibold text-zinc-300 hover:bg-white/[0.08] hover:text-white">
              Fechar
            </AlertDialogCancel>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function FreePixSection() {
  return (
    <PageSection id="pix-livre" className="max-w-7xl">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.25rem] border border-amber-300/[0.22] bg-gradient-to-br from-amber-300/[0.105] via-white/[0.035] to-transparent p-5 shadow-[0_35px_90px_rgba(0,0,0,0.35)] sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-amber-300/[0.075] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 left-1/3 h-72 w-72 rounded-full bg-orange-500/[0.04] blur-3xl" />

          <div className="relative grid gap-9 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
            <div>
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-300 text-black shadow-xl shadow-amber-300/15">
                <CreditCard className="h-6 w-6" />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-300/[0.65]">
                Pix livre
              </p>
              <h2 className="mt-4 max-w-xl text-3xl font-black leading-tight tracking-[-0.045em] text-white sm:text-5xl">
                Um gesto de carinho em qualquer valor
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
                Prefere ajudar de outra forma? Qualquer contribuição será muito
                bem-vinda e fará parte da construção do nosso novo lar.
              </p>

              <div className="mt-6 flex items-center gap-3 text-sm font-semibold text-amber-100/[0.65]">
                <CheckCircle2 className="h-5 w-5 text-amber-300" />
                Seguro, rápido e direto pelo seu banco.
              </div>
            </div>

            <FreeValuePixCard pixKey={FREE_PIX_KEY} qrCodeImage="/pix.jpeg" />
          </div>
        </div>
      </Reveal>
    </PageSection>
  );
}

function FreeValuePixCard({
  pixKey,
  qrCodeImage,
}: {
  pixKey: string;
  qrCodeImage: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/[0.08] bg-black/25 p-4 sm:p-5">
      <div className="grid gap-5 sm:grid-cols-[148px_minmax(0,1fr)] sm:items-center">
        <div className="mx-auto rounded-2xl bg-white p-2 shadow-xl shadow-black/25 sm:mx-0">
          <Image
            src={qrCodeImage}
            alt="QR Code do Pix livre"
            width={148}
            height={148}
            sizes="148px"
            className="h-36 w-36 rounded-xl object-contain"
          />
        </div>

        <div className="min-w-0">
          <p className="text-center text-sm leading-relaxed text-zinc-400 sm:text-left">
            Escaneie o QR Code ou copie a chave para contribuir pelo aplicativo
            do seu banco.
          </p>
          <div className="mt-4">
            <PixKeyBox
              pixKey={pixKey}
              label="Chave Pix (CPF)"
              hint="Qualquer valor é bem-vindo"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function PixKeyBox({
  pixKey,
  label,
  hint,
}: {
  pixKey: string;
  label: string;
  hint: string;
}) {
  const { copied, copy } = useClipboardFeedback();

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-black/30 p-3.5">
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
          {label}
        </span>
        <span className="text-[11px] text-zinc-600">{hint}</span>
      </div>

      <button
        type="button"
        onClick={() => void copy(pixKey)}
        aria-label={`Copiar ${label}`}
        className="group flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-white/[0.035] px-3.5 text-left transition hover:border-amber-300/30 hover:bg-amber-300/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
      >
        <code className="min-w-0 flex-1 break-all font-mono text-sm font-semibold tracking-wide text-amber-200">
          {pixKey}
        </code>
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition ${copied
            ? "bg-emerald-400/10 text-emerald-400"
            : "bg-white/[0.05] text-zinc-400 group-hover:text-amber-300"
            }`}
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </span>
      </button>

      <div className="mt-2.5 min-h-4 text-center text-xs" aria-live="polite">
        {copied ? (
          <span className="inline-flex items-center gap-1 text-emerald-400">
            <Check className="h-3.5 w-3.5" /> Chave copiada
          </span>
        ) : (
          <span className="text-zinc-600">Toque para copiar</span>
        )}
      </div>
    </div>
  );
}

function GallerySection() {
  return (
    <PageSection id="momentos" className="max-w-7xl">
      <SectionHeading
        eyebrow="Nossa história"
        title="Momentos que nos trouxeram até aqui"
        description="Algumas lembranças especiais da nossa caminhada juntos."
      />

      <div className="grid gap-4 md:grid-cols-3 md:auto-rows-[230px]">
        {GALLERY_PHOTOS.map(({ src, alt }, index) => (
          <Reveal
            key={src}
            delay={index * 0.08}
            className={index === 0 ? "md:col-span-2 md:row-span-2" : ""}
          >
            <figure className="group relative h-full min-h-[340px] overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-zinc-900 md:min-h-0">
              <Image
                src={src}
                alt={alt}
                fill
                sizes={
                  index === 0
                    ? "(max-width: 768px) 100vw, 66vw"
                    : "(max-width: 768px) 100vw, 33vw"
                }
                className="object-cover transition duration-1000 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/[0.06]" />
              <figcaption className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <span className="inline-flex rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-amber-200 backdrop-blur-xl">
                  {alt}
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </PageSection>
  );
}

function SiteFooter() {
  return (
    <footer className="relative border-t border-white/[0.07] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/20 to-transparent" />
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-300/10">
            <Heart className="h-4 w-4 fill-amber-300 text-amber-300" />
          </div>
          <div>
            <p className="font-black text-white">Gustavo & Mirela</p>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-700">
              Nosso Chá de Casa Nova
            </p>
          </div>
        </div>

        <p className="max-w-sm text-xs leading-relaxed text-zinc-700">
          © 2026 · Feito com carinho para celebrar o início do nosso novo lar.
        </p>
      </div>
    </footer>
  );
}

function PageSection({
  id,
  className,
  children,
}: {
  id: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`relative mx-auto scroll-mt-28 px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24 ${className ?? ""
        }`}
    >
      {children}
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <Reveal className="mx-auto mb-9 max-w-3xl text-center sm:mb-12">
      <div className="mx-auto mb-4 h-px w-16 bg-gradient-to-r from-transparent via-amber-300/70 to-transparent" />
      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-300/60 sm:text-xs">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-balance text-3xl font-black leading-[1.05] tracking-[-0.045em] text-white sm:text-5xl">
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-zinc-500 sm:text-base sm:leading-7">
        {description}
      </p>
    </Reveal>
  );
}

function useProducts(): ProductsState {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isPollingActive, setIsPollingActive] = useState(false);

  const requestControllerRef = useRef<AbortController | null>(null);

  const refresh = useCallback(
    async ({ showLoading = false }: RefreshOptions = {}) => {
      requestControllerRef.current?.abort();

      const controller = new AbortController();
      requestControllerRef.current = controller;

      if (showLoading) {
        setLoading(true);
      }

      try {
        const response = await axios.get<ProductsApiResponse>(
          PRODUCTS_ENDPOINT,
          {
            signal: controller.signal,
            timeout: REQUEST_TIMEOUT_MS,
          },
        );

        if (!response.data.success || !Array.isArray(response.data.data)) {
          throw new Error(
            response.data.message ?? "A API retornou uma resposta inválida.",
          );
        }

        if (controller.signal.aborted) return;

        setProducts(response.data.data);
        setError(null);
        setLastUpdate(new Date());
      } catch (requestError) {
        if (controller.signal.aborted || axios.isCancel(requestError)) {
          return;
        }

        console.error("Erro ao buscar produtos:", requestError);
        setError(getProductsRequestError(requestError));
      } finally {
        if (requestControllerRef.current === controller) {
          requestControllerRef.current = null;
          setLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    let pollingInterval: ReturnType<typeof setInterval> | null = null;

    const clearPolling = () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
      }
    };

    const startPolling = () => {
      clearPolling();

      if (document.hidden) {
        setIsPollingActive(false);
        return;
      }

      pollingInterval = setInterval(() => {
        void refresh();
      }, POLLING_INTERVAL_MS);

      setIsPollingActive(true);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearPolling();
        setIsPollingActive(false);
        return;
      }

      void refresh();
      startPolling();
    };

    void refresh({ showLoading: true });
    startPolling();

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearPolling();
      requestControllerRef.current?.abort();
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
    };
  }, [refresh]);

  return {
    products,
    loading,
    error,
    lastUpdate,
    isPollingActive,
    refresh,
  };
}

function useVisitorPresence() {
  useEffect(() => {
    const sessionId =
      globalThis.crypto?.randomUUID?.() ??
      `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const channel = supabase.channel("site-visitors", {
      config: {
        presence: {
          key: sessionId,
        },
      },
    });

    channel.subscribe((status) => {
      if (status !== "SUBSCRIBED") return;

      void channel
        .track({
          online_at: new Date().toISOString(),
          user_agent: navigator.userAgent,
          url: window.location.pathname,
        })
        .catch((presenceError) => {
          console.error("Erro ao registrar presença:", presenceError);
        });
    });

    return () => {
      void channel.untrack();
      void supabase.removeChannel(channel);
    };
  }, []);
}

function useClipboardFeedback(resetAfterMs = 2_500) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(
    async (value: string) => {
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(value);
        } else {
          const textArea = document.createElement("textarea");
          textArea.value = value;
          textArea.style.position = "fixed";
          textArea.style.opacity = "0";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand("copy");
          textArea.remove();
        }

        setCopied(true);

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          setCopied(false);
        }, resetAfterMs);
      } catch (clipboardError) {
        console.error("Não foi possível copiar a chave Pix:", clipboardError);
      }
    },
    [resetAfterMs],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { copied, copy };
}

function getProductsRequestError(error: unknown) {
  if (axios.isAxiosError<ProductsApiResponse>(error)) {
    if (error.code === "ECONNABORTED") {
      return "O servidor demorou muito para responder. Tente novamente.";
    }

    return (
      error.response?.data?.message ??
      "Não foi possível conectar ao servidor."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível carregar os produtos.";
}

function formatUpdateTime(date: Date | null) {
  if (!date) return "--:--";

  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}
