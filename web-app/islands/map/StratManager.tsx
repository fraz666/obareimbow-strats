
interface StratManagerProps {
  currentStrat: string | null;
  availableStrats: string[];
  onStratChange: (s: string) => void;
}

export function StratManager(props: StratManagerProps) {
  const { currentStrat, availableStrats, onStratChange } = props;

  return (
    <div>
      <h4>Strats</h4>
      <div class="strats-container">
        {availableStrats.map((strat) => (
          <button
          type="button"
          onClick={() => onStratChange(strat)}
          class={`${
            currentStrat === strat
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
          >
            {strat}
          </button>
        ))}
      </div>
    </div>
  );
}
