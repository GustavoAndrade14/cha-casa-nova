"use client";

import axios from "axios";
import dynamic from "next/dynamic";
import Image from "next/image";
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
    <main className="relative min-h-screen overflow-x-clip bg-[#090805] pb-[calc(6rem+env(safe-area-inset-bottom))] text-white selection:bg-amber-300 selection:text-black md:pb-0">
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

      <MobileActionBar />
    </main>
  );
}

function BackgroundDecoration() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% -10%, rgba(250, 204, 21, 0.13), transparent 34%), radial-gradient(circle at 10% 45%, rgba(245, 158, 11, 0.05), transparent 28%), linear-gradient(180deg, #0d0c08 0%, #090805 46%, #070704 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.6'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#090805]/85 backdrop-blur-xl supports-[backdrop-filter]:bg-[#090805]/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a
          href="#inicio"
          className="flex min-w-0 items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          aria-label="Ir para o início"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber-300/25 bg-amber-300/10">
            <HouseHeart className="h-5 w-5 text-amber-300" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold text-white">
              Gustavo & Mirela
            </span>
            <span className="block truncate text-[11px] text-zinc-500">
              Chá de Casa Nova
            </span>
          </span>
        </a>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Navegação principal"
        >
          <HeaderLink href="#sobre">Sobre</HeaderLink>
          <HeaderLink href="#informacoes">Informações</HeaderLink>
          <HeaderLink href="#como-funciona">Como funciona</HeaderLink>
          <HeaderLink href="#momentos">Momentos</HeaderLink>
        </nav>

        <a
          href="#presentes"
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-300 px-4 text-sm font-bold text-black shadow-[0_8px_30px_rgba(250,204,21,0.16)] transition hover:bg-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090805]"
        >
          <Gift className="h-4 w-4" />
          <span>Presentes</span>
        </a>
      </div>
    </header>
  );
}

function HeaderLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="rounded-lg px-3 py-2 text-sm text-zinc-400 transition hover:bg-white/[0.05] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
    >
      {children}
    </a>
  );
}

function HeroSection() {
  return (
    <section
      id="inicio"
      className="scroll-mt-20 px-4 pb-12 pt-10 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8"
    >
      <div className="mx-auto max-w-5xl text-center">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/[0.08] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-amber-200/80">
          <Sparkles className="h-3.5 w-3.5" />
          Um novo capítulo começa aqui
        </div>

        <h1 className="mx-auto max-w-4xl bg-gradient-to-r from-amber-100 via-yellow-300 to-amber-100 bg-clip-text text-4xl font-black leading-[1.04] tracking-[-0.045em] text-transparent sm:text-6xl lg:text-7xl">
          Nosso Chá de Casa Nova
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
          Estamos preparando nosso novo lar e queremos dividir esse momento
          especial com as pessoas que fazem parte da nossa história.
        </p>

        <div className="relative mx-auto mt-8 flex max-w-sm items-end justify-center sm:mt-10">
          <PersonAvatar person={HERO_PEOPLE[0]} position="left" />

          <div className="relative z-20 -mx-3 mb-6 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-[#090805] bg-amber-300 shadow-[0_8px_32px_rgba(250,204,21,0.28)] sm:h-14 sm:w-14">
            <Heart className="h-5 w-5 fill-black text-black sm:h-6 sm:w-6" />
          </div>

          <PersonAvatar person={HERO_PEOPLE[1]} position="right" />
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-xl font-bold text-amber-200 sm:text-2xl">
          <span>Gustavo</span>
          <span className="text-amber-300/40">&</span>
          <span>Mirela</span>
        </div>

        <div className="mx-auto mt-8 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
          <a
            href="#presentes"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-amber-300 px-5 text-sm font-bold text-black shadow-[0_12px_36px_rgba(250,204,21,0.16)] transition hover:-translate-y-0.5 hover:bg-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090805]"
          >
            <Gift className="h-5 w-5" />
            Ver lista de presentes
          </a>

          <a
            href="#pix-livre"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-amber-300/30 hover:bg-amber-300/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            <QrCode className="h-5 w-5 text-amber-300" />
            Contribuir via Pix
          </a>
        </div>

        <a
          href="#sobre"
          className="mx-auto mt-10 inline-flex flex-col items-center gap-1.5 rounded-xl px-3 py-2 text-xs text-zinc-500 transition hover:text-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          Saiba mais
          <ChevronDown className="h-4 w-4 animate-bounce" />
        </a>
      </div>
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
      className={`relative z-10 h-32 w-32 overflow-hidden rounded-full border-2 border-amber-300/70 bg-zinc-900 shadow-2xl sm:h-44 sm:w-44 ${position === "left" ? "rotate-[-3deg]" : "rotate-[3deg]"
        }`}
    >
      <Image
        src={person.src}
        alt={person.name}
        fill
        sizes="(max-width: 640px) 128px, 176px"
        priority
        className="object-cover"
      />
    </div>
  );
}

