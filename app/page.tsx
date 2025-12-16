import PdfCompressor from "@/components/pdf-compressor";
import { ShieldCheck, Zap, Lock } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:16px_16px]">
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100 mb-4">
            <ShieldCheck size={16} />
            <span>100% Client-Side • No Server Uploads</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900">
            Secure, Local <br className="hidden md:block" />
            <span className="text-blue-600">PDF Compression</span>
          </h1>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Optimize your PDF files directly in your browser. Your documents
            never leave your device, ensuring maximum privacy and speed.
          </p>
        </div>

        <PdfCompressor />

        <div className="mt-24 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
              <Lock size={24} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Private & Secure
            </h3>
            <p className="text-slate-600">
              Files are processed locally on your device. We never see, store,
              or transmit your documents.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
              <Zap size={24} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Lightning Fast
            </h3>
            <p className="text-slate-600">
              No upload or download times. Compression happens instantly using
              your browser's power.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Quality Preserved
            </h3>
            <p className="text-slate-600">
              Smart optimization reduces file size while maintaining document
              readability and structure.
            </p>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-slate-500 text-sm">
        <p>
          © {new Date().getFullYear()} Secure PDF Compressor. Built with Next.js
          & pdf-lib.
        </p>
      </footer>
    </div>
  );
}
