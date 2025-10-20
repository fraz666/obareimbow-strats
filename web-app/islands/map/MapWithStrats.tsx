import { Bombsite } from "../../domain/models/bombsite.ts";
import { Side } from "../../domain/models/side.ts";
import SidePicker from "./SidePicker.tsx";
import { Header } from "./Header.tsx";
import { useSignal } from "@preact/signals";
import BombsitePicker from "./BombsitePicker.tsx";
import { MapBlueprint } from "./MapBlueprint.tsx";

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

  const onSideChange = (newSide: Side) => {
    currentSide.value = newSide;
    updateURLParams(newSide);
  };

  const onBombsiteChange = (newBombsite: Bombsite) => {
    currentBombsite.value = newBombsite;

    currentLayer.value = layers[newBombsite.layer]

    // updateURLParams(newSide);
  };

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
      </div>
      <div class="map">
        {/* <img
          src={`/maps/${map.code}/${currentLayer.value}.jpg`}
          alt={`${map} ${1}`}
          class="map-image"
        /> */}
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

function updateURLParams(side: Side) {
  // Update URL without page reload
  const newParams = new URLSearchParams({ side });
  globalThis.history.pushState({}, "", `?${newParams.toString()}`);
}
