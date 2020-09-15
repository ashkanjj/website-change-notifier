import { useEffect } from "react";

function useDocumentKeyPress(el: string, handler: (e: KeyboardEvent) => void) {
  useEffect(() => {
    const body = document.querySelector(el);
    body.addEventListener("keyup", handler);

    return () => {
      body.removeEventListener("keyup", handler);
    };
  }, [handler]);
}

export default useDocumentKeyPress;