function AboutSection() {
  return (
    <PageSection id="sobre" className="max-w-4xl">
      <SectionHeading
        eyebrow="Nossa história"
        title="Sobre o nosso chá"
        description="Mais do que uma lista de presentes, este site é um convite para celebrar conosco."
      />

      <div className="rounded-[1.75rem] border border-white/[0.08] bg-white/[0.035] p-5 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.78fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-300/10">
              <HouseHeart className="h-5 w-5 text-amber-300" />
            </div>

            <p className="text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8">
              Estamos muito felizes em anunciar que vamos morar juntos! Para
              celebrar esse novo capítulo, convidamos você para o nosso Chá de
              Casa Nova. Sua presença e carinho já são presentes especiais,
              mas selecionamos alguns itens para quem desejar nos ajudar a
              construir o nosso lar.
            </p>
          </div>

          <blockquote className="rounded-2xl border border-amber-300/15 bg-amber-300/[0.055] p-5 sm:p-6">
            <Sparkles className="mb-4 h-5 w-5 text-amber-300" />
            <p className="text-lg font-medium italic leading-relaxed text-amber-100/90">
              “Com a sabedoria se edifica a casa, e com a inteligência ela se
              firma.”
            </p>
            <cite className="mt-4 block text-sm not-italic text-amber-300/60">
              Provérbios 24:3
            </cite>
          </blockquote>
        </div>
      </div>
    </PageSection>
  );
}

function EventInformationSection() {
  return (
    <PageSection id="informacoes" className="max-w-5xl">
      <SectionHeading
        eyebrow="Anote na agenda"
        title="Informações importantes"
        description="Tudo o que você precisa saber para compartilhar esse momento com a gente."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <InformationCard
          icon={<CalendarDays className="h-5 w-5" />}
          title="Data e horário"
          primary={EVENT_DETAILS.date}
          secondary={EVENT_DETAILS.time}
        />
        <InformationCard
          icon={<MapPin className="h-5 w-5" />}
          title="Local"
          primary={EVENT_DETAILS.address}
          secondary={EVENT_DETAILS.city}
        />
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
    <article className="group rounded-[1.5rem] border border-white/[0.08] bg-white/[0.035] p-5 transition hover:border-amber-300/20 hover:bg-white/[0.05] sm:p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-300/10 text-amber-300 transition group-hover:scale-105">
          {icon}
        </div>
        <div className="min-w-0 pt-0.5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-amber-300/70">
            {title}
          </h3>
          <p className="mt-2 break-words text-base font-semibold text-white sm:text-lg">
            {primary}
          </p>
          <p className="mt-1 break-words text-sm leading-relaxed text-zinc-400">
            {secondary}
          </p>
        </div>
      </div>
    </article>
  );
}

