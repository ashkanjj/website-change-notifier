import React, { ReactHTML } from "react";

interface IProps {
  className?: string;
  icon?: string;
  text: string;
  link?: string;
  wrapperEl?: keyof ReactHTML;
}

function IconText(props: IProps) {
  const { icon = "(icon)", link, text, wrapperEl } = props;
  const wrapperProps = {
    className: `relative flex flex-row items-center h-11 pr-6 ${props.className}`,
  };
  let Wrapper;
  if (!wrapperEl) {
    Wrapper = (props: { children: React.ReactNode }) =>
      React.createElement("a", {
        ...wrapperProps,
        href: link || "#",
        children: props.children,
      });
  } else {
    Wrapper = (props: { children: React.ReactNode }) =>
      React.createElement(wrapperEl, {
        ...wrapperProps,
        children: props.children,
      });
  }
  return (
    <Wrapper>
      <span className="inline-flex justify-center items-center ml-4">
        {icon}
      </span>
      <span className="ml-2 text-sm tracking-wide truncate">{text}</span>
    </Wrapper>
  );
}

export default IconText;
