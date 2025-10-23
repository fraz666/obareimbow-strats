import { useSignal } from "@preact/signals";
import { Bombsite } from "../../domain/models/bombsite.ts";
import { Side } from "../../domain/models/side.ts";
import { SidePicker } from "./SidePicker.tsx";
import { Header } from "./Header.tsx";
import { BombsitePicker } from "./BombsitePicker.tsx";
import { MapBlueprint } from "./MapBlueprint.tsx";
import { useEffect } from "preact/hooks";
import { StratManager } from "./StratManager.tsx";

export interface MapWithStratsProps {
  map: any;
  layers: string[];
  bombsites: Bombsite[];
  side: Side;
}

export function MapWithStrats(props: { configuration: MapWithStratsProps }) {
  const { map, layers, bombsites, side } = props.configuration;

  const currentSide = useSignal(side);
  const currentBombsite = useSignal<Bombsite>(bombsites[0]);

  const currentLayer = useSignal<string>(layers[currentBombsite.value.layer]);

  const currentStrat = useSignal<string | null>(null);
  const availableStrats = useSignal<string[]>([]);

  const updateURLParams = () => {
    let newParams: any = {
      side: currentSide.value,
      bombsite: currentBombsite.value.code,
    };

    const strat = currentStrat.value;
    if (strat) {
      newParams.strat = strat;
    }
    const usp = new URLSearchParams(newParams);
    globalThis.history.pushState({}, "", `?${usp.toString()}`);
  };

  const getStratsForCurrentSelection = async () => {
    const res = await fetch(
      `/api/strat?map=${map.code}&side=${currentSide.value}&bombsite=${currentBombsite.value.code}`,
    );
    const strats = await res.json() as any[];
    console.log("Fetched strats:", strats);
    availableStrats.value = strats.map((s:any) => s.code) || [];
    currentStrat.value = availableStrats.value[0];

    updateURLParams();
  };

  useEffect(() => {
    getStratsForCurrentSelection();
  }, [currentSide.value, currentBombsite.value]);

  const onSideChange = (newSide: Side) => {
    currentSide.value = newSide;
    updateURLParams();
  };

  const onBombsiteChange = (newBombsite: Bombsite) => {
    currentBombsite.value = newBombsite;
    currentLayer.value = layers[newBombsite.layer];
    updateURLParams();
  };

  const onStratChange = (newStrat: string) => {
    currentStrat.value = newStrat;
    updateURLParams();
  }

  const onLayerIncrease = () => {
    const index = layers.indexOf(currentLayer.value);
    if (index < layers.length - 1) {
      currentLayer.value = layers[index + 1];
    }
  };

  const onLayerDecrease = () => {
    const index = layers.indexOf(currentLayer.value);
    if (index > 0) {
      currentLayer.value = layers[index - 1];
    }
  };

  return (
    <div class="map-with-strats-wrapper">
      <div class="sidebar">
        <Header name={map.name} />
        <SidePicker
          currentSide={currentSide.value}
          onSideChange={onSideChange}
        />
        <BombsitePicker
          currentBombsite={currentBombsite.value}
          availableBombsites={bombsites}
          onBombsiteChange={onBombsiteChange}
        />
        <StratManager
          currentStrat={currentStrat.value}
          availableStrats={availableStrats.value}
          onStratChange={onStratChange}
        />
      </div>
      <div class="map">
        <MapBlueprint
          mapCode={map.code}
          currentLayer={currentLayer.value}
          onLayerIncrease={onLayerIncrease}
          onLayerDecrease={onLayerDecrease}
        />
      </div>
    </div>
  );
}

// function updateURLParams(side: Side) {
//   // Update URL without page reload
//   const newParams = new URLSearchParams({ side });
//   globalThis.history.pushState({}, "", `?${newParams.toString()}`);
// }
