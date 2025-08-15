"use client";

import type { Dispatch, SetStateAction } from "react";
import type { EditingText, TextLayer } from "../types";

const TextEditor = ({
  editingText,
  setEditingText,
  loadedFonts,
  setSelectedFont,
  saveToHistory,
  setTextLayers,
}: {
  editingText: EditingText;
  setEditingText: Dispatch<SetStateAction<EditingText>>;
  loadedFonts: string[];
  setSelectedFont: Dispatch<SetStateAction<string>>;
  saveToHistory: (action: string) => void;
  setTextLayers: Dispatch<SetStateAction<TextLayer[]>>;
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
            <h3 className="text-2xl font-bold text-gray-900">Edit Text</h3>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Text Content</label>
            <textarea
              value={editingText.text}
              onChange={(e) => setEditingText((prev) => ({ ...prev, text: e.target.value }))}
              className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 text-gray-900 placeholder-gray-400"
              placeholder="Enter your text..."
              autoFocus
            />
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Typography Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-gradient-to-b from-green-500 to-teal-600 rounded-full"></div>
                <h4 className="text-lg font-bold text-gray-900">Typography</h4>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Font Size (px)</label>
                  <input
                    type="number"
                    value={editingText.fontSize || 2}
                    onChange={(e) =>
                      setEditingText((prev) => ({
                        ...prev,
                        fontSize: Number(e.target.value),
                      }))
                    }
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Font Weight</label>
                  <select
                    value={editingText.fontWeight || "normal"}
                    onChange={(e) =>
                      setEditingText((prev) => ({
                        ...prev,
                        fontWeight: e.target.value,
                      }))
                    }
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 bg-white"
                  >
                    <option value="100">Thin</option>
                    <option value="300">Light</option>
                    <option value="400">Normal</option>
                    <option value="500">Medium</option>
                    <option value="700">Bold</option>
                    <option value="900">Black</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Font Family</label>
                <select
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 bg-white"
                  value={editingText.fontFamily}
                  onChange={(e) =>
                    setEditingText((prev) => ({
                      ...prev,
                      fontFamily: e.target.value,
                    }))
                  }
                >
                  {loadedFonts.map((font, index) => (
                    <option key={index} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Appearance Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
                <h4 className="text-lg font-bold text-gray-900">Appearance</h4>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Text Color</label>
                  <div className="relative">
                    <input
                      type="color"
                      value={editingText.color || "#000000"}
                      onChange={(e) => setEditingText((prev) => ({ ...prev, color: e.target.value }))}
                      className="w-full h-12 border-2 border-gray-200 rounded-lg cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Opacity ({Math.round((editingText.opacity ?? 1) * 100)}%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={editingText.opacity ?? 1}
                    onChange={(e) =>
                      setEditingText((prev) => ({
                        ...prev,
                        opacity: Number.parseFloat(e.target.value),
                      }))
                    }
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-5 bg-gradient-to-b from-orange-500 to-red-600 rounded-full"></div>
              <h4 className="text-lg font-bold text-gray-900">Text Shadow</h4>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Shadow Color</label>
                <input
                  type="color"
                  value={editingText.shadowColor}
                  className="w-full h-12 border-2 border-gray-200 rounded-lg cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                  onChange={(e) =>
                    setEditingText((prev) => ({
                      ...prev,
                      shadowColor: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Shadow Opacity ({Math.round(editingText.shadowOpacity * 100)}%)
                </label>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={editingText.shadowOpacity}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  onChange={(e) =>
                    setEditingText((prev) => ({
                      ...prev,
                      shadowOpacity: Number.parseFloat(e.target.value),
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Blur Radius</label>
                <input
                  type="number"
                  min={0}
                  value={editingText.shadowBlur}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                  onChange={(e) =>
                    setEditingText((prev) => ({
                      ...prev,
                      shadowBlur: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Offset X</label>
                <input
                  type="number"
                  value={editingText.shadowOffsetX}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                  onChange={(e) =>
                    setEditingText((prev) => ({
                      ...prev,
                      shadowOffsetX: Number(e.target.value),
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Offset Y</label>
                <input
                  type="number"
                  value={editingText.shadowOffsetY}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                  onChange={(e) =>
                    setEditingText((prev) => ({
                      ...prev,
                      shadowOffsetY: Number(e.target.value),
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Enable Shadow</label>
                <div className="flex items-center h-12">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingText.shadowEnabled}
                      className="sr-only peer"
                      onChange={(e) =>
                        setEditingText((prev) => ({
                          ...prev,
                          shadowEnabled: e.target.checked,
                        }))
                      }
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-gray-100">
            <button
              onClick={() => {
                setTextLayers((prev) =>
                  prev.map((l) =>
                    l.id === editingText.layerId
                      ? {
                          ...l,
                          text: editingText.text,
                          fontSize: editingText.fontSize,
                          fontWeight: editingText.fontWeight,
                          fontFamily: editingText.fontFamily,
                          color: editingText.color,
                          opacity: editingText.opacity,
                          shadowColor: editingText.shadowColor,
                          shadowOpacity: editingText.shadowOpacity,
                          shadowBlur: editingText.shadowBlur,
                          shadowOffsetX: editingText.shadowOffsetX,
                          shadowOffsetY: editingText.shadowOffsetY,
                          shadowEnabled: editingText.shadowEnabled,
                        }
                      : l,
                  ),
                )
                saveToHistory("Edit Text")
                setEditingText({
                  layerId: "",
                  text: "",
                  isOpen: false,
                  color: "",
                  opacity: 1,
                  fontSize: 16,
                  fontWeight: "normal",
                  shadowColor: "#000000",
                  shadowOpacity: 1,
                  shadowBlur: 0,
                  shadowOffsetX: 0,
                  shadowOffsetY: 0,
                  shadowEnabled: false,
                  fontFamily: "Inter",
                })
                setSelectedFont(editingText.fontFamily)
              }}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Save Changes
            </button>
            <button
              onClick={() =>
                setEditingText({
                  layerId: "",
                  text: "",
                  isOpen: false,
                  color: "",
                  opacity: 1,
                  fontSize: 16,
                  fontWeight: "normal",
                  shadowColor: "#000000",
                  shadowOpacity: 1,
                  shadowBlur: 0,
                  shadowOffsetX: 0,
                  shadowOffsetY: 0,
                  shadowEnabled: false,
                  fontFamily: "Inter",
                })
              }
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-500/20 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>  );
};

export default TextEditor;
