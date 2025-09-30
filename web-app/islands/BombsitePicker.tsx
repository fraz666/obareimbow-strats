/** @jsxImportSource preact */

interface Bombsite {
  name: string;
  code: string;
  layer: number;
}

interface BombsitePickerProps {
  bombsites: Bombsite[];
  selectedBombsite: Bombsite | null;
  onBombsiteSelect: (bombsite: Bombsite) => void;
  layers: string[];
}

export default function BombsitePicker(props: BombsitePickerProps) {
  const { bombsites, selectedBombsite, onBombsiteSelect, layers } = props;

  return (
    <div class="p-4 border-b border-gray-700">
      <h3 class="font-semibold mb-3">Target Bombsite</h3>
      <div class="space-y-2">
        {bombsites.map((bombsite) => (
          <button
            type="button"
            key={bombsite.code}
            onClick={() => onBombsiteSelect(bombsite)}
            class={`w-full p-3 rounded text-sm text-left transition-colors ${
              selectedBombsite?.code === bombsite.code
                ? "bg-blue-600 text-white ring-2 ring-blue-400"
                : "bg-gray-700 hover:bg-gray-600 text-gray-300"
            }`}
          >
            <div class="font-medium">{bombsite.name}</div>
            <div class="text-xs opacity-75 mt-1">
              📍 {layers[bombsite.layer]} floor
            </div>
          </button>
        ))}
      </div>

      {selectedBombsite && (
        <div class="mt-3 p-2 bg-blue-900 bg-opacity-50 rounded text-xs">
          <div class="text-blue-300 font-medium">Planning for:</div>
          <div class="text-white">{selectedBombsite.name}</div>
        </div>
      )}
    </div>
  );
}
