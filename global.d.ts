// types/globals.d.ts or src/types.d.ts

export {};

declare global {
  interface Window {
    Prism: {
      highlightAll: () => void;
      // add more Prism methods/types if needed
    };
  }
}
