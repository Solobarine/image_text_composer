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
    <div className="w-80 bg-gradient-to-b from-slate-50 to-white border-l border-slate-200/60 shadow-xl overflow-y-auto">
      <div className="p-6 space-y-8">
        {/* Text Tools Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
            <h3 className="text-lg font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Text Tools
            </h3>
          </div>

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
              }
              setTextLayers((prev) => [...prev, newLayer])
              setSelectedLayerId(newLayer.id)
              saveToHistory("Add Text Layer")
            }}
            className="group w-full px-5 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          >
            <Type size={20} className="group-hover:rotate-12 transition-transform duration-200" />
            Add Text Layer
          </button>
        </div>

        {/* Layers Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full"></div>
              <h3 className="text-lg font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Layers
              </h3>
            </div>
            <div className="px-3 py-1 bg-slate-100 text-slate-600 text-sm font-medium rounded-full">
              {textLayers.length}
            </div>
          </div>

          {textLayers.length === 0 ? (
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 text-center border border-slate-200/50">
              <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <Type size={20} className="text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium">No layers yet</p>
              <p className="text-slate-400 text-sm mt-1">Add your first text layer to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {textLayers.map((layer, index) => (
                <div
                  key={layer.id}
                  className={`group p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                    selectedLayerId === layer.id
                      ? "border-blue-300 bg-gradient-to-r from-blue-50 to-purple-50 shadow-md"
                      : "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 cursor-pointer min-w-0" onClick={() => setSelectedLayerId(layer.id)}>
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            selectedLayerId === layer.id
                              ? "bg-gradient-to-r from-blue-500 to-purple-600"
                              : "bg-slate-300"
                          }`}
                        ></div>
                        <span className="text-sm font-semibold text-slate-800 truncate">
                          {layer.text.substring(0, 20)}
                          {layer.text.length > 20 ? "..." : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 ml-4">
                        <span className="px-2 py-1 bg-slate-100 rounded-md font-medium">{layer.fontFamily}</span>
                        <span className="px-2 py-1 bg-slate-100 rounded-md font-medium">{layer.fontSize}px</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (index > 0) {
                            setTextLayers((prev) => {
                              const newLayers = [...prev]
                              ;[newLayers[index - 1], newLayers[index]] = [newLayers[index], newLayers[index - 1]]
                              return newLayers
                            })
                            saveToHistory("Move Layer Up")
                          }
                        }}
                        className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move layer up"
                        disabled={index === 0}
                      >
                        <ArrowUp size={14} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (index < textLayers.length - 1) {
                            setTextLayers((prev) => {
                              const newLayers = [...prev]
                              ;[newLayers[index + 1], newLayers[index]] = [newLayers[index], newLayers[index + 1]]
                              return newLayers
                            })
                            saveToHistory("Move Layer Down")
                          }
                        }}
                        className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move layer down"
                        disabled={index === textLayers.length - 1}
                      >
                        <ArrowDown size={14} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setTextLayers((prev) =>
                            prev.map((l) => (l.id === layer.id ? { ...l, visible: !l.visible } : l)),
                          )
                          saveToHistory("Toggle Layer Visibility")
                        }}
                        className={`p-2 rounded-lg transition-all duration-150 ${
                          layer.visible
                            ? "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                            : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                        }`}
                        title={layer.visible ? "Hide layer" : "Show layer"}
                      >
                        {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          const newLayer: TextLayer = {
                            ...layer,
                            id: `text-${Date.now()}`,
                            x: layer.x + 20,
                            y: layer.y + 20,
                          }
                          setTextLayers((prev) => [...prev, newLayer])
                          setSelectedLayerId(newLayer.id)
                          saveToHistory("Duplicate Layer")
                        }}
                        className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-150"
                        title="Duplicate layer"
                      >
                        <Copy size={14} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (confirm("Are you sure you want to delete this layer?")) {
                            setTextLayers((prev) => prev.filter((l) => l.id !== layer.id))
                            if (selectedLayerId === layer.id) {
                              setSelectedLayerId(null)
                            }
                            delete textRefs.current[layer.id]
                            saveToHistory("Delete Layer")
                          }
                        }}
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-150"
                        title="Delete layer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>  );
};

export default Sidebar;
