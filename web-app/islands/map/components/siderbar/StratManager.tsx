import { Signal, signal } from "@preact/signals";
import { Strategy } from "../../../../domain/models/strategy.ts";
import { Side } from "../../../../domain/models/side.ts";
import { TRACE_COLORS } from "../../../../domain/costants.ts";
import OperatorsModal from "../../../../components/OperatorsModal.tsx";

interface StratManagerProps {
  isAdmin: boolean;
  side: Side;
  currentStrat: Partial<Strategy> | null;
  availableStrats: Partial<Strategy>[];
  currentPlayerIndex: number | null;
  onStratChange: (s: string) => void;
  onStratAdd: () => void;
  onStratSave: (s: Partial<Strategy>) => void;
  onStratDelete: (s: string) => void;
  onPlayerChange: (idx: number) => void;
}

export function StratManager(props: StratManagerProps) {
  const {
    isAdmin,
    side,
    currentStrat,
    availableStrats,
    currentPlayerIndex,
    onStratChange,
    onStratAdd,
    onStratSave,
    onStratDelete,
    onPlayerChange,
  } = props;

  const isModalOpen = signal(false);
  const modalRelatedPlayerIndex: Signal<number|null> = signal(null);

  const stratName = signal(currentStrat?.code ?? "");

  const playerPicker = (
    <div class="flex flex-col gap-2 pt-2 pb-2">
      {(currentStrat?.players ?? []).map((p, idx) => {
        return (
          <div class="flex flex-row">
            {p != null && (
              <button
                type="button"
                class="bg-gray-700 text-gray-300 hover:bg-gray-600"
                style={{
                  backgroundImage: `url(/operators/${p}.png)`,
                  backgroundSize: "cover",
                  width: "48px",
                  height: "48px",
                }}
                onClick={() => {
                  modalRelatedPlayerIndex.value = idx;
                  isModalOpen.value = true;
                }}
              >
              </button>
            )}

            {p == null && (
              <button
                type="button"
                class="bg-gray-700 text-gray-300 hover:bg-gray-600"
                style={{ width: "48px", height: "48px" }}
                onClick={() => {
                  modalRelatedPlayerIndex.value = idx;
                  isModalOpen.value = true;
                }}
              >
                {idx + 1}
              </button>
            )}

            <button
              type="button"
              style={{ flex: 1, backgroundColor: TRACE_COLORS[idx] }}
              onClick={() => onPlayerChange(idx)}
            >
            </button>
          </div>
        );
      })}
      <OperatorsModal
        isOpen={isModalOpen}
        side={side}
        onSelect={(operator: string) => {
          console.log("Selected operator:", operator);

          if (currentStrat) {
            currentStrat.players![modalRelatedPlayerIndex.value!] = operator;
          }

          console.warn("Current strat after selection:", currentStrat?.players);

          isModalOpen.value = false;
          modalRelatedPlayerIndex.value = null;
        }}
        onClose={() => {
          isModalOpen.value = false;
          modalRelatedPlayerIndex.value = null;
        }}
      />
    </div>
  );

  return (
    <div>
      <h4>Strats</h4>
      {isAdmin && (
        <button
          type="button"
          class="mb-2 bg-gray-700 text-gray-300 hover:bg-gray-600"
          onClick={() => onStratAdd()}
        >
          Add
        </button>
      )}

      <div class="strats-container">
        {availableStrats.map((strat) => {
          // Selected strat
          if (stratName.value === strat.code) {
            if (isAdmin) {
              return (
                <div class="bg-blue-600 text-white p-2">
                  <input
                    class="w-100 mb-2 text-center bg-gray-700 text-gray-300 hover:bg-gray-600 focus:outline-none"
                    value={stratName.value}
                    onInput={(e) => stratName.value = e.currentTarget.value}
                    readOnly
                  />
                  {playerPicker}
                  <button
                    type="button"
                    class="bg-gray-700 text-gray-300 hover:bg-gray-600"
                    onClick={() => onStratSave(currentStrat!)}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    class="bg-gray-700 text-gray-300 hover:bg-gray-600 ml-2"
                    onClick={() => onStratDelete(stratName.value)}
                  >
                    Delete
                  </button>
                </div>
              );
            } else {
              return (
                <button
                  type="button"
                  onClick={() => onStratChange(strat.code!)}
                  class="bg-blue-600 text-gray-300"
                >
                  {strat.code}
                </button>
              );
            }
          }

          // Unselected strat
          return (
            <button
              type="button"
              onClick={() => onStratChange(strat.code!)}
              class="bg-gray-700 text-gray-300 hover:bg-gray-600"
            >
              {strat.code}
            </button>
          );
        })}
      </div>
    </div>
  );
}
