// import { useSignal } from "@preact/signals";
// import StratPlanner from "./StratPlanner.tsx";
// // import BombsitePicker from "./BombsitePicker.tsx";
// import SidePicker from "./map/SidePicker.tsx";

// interface Bombsite {
//   name: string;
//   code: string;
//   layer: number;
// }

// interface MapInterfaceProps {
//   map: { code: string; name: string };
//   layers: string[];
//   bombsites: Bombsite[];
//   side: string;
// }

// interface Player {
//   id: number;
//   operator: string | null;
//   color: string;
//   name: string;
// }

// interface SavedStrategy {
//   id: string;
//   name: string;
//   map: string;
//   side: string;
//   bombsite: string;
//   players: Player[];
//   strokes: any[];
//   utilities: any[];
//   createdAt: string;
//   updatedAt: string;
// }

// // R6S Operators data
// const OPERATORS = {
//   attack: [
//     "Sledge",
//     "Thatcher",
//     "Ash",
//     "Thermite",
//     "Twitch",
//     "Montagne",
//     "Glaz",
//     "Fuze",
//     "IQ",
//     "Blitz",
//     "Buck",
//     "Blackbeard",
//     "Capitao",
//     "Hibana",
//     "Jackal",
//     "Ying",
//     "Zofia",
//     "Dokkaebi",
//     "Lion",
//     "Finka",
//     "Maverick",
//     "Nomad",
//     "Gridlock",
//     "Nokk",
//     "Amaru",
//     "Kali",
//     "Iana",
//     "Ace",
//     "Zero",
//     "Flores",
//     "Osa",
//     "Sens",
//     "Grim",
//     "Brava",
//     "Ram",
//   ],
//   defense: [
//     "Smoke",
//     "Mute",
//     "Castle",
//     "Pulse",
//     "Doc",
//     "Rook",
//     "Kapkan",
//     "Tachanka",
//     "Jager",
//     "Bandit",
//     "Frost",
//     "Valkyrie",
//     "Caveira",
//     "Echo",
//     "Mira",
//     "Lesion",
//     "Ela",
//     "Vigil",
//     "Maestro",
//     "Alibi",
//     "Clash",
//     "Kaid",
//     "Mozzie",
//     "Warden",
//     "Goyo",
//     "Wamai",
//     "Oryx",
//     "Melusi",
//     "Aruni",
//     "Thunderbird",
//     "Thorn",
//     "Azami",
//     "Solis",
//     "Fenrir",
//     "Tubarao",
//   ],
// };

// const PLAYER_COLORS = [
//   "#ef4444", // red
//   "#3b82f6", // blue
//   "#10b981", // green
//   "#f59e0b", // yellow
//   "#8b5cf6", // purple
// ];

// export default function MapInterface(props: MapInterfaceProps) {
//   const { map, layers, bombsites, side } = props;
//   const currentSide = useSignal(side);
//   const currentLayerIndex = useSignal(0);
//   const activeDrawingTool = useSignal(side === "atk" ? "route" : "position");
//   const selectedPlayer = useSignal<number | null>(null);
//   const selectedBombsite = useSignal<Bombsite | null>(bombsites[0] || null);
//   const showOperatorSelect = useSignal(false);
//   const operatorSelectForPlayer = useSignal<number | null>(null);
//   const showSaveDialog = useSignal(false);
//   const showLoadDialog = useSignal(false);
//   const strategyName = useSignal("");
//   const savedStrategies = useSignal<SavedStrategy[]>([]);

//   // Initialize players
//   const players = useSignal<Player[]>([
//     { id: 1, operator: null, color: PLAYER_COLORS[0], name: "Player 1" },
//     { id: 2, operator: null, color: PLAYER_COLORS[1], name: "Player 2" },
//     { id: 3, operator: null, color: PLAYER_COLORS[2], name: "Player 3" },
//     { id: 4, operator: null, color: PLAYER_COLORS[3], name: "Player 4" },
//     { id: 5, operator: null, color: PLAYER_COLORS[4], name: "Player 5" },
//   ]);

//   const handleLayerChange = (index: number) => {
//     currentLayerIndex.value = index;
//   };

//   const handleBombsiteSelect = (bombsite: Bombsite) => {
//     selectedBombsite.value = bombsite;
//     // Automatically switch to the bombsite's floor
//     currentLayerIndex.value = bombsite.layer;
//   };

//   const handleSideChange = (newSide: string) => {
//     currentSide.value = newSide;
//     // Update drawing tool based on side
//     activeDrawingTool.value = newSide === "atk" ? "route" : "position";
//     // Clear player selection when switching sides
//     selectedPlayer.value = null;
//   };

