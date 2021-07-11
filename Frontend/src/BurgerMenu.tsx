import React from "react";

export default function BurgerMenu(props: {
  open: boolean;
  onOpen: (open: boolean) => void;
  className?: string;
}) {
  const { className, open, onOpen } = props;

  const divClassesCommon = `w-6 h-1 bg-white rounded-xl transition-all origin-1 group-hover:bg-blue-100`;

  return (
    <button
      onClick={() => onOpen(!open)}
      className={`relative flex flex-col ml-5 justify-around w-6 h-6 bg-transparent border-none cursor-pointer p-0 z-10 focus:outline-none group ${className}`}
    >
      <div
        className={`${divClassesCommon} transform ${
          open ? "rotate-45" : "rotate-0"
        } `}
      />
      <div
        className={`${divClassesCommon} ${
          open ? `opacity-0` : "opacity-100"
        } transform ${open ? "translate-x-5" : "translate-x-0"}`}
      />
      <div
        className={`${divClassesCommon} transform ${
          open ? "-rotate-45" : "rotate-0"
        }`}
      />
    </button>
  );
}
