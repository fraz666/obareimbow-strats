import { useSignal } from "@preact/signals";
import { Bombsite } from "./models/bombsite.ts";

export default function BombsitePicker(props: any) {
  const state = props.state;
  const stateValue = state.value;

  const bombsites = stateValue.bombsites;

  const updateBombsite = (code: string) => {
    const selected = bombsites.find((b: Bombsite) => b.code === code);
    if (selected) {
      props.state.value = {
        ...props.state.value,
        bombsiteSelected: selected
      };
    }
  };

  return (
    <div>
      {bombsites.map((b: Bombsite) => (
        <button
          key={b.code}
          type="button"
          class={ b.code === stateValue.bombsiteSelected.code ? "selected" : "" }
          onClick={() => updateBombsite(b.code)}
        >
          {b.name}
        </button>
      ))}
    </div>
  );
}
