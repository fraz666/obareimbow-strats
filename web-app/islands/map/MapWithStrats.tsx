import { useSignal } from "@preact/signals";
import { Bombsite } from "../../domain/models/bombsite.ts";
import { Side } from "../../domain/models/side.ts";
import { SidePicker } from "./components/siderbar/SidePicker.tsx";
import { Header } from "./components/siderbar/Header.tsx";
import { BombsitePicker } from "./components/siderbar/BombsitePicker.tsx";
import { MapBlueprint } from "./components/content/MapBlueprint.tsx";
import { useEffect } from "preact/hooks";
import { StratManager } from "./components/siderbar/StratManager.tsx";
import { MapDraweArea } from "./components/content/MapDrawArea.tsx";
import { Strategy } from "../../domain/models/strategy.ts";

export interface MapWithStratsProps {
  isAdmin: boolean;
  map: any;
  layers: string[];
  bombsites: Bombsite[];
  currentSide: Side;
  currentBombsite: string | null;
  currentStrat: string | null;
}

export function MapWithStrats(props: { configuration: MapWithStratsProps }) {
  const {
    isAdmin,
    map,
    layers,
    bombsites,
    currentSide: side,
    currentBombsite: bombsiteCode,
    currentStrat: stratCode,
  } = props.configuration;

  const currentSide = useSignal(side);

  const bombsite = bombsites.find((b) => b.code === bombsiteCode) ??
    bombsites[0];
  const currentBombsite = useSignal<Bombsite>(bombsite);

  const currentLayer = useSignal<string>(layers[currentBombsite.value.layer]);

  const currentStrat = useSignal<Strategy | null>(null);
  const availableStrats = useSignal<Strategy[]>([]);

  useEffect(() => {
    getStratsForCurrentSelection();
  }, [currentSide.value, currentBombsite.value]);

  const updateURLParams = () => {
    const newParams: any = {
      side: currentSide.value,
      bombsite: currentBombsite.value.code,
    };

    const strat = currentStrat.value;
    if (strat) {
      newParams.strat = strat.code;
    }
    const usp = new URLSearchParams(newParams);
    globalThis.history.pushState({}, "", `?${usp.toString()}`);
  };

  const getStratsForCurrentSelection = async () => {
    const res = await fetch(
      `/api/strat?map=${map.code}&side=${currentSide.value}&bombsite=${currentBombsite.value.code}`,
    );
    const strats = await res.json() as Strategy[];
    availableStrats.value = strats ?? [];
    if (availableStrats.value.length > 0) {
      const requestedStrat = availableStrats.value.find((s) =>
        s.code === stratCode
      );
      if (requestedStrat) {
        currentStrat.value = requestedStrat;
      } else {
        currentStrat.value = availableStrats.value[0];
      }
    }

    updateURLParams();
  };

  const onSideChange = (newSide: Side) => {
    if (newSide != currentSide.value) {
      currentSide.value = newSide;
      currentStrat.value = null;
      updateURLParams();
    }
  };

  const onBombsiteChange = (newBombsite: Bombsite) => {
    if (newBombsite.code !== currentBombsite.value.code) {
      currentBombsite.value = newBombsite;
      currentLayer.value = layers[newBombsite.layer];
      currentStrat.value = null;
      updateURLParams();
    }
  };

  const onStratChange = (newStrat: string) => {
    const strat = availableStrats.value.find((s) => s.code === newStrat);
    if (!strat) return;
    currentStrat.value = strat;
    updateURLParams();
  };

  const onStratAdd = () => {
    const strats = availableStrats.value;

    const newStratName = `${strats.length + 1}`;

    const newStrat: Strategy = {
      code: newStratName,
      strokesByLayer: {},
    };
    availableStrats.value = [...strats, newStrat];
    currentStrat.value = newStrat;

    console.log("Add strat");
  };

  const onStratSave = async (s: string) => {
    // TODO: show spinner
    const strat = availableStrats.value.find((st) => st.code === s);
    if (!strat) return;

    const res = await fetch(
      `/api/strat?map=${map.code}&side=${currentSide.value}&bombsite=${currentBombsite.value.code}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(strat),
      },
    );

    if (res.ok) {
      console.log("Strat saved successfully");
    } else {
      console.error("Error saving strat:", await res.text());
    }
  };

  const onStratDelete = async (s: string) => {
    // TODO: show spinner
    const idx = availableStrats.value.findIndex((st) => st.code === s);
    if (idx === -1) return;

    const strat = availableStrats.value.splice(idx, 1)[0];
    availableStrats.value = [...availableStrats.value];

    const res = await fetch(
      `/api/strat?map=${map.code}&side=${currentSide.value}&bombsite=${currentBombsite.value.code}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(strat),
      },
    );

    if (res.ok) {
      console.log("Strat deleted successfully");
    } else {
      console.error("Error deleting strat:", await res.text());
    }
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
        <div class="flex flex-col gap-4 px-4">
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
            isAdmin={isAdmin}
            currentStrat={currentStrat.value?.code ?? null}
            availableStrats={availableStrats.value.map((s) => s.code)}
            onStratChange={onStratChange}
            onStratAdd={onStratAdd}
            onStratSave={onStratSave}
            onStratDelete={onStratDelete}
          />
        </div>
      </div>
      <div class="map">
        <MapBlueprint
          mapCode={map.code}
          currentLayer={currentLayer.value}
          onLayerIncrease={onLayerIncrease}
          onLayerDecrease={onLayerDecrease}
        />

        <MapDraweArea
          isAdmin={isAdmin}
          mapCode={map.code}
          currentStrat={currentStrat.value}
          currentLayer={currentLayer.value}
        />
      </div>
    </div>
  );
}
