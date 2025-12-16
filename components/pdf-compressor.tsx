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
} from "lucide-react";
import { Button } from "./ui/button";
import { formatBytes } from "../utils/pdf-compression";
import JSZip from "jszip";

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

  const activeFiles = files.filter(
    (f) => f.status === "queued" || f.status === "processing"
  );
  const completedFiles = files.filter(
    (f) => f.status === "success" || f.status === "error"
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Upload Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div
          {...getRootProps()}
          className={`p-12 text-center cursor-pointer transition-all duration-200 ease-in-out ${
            isDragActive
              ? "bg-blue-50 border-2 border-blue-500 border-dashed"
              : "hover:bg-slate-50 border-2 border-transparent hover:border-slate-200 border-dashed"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 bg-blue-100 rounded-full text-blue-600">
              <UploadCloud size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-slate-900">
                {isDragActive ? "Drop files here" : "Drop your PDFs here"}
              </h3>
              <p className="text-slate-500">
                Upload up to 100 files. We'll compress them in the browser.
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
            className="bg-white rounded-xl shadow-sm border border-slate-100 p-6"
          >
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Loader2 className="animate-spin text-blue-500" size={20} />
              Processing Queue ({activeFiles.length})
            </h2>
            <div className="space-y-3">
              {activeFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText className="text-slate-400 shrink-0" size={20} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate max-w-50 sm:max-w-xs">
                        {file.file.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatBytes(file.originalSize)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {file.status === "processing" && (
                      <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    )}
                    {file.status === "queued" && (
                      <span className="text-xs font-medium text-slate-400 bg-slate-200 px-2 py-1 rounded">
                        Queued
                      </span>
                    )}
                    <button
                      onClick={() => removeFile(file.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <X size={18} />
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
            className="bg-white rounded-xl shadow-lg border border-green-100 overflow-hidden"
          >
            <div className="p-6 bg-green-50/50 border-b border-green-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-green-900 flex items-center gap-2">
                  <FileCheck className="text-green-600" size={20} />
                  Completed Files (
                  {completedFiles.filter((f) => f.status === "success").length})
                </h2>
                <p className="text-sm text-green-700 mt-1">
                  Total saved:{" "}
                  {formatBytes(
                    completedFiles.reduce(
                      (acc, f) =>
                        acc +
                        (f.originalSize - (f.compressedSize || f.originalSize)),
                      0
                    )
                  )}
                </p>
              </div>
              {completedFiles.some((f) => f.status === "success") && (
                <Button
                  onClick={downloadAllZip}
                  disabled={isZipping}
                  className="bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all"
                >
                  {isZipping ? (
                    <Loader2 className="animate-spin mr-2" size={18} />
                  ) : (
                    <Archive className="mr-2" size={18} />
                  )}
                  Download All as ZIP
                </Button>
              )}
            </div>

            <div className="divide-y divide-slate-100">
              {completedFiles.map((file) => (
                <div
                  key={file.id}
                  className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={`p-2 rounded-lg ${
                        file.status === "error"
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {file.status === "error" ? (
                        <AlertCircle size={20} />
                      ) : (
                        <FileCheck size={20} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {file.file.name}
                      </p>
                      {file.status === "success" ? (
                        <div className="flex items-center gap-2 text-xs mt-0.5">
                          <span className="text-slate-500 line-through">
                            {formatBytes(file.originalSize)}
                          </span>
                          <span className="text-green-600 font-medium">
                            {formatBytes(file.compressedSize || 0)}
                          </span>
                          <span className="text-green-600 bg-green-100 px-1.5 py-0.5 rounded text-[10px]">
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
                        <p className="text-xs text-red-500">{file.error}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {file.status === "success" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadFile(file)}
                        className="text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                      >
                        <Download size={18} />
                      </Button>
                    )}
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                    >
                      <X size={18} />
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
