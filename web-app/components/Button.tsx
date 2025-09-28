/** @jsxImportSource preact */

export interface ButtonProps {
  id?: string;
  onClick?: () => void;
  children?: string | number | Element | Element[];
  disabled?: boolean;
  class?: string;
  type?: "button" | "submit" | "reset";
}

export function Button(props: ButtonProps) {
  const { children, class: className, type = "button", ...rest } = props;

  return (
    <button
      type={type}
      {...rest}
      class={`px-2 py-1 border-gray-500 border-2 rounded-sm bg-white hover:bg-gray-200 transition-colors ${
        className || ""
      }`}
    >
      {children}
    </button>
  );
}
