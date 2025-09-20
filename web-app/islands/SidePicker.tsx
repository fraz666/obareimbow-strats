import { useSignal } from "@preact/signals";

export default function SidePicker() {
  const currentSide = useSignal("atk");

  const handleSideChange = (side: string) => {
    console.log(side);
    currentSide.value = side;

    const newParams = new URLSearchParams({ side });
    globalThis.history.pushState({}, "", "?" + newParams.toString());
  };
  
  return (
    <div>
      <button type='button' onClick={() => handleSideChange("atk")}>ATK</button>
      <button type='button' onClick={() => handleSideChange("def")}>DEF</button>
    </div>
  );
}
