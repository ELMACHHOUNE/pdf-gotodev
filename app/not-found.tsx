"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n-context";

export default function NotFound() {
  const { t } = useI18n();
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const redirect = setTimeout(() => {
      router.push("/");
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [router]);

  return (
    <div className="h-screen w-full bg-neutral-950 relative flex flex-col items-center justify-center antialiased overflow-hidden">
      <div className="max-w-2xl mx-auto p-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-9xl font-bold bg-clip-text text-transparent bg-linear-to-b from-neutral-200 to-neutral-600 mb-8">
            404
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
            {t.not_found.title}
          </h2>
          <p className="text-neutral-400 text-lg mb-8 max-w-lg mx-auto">
            {t.not_found.description_start}{" "}
            <span className="text-blue-500 font-bold">{countdown}</span>{" "}
            {t.not_found.description_end}
          </p>

          <div className="flex justify-center gap-4">
            <Link href="/">
              <Button className="bg-white text-black hover:bg-neutral-200 transition-colors flex items-center gap-2">
                <Home size={18} />
                {t.not_found.button}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
      <BackgroundBeams />
    </div>
  );
}
