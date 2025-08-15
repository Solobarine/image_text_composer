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
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h3 className="text-lg font-semibold mb-4">Edit Text</h3>

        {/* Text content */}
        <textarea
          value={editingText.text}
          onChange={(e) =>
            setEditingText((prev) => ({ ...prev, text: e.target.value }))
          }
          className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your text..."
          autoFocus
        />
        <div className="grid gap-1 grid-cols-4">
          <span className="grid gap-1">
            <label className="block mt-4 text-sm font-medium">
              Font Size (px)
            </label>
            <input
              type="number"
              value={editingText.fontSize || 2}
              onChange={(e) =>
                setEditingText((prev) => ({
                  ...prev,
                  fontSize: Number(e.target.value),
                }))
              }
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </span>

          <span className="grid gap-1">
            <label className="block mt-4 text-sm font-medium">
              Font Weight
            </label>
            <select
              value={editingText.fontWeight || "normal"}
              onChange={(e) =>
                setEditingText((prev) => ({
                  ...prev,
                  fontWeight: e.target.value,
                }))
              }
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="100">Thin</option>
              <option value="300">Light</option>
              <option value="400">Normal</option>
              <option value="500">Medium</option>
              <option value="700">Bold</option>
              <option value="900">Black</option>
            </select>
          </span>

          <span className="grid gap-1">
            <label className="block mt-4 text-sm font-medium">Text Color</label>
            <input
              type="color"
              value={editingText.color || "#000000"}
              onChange={(e) =>
                setEditingText((prev) => ({ ...prev, color: e.target.value }))
              }
              className="w-full h-10 p-1 border border-gray-300 rounded-lg"
            />
          </span>
          <span className="grid gap-1">
            <label className="block mt-4 text-sm font-medium">Opacity</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={editingText.opacity ?? 1}
              onChange={(e) =>
                setEditingText((prev) => ({
                  ...prev,
                  opacity: parseFloat(e.target.value),
                }))
              }
              className="w-full"
            />
          </span>
        </div>

        {/* Text Shadow */}
        <span className="grid gap-1">
          <label className="block mt-4 text-sm font-medium">Text Shadow</label>
          <span className="grid gap-1 grid-cols-3">
            <span className="grid gap-1">
              <label htmlFor="shadowColor">Color</label>
              <input
                type="color"
                value={editingText.shadowColor}
                className="w-full p-2 border border-gray-300 rounded-lg"
                onChange={(e) =>
                  setEditingText((prev) => ({
                    ...prev,
                    shadowColor: e.target.value,
                  }))
                }
              />
            </span>
            <span className="grid gap-1">
              <label htmlFor="shadowOpacity">Opacity</label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={editingText.shadowOpacity}
                className="w-full p-2 border border-gray-300 rounded-lg"
                onChange={(e) =>
                  setEditingText((prev) => ({
                    ...prev,
                    shadowOpacity: parseFloat(e.target.value),
                  }))
                }
              />
            </span>
            <span className="grid gap-1">
              <label htmlFor="shadowBlur">Blur</label>
              <input
                type="number"
                min={0}
                value={editingText.shadowBlur}
                className="w-full p-2 border border-gray-300 rounded-lg"
                onChange={(e) =>
                  setEditingText((prev) => ({
                    ...prev,
                    shadowBlur: Number(e.target.value),
                  }))
                }
              />
            </span>
          </span>
          <span className="grid gap-1 grid-cols-4">
            <span>
              <label htmlFor="shadowOffsetX">ShadowOffsetX</label>
              <input
                type="number"
                min={0}
                value={editingText.shadowOffsetX}
                className="w-full p-2 border border-gray-300 rounded-lg"
                onChange={(e) =>
                  setEditingText((prev) => ({
                    ...prev,
                    shadowOffsetX: Number(e.target.value),
                  }))
                }
              />
            </span>
            <span>
              <label htmlFor="shadowOffsetY">ShadowOffsetY</label>
              <input
                type="number"
                min={0}
                value={editingText.shadowOffsetY}
                className="w-full p-2 border border-gray-300 rounded-lg"
                onChange={(e) =>
                  setEditingText((prev) => ({
                    ...prev,
                    shadowOffsetY: Number(e.target.value),
                  }))
                }
              />
            </span>
            <span>
              <label htmlFor="shadowOffsetY">Enable Shadows</label>
              <input
                type="checkbox"
                checked={editingText.shadowEnabled}
                className="w-full p-2 border border-gray-300 rounded-lg"
                onChange={(e) =>
                  setEditingText((prev) => ({
                    ...prev,
                    shadowEnabled: e.target.checked,
                  }))
                }
              />
            </span>
            <span>
              <label htmlFor="shadowOffsetY">Font Family</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg"
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
            </span>
          </span>
        </span>

        {/* Buttons */}
        <div className="flex gap-2 mt-6">
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
              );
              saveToHistory("Edit Text");
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
              });
	setSelectedFont(editingText.fontFamily)
            }}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save
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
            className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
