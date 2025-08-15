"use client";

import type React from "react";
import dynamic from "next/dynamic";
import { useState, useRef, useEffect, useCallback } from "react";
import type {
  AutosaveData,
  CanvasState,
  EditingText,
  HistoryState,
  SnapGuide,
  TextLayer,
} from "./types";
import { Loader2 } from "lucide-react";
import loadGoogleFont from "./helper/loadFont";
import { LoaderSnippet } from "./components/loader";

const TextEditor = dynamic(() => import("./components/textEditor"), {
  ssr: false,
});
const ImageUploader = dynamic(() => import("./components/imageUploader"), {
  ssr: false,
});
const Loader = dynamic(() => import("./components/loader"), { ssr: false });
const Header = dynamic(() => import("./components/header"), { ssr: false });
const Sidebar = dynamic(() => import("./components/sidebar"), { ssr: false });
const Canvas = dynamic(() => import("./components/canvas"), { ssr: false });

const useIsClient = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return isClient;
};

export default function ImageTextComposer() {
  const isClient = useIsClient();

  const [canvasState, setCanvasState] = useState<CanvasState>({
    backgroundImage: null,
    canvasWidth: 800,
    canvasHeight: 600,
    scale: 1,
  });

  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [textLayers, setTextLayers] = useState<TextLayer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isUndoRedoing, setIsUndoRedoing] = useState(false);

  const [fonts, setFonts] = useState<string[]>([]);
  const [selectedFont, setSelectedFont] = useState("Inter");

  const [snapGuides, setSnapGuides] = useState<SnapGuide>({
    vertical: null,
    horizontal: null,
    show: false,
  });

  const [draggedImageUrl, setDraggedImageUrl] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<EditingText>({
    layerId: "",
    text: "",
    color: "",
    opacity: 1,
    isOpen: false,
    fontSize: 16,
    fontFamily: "Inter",
    fontWeight: "normal",
    shadowColor: "#000000",
    shadowOpacity: 1,
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowEnabled: false,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const stageRef = useRef<any>(null);
  const textRefs = useRef<{ [key: string]: any }>({});
  const transformerRef = useRef<any>(null);

  const saveToLocalStorage = useCallback(() => {
    const autosaveData: AutosaveData = {
      textLayers,
      canvasState,
      draggedImageUrl,
      timestamp: Date.now(),
    };
    localStorage.setItem(
      "image-text-composer-state",
      JSON.stringify(autosaveData),
    );
  }, [textLayers, canvasState, draggedImageUrl]);

  const loadFromLocalStorage = useCallback(() => {
    try {
      const saved = localStorage.getItem("image-text-composer-state");
      if (saved) {
        const autosaveData: AutosaveData = JSON.parse(saved);
        setTextLayers(autosaveData.textLayers);

        const img = new Image();
        img.src = autosaveData.draggedImageUrl as string;
        img.onload = () =>
          setCanvasState({ ...autosaveData.canvasState, backgroundImage: img });
        if (autosaveData.draggedImageUrl) {
          setDraggedImageUrl(autosaveData.draggedImageUrl);
        }
        // Load fonts
        autosaveData.textLayers.forEach((layer) => {
          loadGoogleFont(layer.fontFamily);
        });

        return true;
      }
    } catch (error) {
      console.error("Failed to load from localStorage:", error);
    }
    return false;
  }, []);

  const handleImageUpload = useCallback((file: File) => {
    if (file.type !== "image/png") {
      alert("Please upload a PNG image only");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxWidth = 1000;
        const maxHeight = 700;
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        setCanvasState((prev) => ({
          ...prev,
          backgroundImage: img,
          canvasWidth: width,
          canvasHeight: height,
          scale: 1,
        }));
        setDraggedImageUrl(e.target?.result as string);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleImageUpload(file);
    },
    [handleImageUpload],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleImageUpload(file);
    },
    [handleImageUpload],
  );

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setIsUndoRedoing(true);
      const prevState = history[historyIndex - 1];
      setTextLayers(prevState.textLayers);
      setSelectedLayerId(prevState.selectedLayerId);
      setHistoryIndex(historyIndex - 1);
      setTimeout(() => setIsUndoRedoing(false), 100);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setIsUndoRedoing(true);
      const nextState = history[historyIndex + 1];
      setTextLayers(nextState.textLayers);
      setSelectedLayerId(nextState.selectedLayerId);
      setHistoryIndex(historyIndex + 1);
      setTimeout(() => setIsUndoRedoing(false), 100);
    }
  }, [history, historyIndex]);

  const saveToHistory = useCallback(
    (action: string) => {
      if (isUndoRedoing) return;

      const newState: HistoryState = {
        textLayers: [...textLayers],
        selectedLayerId,
        timestamp: Date.now(),
        action,
      };

      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newState);

      if (newHistory.length > 25) {
        newHistory.shift();
      } else {
        setHistoryIndex((prev) => prev + 1);
      }

      setHistory(newHistory);
    },
    [textLayers, selectedLayerId, history, historyIndex, isUndoRedoing],
  );

  useEffect(() => {
    fetch("/api/fonts")
      .then((res) => res.json())
      .then((data) => {
        setFonts(data.fonts);
        setSelectedFont(data.fonts[0]); // pick first font as default
      })
      .catch((err) => console.error(err));
  }, []);

  // Load selected font
  useEffect(() => {
    console.log("Loading Selected Font");
    console.log(selectedFont);
    if (!selectedFont) return;
    setFontsLoaded(false);
    loadGoogleFont(selectedFont).then(() => setFontsLoaded(true));
  }, [selectedFont]);

  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (textLayers.length > 0 || canvasState.backgroundImage) {
        saveToLocalStorage();
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [textLayers, canvasState, draggedImageUrl, saveToLocalStorage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "y" || (e.key === "z" && e.shiftKey))
      ) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  if (!isClient) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {!fontsLoaded && (
      <LoaderSnippet /> 
      )}
      <Header
        fileInputRef={fileInputRef}
        stageRef={stageRef}
        transformerRef={transformerRef}
        textRefs={textRefs}
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        setSelectedLayerId={setSelectedLayerId}
        setHistory={setHistory}
        setHistoryIndex={setHistoryIndex}
        setDraggedImageUrl={setDraggedImageUrl}
        setTextLayers={setTextLayers}
        historyIndex={historyIndex}
        undo={undo}
        redo={redo}
      />
      <div className="flex-1 flex">
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full">
            {!canvasState.backgroundImage ? (
              <ImageUploader
                fileInputRef={fileInputRef}
                handleDrop={handleDrop}
              />
            ) : (
              <Canvas
                canvasState={canvasState}
                stageRef={stageRef}
                transformerRef={transformerRef}
                setHistory={setHistory}
                setTextLayers={setTextLayers}
                setHistoryIndex={setHistoryIndex}
                historyIndex={historyIndex}
                setSnapGuides={setSnapGuides}
                snapGuides={snapGuides}
                setEditingText={setEditingText}
                textRefs={textRefs}
                textLayers={textLayers}
                selectedLayerId={selectedLayerId}
                setSelectedLayerId={setSelectedLayerId}
                isUndoRedoing={isUndoRedoing}
              />
            )}
          </div>
        </div>
        <Sidebar
          canvasState={canvasState}
          setSelectedLayerId={setSelectedLayerId}
          textLayers={textLayers}
          setTextLayers={setTextLayers}
          saveToHistory={saveToHistory}
          textRefs={textRefs}
          selectedLayerId={selectedLayerId}
        />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png"
        onChange={handleFileSelect}
        className="hidden"
      />

      {editingText.isOpen && (
        <TextEditor
          editingText={editingText}
          setEditingText={setEditingText}
          loadedFonts={fonts}
          setSelectedFont={setSelectedFont}
          setTextLayers={setTextLayers}
          saveToHistory={saveToHistory}
        />
      )}
    </div>
  );
}
