"use client";
import React from "react";
import { Github, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              GoToDev
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Secure, client-side PDF compression tool. Your files never leave
              your device.
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
              Product
            </h4>
            <ul className="space-y-2 text-sm text-neutral-500 dark:text-neutral-400">
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  API
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-900 dark:text-white mb-4">
              Resources
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
              Legal
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
          <p>© {new Date().getFullYear()} GoToDev. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