//   const handleDrawingToolChange = (tool: string) => {
//     activeDrawingTool.value = tool;
//     if (
//       (globalThis as { setDrawingMode?: (tool: string, color: string) => void })
//         .setDrawingMode
//     ) {
//       const currentPlayer = selectedPlayer.value;
//       const color = currentPlayer
//         ? players.value[currentPlayer - 1].color
//         : "#ffffff";
//       (globalThis as unknown as {
//         setDrawingMode: (tool: string, color: string) => void;
//       })
//         .setDrawingMode(tool, color);
//     }
//   };

//   const handlePlayerSelect = (playerId: number) => {
//     selectedPlayer.value = selectedPlayer.value === playerId ? null : playerId;
//     if (
//       selectedPlayer.value &&
//       (globalThis as { setDrawingMode?: (tool: string, color: string) => void })
//         .setDrawingMode
//     ) {
//       const player = players.value[playerId - 1];
//       (globalThis as unknown as {
//         setDrawingMode: (tool: string, color: string) => void;
//       })
//         .setDrawingMode(activeDrawingTool.value, player.color);
//     }
//   };

//   const handleOperatorSelect = (operator: string) => {
//     console.log(
//       "Selected operator:",
//       operator,
//       "for player:",
//       operatorSelectForPlayer.value,
//     );
//     if (operatorSelectForPlayer.value) {
//       const newPlayers = [...players.value];
//       newPlayers[operatorSelectForPlayer.value - 1].operator = operator;
//       players.value = newPlayers;
//       console.log("Updated players:", players.value);
//     }
//     showOperatorSelect.value = false;
//     operatorSelectForPlayer.value = null;
//   };

//   const openOperatorSelect = (playerId: number) => {
//     console.log("Opening operator select for player:", playerId);
//     console.log("Current side:", currentSide.value);
//     console.log(
//       "Available operators:",
//       OPERATORS[currentSide.value === "atk" ? "attack" : "defense"],
//     );
//     operatorSelectForPlayer.value = playerId;
//     showOperatorSelect.value = true;
//     console.log("showOperatorSelect.value:", showOperatorSelect.value);
//   };

//   const handleClearCanvas = () => {
//     if ((globalThis as { clearStratCanvas?: () => void }).clearStratCanvas) {
//       (globalThis as unknown as { clearStratCanvas: () => void })
//         .clearStratCanvas();
//     }
//   };

//   // Load saved strategies from localStorage on component mount
//   const loadSavedStrategies = () => {
//     try {
//       const saved = localStorage.getItem("r6s-strategies");
//       if (saved) {
//         const strategies = JSON.parse(saved) as SavedStrategy[];
//         savedStrategies.value = strategies;
//       }
//     } catch (error) {
//       console.error("Error loading saved strategies:", error);
//     }
//   };

//   // Save current strategy
//   const saveStrategy = () => {
//     if (!strategyName.value.trim()) {
//       alert("Please enter a strategy name");
//       return;
//     }

//     // Get current drawing data from StratPlanner
//     const currentStrokes = (globalThis as any).getCurrentStrokes?.() || [];
//     const currentUtilities = (globalThis as any).getCurrentUtilities?.() || [];

//     const strategy: SavedStrategy = {
//       id: Date.now().toString(),
//       name: strategyName.value.trim(),
//       map: map.code,
//       side: currentSide.value,
//       bombsite: selectedBombsite.value?.name || "",
//       players: [...players.value],
//       strokes: currentStrokes,
//       utilities: currentUtilities,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     };

//     const updatedStrategies = [...savedStrategies.value, strategy];
//     savedStrategies.value = updatedStrategies;

//     // Save to localStorage
//     try {
//       localStorage.setItem("r6s-strategies", JSON.stringify(updatedStrategies));
//       console.log("Strategy saved:", strategy.name);
//       showSaveDialog.value = false;
//       strategyName.value = "";
//     } catch (error) {
//       console.error("Error saving strategy:", error);
//       alert("Error saving strategy. Please try again.");
//     }
//   };

//   // Load a saved strategy
//   const loadStrategy = (strategy: SavedStrategy) => {
//     // Update current state
//     currentSide.value = strategy.side;
//     players.value = [...strategy.players];

//     // Find and select the bombsite
//     const bombsite = bombsites.find((b) => b.name === strategy.bombsite);
//     if (bombsite) {
//       selectedBombsite.value = bombsite;
//       currentLayerIndex.value = bombsite.layer;
//     }

