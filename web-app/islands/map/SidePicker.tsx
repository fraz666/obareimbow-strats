import { Side } from "../../domain/models/side.ts";

interface SidePickerProps {
  currentSide: Side;
  onSideChange: (side: Side) => void;
}

export default function SidePicker(props: SidePickerProps) {
  const { currentSide, onSideChange } = props;

  return (
    <div>
      <h4>Side</h4>
      <div class="flex gap-2">
        <button
          type="button"
          onClick={() => onSideChange("atk")}
          class={`button__attack ${
            currentSide === "atk"
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          <span>A</span>
        </button>
        <button
          type="button"
          onClick={() => onSideChange("def")}
          class={`button__defense ${
            currentSide === "def"
              ? "bg-orange-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          <span>D</span>
        </button>
      </div>
    </div>
  );
}
