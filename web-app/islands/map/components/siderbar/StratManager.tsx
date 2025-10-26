import { signal } from "@preact/signals";

interface StratManagerProps {
  currentStrat: string | null;
  availableStrats: string[];
  onStratChange: (s: string) => void;
  onStratAdd: () => void;
  onStratSave: (s: string) => void;
  onStratDelete: (s: string) => void;
}

export function StratManager(props: StratManagerProps) {
  const {
    currentStrat,
    availableStrats,
    onStratChange,
    onStratAdd,
    onStratSave,
    onStratDelete,
  } = props;

  const stratName = signal(currentStrat ?? "");

  return (
    <div>
      <h4>Strats</h4>
      <button
        type="button"
        class="mb-2 bg-gray-700 text-gray-300 hover:bg-gray-600"
        onClick={() => onStratAdd()}
      >
        Add
      </button>
      <div class="strats-container">
        {availableStrats.map((strat) => {
          // TODO admin check here
          if (currentStrat === strat) {
            return (
              <div class="bg-blue-600 text-white p-2">
                <input
                  class="w-100 text-center bg-gray-700 text-gray-300 hover:bg-gray-600 focus:outline-none"
                  value={currentStrat}
                  onInput={(e) => stratName.value = e.currentTarget.value}
                />
                <button
                  type="button"
                  class="bg-gray-700 text-gray-300 hover:bg-gray-600"
                  onClick={() => onStratSave(stratName.value)}
                >
                  Save
                </button>
                <button
                  type="button"
                  class="bg-gray-700 text-gray-300 hover:bg-gray-600"
                  onClick={() => onStratDelete(strat)}
                >
                  Delete
                </button>
              </div>
            );
          }

          return (
            <button
              type="button"
              onClick={() => onStratChange(strat)}
              class="bg-gray-700 text-gray-300 hover:bg-gray-600"
            >
              {strat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
