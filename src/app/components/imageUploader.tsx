"use client";

import { Upload } from "lucide-react";
import { useCallback, type DragEvent, type RefObject } from "react";

const ImageUploader = ({
  fileInputRef,
  handleDrop,
}: {
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleDrop: (event: DragEvent) => void;
}) => {
  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => fileInputRef.current?.click()}
      className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-gray-400 transition-colors cursor-pointer"
    >
      <Upload size={48} className="mb-4 text-gray-400" />
      <p className="text-lg font-medium mb-2">Drop your PNG image here</p>
      <p className="text-sm">or click to browse files</p>
    </div>
  );
};

export default ImageUploader;
