"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  FileCheck,
  ArrowDown,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { formatBytes } from "../utils/pdf-compression";

type CompressionStatus = "idle" | "compressing" | "success" | "error";

interface CompressionStats {
  originalSize: number;
  compressedSize: number;
}

export default function PdfCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<CompressionStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [compressedPdf, setCompressedPdf] = useState<Blob | null>(null);
  const [stats, setStats] = useState<CompressionStats | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      startCompression(selectedFile);
    } else {
      setErrorMessage("Please upload a valid PDF file.");
      setStatus("error");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
  });

  const startCompression = async (fileToCompress: File) => {
    setStatus("compressing");
    setProgress(0);
    setErrorMessage("");

    // Simulate progress for better UX since the actual operation might be too fast or blocking
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 5;
      });
    }, 100);

    try {
      // Give the UI a moment to show the starting state
      await new Promise((resolve) => setTimeout(resolve, 500));

      const worker = new Worker(
        new URL("../utils/pdf.worker.ts", import.meta.url)
      );

      worker.onmessage = (e) => {
        const { type, blob, error } = e.data;
        if (type === "success") {
          clearInterval(progressInterval);
          setProgress(100);

          // Small delay to show 100%
          setTimeout(() => {
            setCompressedPdf(blob);
            setStats({
              originalSize: fileToCompress.size,
              compressedSize: blob.size,
            });
            setStatus("success");
            worker.terminate();
          }, 500);
        } else if (type === "error") {
          console.error("Compression failed (worker response):", e.data);
          const errorMsg = error || "Unknown error occurred in worker";
          setErrorMessage("Failed to compress PDF. " + errorMsg);
          setStatus("error");
          clearInterval(progressInterval);
          worker.terminate();
        } else {
          // Ignore internal messages from pdfjs-dist or other libraries
          console.log("Ignored worker message:", e.data);
        }
      };

      worker.onerror = (error) => {
        console.error("Worker error:", error);
        setErrorMessage("An unexpected error occurred during compression.");
        setStatus("error");
        clearInterval(progressInterval);
        worker.terminate();
      };

      worker.postMessage(fileToCompress);
    } catch (error) {
      console.error("Compression failed:", error);
      setErrorMessage(
        "Failed to compress PDF. The file might be corrupted or password protected."
      );
      setStatus("error");
      clearInterval(progressInterval);
    }
  };

  const handleDownload = () => {
    if (compressedPdf && file) {
      const url = URL.createObjectURL(compressedPdf);
      const link = document.createElement("a");
      link.href = url;
      link.download = `compressed-${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const reset = () => {
    setFile(null);
    setStatus("idle");
    setProgress(0);
    setCompressedPdf(null);
    setStats(null);
    setErrorMessage("");
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden border border-slate-100">
      <div className="p-8">
        <AnimatePresence mode="wait">
          {status === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center"
            >
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-12 cursor-pointer transition-all duration-200 ease-in-out ${
                  isDragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 hover:border-blue-400 hover:bg-slate-50"
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="p-4 bg-blue-100 rounded-full text-blue-600">
                    <UploadCloud size={40} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-slate-900">
                      Drop your PDF here
                    </h3>
                    <p className="text-slate-500">or click to browse files</p>
                  </div>
                  <p className="text-xs text-slate-400 mt-4">
                    Maximum file size: 50MB • PDF only
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {status === "compressing" && (
            <motion.div
              key="compressing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-12"
            >
              <div className="mb-8 relative w-24 h-24 mx-auto">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-slate-100 stroke-current"
                    strokeWidth="8"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                  ></circle>
                  <circle
                    className="text-blue-600 progress-ring__circle stroke-current transition-all duration-300 ease-in-out"
                    strokeWidth="8"
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * progress) / 100}
                    transform="rotate(-90 50 50)"
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-700">
                  {Math.round(progress)}%
                </div>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Compressing PDF...
              </h3>
              <p className="text-slate-500">
                Stripping unused metadata and optimizing structure
              </p>
            </motion.div>
          )}

          {status === "success" && stats && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="flex flex-col items-center justify-center mb-8">
                <div className="p-4 bg-green-100 rounded-full text-green-600 mb-4">
                  <FileCheck size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Ready to Download!
                </h3>
                <p className="text-slate-500">
                  Your PDF has been successfully compressed.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8 bg-slate-50 p-6 rounded-lg border border-slate-100">
                <div className="text-center border-r border-slate-200">
                  <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-1">
                    Original
                  </p>
                  <p className="text-lg font-medium text-slate-900">
                    {formatBytes(stats.originalSize)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-1">
                    Compressed
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    {formatBytes(stats.compressedSize)}
                  </p>
                </div>
                <div className="col-span-2 pt-4 border-t border-slate-200 mt-2">
                  <p className="text-sm text-slate-600">
                    Saved{" "}
                    <span className="font-bold text-green-600">
                      {(
                        (1 - stats.compressedSize / stats.originalSize) *
                        100
                      ).toFixed(1)}
                      %
                    </span>{" "}
                    of file size
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleDownload}
                  size="lg"
                  className="w-full sm:w-auto gap-2"
                >
                  <ArrowDown size={18} />
                  Download PDF
                </Button>
                <Button
                  onClick={reset}
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto gap-2"
                >
                  <RefreshCw size={18} />
                  Compress Another
                </Button>
              </div>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="p-4 bg-red-100 rounded-full text-red-600 mb-4 inline-block">
                <AlertCircle size={40} />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Something went wrong
              </h3>
              <p className="text-red-500 mb-6">{errorMessage}</p>
              <Button onClick={reset} variant="outline">
                Try Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
