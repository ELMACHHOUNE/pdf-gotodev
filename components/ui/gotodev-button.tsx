"use client";
import Link from "next/link";
import Image from "next/image";

export const GoToDevButton = () => {
  return (
    <Link
      href="https://gotodev.ma"
      target="_blank"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group"
    >
      <Image
        src="/images/icon-for-dark.webp"
        alt="GoToDev"
        width={24}
        height={24}
        className="w-6 h-6 object-contain"
      />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap text-sm font-medium text-neutral-700 dark:text-neutral-200">
        Visit GoToDev.ma
      </span>
    </Link>
  );
};
