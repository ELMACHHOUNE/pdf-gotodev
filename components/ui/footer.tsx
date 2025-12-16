"use client";
import React from "react";
import {
  Github,
  Linkedin,
  Facebook,
  Instagram,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { useI18n } from "@/lib/i18n-context";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 relative z-20">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-4">
            <Image
              src="/images/icon-for-dark.webp"
              alt="GoToDev Logo"
              width={48}
              height={48}
              className="h-12 w-12 object-contain"
            />
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
              GoToDev
            </h3>
          </div>

          <p className="text-neutral-500 dark:text-neutral-400 max-w-md mb-8">
            {t.footer.description}
          </p>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-8">
            <Link
              href="https://toolkit-hub.gotodev.ma/"
              className="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              target="_blank"
            >
              Toolkit Hub
            </Link>
            <Link
              href="https://imgconvert.gotodev.ma/"
              className="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              target="_blank"
            >
              Image Converter
            </Link>
            <Link
              href="http://background.gotodev.ma/"
              className="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              target="_blank"
            >
              Background Remover
            </Link>
            <Link
              href="https://blurcss.gotodev.ma/"
              className="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              target="_blank"
            >
              BlurCSS
            </Link>
          </div>

          <div className="flex space-x-6 mb-8">
            <Link
              href="https://github.com/ELMACHHOUNE/pdf-gotodev"
              target="_blank"
              className="text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors transform hover:scale-110"
            >
              <Github size={24} />
            </Link>
            <Link
              href="https://www.linkedin.com/company/gotodev-ma/"
              target="_blank"
              className="text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors transform hover:scale-110"
            >
              <Linkedin size={24} />
            </Link>
            <Link
              href="https://www.instagram.com/gotodev.ma"
              target="_blank"
              className="text-neutral-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors transform hover:scale-110"
            >
              <Instagram size={24} />
            </Link>
            <Link
              href="https://www.facebook.com/gotodev.ma"
              target="_blank"
              className="text-neutral-400 hover:text-blue-800 dark:hover:text-blue-600 transition-colors transform hover:scale-110"
            >
              <Facebook size={24} />
            </Link>
            <Link
              href="https://wa.me/+212649455082"
              target="_blank"
              className="text-neutral-400 hover:text-green-600 dark:hover:text-green-400 transition-colors transform hover:scale-110"
            >
              <MessageCircle size={24} />
            </Link>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800 text-center text-sm text-neutral-500 dark:text-neutral-400">
          <p>
            © {new Date().getFullYear()} GoToDev. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
