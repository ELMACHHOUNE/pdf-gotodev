"use client";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Footer } from "@/components/ui/footer";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import {
  Home as HomeIcon,
  User,
  MessageSquare,
  Wrench,
  Image as ImageIcon,
  Eraser,
  Code,
} from "lucide-react";
import { useI18n } from "@/lib/i18n-context";

export default function About() {
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

  const tools = [
    {
      title: "Toolkit Hub",
      description: t.about.tools.toolkit,
      link: "https://toolkit-hub.gotodev.ma/",
      icon: <Wrench size={28} />,
    },
    {
      title: "Image Converter",
      description: t.about.tools.converter,
      link: "https://imgconvert.gotodev.ma/",
      icon: <ImageIcon size={28} />,
    },
    {
      title: "Background Remover",
      description: t.about.tools.remover,
      link: "http://background.gotodev.ma/",
      icon: <Eraser size={28} />,
    },
    {
      title: "BlurCSS",
      description: t.about.tools.blur,
      link: "https://blurcss.gotodev.ma/",
      icon: <Code size={28} />,
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
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white">
            <span className="block text-slate-900 dark:text-white mb-2">
              {t.about.title}
            </span>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500">
              {t.about.subtitle}
            </span>
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t.about.description}
          </p>
        </div>

        <div className="mt-16 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
            {t.about.ecosystem}
          </h2>
          <HoverEffect items={tools} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
