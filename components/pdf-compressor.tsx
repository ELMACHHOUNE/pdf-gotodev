"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  FileCheck,
  AlertCircle,
  FileText,
  X,
  Download,
  Archive,
  Loader2,
  ArrowDown,
} from "lucide-react";
import { Button } from "./ui/button";
import { formatBytes } from "../utils/pdf-compression";
import JSZip from "jszip";
import { useI18n } from "@/lib/i18n-context";

type CompressionStatus = "queued" | "processing" | "success" | "error";

interface FileItem {
  id: string;
  file: File;
  status: CompressionStatus;
  progress: number;
  compressedBlob?: Blob;
  originalSize: number;
  compressedSize?: number;
  error?: string;
}

export default function PdfCompressor() {
  const { t } = useI18n();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isZipping, setIsZipping] = useState(false);

  // Concurrency limit
  const MAX_CONCURRENT = 3;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles
      .filter((file) => file.type === "application/pdf")
      .map((file) => ({
        id: Math.random().toString(36).substring(7),
        file,
        status: "queued" as CompressionStatus,
        progress: 0,
        originalSize: file.size,
      }));

    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: true,
  });

  // Queue Processor
  useEffect(() => {
    const processingCount = files.filter(
      (f) => f.status === "processing"
    ).length;
    const queuedFiles = files.filter((f) => f.status === "queued");

    if (processingCount < MAX_CONCURRENT && queuedFiles.length > 0) {
      const nextFile = queuedFiles[0];
      processFile(nextFile);
    }
  }, [files]);

  const processFile = async (item: FileItem) => {
    // Update status to processing
    setFiles((prev) =>
      prev.map((f) =>
        f.id === item.id ? { ...f, status: "processing", progress: 5 } : f
      )
    );

    const worker = new Worker(
      new URL("../utils/pdf.worker.ts", import.meta.url)
    );

    // Progress simulation
    const progressInterval = setInterval(() => {
      setFiles((prev) =>
        prev.map((f) => {
          if (
            f.id === item.id &&
            f.status === "processing" &&
            f.progress < 90
          ) {
            return { ...f, progress: f.progress + 5 };
          }
          return f;
        })
      );
    }, 200);

    worker.onmessage = (e) => {
      const { type, blob, error } = e.data;
      if (type === "success") {
        clearInterval(progressInterval);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === item.id
              ? {
                  ...f,
                  status: "success",
                  progress: 100,
                  compressedBlob: blob,
                  compressedSize: blob.size,
                }
              : f
          )
        );
        worker.terminate();
      } else if (type === "error") {
        clearInterval(progressInterval);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === item.id
              ? {
                  ...f,
                  status: "error",
                  error: error || "Compression failed",
                }
              : f
          )
        );
        worker.terminate();
      }
    };

    worker.onerror = () => {
      clearInterval(progressInterval);
      setFiles((prev) =>
        prev.map((f) =>
          f.id === item.id
            ? {
                ...f,
                status: "error",
                error: "Worker error",
              }
            : f
        )
      );
      worker.terminate();
    };

    worker.postMessage(item.file);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const downloadFile = (item: FileItem) => {
    if (item.compressedBlob) {
      const url = URL.createObjectURL(item.compressedBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `compressed-${item.file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const downloadAllZip = async () => {
    setIsZipping(true);
    const zip = new JSZip();
    const completedFiles = files.filter(
      (f) => f.status === "success" && f.compressedBlob
    );

    completedFiles.forEach((f) => {
      if (f.compressedBlob) {
        zip.file(`compressed-${f.file.name}`, f.compressedBlob);
      }
    });

    try {
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.download = "compressed-pdfs.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to zip", err);
    } finally {
      setIsZipping(false);
    }
  };

  const clearAll = () => {
    setFiles([]);
    setIsZipping(false);
  };

  const activeFiles = files.filter(
    (f) => f.status === "queued" || f.status === "processing"
  );
  const completedFiles = files.filter(
    (f) => f.status === "success" || f.status === "error"
  );

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Upload Section */}
      <div className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl rounded-3xl shadow-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden transition-all hover:shadow-2xl">
        <div
          {...getRootProps()}
          className={`p-16 text-center cursor-pointer transition-all duration-300 ease-in-out ${
            isDragActive
              ? "bg-blue-500/10 border-2 border-blue-500 border-dashed"
              : "hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 border-2 border-transparent hover:border-neutral-300 dark:hover:border-neutral-700 border-dashed"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-6">
            <div
              className={`p-6 rounded-2xl transition-colors duration-300 ${
                isDragActive
                  ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500"
              }`}
            >
              <UploadCloud size={48} strokeWidth={1.5} />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
                {isDragActive
                  ? t.compressor.drop_active
                  : t.compressor.drop_inactive}
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-lg max-w-md mx-auto">
                {t.compressor.drop_desc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Queue */}
      <AnimatePresence>
        {activeFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl rounded-3xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400">
                  <Loader2 className="animate-spin" size={24} />
                </div>
                {t.compressor.processing_queue}
                <span className="text-sm font-normal text-neutral-500 dark:text-neutral-400 ml-2 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full">
                  {activeFiles.length} {t.compressor.remaining}
                </span>
              </h2>
            </div>

            <div className="space-y-4">
              {activeFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 bg-neutral-50/50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700"
                >
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className="p-2 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm text-neutral-400 shrink-0">
                      <FileText size={24} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate max-w-50 sm:max-w-md">
                        {file.file.name}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                        {formatBytes(file.originalSize)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    {file.status === "processing" && (
                      <div className="w-32 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300 ease-out"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    )}
                    {file.status === "queued" && (
                      <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 bg-neutral-200/50 dark:bg-neutral-700/50 px-3 py-1 rounded-full">
                        {t.compressor.queued}
                      </span>
                    )}
                    <button
                      onClick={() => removeFile(file.id)}
                      className="text-neutral-400 hover:text-red-500 transition-colors p-1 hover:bg-red-500/10 rounded-lg"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completed Section */}
      <AnimatePresence>
        {completedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl rounded-3xl shadow-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
          >
            <div className="p-6 md:p-8 bg-neutral-50/50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg text-green-600 dark:text-green-400">
                    <FileCheck size={24} />
                  </div>
                  {t.compressor.completed_files}
                  <span className="text-sm font-normal text-neutral-500 dark:text-neutral-400 ml-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 px-2 py-0.5 rounded-full">
                    {
                      completedFiles.filter((f) => f.status === "success")
                        .length
                    }{" "}
                    {t.compressor.done}
                  </span>
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 font-medium ml-14">
                  {t.compressor.total_saved}{" "}
                  <span className="text-green-600 dark:text-green-400">
                    {formatBytes(
                      completedFiles.reduce(
                        (acc, f) =>
                          acc +
                          (f.originalSize -
                            (f.compressedSize || f.originalSize)),
                        0
                      )
                    )}
                  </span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 ml-0 md:ml-0">
                <Button
                  onClick={clearAll}
                  variant="outline"
                  className="border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 w-full sm:w-auto"
                >
                  {t.compressor.clear_all}
                </Button>

                {completedFiles.some((f) => f.status === "success") && (
                  <Button
                    onClick={downloadAllZip}
                    disabled={isZipping}
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all w-full sm:w-auto"
                  >
                    {isZipping ? (
                      <Loader2 className="animate-spin mr-2" size={18} />
                    ) : (
                      <Archive className="mr-2" size={18} />
                    )}
                    {t.compressor.download_all}
                  </Button>
                )}
              </div>
            </div>

            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {completedFiles.map((file) => (
                <div
                  key={file.id}
                  className="p-4 md:p-6 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={`p-3 rounded-xl shrink-0 ${
                        file.status === "error"
                          ? "bg-red-500/10 text-red-500"
                          : "bg-green-500/10 text-green-600 dark:text-green-400"
                      }`}
                    >
                      {file.status === "error" ? (
                        <AlertCircle size={24} />
                      ) : (
                        <FileCheck size={24} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                        {file.file.name}
                      </p>
                      {file.status === "success" ? (
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs mt-1">
                          <span className="text-neutral-400 line-through">
                            {formatBytes(file.originalSize)}
                          </span>
                          <ArrowDown
                            size={12}
                            className="text-neutral-300 dark:text-neutral-600"
                          />
                          <span className="text-green-600 dark:text-green-400 font-bold">
                            {formatBytes(file.compressedSize || 0)}
                          </span>
                          <span className="text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            -
                            {Math.round(
                              (1 -
                                (file.compressedSize || 0) /
                                  file.originalSize) *
                                100
                            )}
                            %
                          </span>
                        </div>
                      ) : (
                        <p className="text-xs text-red-500 font-medium mt-1">
                          {file.error}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 justify-end sm:justify-start w-full sm:w-auto opacity-100">
                    {file.status === "success" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadFile(file)}
                        className="text-neutral-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        <Download size={20} />
                      </Button>
                    )}
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-2 text-neutral-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/10"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
