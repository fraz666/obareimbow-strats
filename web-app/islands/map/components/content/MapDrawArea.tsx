import { useEffect, useRef } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { Strategy } from "../../../../domain/models/strategy.ts";
import { TRACE_COLORS } from "../../../../domain/costants.ts";

interface MapDraweAreaProps {
  isAdmin: boolean;
  mapCode: string;
  currentStrat: Strategy | null;
  currentLayer: string;
  currentPlayerIndex: number;
}

export function MapDraweArea(props: MapDraweAreaProps) {
  const { isAdmin, currentStrat, currentLayer, currentPlayerIndex } = props;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isDrawing = useSignal(false);
  const currentStroke = useSignal<{ x: number; y: number }[]>([]);

  useEffect(() => {
    // console.log(
    //   "MapDrawArea mounted for map:",
    //   mapCode,
    //   "strat:",
    //   currentStrat,
    //   "layer:",
    //   currentLayer,
    // );

    attachCanvasEvents();

    return () => {
      detachCanvasEvents();
    };
  }, [currentStrat, currentLayer, currentPlayerIndex]);

  const resizeCanvas = () => {
    const imgRef = document.getElementById(
      "map-blueprint",
    ) as HTMLImageElement;
    const canvas = canvasRef.current;
    if (canvas && imgRef) {
      canvas.width = imgRef.width;
      canvas.height = imgRef.height;

      // style adjustments
      canvas.style.position = "absolute";
      canvas.style.left = imgRef.offsetLeft + "px";
      canvas.style.top = imgRef.offsetTop + "px";
      canvas.style.pointerEvents = "auto";

      if (currentStrat != null) {
        canvas.style.cursor = "crosshair";
      } else {
        canvas.style.cursor = "default";
      }
      redrawCanvas();
    }
  };

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all strokes for current layer
    if (currentStrat == null) return;

    const currentLayerTraces = currentStrat.traces[currentLayer];
    if (!currentLayerTraces) return;

    Object.keys(currentLayerTraces).forEach((playerIdxStr) => {
      const playerIdx = +playerIdxStr;
      const strokeColor = TRACE_COLORS[playerIdx] + "dd"; // semi-transparent

      currentLayerTraces[playerIdx]?.forEach((strokePoints) => {
        if (strokePoints.length < 2) return;

        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // Set opacity based on whether this player is selected
        ctx.strokeStyle = strokeColor;

        // Map stored points to current canvas pixels
        const first = strokePoints[0];
        const startX = first.x * canvas.width;
        const startY = first.y * canvas.height;
        ctx.moveTo(startX, startY);

        for (let i = 1; i < strokePoints.length; i++) {
          const p = strokePoints[i];
          const x = p.x * canvas.width;
          const y = p.y * canvas.height;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
    });
  };

  const handleUndo = (e: KeyboardEvent) => {
    if (e.key === "z" && (e.ctrlKey || e.metaKey)) {
      if (currentStrat == null) return;

      const strokes = currentStrat!.traces[currentLayer][currentPlayerIndex];
      if (strokes && strokes.length > 0) {
        strokes.pop();
        redrawCanvas();
      }
    }
  };

  const getMouseCoords = (e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return { x: 0, y: 0 };
    }

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
    const coords = getMouseCoords(e);
    // console.log("Mouse position:", coords);

    if (isAdmin && currentStrat != null) {
      isDrawing.value = true;
      currentStroke.value = [coords];
    }
  };

  const draw = (e: MouseEvent) => {
    const canvas = canvasRef.current;
    const ctx = canvas!.getContext("2d")!;

    if (!isDrawing.value) return;

    const coords = getMouseCoords(e);
    currentStroke.value = [...currentStroke.value, coords];

    // Draw current stroke in real-time
    if (currentStroke.value.length >= 2) {
      const points = currentStroke.value;
      const lastPoint = points[points.length - 2];

      const color = TRACE_COLORS[currentPlayerIndex];
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = color;
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (!isDrawing.value) return;

    if (currentStrat == null) return;

    if (!currentStrat.traces[currentLayer]) {
      currentStrat.traces[currentLayer] = {};
    }

    if (!currentStrat.traces[currentLayer][currentPlayerIndex]) {
      currentStrat.traces[currentLayer][currentPlayerIndex] = [];
    }

    // Convert current stroke (stored in canvas pixels) to normalized [0..1]
    // so that strokes scale correctly when canvas size changes.
    const canvas = canvasRef.current!;
    const normalized = currentStroke.value.map((p) => ({
      x: canvas.width > 0 ? p.x / canvas.width : 0,
      y: canvas.height > 0 ? p.y / canvas.height : 0,
    }));
    
    currentStrat.traces[currentLayer][currentPlayerIndex].push(normalized);

    isDrawing.value = false;
    currentStroke.value = [];
    redrawCanvas();
  };

  const attachCanvasEvents = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    resizeCanvas();
    globalThis.addEventListener("resize", resizeCanvas);

    redrawCanvas();

    // Mouse events
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);

    // Keyboard events
    globalThis.addEventListener("keydown", handleUndo);
  };

  const detachCanvasEvents = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    globalThis.removeEventListener("resize", resizeCanvas);

    // Mouse events
    canvas.removeEventListener("mousedown", startDrawing);
    canvas.removeEventListener("mousemove", draw);
    canvas.removeEventListener("mouseup", stopDrawing);
    canvas.removeEventListener("mouseout", stopDrawing);

    // Keyboard events
    globalThis.removeEventListener("keydown", handleUndo);
  };

  return (
    <canvas
      ref={canvasRef}
    />
  );
}
