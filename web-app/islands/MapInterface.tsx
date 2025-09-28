/** @jsxImportSource preact */

import { useSignal } from "@preact/signals";
import StratPlanner from "./StratPlanner.tsx";
import BombsitePicker from "./BombsitePicker.tsx";
import SidePicker from "./SidePicker.tsx";

interface Bombsite {
  name: string;
  code: string;
  layer: number;
}

interface MapInterfaceProps {
  map: string;
  layers: string[];
  bombsites: Bombsite[];
  side: string;
}

interface Player {
  id: number;
  operator: string | null;
  color: string;
  name: string;
}

// R6S Operators data
const OPERATORS = {
  attack: [
    "Sledge",
    "Thatcher",
    "Ash",
    "Thermite",
    "Twitch",
    "Montagne",
    "Glaz",
    "Fuze",
    "IQ",
    "Blitz",
    "Buck",
    "Blackbeard",
    "Capitao",
    "Hibana",
    "Jackal",
    "Ying",
    "Zofia",
    "Dokkaebi",
    "Lion",
    "Finka",
    "Maverick",
    "Nomad",
    "Gridlock",
    "Nokk",
    "Amaru",
    "Kali",
    "Iana",
    "Ace",
    "Zero",
    "Flores",
    "Osa",
    "Sens",
    "Grim",
    "Brava",
    "Ram",
  ],
  defense: [
    "Smoke",
    "Mute",
    "Castle",
    "Pulse",
    "Doc",
    "Rook",
    "Kapkan",
    "Tachanka",
    "Jager",
    "Bandit",
    "Frost",
    "Valkyrie",
    "Caveira",
    "Echo",
    "Mira",
    "Lesion",
    "Ela",
    "Vigil",
    "Maestro",
    "Alibi",
    "Clash",
    "Kaid",
    "Mozzie",
    "Warden",
    "Goyo",
    "Wamai",
    "Oryx",
    "Melusi",
    "Aruni",
    "Thunderbird",
    "Thorn",
    "Azami",
    "Solis",
    "Fenrir",
    "Tubarao",
  ],
};

const PLAYER_COLORS = [
  "#ef4444", // red
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // yellow
  "#8b5cf6", // purple
];