//     // Load drawing data into StratPlanner
//     if ((globalThis as any).loadStrategyData) {
//       (globalThis as any).loadStrategyData(
//         strategy.strokes,
//         strategy.utilities,
//       );
//     }

//     showLoadDialog.value = false;
//     console.log("Strategy loaded:", strategy.name);
//   };

//   // Delete a saved strategy
//   const deleteStrategy = (strategyId: string) => {
//     if (confirm("Are you sure you want to delete this strategy?")) {
//       const updatedStrategies = savedStrategies.value.filter((s) =>
//         s.id !== strategyId
//       );
//       savedStrategies.value = updatedStrategies;

//       try {
//         localStorage.setItem(
//           "r6s-strategies",
//           JSON.stringify(updatedStrategies),
//         );
//         console.log("Strategy deleted");
//       } catch (error) {
//         console.error("Error deleting strategy:", error);
//       }
//     }
//   };

//   // Export strategies to file
//   const exportStrategies = () => {
//     try {
//       const dataStr = JSON.stringify(savedStrategies.value, null, 2);
//       const dataBlob = new Blob([dataStr], { type: "application/json" });
//       const url = URL.createObjectURL(dataBlob);

//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `r6s-strategies-${map}-${
//         new Date().toISOString().split("T")[0]
//       }.json`;
//       link.click();

//       URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("Error exporting strategies:", error);
//       alert("Error exporting strategies");
//     }
//   };

//   // Import strategies from file
//   const importStrategies = (event: Event) => {
//     const input = event.target as HTMLInputElement;
//     const file = input.files?.[0];

//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       try {
//         const importedStrategies = JSON.parse(
//           e.target?.result as string,
//         ) as SavedStrategy[];

//         // Merge with existing strategies (avoid duplicates by ID)
//         const existingIds = new Set(savedStrategies.value.map((s) => s.id));
//         const newStrategies = importedStrategies.filter((s) =>
//           !existingIds.has(s.id)
//         );

//         const mergedStrategies = [...savedStrategies.value, ...newStrategies];
//         savedStrategies.value = mergedStrategies;

//         localStorage.setItem(
//           "r6s-strategies",
//           JSON.stringify(mergedStrategies),
//         );
//         console.log(`Imported ${newStrategies.length} new strategies`);
//         alert(`Successfully imported ${newStrategies.length} strategies`);
//       } catch (error) {
//         console.error("Error importing strategies:", error);
//         alert("Error importing strategies. Please check the file format.");
//       }
//     };

//     reader.readAsText(file);
//     input.value = ""; // Reset input
//   };

//   // Load strategies on component mount
//   if (typeof window !== "undefined") {
//     loadSavedStrategies();
//   }

//   return (
//     <div class="flex h-screen">
//       {/* Sidebar */}
//       <div class="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
//         <div class="p-4 border-b border-gray-700">
//           <a
//             href="/maps"
//             class="text-orange-500 hover:text-orange-400 text-sm mb-2 inline-block"
//           >
//             ← Back to Maps
//           </a>
//           <h1 class="text-2xl font-bold capitalize">{map}</h1>
//           <p class="text-gray-400 text-sm">Strategy Planner</p>
//         </div>

//         {/* Side Selection */}
//         {/* <SidePicker
//           currentSide={currentSide.value}
//           onSideChange={handleSideChange}
//           map={map.code}
//         /> */}

