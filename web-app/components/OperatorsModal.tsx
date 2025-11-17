import { Side } from "../domain/models/side.ts";

import availableOperators from "../static/operators/info.json" with {
  type: "json",
};
import { Signal } from "@preact/signals";

interface OperatorsModalProps {
  isOpen: Signal<boolean>;
  side: Side;
  onSelect: (operator: string) => void;
  onClose: () => void;
}

export default function OperatorsModal({
  isOpen,
  side,
  onSelect,
  onClose,
}: OperatorsModalProps) {
  const filter = side === "atk" ? "attack" : "defense";
  const filteredOperators = availableOperators[filter];

  if (!isOpen.value) return null;

  return (
    <div
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
      style="z-index: 9999;"
    >
      <div class="bg-gray-800 flex flex-col p-6 max-w-md w-full max-h-96">
        <h3 class="text-lg font-semibold mb-4">
          Select an operator
        </h3>

        <div class="grid grid-cols-5 gap-4 overflow-y-auto">
          {filteredOperators.map((o: string) => (
            <button
              type="button"
              class="bg-gray-700 text-gray-300 hover:bg-gray-600"
              style={{
                backgroundImage: `url(/operators/${o}.png)`,
                backgroundSize: "cover",
                width: "48px",
                height: "48px",
              }}
              onClick={() => onSelect(o)}
            >
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          class="mt-4 w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