export default function MapInterface(props: MapInterfaceProps) {
  const { map, layers, bombsites, side } = props;
  const currentSide = useSignal(side);
  const currentLayerIndex = useSignal(0);
  const activeDrawingTool = useSignal(side === "atk" ? "route" : "position");
  const selectedPlayer = useSignal<number | null>(null);
  const selectedBombsite = useSignal<Bombsite | null>(bombsites[0] || null);
  const showOperatorSelect = useSignal(false);
  const operatorSelectForPlayer = useSignal<number | null>(null);

  // Initialize players
  const players = useSignal<Player[]>([
    { id: 1, operator: null, color: PLAYER_COLORS[0], name: "Player 1" },
    { id: 2, operator: null, color: PLAYER_COLORS[1], name: "Player 2" },
    { id: 3, operator: null, color: PLAYER_COLORS[2], name: "Player 3" },
    { id: 4, operator: null, color: PLAYER_COLORS[3], name: "Player 4" },
    { id: 5, operator: null, color: PLAYER_COLORS[4], name: "Player 5" },
  ]);

  const handleLayerChange = (index: number) => {
    currentLayerIndex.value = index;
  };

  const handleBombsiteSelect = (bombsite: Bombsite) => {
    selectedBombsite.value = bombsite;
    // Automatically switch to the bombsite's floor
    currentLayerIndex.value = bombsite.layer;
  };

  const handleSideChange = (newSide: string) => {
    currentSide.value = newSide;
    // Update drawing tool based on side
    activeDrawingTool.value = newSide === "atk" ? "route" : "position";
    // Clear player selection when switching sides
    selectedPlayer.value = null;
  };

  const handleDrawingToolChange = (tool: string) => {
    activeDrawingTool.value = tool;
    if (
      (globalThis as { setDrawingMode?: (tool: string, color: string) => void })
        .setDrawingMode
    ) {
      const currentPlayer = selectedPlayer.value;
      const color = currentPlayer
        ? players.value[currentPlayer - 1].color
        : "#ffffff";
      (globalThis as unknown as {
        setDrawingMode: (tool: string, color: string) => void;
      })
        .setDrawingMode(tool, color);
    }
  };

  const handlePlayerSelect = (playerId: number) => {
    selectedPlayer.value = selectedPlayer.value === playerId ? null : playerId;
    if (
      selectedPlayer.value &&
      (globalThis as { setDrawingMode?: (tool: string, color: string) => void })
        .setDrawingMode
    ) {
      const player = players.value[playerId - 1];
      (globalThis as unknown as {
        setDrawingMode: (tool: string, color: string) => void;
      })
        .setDrawingMode(activeDrawingTool.value, player.color);
    }
  };

  const handleOperatorSelect = (operator: string) => {
    if (operatorSelectForPlayer.value) {
      const newPlayers = [...players.value];
      newPlayers[operatorSelectForPlayer.value - 1].operator = operator;
      players.value = newPlayers;
    }
    showOperatorSelect.value = false;
    operatorSelectForPlayer.value = null;
  };

  const openOperatorSelect = (playerId: number) => {
    operatorSelectForPlayer.value = playerId;
    showOperatorSelect.value = true;
  };

  const handleClearCanvas = () => {
    if ((globalThis as { clearStratCanvas?: () => void }).clearStratCanvas) {
      (globalThis as unknown as { clearStratCanvas: () => void })
        .clearStratCanvas();
    }
  };

  return (
    <div class="flex h-screen">
      {/* Sidebar */}
      <div class="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div class="p-4 border-b border-gray-700">
          <a
            href="/maps"
            class="text-orange-500 hover:text-orange-400 text-sm mb-2 inline-block"
          >
            ← Back to Maps
          </a>
          <h1 class="text-2xl font-bold capitalize">{map}</h1>
          <p class="text-gray-400 text-sm">Strategy Planner</p>
        </div>

        {/* Side Selection */}
        <SidePicker
          currentSide={currentSide.value}
          onSideChange={handleSideChange}
          map={map}
        />

        {/* Player Slots */}
        <div class="p-4 border-b border-gray-700">
          <h3 class="font-semibold mb-3">Team Composition</h3>
          <div class="space-y-2">
            {players.value.map((player) => (
              <div key={player.id} class="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handlePlayerSelect(player.id)}
                  class={`flex-1 p-2 rounded text-sm text-left transition-all ${
                    selectedPlayer.value === player.id
                      ? "bg-gray-600 ring-2 ring-blue-500"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                  style={{
                    opacity:
                      selectedPlayer.value && selectedPlayer.value !== player.id
                        ? 0.5
                        : 1,
                  }}
                >
                  <div class="flex items-center gap-2">
                    <div
                      class="w-3 h-3 rounded-full"
                      style={{ backgroundColor: player.color }}
                    >
                    </div>
                    <span class="font-medium">
                      {player.operator || `Player ${player.id}`}
                    </span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    openOperatorSelect(player.id)}
                  class="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs transition-colors"
                >
                  {player.operator ? "Change" : "Select"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Drawing Tools */}
        <div class="p-4 border-b border-gray-700">
          <h3 class="font-semibold mb-3">Drawing Tools</h3>
          <div class="text-xs text-gray-400 mb-2">
            {selectedPlayer.value
              ? `Drawing for ${
                players.value[selectedPlayer.value - 1].operator ||
                `Player ${selectedPlayer.value}`
              }`
              : "Select a player first"}
          </div>
          <div class="space-y-2">
            {currentSide.value === "atk" && (
              <button
                type="button"
                onClick={() => handleDrawingToolChange("route")}
                disabled={!selectedPlayer.value}
                class={`w-full px-3 py-2 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  activeDrawingTool.value === "route"
                    ? "bg-red-600 text-white"
                    : "bg-red-600 bg-opacity-50 hover:bg-red-600 hover:bg-opacity-75"
                }`}
              >
                Attack Route
              </button>
            )}
            {currentSide.value === "def" && (
              <button
                type="button"
                onClick={() => handleDrawingToolChange("position")}
                disabled={!selectedPlayer.value}
                class={`w-full px-3 py-2 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  activeDrawingTool.value === "position"
                    ? "bg-orange-600 text-white"
                    : "bg-orange-600 bg-opacity-50 hover:bg-orange-600 hover:bg-opacity-75"
                }`}
              >
                Defense Position
              </button>
            )}
            <button
              type="button"
              onClick={() => handleDrawingToolChange("utility")}
              disabled={!selectedPlayer.value}
              class={`w-full px-3 py-2 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                activeDrawingTool.value === "utility"
                  ? "bg-purple-600 text-white"
                  : "bg-purple-600 bg-opacity-50 hover:bg-purple-600 hover:bg-opacity-75"
              }`}
            >
              Utility Placement
            </button>
            <button
              type="button"
              onClick={() => handleDrawingToolChange("callout")}
              disabled={!selectedPlayer.value}
              class={`w-full px-3 py-2 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                activeDrawingTool.value === "callout"
                  ? "bg-yellow-600 text-white"
                  : "bg-yellow-600 bg-opacity-50 hover:bg-yellow-600 hover:bg-opacity-75"
              }`}
            >
              Callout
            </button>
            <button
              type="button"
              onClick={handleClearCanvas}
              class="w-full px-3 py-2 bg-gray-600 hover:bg-gray-700 rounded text-sm transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Bombsite Selection */}
        <BombsitePicker
          bombsites={bombsites}
          selectedBombsite={selectedBombsite.value}
          onBombsiteSelect={handleBombsiteSelect}
          layers={layers}
        />

        {/* Layer Controls */}
        <div class="p-4 flex-1">
          <h3 class="font-semibold mb-3">Floor Layers</h3>
          <div class="text-sm text-gray-400 mb-2">
            Click to switch floors (+/- keys)
          </div>
          <div class="space-y-1">
            {layers.map((layer: string, index: number) => (
              <button
                type="button"
                key={layer}
                onClick={() => handleLayerChange(index)}
                class={`w-full p-2 rounded text-sm capitalize text-left transition-colors ${
                  currentLayerIndex.value === index
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                }`}
              >
                <span class="text-gray-400">{index + 1}.</span>{" "}
                {layer.replace("-", " ")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Map Area */}
      <div class="flex-1 relative overflow-hidden">
        <StratPlanner
          map={map}
          layers={layers}
          side={currentSide.value}
          onLayerChange={handleLayerChange}
          currentLayerIndex={currentLayerIndex.value}
          selectedPlayer={selectedPlayer.value}
          _players={players.value}
        />
      </div>

      {/* Operator Selection Modal */}
      {showOperatorSelect.value && (
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
            <h3 class="text-lg font-semibold mb-4">Select Operator</h3>
            <div class="grid grid-cols-2 gap-2">
              {OPERATORS[currentSide.value as keyof typeof OPERATORS].map((
                op,
              ) => (
                <button
                  type="button"
                  key={op}
                  onClick={() => handleOperatorSelect(op)}
                  class="p-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors text-left"
                >
                  {op}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                showOperatorSelect.value = false;
                operatorSelectForPlayer.value = null;
              }}
              class="mt-4 w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