function HowToUseSection() {
  return (
    <PageSection id="como-funciona" className="max-w-6xl">
      <SectionHeading
        eyebrow="É simples"
        title="Como funciona"
        description="Em poucos passos você escolhe a melhor forma de participar."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {HOW_TO_USE_STEPS.map((step, index) => {
          const Icon = step.icon;

          return (
            <article
              key={step.title}
              className="relative overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-white/[0.03] p-5 sm:p-6"
            >
              <span className="absolute right-4 top-3 text-5xl font-black text-white/[0.035]">
                {index + 1}
              </span>

              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-300 text-black">
                <Icon className="h-5 w-5" />
              </div>

              <h3 className="text-base font-bold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {step.description}
              </p>
            </article>
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
        title="Escolha algo para o nosso lar"
        description="Você pode comprar pela loja ou contribuir via Pix com o valor do item."
      />

      <div className="mb-5 rounded-[1.5rem] border border-white/[0.08] bg-white/[0.03] p-3 sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative block flex-1 lg:max-w-md">
            <span className="sr-only">Buscar presente</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar presente..."
              className="h-12 w-full rounded-xl border border-white/[0.08] bg-black/25 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-300/40 focus:ring-4 focus:ring-amber-300/[0.08]"
            />
          </label>

          <div
            className="grid grid-cols-3 gap-2"
            role="group"
            aria-label="Filtrar presentes"
          >
            <FilterButton
              active={filter === "all"}
              onClick={() => setFilter("all")}
            >
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

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-zinc-500">
          <span>
            {availableCount} {availableCount === 1 ? "item disponível" : "itens disponíveis"}
          </span>
          <SyncStatus
            isPollingActive={isPollingActive}
            lastUpdate={lastUpdate}
          />
        </div>
      </div>

      {loading && <ProductsSkeleton />}

      {!loading && error && (
        <div
          className="rounded-[1.5rem] border border-red-400/15 bg-red-400/[0.055] px-5 py-10 text-center"
          role="alert"
        >
          <p className="font-semibold text-red-200">
            Não foi possível carregar os presentes.
          </p>
          <p className="mt-2 text-sm text-red-200/60">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-5 min-h-11 rounded-xl bg-white px-5 text-sm font-bold text-black transition hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Tentar novamente
          </button>
        </div>
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
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
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
      className={`min-h-11 rounded-xl px-2.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 sm:px-4 sm:text-sm ${active
        ? "bg-amber-300 text-black"
        : "border border-white/[0.08] bg-white/[0.035] text-zinc-400 hover:bg-white/[0.07] hover:text-white"
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

  useEffect(() => {
    setImageError(false);
    setImageLoading(Boolean(product.image));
  }, [product.image]);

  const isUnavailable = product.unavailable;

  return (
    <>
      <article
        className={`group overflow-hidden rounded-[1.5rem] border transition duration-300 ${isUnavailable
          ? "border-white/[0.06] bg-white/[0.02] opacity-70"
          : "border-white/[0.08] bg-white/[0.035] hover:-translate-y-0.5 hover:border-amber-300/20 hover:bg-white/[0.05] hover:shadow-2xl hover:shadow-black/20"
          }`}
      >
        <div className="grid grid-cols-[112px_minmax(0,1fr)] sm:block">
          <div className="relative aspect-square overflow-hidden bg-[#12110d] sm:aspect-[4/3]">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-7 w-7 animate-spin rounded-full border-2 border-amber-300/15 border-t-amber-300" />
              </div>
            )}

            {product.image && !imageError ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 112px, (max-width: 1280px) 50vw, 33vw"
                className={`object-contain p-3 transition duration-500 sm:p-6 ${isUnavailable
                  ? "grayscale-[0.35] opacity-45"
                  : "group-hover:scale-[1.025]"
                  }`}
                onError={() => {
                  setImageError(true);
                  setImageLoading(false);
                }}
                onLoad={() => setImageLoading(false)}
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-amber-300/35">
                <Gift className="h-8 w-8" />
                <span className="hidden text-xs sm:block">Sem imagem</span>
              </div>
            )}

            {isUnavailable && (
              <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/70 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-zinc-300 backdrop-blur-md sm:left-3 sm:top-3 sm:px-2.5 sm:text-[11px]">
                <PackageCheck className="h-3 w-3" />
                Já escolhido
              </span>
            )}
          </div>

          <div className="flex min-w-0 flex-col justify-center p-3.5 sm:min-h-28 sm:p-5">
            <h3
              className={`line-clamp-2 text-sm font-bold leading-snug sm:text-base ${isUnavailable ? "text-zinc-500" : "text-white"
                }`}
            >
              {product.name}
            </h3>
            <p
              className={`mt-2 text-lg font-black sm:text-xl ${isUnavailable
                ? "text-zinc-600 line-through"
                : "text-amber-300"
                }`}
            >
              {product.price}
            </p>
            <p className="mt-1 hidden text-xs text-zinc-500 sm:block">
              {isUnavailable
                ? "Este item já foi escolhido por alguém."
                : "Compre na loja ou contribua pelo Pix."}
            </p>
          </div>

          <div className="col-span-2 grid grid-cols-2 gap-2 border-t border-white/[0.06] p-3 sm:border-t-0 sm:px-5 sm:pb-5 sm:pt-0">
            {isUnavailable ? (
              <button
                type="button"
                disabled
                className="inline-flex min-h-11 cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-white/[0.045] px-3 text-sm font-semibold text-zinc-600"
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
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-amber-300 px-3 text-sm font-bold text-black transition hover:bg-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
              >
                <ShoppingBag className="h-4 w-4" />
                Comprar
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}

            <button
              type="button"
              onClick={() => setShowPixDialog(true)}
              disabled={isUnavailable}
              aria-label={`Abrir Pix para ${product.name}`}
              className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${isUnavailable
                ? "cursor-not-allowed border-white/[0.04] bg-white/[0.02] text-zinc-700"
                : "border-amber-300/20 bg-amber-300/[0.08] text-amber-200 hover:border-amber-300/35 hover:bg-amber-300/[0.13]"
                }`}
            >
              <QrCode className="h-4 w-4" />
              Pix
            </button>
          </div>
        </div>
      </article>

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
    <PageSection id="pix-livre" className="max-w-5xl">
      <div className="relative overflow-hidden rounded-[2rem] border border-amber-300/25 bg-gradient-to-br from-amber-300/[0.09] via-white/[0.035] to-transparent p-5 shadow-2xl shadow-black/25 sm:p-8 lg:p-10">
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-300/[0.07] blur-3xl"
          aria-hidden="true"
        />

        <div className="relative grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-300 text-black">
              <CreditCard className="h-6 w-6" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300/65">
              Pix livre
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
              Contribua com qualquer valor
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-zinc-400">
              Prefere ajudar de outra forma? Qualquer contribuição será muito
              bem-vinda e fará parte da construção do nosso novo lar.
            </p>
          </div>

          <FreeValuePixCard pixKey={FREE_PIX_KEY} qrCodeImage="/pix.jpeg" />
        </div>
      </div>
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

      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden">
        {GALLERY_PHOTOS.map(({ src, alt }) => (
          <figure
            key={src}
            className="group relative aspect-[4/5] w-[82vw] max-w-sm shrink-0 snap-center overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-zinc-900 sm:w-[58vw] md:w-auto"
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 640px) 82vw, (max-width: 768px) 58vw, 33vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/5 to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 p-5">
              <span className="inline-flex rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-amber-200 backdrop-blur-md">
                {alt}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      <p className="mt-3 text-center text-xs text-zinc-600 md:hidden">
        Arraste para o lado para ver mais fotos
      </p>
    </PageSection>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.07] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-300/10">
            <Heart className="h-4 w-4 fill-amber-300 text-amber-300" />
          </div>
          <div>
            <p className="font-bold text-white">Gustavo & Mirela</p>
            <p className="text-xs text-zinc-600">Nosso Chá de Casa Nova</p>
          </div>
        </div>

        <p className="text-xs text-zinc-600">
          © 2026 · Feito com carinho para celebrar nosso novo lar
        </p>
      </div>
    </footer>
  );
}

function MobileActionBar() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#0b0a07]/95 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-16px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl md:hidden"
      aria-label="Ações rápidas"
    >
      <div className="mx-auto grid max-w-md grid-cols-2 gap-2">
        <a
          href="#presentes"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-amber-300 px-4 text-sm font-bold text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-100"
        >
          <Gift className="h-4 w-4" />
          Ver presentes
        </a>
        <a
          href="#pix-livre"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.055] px-4 text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          <QrCode className="h-4 w-4 text-amber-300" />
          Pix livre
        </a>
      </div>
    </nav>
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
      className={`mx-auto scroll-mt-24 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20 ${className ?? ""
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
    <div className="mx-auto mb-7 max-w-2xl text-center sm:mb-10">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300/60">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-black leading-tight tracking-[-0.035em] text-white sm:text-4xl">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-500 sm:text-base sm:leading-7">
        {description}
      </p>
    </div>
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

