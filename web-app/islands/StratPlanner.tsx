import { computed, effect, useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import SidePicker from "./SidePicker.tsx";
import BombsitePicker from "./BombsitePicker.tsx";
import { Bombsite } from "./models/bombsite.ts";

interface StratPlannerProps {
  map: string;
  layers: string[];
  bombsites: Bombsite[];
}

export default function StratPlanner(props: StratPlannerProps) {
  // const map = props.map;
  // const layers = props.layers;
  // const bombsites = props.bombsites;

  const { map, layers, bombsites } = props;

  const state = useSignal({
    map,
    layers,
    layerSelected: layers[0],
    bombsites,
    bombsiteSelected: bombsites[0],
  });

  const lowestLayer = 0;
  const highestLayer = layers.length - 1;
  const currentLayerIndex = useSignal(lowestLayer);
  // const currentLayer = useSignal(layers[lowestLayer]);
  const currentLayer = computed( () => layers[currentLayerIndex.value]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "+" && currentLayerIndex.value < highestLayer) {
        currentLayerIndex.value += 1;
      }

      if (event.key === "-" && currentLayerIndex.value > lowestLayer) {
        currentLayerIndex.value -= 1;
      }
    };

    const drawOverlay = () => {
      const canvasElement = document.getElementById(
        "strat-planner-canvas",
      ) as HTMLCanvasElement;
      const context = canvasElement.getContext("2d");

      canvasElement.width = 1414;
      canvasElement.height = 795;

      if (!canvasElement || !context) return;

      let isDrawing: boolean;
      canvasElement.onmousedown = (e) => {
        isDrawing = true;
        context.beginPath();
        context.lineWidth = 5;
        context.strokeStyle = "red";
        context.lineJoin = "round";
        context.lineCap = "round";
        context.moveTo(e.clientX, e.clientY);
      };

      canvasElement.onmousemove = (e) => {
        if (isDrawing) {
          context.lineTo(e.clientX, e.clientY);
          context.stroke();
        }
      };

      canvasElement.onmouseup = function () {
        isDrawing = false;
        context.closePath();
      };
    };

    drawOverlay();

    // Mouse events
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);

    // Keyboard events
    document.addEventListener("keydown", handleKeyDown);

    // Expose functions globally for buttons
    (globalThis as { setDrawingMode?: (tool: string, color?: string) => void })
      .setDrawingMode = setDrawingMode;
    (globalThis as { clearStratCanvas?: () => void }).clearStratCanvas =
      clearCanvas;

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
    };
  }, []);

  useEffect(() => {
    const bombsite = state.value.bombsiteSelected;
    console.log("Current layer changed to:", bombsite);
    currentLayerIndex.value = bombsite.layer;
  }, [state.value.bombsiteSelected]);

  return (
    <>
      <SidePicker />
      <BombsitePicker state={state} />
      <div id="strat-planner">
        <canvas id="strat-planner-canvas" />
        <img src={`/maps/${map}/${currentLayer.value}.jpg`} alt={map} />
      </div>
    </>
  );
}
