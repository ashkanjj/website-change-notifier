import React, { ReactHTML } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

export interface IconTextProps {
  wrapperClassName?: string;
  textClassName?: string;
  faIcon?: IconDefinition;
  text: string;
  link?: string;
  wrapperEl?: keyof ReactHTML;
  textSize?: "xs" | "sm";
}

function IconText(props: IconTextProps) {
  const {
    faIcon,
    link,
    text,
    textClassName,
    textSize = "sm",
    wrapperEl,
  } = props;
  const wrapperProps = {
    className: `relative flex flex-row items-center h-11 pr-6 ${props.wrapperClassName}`,
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
        {!faIcon ? "(icon)" : <FontAwesomeIcon icon={faIcon} />}
      </span>
      <span
        className={`ml-2 text-${textSize} tracking-wide truncate ${textClassName}`}
      >
        {text}
      </span>
    </Wrapper>
  );
}

export default IconText;
