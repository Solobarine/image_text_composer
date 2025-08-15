"use client";

import type { Dispatch, RefObject, SetStateAction } from "react";
import type { CanvasState, TextLayer } from "../types";
import { ArrowDown, ArrowUp, Copy, Eye, EyeOff, Type, X } from "lucide-react";

const Sidebar = ({
  canvasState,
  textLayers,
  setTextLayers,
  saveToHistory,
  setSelectedLayerId,
  selectedLayerId,
  textRefs,
}: {
  canvasState: CanvasState;
  textLayers: TextLayer[];
  setTextLayers: Dispatch<SetStateAction<TextLayer[]>>;
  setSelectedLayerId: Dispatch<SetStateAction<string | null>>;
  saveToHistory: (action: string) => void;
  textRefs: RefObject<{ [key: string]: any }>;
  selectedLayerId: string | null;
}) => {
  return (
    <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Text Tools
          </h3>
          <button
            onClick={() => {
              const newLayer: TextLayer = {
                id: `text-${Date.now()}`,
                text: "Double click to edit",
                x: canvasState.canvasWidth / 2 - 100,
                y: canvasState.canvasHeight / 2 - 20,
                fontSize: 32,
                fontFamily: "Inter",
                fontWeight: "400",
                fill: "#000000",
                color: "#999999",
                opacity: 1,
                align: "center",
                width: 200,
                rotation: 0,
                visible: true,
                shadowColor: "#000000",
                shadowOpacity: 1,
                shadowBlur: 0,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowEnabled: true,
              };
              setTextLayers((prev) => [...prev, newLayer]);
              setSelectedLayerId(newLayer.id);
              saveToHistory("Add Text Layer");
            }}
            className="w-full px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Type size={18} />
            Add Text Layer
          </button>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Layers ({textLayers.length})
          </h3>
          {textLayers.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
              No layers yet
            </div>
          ) : (
            <div className="space-y-2">
              {textLayers.map((layer, index) => (
                <div
                  key={layer.id}
                  className={`p-3 rounded-lg border transition-colors ${
                    selectedLayerId === layer.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => setSelectedLayerId(layer.id)}
                    >
                      <span className="text-sm font-medium truncate block">
                        {layer.text.substring(0, 20)}...
                      </span>
                      <span className="text-xs text-gray-500">
                        {layer.fontFamily} • {layer.fontSize}px
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (index > 0) {
                            setTextLayers((prev) => {
                              const newLayers = [...prev];
                              [newLayers[index - 1], newLayers[index]] = [
                                newLayers[index],
                                newLayers[index - 1],
                              ];
                              return newLayers;
                            });
                            saveToHistory("Move Layer Up");
                          }
                        }}
                        className="p-1 text-gray-600 hover:text-gray-800 rounded transition-colors"
                        title="Move layer up"
                        disabled={index === 0}
                      >
                        <ArrowUp />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (index < textLayers.length - 1) {
                            setTextLayers((prev) => {
                              const newLayers = [...prev];
                              [newLayers[index + 1], newLayers[index]] = [
                                newLayers[index],
                                newLayers[index + 1],
                              ];
                              return newLayers;
                            });
                            saveToHistory("Move Layer Down");
                          }
                        }}
                        className="p-1 text-gray-600 hover:text-gray-800 rounded transition-colors"
                        title="Move layer down"
                        disabled={index === textLayers.length - 1}
                      >
                        <ArrowDown />
                      </button>

                      {/* Visibility toggle */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setTextLayers((prev) =>
                            prev.map((l) =>
                              l.id === layer.id
                                ? { ...l, visible: !l.visible }
                                : l,
                            ),
                          );
                          saveToHistory("Toggle Layer Visibility");
                        }}
                        className={`p-1 rounded transition-colors ${
                          layer.visible
                            ? "text-gray-600 hover:text-gray-800"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                        title={layer.visible ? "Hide layer" : "Show layer"}
                      >
                        {layer.visible ? (
                          <Eye size={14} />
                        ) : (
                          <EyeOff size={14} />
                        )}
                      </button>

                      {/* Duplicate */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const newLayer: TextLayer = {
                            ...layer,
                            id: `text-${Date.now()}`,
                            x: layer.x + 20,
                            y: layer.y + 20,
                          };
                          setTextLayers((prev) => [...prev, newLayer]);
                          setSelectedLayerId(newLayer.id);
                          saveToHistory("Duplicate Layer");
                        }}
                        className="p-1 text-gray-600 hover:text-gray-800 rounded transition-colors"
                        title="Duplicate layer"
                      >
                        <Copy size={14} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (
                            confirm(
                              "Are you sure you want to delete this layer?",
                            )
                          ) {
                            setTextLayers((prev) =>
                              prev.filter((l) => l.id !== layer.id),
                            );
                            if (selectedLayerId === layer.id) {
                              setSelectedLayerId(null);
                            }
                            delete textRefs.current[layer.id];
                            saveToHistory("Delete Layer");
                          }
                        }}
                        className="p-1 text-red-500 hover:text-red-700 rounded transition-colors"
                        title="Delete layer"
                      >
                        <X />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
