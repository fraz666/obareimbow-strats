/** @jsxImportSource preact */

interface SidePickerProps {
  currentSide: string;
  onSideChange: (side: string) => void;
  map: string;
}

export default function SidePicker(props: SidePickerProps) {
  const { currentSide, onSideChange, map: _map } = props;

  const handleSideChange = (side: string) => {
    // Update URL without page reload
    const newParams = new URLSearchParams({ side });
    globalThis.history.pushState({}, "", `?${newParams.toString()}`);

    // Call the parent handler
    onSideChange(side);
  };

  return (
    <div class="p-4 border-b border-gray-700">
      <h3 class="font-semibold mb-3">Team Side</h3>
      <div class="flex gap-2">
        <button
          type="button"
          onClick={() => handleSideChange("atk")}
          class={`px-4 py-2 rounded text-sm font-medium transition-colors ${
            currentSide === "atk"
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          🔫 Attack
        </button>
        <button
          type="button"
          onClick={() => handleSideChange("def")}
          class={`px-4 py-2 rounded text-sm font-medium transition-colors ${
            currentSide === "def"
              ? "bg-orange-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          🛡️ Defense
        </button>
      </div>

      <div class="mt-2 text-xs text-gray-400">
        {currentSide === "atk"
          ? "Planning attack strategies and entry routes"
          : "Planning defense positions and utility placement"}
      </div>
    </div>
  );
}
