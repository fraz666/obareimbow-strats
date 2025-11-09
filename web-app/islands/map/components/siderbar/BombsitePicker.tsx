import { Bombsite } from "../../../../domain/models/bombsite.ts";

interface BombsitePickerProps {
  currentBombsite: Bombsite;
  availableBombsites: Bombsite[];
  onBombsiteChange: (b: Bombsite) => void;
}

export function BombsitePicker(props: BombsitePickerProps) {
  const { currentBombsite, availableBombsites, onBombsiteChange } = props;

  return (
    <div>
      <h4>Bombsite</h4>
      <div class="bombsite-container">
        {availableBombsites.map((bombsite) => (
          <button
          type="button"
          onClick={() => onBombsiteChange(bombsite)}
          class={`${
            currentBombsite.code === bombsite.code
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
          >
            {bombsite.name}
          </button>
        ))}
      </div>
    </div>
  );
}
