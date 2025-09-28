/** @jsxImportSource preact */

import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";

interface Player {
  id: number;
  operator: string | null;
  color: string;
  name: string;
}

interface DrawingStroke {
  playerId: number;
  color: string;
  tool: string;
  points: { x: number; y: number }[];
  layer: number;
}

interface UtilityMarker {
  playerId: number;
  color: string;
  x: number;
  y: number;
  layer: number;
}

interface StratPlannerProps {
  map: string;
  layers: string[];
  side: string;
  onLayerChange: (index: number) => void;
  currentLayerIndex: number;
  selectedPlayer: number | null;
  _players: Player[];
}

export default function StratPlanner(props: StratPlannerProps) {
  const {
    map,
    layers,
    side,
    onLayerChange,
    currentLayerIndex,
    selectedPlayer,
    _players,
  } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const drawingMode = useSignal("route");
  const currentDrawingColor = useSignal("#ffffff");
  const isDrawing = useSignal(false);
  const currentStroke = useSignal<{ x: number; y: number }[]>([]);

  // Store all drawings persistently
  const allStrokes = useSignal<DrawingStroke[]>([]);
  const allUtilities = useSignal<UtilityMarker[]>([]);

  const currentLayer = layers[currentLayerIndex];

  // Redraw all content when anything changes
  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all strokes for current layer
    allStrokes.value
      .filter((stroke) => stroke.layer === currentLayerIndex)
      .forEach((stroke) => {
        if (stroke.points.length < 2) return;

        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // Set opacity based on whether this player is selected
        const opacity = selectedPlayer === stroke.playerId ? 1.0 : 0.3;
        ctx.strokeStyle = stroke.color +
          Math.round(opacity * 255).toString(16).padStart(2, "0");

        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        for (let i = 1; i < stroke.points.length; i++) {
          ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
        }
        ctx.stroke();
      });

    // Draw all utility markers for current layer
    allUtilities.value
      .filter((utility) => utility.layer === currentLayerIndex)
      .forEach((utility) => {
        const opacity = selectedPlayer === utility.playerId ? 1.0 : 0.3;

        // Draw circle background
        ctx.beginPath();
        ctx.arc(utility.x, utility.y, 12, 0, 2 * Math.PI);
        ctx.fillStyle = utility.color +
          Math.round(opacity * 255).toString(16).padStart(2, "0");
        ctx.fill();

        // Draw border
        ctx.strokeStyle = "#000000" +
          Math.round(opacity * 255).toString(16).padStart(2, "0");
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw "U" text
        ctx.fillStyle = "#ffffff" +
          Math.round(opacity * 255).toString(16).padStart(2, "0");
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("U", utility.x, utility.y);
      });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set up canvas
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      // Redraw after resize
      redrawCanvas();
    };

    // Get correct mouse coordinates relative to canvas
    const getMousePos = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    };

    // Drawing event handlers
    const startDrawing = (e: MouseEvent) => {
      // Allow drawing even without selected player for testing
      console.log("Starting drawing, selectedPlayer:", selectedPlayer);

      const pos = getMousePos(e);
      console.log("Mouse position:", pos);

      if (drawingMode.value === "utility") {
        // Place utility marker immediately
        const newUtility: UtilityMarker = {
          playerId: selectedPlayer || 1, // Default to player 1 if none selected
          color: currentDrawingColor.value || "#ff0000", // Default to red
          x: pos.x,
          y: pos.y,
          layer: currentLayerIndex,
        };
        allUtilities.value = [...allUtilities.value, newUtility];
        console.log("Placed utility marker:", newUtility);
        redrawCanvas();
      } else {
        // Start drawing stroke
        isDrawing.value = true;
        currentStroke.value = [pos];
        console.log("Started drawing stroke");
      }
    };

    const draw = (e: MouseEvent) => {
      if (
        !isDrawing.value || drawingMode.value === "utility"
      ) return;

      const pos = getMousePos(e);
      currentStroke.value = [...currentStroke.value, pos];

      // Draw current stroke in real-time
      if (currentStroke.value.length >= 2) {
        const points = currentStroke.value;
        const lastPoint = points[points.length - 2];

        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = currentDrawingColor.value || "#ff0000"; // Default to red
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      }
    };

    const stopDrawing = () => {
      if (
        !isDrawing.value || drawingMode.value === "utility"
      ) return;

      console.log(
        "Stopping drawing, stroke length:",
        currentStroke.value.length,
      );

      // Save the completed stroke
      if (currentStroke.value.length >= 2) {
        const newStroke: DrawingStroke = {
          playerId: selectedPlayer || 1, // Default to player 1
          color: currentDrawingColor.value || "#ff0000", // Default to red
          tool: drawingMode.value,
          points: [...currentStroke.value],
          layer: currentLayerIndex,
        };
        allStrokes.value = [...allStrokes.value, newStroke];
        console.log("Saved stroke:", newStroke);
      }

      isDrawing.value = false;
      currentStroke.value = [];
      redrawCanvas();
    };

    // Keyboard controls for layer switching
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "+" || e.key === "=") {
        if (currentLayerIndex < layers.length - 1) {
          onLayerChange(currentLayerIndex + 1);
        }
      } else if (e.key === "-" || e.key === "_") {
        if (currentLayerIndex > 0) {
          onLayerChange(currentLayerIndex - 1);
        }
      }
    };

    // Functions to expose globally
    const setDrawingMode = (mode: string, color?: string) => {
      drawingMode.value = mode;
      if (color) {
        currentDrawingColor.value = color;
      }
    };

    const clearCanvas = () => {
      allStrokes.value = [];
      allUtilities.value = [];
      redrawCanvas();
    };

    // Initialize
    resizeCanvas();
    globalThis.addEventListener("resize", resizeCanvas);

    // Debug: Draw a test line to verify canvas is working
    ctx.beginPath();
    ctx.moveTo(10, 10);
    ctx.lineTo(100, 100);
    ctx.strokeStyle = "#ff0000";
    ctx.lineWidth = 2;
    ctx.stroke();
    console.log("Canvas initialized, test line drawn");

    // Mouse events
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);

    // Keyboard events
    document.addEventListener("keydown", handleKeyDown);

    // Functions to expose globally for save/load
    const getCurrentStrokes = () => allStrokes.value;
    const getCurrentUtilities = () => allUtilities.value;
    const loadStrategyData = (strokes: any[], utilities: any[]) => {
      allStrokes.value = strokes;
      allUtilities.value = utilities;
      redrawCanvas();
    };

    // Expose functions globally for buttons
    (globalThis as { setDrawingMode?: (tool: string, color?: string) => void })
      .setDrawingMode = setDrawingMode;
    (globalThis as { clearStratCanvas?: () => void }).clearStratCanvas =
      clearCanvas;
    (globalThis as any).getCurrentStrokes = getCurrentStrokes;
    (globalThis as any).getCurrentUtilities = getCurrentUtilities;
    (globalThis as any).loadStrategyData = loadStrategyData;

    return () => {
      globalThis.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseout", stopDrawing);
      document.removeEventListener("keydown", handleKeyDown);
      delete (globalThis as {
        setDrawingMode?: (tool: string, color?: string) => void;
      }).setDrawingMode;
      delete (globalThis as { clearStratCanvas?: () => void }).clearStratCanvas;
      delete (globalThis as any).getCurrentStrokes;
      delete (globalThis as any).getCurrentUtilities;
      delete (globalThis as any).loadStrategyData;
    };
  }, [layers, side, currentLayerIndex, onLayerChange, selectedPlayer]);

  // Redraw when selected player changes or layer changes
  useEffect(() => {
    redrawCanvas();
  }, [selectedPlayer, currentLayerIndex, allStrokes.value, allUtilities.value]);

  return (
    <div class="strat-planner-container">
      {/* Map image */}
      <img
        ref={imageRef}
        src={`/maps/${map}/${currentLayer}.jpg`}
        alt={`${map} ${currentLayer}`}
        class="map-image"
      />

      {/* Drawing canvas */}
      <canvas
        ref={canvasRef}
        class="drawing-canvas"
      />
    </div>
  );
}
