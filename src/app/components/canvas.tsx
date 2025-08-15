"use client";

import type {
  CanvasState,
  EditingText,
  HistoryState,
  SnapGuide,
  TextLayer,
} from "../types";
import {
  useEffect,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";

const Canvas = ({
  canvasState,
  setSelectedLayerId,
  textLayers,
  selectedLayerId,
  setEditingText,
  textRefs,
  snapGuides,
  setSnapGuides,
  isUndoRedoing,
  setTextLayers,
  setHistoryIndex,
  historyIndex,
  setHistory,
  stageRef,
  transformerRef,
}: {
  canvasState: CanvasState;
  setSelectedLayerId: Dispatch<SetStateAction<string | null>>;
  textLayers: TextLayer[];
  textRefs: RefObject<{ [key: string]: any }>;
  selectedLayerId: string | null;
  setEditingText: Dispatch<SetStateAction<EditingText>>;
  snapGuides: SnapGuide;
  setSnapGuides: Dispatch<SetStateAction<SnapGuide>>;
  setTextLayers: Dispatch<SetStateAction<TextLayer[]>>;
  historyIndex: number;
  setHistoryIndex: Dispatch<SetStateAction<number>>;
  isUndoRedoing: boolean;
  setHistory: Dispatch<SetStateAction<HistoryState[]>>;
  stageRef: RefObject<any>;
  transformerRef: RefObject<any>;
}) => {
  const {
    Layer,
    Stage,
    Image: KonvaImage,
    Text,
    Line,
    Transformer,
  } = require("react-konva");

  useEffect(() => {
    if (
      selectedLayerId &&
      transformerRef.current &&
      textRefs.current[selectedLayerId]
    ) {
      transformerRef.current.nodes([textRefs.current[selectedLayerId]]);
      transformerRef.current.getLayer()?.batchDraw();
    } else if (transformerRef.current) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedLayerId, textLayers]);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm relative">
        <Stage
          width={canvasState.canvasWidth}
          height={canvasState.canvasHeight}
          ref={stageRef}
          className="bg-white"
          onClick={(e: any) => {
            if (e.target === e.target.getStage()) {
              setSelectedLayerId(null);
            }
          }}
          onTap={(e: any) => {
            if (e.target === e.target.getStage()) {
              setSelectedLayerId(null);
            }
          }}
        >
          <Layer>
            {canvasState.backgroundImage && (
              <KonvaImage
                image={canvasState.backgroundImage}
                width={canvasState.canvasWidth}
                height={canvasState.canvasHeight}
              />
            )}

            {textLayers
              .filter((layer) => layer.visible)
              .map((layer) => (
                <Text
                  key={layer.id}
                  ref={(node) => {
                    if (node) {
                      textRefs.current[layer.id] = node;
                    }
                  }}
                  text={layer.text}
                  x={layer.x}
                  y={layer.y}
                  fontSize={layer.fontSize}
                  fontFamily={layer.fontFamily}
                  fontStyle={layer.fontWeight}
                  fill={layer.color}
                  opacity={layer.opacity}
                  align={layer.align}
                  width={undefined}
                  rotation={layer.rotation}
                  shadowColor={layer.shadowColor}
                  shadowOpacity={layer.shadowOpacity}
                  shadowBlur={layer.shadowBlur}
                  shadowOffsetX={layer.shadowOffsetX}
                  shadowOffsetY={layer.shadowOffsetY}
                  shadowEnabled={layer.shadowEnabled}
                  draggable
                  onClick={(e) => {
                    e.cancelBubble = true;
                    setSelectedLayerId(layer.id);
                  }}
                  onDragMove={(e) => {
                    const node = e.target;
                    const width = layer.width || 200;
                    const height = layer.fontSize * 1.2 || 50;

                    const centerX = canvasState.canvasWidth / 2;
                    const centerY = canvasState.canvasHeight / 2;
                    const snapThreshold = 10;

                    const elementCenterX = node.x() + width / 2;
                    const elementCenterY = node.y() + height / 2;

                    let snapX = node.x();
                    let snapY = node.y();
                    let showVertical: number | null = null;
                    let showHorizontal:number | null = null;

                    if (Math.abs(elementCenterX - centerX) < snapThreshold) {
                      snapX = centerX - width / 2;
                      showVertical = centerX;
                    }

                    if (Math.abs(elementCenterY - centerY) < snapThreshold) {
                      snapY = centerY - height / 2;
                      showHorizontal = centerY;
                    }

                    setSnapGuides({
                      vertical: showVertical,
                      horizontal: showHorizontal,
                      show: showVertical !== null || showHorizontal !== null,
                    });

                    node.x(snapX);
                    node.y(snapY);
                  }}
                  onDragEnd={(e) => {
                    const updates = {
                      x: e.target.x(),
                      y: e.target.y(),
                    };
                    setTextLayers((prev) =>
                      prev.map((l) =>
                        l.id === layer.id ? { ...l, ...updates } : l,
                      ),
                    );
                    setSnapGuides({
                      vertical: null,
                      horizontal: null,
                      show: false,
                    });

                    if (!isUndoRedoing) {
                      setTimeout(() => {
                        const newState = {
                          textLayers: textLayers.map((l) =>
                            l.id === layer.id ? { ...l, ...updates } : l,
                          ),
                          selectedLayerId,
                          timestamp: Date.now(),
                          action: "Move Layer",
                        };
                        setHistory((prev) => {
                          const newHistory = prev.slice(0, historyIndex + 1);
                          newHistory.push(newState);
                          return newHistory.length > 25
                            ? newHistory.slice(-25)
                            : newHistory;
                        });
                        setHistoryIndex((prev) => Math.min(prev + 1, 24));
                      }, 100);
                    }
                  }}
                  onDblClick={() => {
                    setEditingText({
                      layerId: layer.id,
                      text: layer.text,
                      fontSize: layer.fontSize,
                      fontWeight: layer.fontWeight,
                      fontFamily: layer.fontFamily,
                      opacity: layer.opacity,
                      color: layer.color,
                      shadowColor: layer.shadowColor,
                      shadowOpacity: layer.shadowOpacity,
                      shadowBlur: layer.shadowBlur,
                      shadowOffsetX: layer.shadowOffsetX,
                      shadowOffsetY: layer.shadowOffsetY,
                      shadowEnabled: layer.shadowEnabled,
                      isOpen: true,
                    });
                  }}
                  onTransformEnd={() => {
                    const layerIndex = textLayers.findIndex(
                      (l) => l.id == layer.id,
                    );

                    if (layerIndex >= 0) {
                      setTextLayers((prev) =>
                        prev.map((p) =>
                          p.id == layer.id
                            ? {
                                ...p,
                                rotation: transformerRef.current.rotation(),
                              }
                            : p,
                        ),
                      );
                    }
                  }}
                />
              ))}

            {snapGuides.show && (
              <>
                {snapGuides.vertical !== null && (
                  <Line
                    points={[
                      snapGuides.vertical,
                      0,
                      snapGuides.vertical,
                      canvasState.canvasHeight,
                    ]}
                    stroke="#3b82f6"
                    strokeWidth={1}
                    dash={[5, 5]}
                    opacity={0.8}
                  />
                )}
                {snapGuides.horizontal !== null && (
                  <Line
                    points={[
                      0,
                      snapGuides.horizontal,
                      canvasState.canvasWidth,
                      snapGuides.horizontal,
                    ]}
                    stroke="#3b82f6"
                    strokeWidth={1}
                    dash={[5, 5]}
                    opacity={0.8}
                  />
                )}
              </>
            )}

            <Transformer
              ref={transformerRef}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 20 || newBox.height < 10) {
                  return oldBox;
                }
                return newBox;
              }}
              enabledAnchors={[
                "top-left",
                "top-right",
                "bottom-left",
                "bottom-right",
                "middle-left",
                "middle-right",
              ]}
              rotateAnchorOffset={20}
              borderStroke="#3b82f6"
              borderStrokeWidth={2}
              anchorFill="#3b82f6"
              anchorStroke="#ffffff"
              anchorStrokeWidth={2}
              anchorSize={8}
              keepRatio={true}
              onTransformEnd={(e) => {
                const node = e.target;

                setTextLayers((prev) =>
                  prev.map((layer) =>
                    layer.id == selectedLayerId
                      ? {
                          ...layer,
                          fontSize: Math.round(node.scaleY() * layer.fontSize),
                        }
                      : layer,
                  ),
                );
              }}
            />
          </Layer>
        </Stage>

        {selectedLayerId && (
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            Use arrow keys to nudge • Hold Shift for larger steps
          </div>
        )}

        <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
          Auto-saved
        </div>
      </div>
    </div>
  );
};

export default Canvas;
