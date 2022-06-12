import { useEffect } from "react";

//stolen from https://medium.com/nerd-for-tech/using-custom-hooks-to-handle-keyboard-shortcuts-in-react-a91649a81c87
export function useKeyPress(
  callback: (event: KeyboardEvent) => void,
  keys: string[],
  options: readonly ("NEEDS_SHIFT" | "PREVENT_DEFAULT")[] = []
): void {
  const checkShift = ({ shiftKey }: KeyboardEvent) =>
    shiftKey || !options.includes("NEEDS_SHIFT");

  const handler = (event: KeyboardEvent) => {
    const { key } = event;

    if (keys.includes(key) && checkShift(event)) {
      if (options.includes("PREVENT_DEFAULT")) event.preventDefault();

      callback(event);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [callback]);
}
