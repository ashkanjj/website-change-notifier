import React from "react";
import styled from "styled-components";

interface IProps {
  children: React.ReactNode;
  selected?: boolean;
  onClick: () => void;
}

const MatrixParagraph = ({ children, onClick, selected }: IProps) => {
  const Paragraph = selected ? WebsiteParagraphSelected : WebsiteParagraph;
  return <Paragraph onClick={onClick}>{children}</Paragraph>;
};

const WebsiteParagraph = styled.p`
  background-color: ${(props) => props.theme.bg};
  color: ${(props) => props.theme.fg};
  font-size: ${(props) => props.theme.fontSize["xl"]};
  padding-left: 12px;

  &:hover {
    cursor: pointer;
    background-color: ${(props) => props.theme.fg};
    color: ${(props) => props.theme.bg};
  }
`;

const WebsiteParagraphSelected = styled(WebsiteParagraph)`
  background-color: ${(props) => props.theme.fg};
  color: ${(props) => props.theme.bg};
`;

export default MatrixParagraph;
