import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  disabled: boolean;
  onClick?: () => void;
  type?: "primary" | "secondary";
  submitBtn?: boolean;
  navigate?: () => void;
}
const Button = React.forwardRef((props: ButtonProps, ref) => {
  const {
    disabled = false,
    children,
    onClick = () => {},
    type = "primary",
    navigate,
    submitBtn = false,
  } = props;
  const classes =
    type === "primary"
      ? "border border-solid border-gray-700 uppercase transition-all rounded-sm bg-blue-800 hover:bg-blue-900 text-white p-4 h-10 inline-flex items-center disabled:opacity-5"
      : "";
  return (
    <button
      disabled={disabled}
      ref={ref as unknown as any}
      className={classes}
      onClick={navigate ?? onClick}
      type={submitBtn ? "submit" : "button"}
    >
      {children}
    </button>
  );
});

export default Button;
