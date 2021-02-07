import React, { useEffect, useRef, useState } from "react";
import { OnScreenMatrix } from "../components/onScreenMatrix";

const onScreenMatrix = new OnScreenMatrix();

function useOnScreenMatrix() {
  const [list, setList] = useState<string[]>([]);
  const singleton = useRef(null);

  useEffect(() => {
    singleton.current = onScreenMatrix;
  }, []);

  function updateList(nl) {
    const newList = [...list, ...nl];
    singleton.current.addNewArray(newList);
    setList(newList);
  }

  return {
    matrix: singleton.current,
    updateList,
  };
}

export default useOnScreenMatrix;
