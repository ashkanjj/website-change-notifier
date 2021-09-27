import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "primary" | "secondary";
  navigate?: () => void;
}
const Button = React.forwardRef((props: ButtonProps, ref) => {
  const { children, onClick = () => {}, type = "primary", navigate } = props;
  const classes =
    type === "primary"
      ? "border border-solid border-gray-700 uppercase transition-all rounded-sm bg-blue-800 hover:bg-blue-900 text-white p-4 h-10 inline-flex items-center"
      : "";
  return (
    <button
      ref={ref as unknown as any}
      className={classes}
      onClick={navigate ?? onClick}
    >
      {children}
    </button>
  );
});

export default Button;
