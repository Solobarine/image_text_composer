"use client";

import { Download, Redo, RotateCcw, Undo, Upload } from "lucide-react";
import {
  useCallback,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";
import type { CanvasState, HistoryState, TextLayer } from "../types";

const Header = ({
  fileInputRef,
  stageRef,
  transformerRef,
  textRefs,
  canvasState,
  setCanvasState,
  setDraggedImageUrl,
  setSelectedLayerId,
  historyIndex,
  setHistoryIndex,
  setHistory,
  setTextLayers,
  undo,
  redo,
}: {
  fileInputRef: RefObject<HTMLInputElement | null>;
  stageRef: RefObject<any>;
  transformerRef: RefObject<any>;
  textRefs: RefObject<{ [key: string]: any }>;
  canvasState: CanvasState;
  setCanvasState: Dispatch<SetStateAction<CanvasState>>;
  setDraggedImageUrl: Dispatch<SetStateAction<string | null>>;
  setSelectedLayerId: Dispatch<SetStateAction<string | null>>;
  historyIndex: number;
  setHistoryIndex: Dispatch<SetStateAction<number>>;
  setHistory: Dispatch<SetStateAction<HistoryState[]>>;
  setTextLayers: Dispatch<SetStateAction<TextLayer[]>>;
  undo: () => void;
  redo: () => void;
}) => {
  const exportToPNG = useCallback(() => {
    if (!stageRef.current || !canvasState.backgroundImage) {
      alert("Please upload an image first");
      return;
    }

    try {
      const stage = stageRef.current;

      // Store current transformer state
      const wasTransformerVisible = transformerRef.current?.visible();
      const currentNodes = transformerRef.current?.nodes() || [];

      // Hide transformer and clear its nodes
      if (transformerRef.current) {
        transformerRef.current.visible(false);
        transformerRef.current.nodes([]);
      }

      // Force redraw without transformer
      stage.batchDraw();

      // Get the original image dimensions
      const originalImage = canvasState.backgroundImage;
      const originalWidth = originalImage.naturalWidth || originalImage.width;
      const originalHeight =
        originalImage.naturalHeight || originalImage.height;

      // Calculate scale factors
      const scaleX = originalWidth / canvasState.canvasWidth;
      const scaleY = originalHeight / canvasState.canvasHeight;

      const originalScale = stage.scaleX();

      stage.scale({ x: scaleX, y: scaleY });
      stage.size({ width: originalWidth, height: originalHeight });

      // Export the clean stage
      const dataURL = stage.toDataURL({
        mimeType: "image/png",
        quality: 1,
        pixelRatio: 1,
      });

      // Restore original stage size and scale
      stage.scale({ x: originalScale, y: originalScale });
      stage.size({
        width: canvasState.canvasWidth,
        height: canvasState.canvasHeight,
      });

      // Restore transformer state
      if (transformerRef.current) {
        transformerRef.current.visible(wasTransformerVisible);
        transformerRef.current.nodes(currentNodes);
      }

      // Redraw with transformer restored
      stage.batchDraw();

      // Download the image
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = `image-text-composition-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    }
  }, [canvasState]);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Image Text Composer
        </h1>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload size={18} />
            Upload PNG
          </button>

          <button
            onClick={() => {
              setCanvasState({
                backgroundImage: null,
                canvasWidth: 800,
                canvasHeight: 600,
                scale: 1,
              });
              setDraggedImageUrl(null);
              setTextLayers([]);
              setSelectedLayerId(null);
              setHistory([]);
              setHistoryIndex(-1);
              textRefs.current = {};
              localStorage.removeItem("image-text-composer-state");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RotateCcw size={18} />
            Reset
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className={`p-2 rounded-lg transition-colors ${
                historyIndex > 0
                  ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  : "text-gray-300 cursor-not-allowed"
              }`}
              title={`Undo${historyIndex > 0 ? ` (${historyIndex} steps)` : ""}`}
            >
              <Undo size={18} />
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className={`p-2 rounded-lg transition-colors ${
                historyIndex < history.length - 1
                  ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  : "text-gray-300 cursor-not-allowed"
              }`}
              title={`Redo${historyIndex < history.length - 1 ? ` (${history.length - historyIndex - 1} steps)` : ""}`}
            >
              <Redo size={18} />
            </button>
          </div>

          <button
            onClick={exportToPNG}
            disabled={!canvasState.backgroundImage}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              canvasState.backgroundImage
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            title={
              canvasState.backgroundImage
                ? "Export as PNG"
                : "Upload an image first"
            }
          >
            <Download size={18} />
            Export PNG
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
