import { useEffect } from "preact/hooks";

interface MapBlueprintProps {
  mapCode: string;
  currentLayer: string;
  onLayerIncrease: () => void;
  onLayerDecrease: () => void;
}

export function MapBlueprint(props: MapBlueprintProps) {
  const { mapCode, currentLayer, onLayerIncrease, onLayerDecrease } = props;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "+" ) {
        onLayerIncrease();
      } else if (e.key === "-") {
        onLayerDecrease();
      }
    };

    globalThis.addEventListener("keydown", handleKeyDown);
    return () => globalThis.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <img
      id="map-blueprint"
      src={`/maps/${mapCode}/${currentLayer}.jpg`}
      alt={`${mapCode} ${currentLayer}`}
      class="map-image"
    />
  );
}
