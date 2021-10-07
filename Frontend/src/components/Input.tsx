import React from "react";
interface Input {
  id: string;
  name: string;
  onChange: (event: React.FormEvent<HTMLInputElement>) => void;
  placeholder: string;
  value: string;
}
const Input = (props: Input) => {
  const { onChange, id, name, placeholder, value } = props;
  const classNames = "";
  return (
    <input
      className={
        "w-full relative text-base p-4 h-10 rounded-md border-2 border-solid appearance-none transition-all outline-none focus:border-blue-600 "
      }
      placeholder={placeholder}
      id={id}
      type="text"
      name={name}
      autoComplete="off"
      value={value}
      onChange={onChange}
    />
  );
};

export default Input;