//         {/* Player Slots */}
//         <div class="p-4 border-b border-gray-700">
//           <h3 class="font-semibold mb-3">Team Composition</h3>
//           <div class="space-y-2">
//             {players.value.map((player) => (
//               <div key={player.id} class="flex items-center gap-2">
//                 <button
//                   type="button"
//                   onClick={() =>
//                     handlePlayerSelect(player.id)}
//                   class={`flex-1 p-2 rounded text-sm text-left transition-all ${
//                     selectedPlayer.value === player.id
//                       ? "bg-gray-600 ring-2 ring-blue-500"
//                       : "bg-gray-700 hover:bg-gray-600"
//                   }`}
//                   style={{
//                     opacity:
//                       selectedPlayer.value && selectedPlayer.value !== player.id
//                         ? 0.5
//                         : 1,
//                   }}
//                 >
//                   <div class="flex items-center gap-2">
//                     <div
//                       class="w-3 h-3 rounded-full"
//                       style={{ backgroundColor: player.color }}
//                     >
//                     </div>
//                     <span class="font-medium">
//                       {player.operator || `Player ${player.id}`}
//                     </span>
//                   </div>
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() =>
//                     openOperatorSelect(player.id)}
//                   class="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs transition-colors"
//                 >
//                   {player.operator ? "Change" : "Select"}
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Drawing Tools */}
//         <div class="p-4 border-b border-gray-700">
//           <h3 class="font-semibold mb-3">Drawing Tools</h3>
//           <div class="text-xs text-gray-400 mb-2">
//             {selectedPlayer.value
//               ? `Drawing for ${
//                 players.value[selectedPlayer.value - 1].operator ||
//                 `Player ${selectedPlayer.value}`
//               }`
//               : "Select a player first"}
//           </div>
//           <div class="space-y-2">
//             {currentSide.value === "atk" && (
//               <button
//                 type="button"
//                 onClick={() => handleDrawingToolChange("route")}
//                 disabled={!selectedPlayer.value}
//                 class={`w-full px-3 py-2 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
//                   activeDrawingTool.value === "route"
//                     ? "bg-red-600 text-white"
//                     : "bg-red-600 bg-opacity-50 hover:bg-red-600 hover:bg-opacity-75"
//                 }`}
//               >
//                 Attack Route
//               </button>
//             )}
//             {currentSide.value === "def" && (
//               <button
//                 type="button"
//                 onClick={() => handleDrawingToolChange("position")}
//                 disabled={!selectedPlayer.value}
//                 class={`w-full px-3 py-2 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
//                   activeDrawingTool.value === "position"
//                     ? "bg-orange-600 text-white"
//                     : "bg-orange-600 bg-opacity-50 hover:bg-orange-600 hover:bg-opacity-75"
//                 }`}
//               >
//                 Defense Position
//               </button>
//             )}
//             <button
//               type="button"
//               onClick={() => handleDrawingToolChange("utility")}
//               disabled={!selectedPlayer.value}
//               class={`w-full px-3 py-2 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
//                 activeDrawingTool.value === "utility"
//                   ? "bg-purple-600 text-white"
//                   : "bg-purple-600 bg-opacity-50 hover:bg-purple-600 hover:bg-opacity-75"
//               }`}
//             >
//               Utility Placement
//             </button>
//             <button
//               type="button"
//               onClick={() => handleDrawingToolChange("callout")}
//               disabled={!selectedPlayer.value}
//               class={`w-full px-3 py-2 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
//                 activeDrawingTool.value === "callout"
//                   ? "bg-yellow-600 text-white"
//                   : "bg-yellow-600 bg-opacity-50 hover:bg-yellow-600 hover:bg-opacity-75"
//               }`}
//             >
//               Callout
//             </button>
//             <button
//               type="button"
//               onClick={handleClearCanvas}
//               class="w-full px-3 py-2 bg-gray-600 hover:bg-gray-700 rounded text-sm transition-colors"
//             >
//               Clear All
//             </button>
//           </div>
//         </div>

//         {/* Strategy Management */}
//         <div class="p-4 border-b border-gray-700">
//           <h3 class="font-semibold mb-3">Strategy Management</h3>
//           <div class="space-y-2">
//             <button
//               type="button"
//               onClick={() => {
//                 showSaveDialog.value = true;
//               }}
//               class="w-full px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors"
//             >
//               💾 Save Strategy
//             </button>
//             <button
//               type="button"
//               onClick={() => {
//                 loadSavedStrategies();
//                 showLoadDialog.value = true;
//               }}
//               class="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
//             >
//               📂 Load Strategy
//             </button>
//             <div class="flex gap-2">
//               <button
//                 type="button"
//                 onClick={exportStrategies}
//                 class="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-colors"
//               >
//                 📤 Export
//               </button>
//               <label class="flex-1">
//                 <input
//                   type="file"
//                   accept=".json"
//                   onChange={importStrategies}
//                   class="hidden"
//                 />
//                 <div class="px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-colors text-center cursor-pointer">
//                   📥 Import
//                 </div>
//               </label>
//             </div>
//           </div>
//         </div>

//         {/* Bombsite Selection */}
//         {/* <BombsitePicker
//           bombsites={bombsites}
//           selectedBombsite={selectedBombsite.value}
//           onBombsiteSelect={handleBombsiteSelect}
//           layers={layers}
//         /> */}

