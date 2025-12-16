"use client";

import { useI18n } from "@/lib/i18n-context";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const { language, setLanguage } = useI18n();

  return (
    <div
      className={cn(
        "flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-full p-1",
        className
      )}
    >
      <button
        onClick={() => setLanguage("en")}
        className={cn(
          "px-3 py-1 rounded-full text-xs font-medium transition-all",
          language === "en"
            ? "bg-white dark:bg-neutral-600 text-neutral-900 dark:text-white shadow-sm"
            : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
        )}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage("fr")}
        className={cn(
          "px-3 py-1 rounded-full text-xs font-medium transition-all",
          language === "fr"
            ? "bg-white dark:bg-neutral-600 text-neutral-900 dark:text-white shadow-sm"
            : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
        )}
      >
        FR
      </button>
    </div>
  );
}
