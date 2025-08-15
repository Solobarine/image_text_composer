export interface TextLayer {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  color: string;
  fill: string;
  opacity: number;
  align: "left" | "center" | "right";
  width?: number;
  height?: number;
  rotation: number;
  visible: boolean;
  shadowColor: string;
  shadowOpacity: number;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowEnabled: boolean;
}

export interface CanvasState {
  backgroundImage: any;
  canvasWidth: number;
  canvasHeight: number;
  scale: number;
}

export interface HistoryState {
  textLayers: TextLayer[];
  selectedLayerId: string | null;
  timestamp: number;
  action: string;
}

export interface AutosaveData {
  textLayers: TextLayer[];
  canvasState: CanvasState;
  draggedImageUrl: string | null;
  timestamp: number;
}

export interface EditingText {
  layerId: string;
  text: string;
  color: string;
  opacity: number;
  isOpen: boolean;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  shadowColor: string;
  shadowOpacity: number;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowEnabled: boolean;
}

export interface SnapGuide {
  vertical: number | null;
  horizontal: number | null;
  show: boolean;
}
