import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";

interface StratPlannerProps {
  map: string;
  layers: string[];
  side: string;
  onLayerChange: (index: number) => void;
  currentLayerIndex: number;
}

export default function StratPlanner(props: StratPlannerProps) {
  const { map, layers, side, onLayerChange, currentLayerIndex } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const drawingMode = useSignal("attack"); // attack, defense, callout
  const isDrawing = useSignal(false);
  const currentLayer = layers[currentLayerIndex];

  // Expose functions globally so sidebar buttons can access them
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
      
      // Configure drawing context
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
    };

    // Get correct mouse coordinates relative to canvas
    const getMousePos = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    };

    // Drawing event handlers
    const startDrawing = (e: MouseEvent) => {
      isDrawing.value = true;
      const pos = getMousePos(e);
      
      ctx.beginPath();
      ctx.lineWidth = 3;
      
      // Set color based on drawing mode
      if (drawingMode.value === "attack") {
        ctx.strokeStyle = "#ef4444"; // red for attack routes
      } else if (drawingMode.value === "defense") {
        ctx.strokeStyle = "#f97316"; // orange for defense positions
      } else {
        ctx.strokeStyle = "#eab308"; // yellow for callouts
      }
      
      ctx.moveTo(pos.x, pos.y);
    };

    const draw = (e: MouseEvent) => {
      if (!isDrawing.value) return;
      
      const pos = getMousePos(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    };

    const stopDrawing = () => {
      if (!isDrawing.value) return;
      isDrawing.value = false;
      ctx.closePath();
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
    const setDrawingMode = (mode: string) => {
      drawingMode.value = mode;
    };

    const clearCanvas = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    // Initialize
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Mouse events
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);

    // Keyboard events
    document.addEventListener("keydown", handleKeyDown);

    // Expose functions globally for buttons
    (window as any).setDrawingMode = setDrawingMode;
    (window as any).clearStratCanvas = clearCanvas;

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseout", stopDrawing);
      document.removeEventListener("keydown", handleKeyDown);
      delete (window as any).setDrawingMode;
      delete (window as any).clearStratCanvas;
    };
  }, [layers, side, currentLayerIndex, onLayerChange]);

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
