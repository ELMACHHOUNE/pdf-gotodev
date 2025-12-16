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

export default function About() {
  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <HomeIcon className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "About",
      link: "/about",
      icon: <User className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Contact",
      link: "/contact",
      icon: (
        <MessageSquare className="h-4 w-4 text-neutral-500 dark:text-white" />
      ),
    },
  ];

  const tools = [
    {
      title: "Toolkit Hub",
      description:
        "A comprehensive collection of developer tools and utilities in one place.",
      link: "https://toolkit-hub.gotodev.ma/",
      icon: <Wrench size={28} />,
    },
    {
      title: "Image Converter",
      description:
        "Convert images between various formats quickly and efficiently.",
      link: "https://imgconvert.gotodev.ma/",
      icon: <ImageIcon size={28} />,
    },
    {
      title: "Background Remover",
      description: "Remove backgrounds from images automatically using AI.",
      link: "http://background.gotodev.ma/",
      icon: <Eraser size={28} />,
    },
    {
      title: "BlurCSS",
      description:
        "Generate beautiful CSS blur effects and glassmorphism styles.",
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
              About GoToDev
            </span>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500">
              Innovating for Developers
            </span>
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            GoToDev is a startup dedicated to building powerful, accessible
            solutions. With over 10+ tools and solutions, we empower developers
            and creators to build better and faster.
          </p>
        </div>

        <div className="mt-16 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
            Our Ecosystem
          </h2>
          <HoverEffect items={tools} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
