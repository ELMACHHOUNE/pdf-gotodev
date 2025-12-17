"use client";
import dynamic from "next/dynamic";
import { ShieldCheck, Zap, Lock, Home as HomeIcon, User } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";

const FloatingNav = dynamic(
  () =>
    import("@/components/ui/floating-navbar").then((mod) => mod.FloatingNav),
  { ssr: false }
);
const BackgroundBeams = dynamic(
  () =>
    import("@/components/ui/background-beams").then(
      (mod) => mod.BackgroundBeams
    ),
  { ssr: false }
);
const HoverEffect = dynamic(
  () =>
    import("@/components/ui/card-hover-effect").then((mod) => mod.HoverEffect),
  { ssr: false }
);
const Footer = dynamic(
  () => import("@/components/ui/footer").then((mod) => mod.Footer),
  { ssr: false }
);

const PdfCompressor = dynamic(() => import("@/components/pdf-compressor"), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-5xl mx-auto h-96 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl rounded-3xl shadow-xl border border-neutral-200 dark:border-neutral-800 animate-pulse" />
  ),
});

export default function Home() {
  const { t } = useI18n();

  const navItems = [
    {
      name: t.nav.home,
      link: "/",
      icon: <HomeIcon className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: t.nav.about,
      link: "/about",
      icon: <User className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
  ];

  const features = [
    {
      title: t.features.secure.title,
      description: t.features.secure.description,
      icon: <Lock size={28} />,
    },
    {
      title: t.features.fast.title,
      description: t.features.fast.description,
      icon: <Zap size={28} />,
    },
    {
      title: t.features.quality.title,
      description: t.features.quality.description,
      icon: <ShieldCheck size={28} />,
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 relative w-full">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <BackgroundBeams />
      </div>

      <FloatingNav navItems={navItems} />

      <main className="container mx-auto px-4 pt-32 pb-12 md:py-32 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-12 md:mb-16 space-y-6 md:space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-blue-100/80 dark:bg-blue-900/30 backdrop-blur-sm text-blue-800 dark:text-blue-200 text-xs md:text-sm font-medium border border-blue-200 dark:border-blue-800 shadow-sm">
            <ShieldCheck size={14} className="md:w-4 md:h-4" />
            <span>{t.hero.badge}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-neutral-900 dark:text-white">
            <span className="block text-neutral-900 dark:text-white mb-2">
              {t.hero.title_prefix}
            </span>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500">
              {t.hero.title_gradient}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed px-4 md:px-0">
            {t.hero.description}
          </p>
        </div>

        <div className="relative z-20">
          <PdfCompressor />
        </div>

        <div className="mt-32 max-w-6xl mx-auto">
          <HoverEffect items={features} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
