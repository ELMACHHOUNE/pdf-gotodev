"use client";
import PdfCompressor from "@/components/pdf-compressor";
import {
  ShieldCheck,
  Zap,
  Lock,
  Home as HomeIcon,
  User,
  MessageSquare,
} from "lucide-react";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { Footer } from "@/components/ui/footer";
import { useI18n } from "@/lib/i18n-context";

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
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 relative w-full">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <BackgroundBeams />
      </div>

      <FloatingNav navItems={navItems} />

      <main className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50/80 backdrop-blur-sm text-blue-700 text-sm font-medium border border-blue-100 shadow-sm">
            <ShieldCheck size={16} />
            <span>{t.hero.badge}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white">
            <span className="block text-slate-900 dark:text-white mb-2">
              {t.hero.title_prefix}
            </span>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500">
              {t.hero.title_gradient}
            </span>
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
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
