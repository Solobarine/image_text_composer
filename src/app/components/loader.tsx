"use client";

import { Loader2 } from "lucide-react";

const Loader = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-600">Loading canvas...</div>
    </div>
  );
};
export default Loader;

export const LoaderSnippet = ({
  message = "Loading Fonts...",
}: {
  message?: string;
}) => {
  return (
    <div className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 px-8 py-6 min-w-[280px]">
      {/* Gradient border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-sm -z-10" />

      <div className="flex items-center gap-4">
        {/* Enhanced spinner with gradient */}
        <div className="relative">
          <Loader2
            className="animate-spin text-blue-600 dark:text-blue-400"
            size={32}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-md opacity-30 animate-pulse" />
        </div>

        {/* Enhanced text with gradient */}
        <div className="flex flex-col">
          <p className="text-lg font-semibold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
            {message}
          </p>
          <div className="flex gap-1 mt-1">
            <div
              className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="w-1 h-1 bg-purple-500 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="w-1 h-1 bg-pink-500 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