//         {/* Layer Controls */}
//         <div class="p-4 flex-1">
//           <h3 class="font-semibold mb-3">Floor Layers</h3>
//           <div class="text-sm text-gray-400 mb-2">
//             Click to switch floors (+/- keys)
//           </div>
//           <div class="space-y-1">
//             {layers.map((layer: string, index: number) => (
//               <button
//                 type="button"
//                 key={layer}
//                 onClick={() => handleLayerChange(index)}
//                 class={`w-full p-2 rounded text-sm capitalize text-left transition-colors ${
//                   currentLayerIndex.value === index
//                     ? "bg-blue-600 text-white"
//                     : "bg-gray-700 hover:bg-gray-600 text-gray-300"
//                 }`}
//               >
//                 <span class="text-gray-400">{index + 1}.</span>{" "}
//                 {layer.replace("-", " ")}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Main Map Area */}
//       <div class="flex-1 relative overflow-hidden">
//         <StratPlanner
//           map={map.code}
//           layers={layers}
//           side={currentSide.value}
//           onLayerChange={handleLayerChange}
//           currentLayerIndex={currentLayerIndex.value}
//           selectedPlayer={selectedPlayer.value}
//           _players={players.value}
//         />
//       </div>

//       {/* Operator Selection Modal */}
//       {showOperatorSelect.value && (
//         <div
//           class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
//           style="z-index: 9999;"
//         >
//           <div class="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
//             <h3 class="text-lg font-semibold mb-4">
//               Select Operator (Player {operatorSelectForPlayer.value})
//             </h3>
//             <div class="grid grid-cols-2 gap-2">
//               {OPERATORS[currentSide.value === "atk" ? "attack" : "defense"]
//                 .map((
//                   op,
//                 ) => (
//                   <button
//                     type="button"
//                     key={op}
//                     onClick={() => handleOperatorSelect(op)}
//                     class="p-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors text-left"
//                   >
//                     {op}
//                   </button>
//                 ))}
//             </div>
//             <button
//               type="button"
//               onClick={() => {
//                 showOperatorSelect.value = false;
//                 operatorSelectForPlayer.value = null;
//               }}
//               class="mt-4 w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded transition-colors"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Save Strategy Dialog */}
//       {showSaveDialog.value && (
//         <div
//           class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
//           style="z-index: 9999;"
//         >
//           <div class="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
//             <h3 class="text-lg font-semibold mb-4">Save Strategy</h3>
//             <div class="mb-4">
//               <label class="block text-sm font-medium mb-2">
//                 Strategy Name
//               </label>
//               <input
//                 type="text"
//                 value={strategyName.value}
//                 onInput={(e) =>
//                   strategyName.value = (e.target as HTMLInputElement).value}
//                 placeholder="Enter strategy name..."
//                 class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
//               />
//             </div>
//             <div class="text-sm text-gray-400 mb-4">
//               <div>Map: {map}</div>
//               <div>
//                 Side: {currentSide.value === "atk" ? "Attack" : "Defense"}
//               </div>
//               <div>Bombsite: {selectedBombsite.value?.name || "None"}</div>
//             </div>
//             <div class="flex gap-2">
//               <button
//                 type="button"
//                 onClick={saveStrategy}
//                 class="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors"
//               >
//                 Save
//               </button>
//               <button
//                 type="button"
//                 onClick={() => {
//                   showSaveDialog.value = false;
//                   strategyName.value = "";
//                 }}
//                 class="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded transition-colors"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Load Strategy Dialog */}
//       {showLoadDialog.value && (
//         <div
//           class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
//           style="z-index: 9999;"
//         >
//           <div class="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
//             <h3 class="text-lg font-semibold mb-4">Load Strategy</h3>
//             {savedStrategies.value.length === 0
//               ? (
//                 <div class="text-gray-400 text-center py-8">
//                   No saved strategies found. Create and save a strategy first!
//                 </div>
//               )
//               : (
//                 <div class="space-y-2 mb-4">
//                   {savedStrategies.value
//                     .filter((s) => s.map === map.code)
//                     .map((strategy) => (
//                       <div
//                         key={strategy.id}
//                         class="flex items-center gap-3 p-3 bg-gray-700 rounded"
//                       >
//                         <div class="flex-1">
//                           <div class="font-medium">{strategy.name}</div>
//                           <div class="text-sm text-gray-400">
//                             {strategy.side === "atk"
//                               ? "🔫 Attack"
//                               : "🛡️ Defense"} • {strategy.bombsite}
//                           </div>
//                           <div class="text-xs text-gray-500">
//                             {new Date(strategy.createdAt).toLocaleDateString()}
//                           </div>
//                         </div>
//                         <button
//                           type="button"
//                           onClick={() => loadStrategy(strategy)}
//                           class="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
//                         >
//                           Load
//                         </button>
//                         <button
//                           type="button"
//                           onClick={() => deleteStrategy(strategy.id)}
//                           class="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     ))}
//                 </div>
//               )}
//             <button
//               type="button"
//               onClick={() => showLoadDialog.value = false}
//               class="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded transition-colors"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
