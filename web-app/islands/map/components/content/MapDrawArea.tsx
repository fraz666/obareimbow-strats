import { useEffect, useRef } from "preact/hooks";

interface MapDraweAreaProps {
  mapCode: string;
  currentStrat: string | null;
  currentLayer: string;
}

export function MapDraweArea(props: MapDraweAreaProps) {
  const { mapCode, currentStrat, currentLayer } = props;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // const redrawCanvas = () => {
  //   const canvas = canvasRef.current;
  //   if (!canvas) return;

  //   const ctx = canvas.getContext("2d");
  //   if (!ctx) return;

  //   // Clear canvas
  //   ctx.clearRect(0, 0, canvas.width, canvas.height);

  //   // Draw all strokes for current layer
  //   allStrokes.value
  //     .filter((stroke) => stroke.layer === currentLayerIndex)
  //     .forEach((stroke) => {
  //       if (stroke.points.length < 2) return;

  //       ctx.beginPath();
  //       ctx.lineWidth = 3;
  //       ctx.lineCap = "round";
  //       ctx.lineJoin = "round";

  //       // Set opacity based on whether this player is selected
  //       const opacity = selectedPlayer === stroke.playerId ? 1.0 : 0.3;
  //       ctx.strokeStyle = stroke.color +
  //         Math.round(opacity * 255).toString(16).padStart(2, "0");

  //       ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
  //       for (let i = 1; i < stroke.points.length; i++) {
  //         ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
  //       }
  //       ctx.stroke();
  //     });
  // };

  useEffect(() => {
    console.log(
      "MapDrawArea mounted for map:",
      mapCode,
      "strat:",
      currentStrat,
      "layer:",
      currentLayer,
    );
    const handleResize = () => {
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
      }
    };
    handleResize();
    globalThis.addEventListener("resize", handleResize);
    return () => globalThis.removeEventListener("resize", handleResize);
  }, [currentStrat]);

  return (
    <canvas
      ref={canvasRef}
    />
  );
}
