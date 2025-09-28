import { useSignal } from "@preact/signals";
import StratPlanner from "./StratPlanner.tsx";

interface MapInterfaceProps {
  map: string;
  layers: string[];
  bombsites: any[];
  side: string;
}

export default function MapInterface(props: MapInterfaceProps) {
  const { map, layers, bombsites, side } = props;
  const currentLayerIndex = useSignal(0);
  const activeDrawingTool = useSignal("attack");

  const handleLayerChange = (index: number) => {
    currentLayerIndex.value = index;
  };

  const handleDrawingToolChange = (tool: string) => {
    activeDrawingTool.value = tool;
    if ((window as any).setDrawingMode) {
      (window as any).setDrawingMode(tool);
    }
  };

  const handleClearCanvas = () => {
    if ((window as any).clearStratCanvas) {
      (window as any).clearStratCanvas();
    }
  };

  return (
    <div class="flex h-screen">
      {/* Sidebar */}
      <div class="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div class="p-4 border-b border-gray-700">
          <a href="/maps" class="text-orange-500 hover:text-orange-400 text-sm mb-2 inline-block">
            ← Back to Maps
          </a>
          <h1 class="text-2xl font-bold capitalize">{map}</h1>
          <p class="text-gray-400 text-sm">Strategy Planner</p>
        </div>

        {/* Side Selection */}
        <div class="p-4 border-b border-gray-700">
          <h3 class="font-semibold mb-3">Team Side</h3>
          <div class="flex gap-2">
            <a 
              href={`/map/${map}?side=atk`}
              class={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                side === "atk" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Attack
            </a>
            <a 
              href={`/map/${map}?side=def`}
              class={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                side === "def" 
                  ? "bg-orange-600 text-white" 
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Defense
            </a>
          </div>
        </div>

        {/* Bombsites */}
        <div class="p-4 border-b border-gray-700">
          <h3 class="font-semibold mb-3">Bombsites</h3>
          <div class="space-y-2">
            {bombsites.map((site: any) => (
              <button
                key={site.code}
                onClick={() => handleLayerChange(site.layer)}
                class="w-full p-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-left transition-colors"
              >
                <div class="font-medium">{site.name}</div>
                <div class="text-gray-400 text-xs">
                  {layers[site.layer]} floor
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Drawing Tools */}
        <div class="p-4 border-b border-gray-700">
          <h3 class="font-semibold mb-3">Drawing Tools</h3>
          <div class="space-y-2">
            <button 
              onClick={() => handleDrawingToolChange("attack")}
              class={`w-full px-3 py-2 rounded text-sm transition-colors ${
                activeDrawingTool.value === "attack"
                  ? "bg-red-600 text-white"
                  : "bg-red-600 bg-opacity-50 hover:bg-red-600 hover:bg-opacity-75"
              }`}
            >
              Attack Route
            </button>
            <button 
              onClick={() => handleDrawingToolChange("defense")}
              class={`w-full px-3 py-2 rounded text-sm transition-colors ${
                activeDrawingTool.value === "defense"
                  ? "bg-orange-600 text-white"
                  : "bg-orange-600 bg-opacity-50 hover:bg-orange-600 hover:bg-opacity-75"
              }`}
            >
              Defense Position
            </button>
            <button 
              onClick={() => handleDrawingToolChange("callout")}
              class={`w-full px-3 py-2 rounded text-sm transition-colors ${
                activeDrawingTool.value === "callout"
                  ? "bg-yellow-600 text-white"
                  : "bg-yellow-600 bg-opacity-50 hover:bg-yellow-600 hover:bg-opacity-75"
              }`}
            >
              Callout
            </button>
            <button 
              onClick={handleClearCanvas}
              class="w-full px-3 py-2 bg-gray-600 hover:bg-gray-700 rounded text-sm transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Layer Controls */}
        <div class="p-4 flex-1">
          <h3 class="font-semibold mb-3">Floor Layers</h3>
          <div class="text-sm text-gray-400 mb-2">Click to switch floors (+/- keys)</div>
          <div class="space-y-1">
            {layers.map((layer: string, index: number) => (
              <button
                key={layer}
                onClick={() => handleLayerChange(index)}
                class={`w-full p-2 rounded text-sm capitalize text-left transition-colors ${
                  currentLayerIndex.value === index
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                }`}
              >
                <span class="text-gray-400">{index + 1}.</span> {layer.replace('-', ' ')}
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
          side={side}
          onLayerChange={handleLayerChange}
          currentLayerIndex={currentLayerIndex.value}
        />
      </div>
    </div>
  );
}