"use client";
import React from "react";
import { Github, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { useI18n } from "@/lib/i18n-context";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 relative z-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src="/images/icon-for-dark.webp"
                alt="GoToDev Logo"
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                GoToDev
              </h3>
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xs">
              {t.footer.description}
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-neutral-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Github size={20} />
              </Link>
              <Link
                href="#"
                className="text-neutral-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Twitter size={20} />
              </Link>
              <Link
                href="#"
                className="text-neutral-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Linkedin size={20} />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-900 dark:text-white mb-4">
              {t.footer.product}
            </h4>
            <ul className="space-y-2 text-sm text-neutral-500 dark:text-neutral-400">
              <li>
                <Link
                  href="https://toolkit-hub.gotodev.ma/"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                  target="_blank"
                >
                  Toolkit Hub
                </Link>
              </li>
              <li>
                <Link
                  href="https://imgconvert.gotodev.ma/"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                  target="_blank"
                >
                  Image Converter
                </Link>
              </li>
              <li>
                <Link
                  href="http://background.gotodev.ma/"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                  target="_blank"
                >
                  Background Remover
                </Link>
              </li>
              <li>
                <Link
                  href="https://blurcss.gotodev.ma/"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                  target="_blank"
                >
                  BlurCSS
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-900 dark:text-white mb-4">
              {t.footer.resources}
            </h4>
            <ul className="space-y-2 text-sm text-neutral-500 dark:text-neutral-400">
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Community
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-900 dark:text-white mb-4">
              {t.footer.legal}
            </h4>
            <ul className="space-y-2 text-sm text-neutral-500 dark:text-neutral-400">
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800 text-center text-sm text-neutral-500 dark:text-neutral-400">
          <p>
            © {new Date().getFullYear()} GoToDev. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
