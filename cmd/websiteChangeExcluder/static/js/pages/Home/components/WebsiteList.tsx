import React, { useState, useEffect, useMemo } from "react";
import { zip } from "lodash";
import { Website, Snapshot } from "../../../types";
import styled from "styled-components";
import SecondaryHeading from "../../../components/SecondaryHeading";
import { OnScreenMatrix, Direction } from "../onScreenMatrix";
import useDocumentKeyPress from "../../../contexts/useDocumentKeyPress";

interface IWebsiteListProps {
  websites: Website[];
}

interface SelectedItem {
  name: string;
  type: "Website" | "snapshot";
}

export const WebsiteList = (props: IWebsiteListProps) => {
  const { websites } = props;
  const [selectedItem, setSelectedItem] = useState<string>(
    websites[0].name || ""
  );
  const snapshots = useSnapshots();

  const matrix = useMemo(() => {
    const wids = websites.map((d) => d.name);
    const sids = snapshots.map((d) => d.id);
    return new OnScreenMatrix(wids, sids);
  }, [websites, snapshots]);

  function onKeyPress(e: KeyboardEvent) {
    const direction = directionBasedOnKeyCode(e.keyCode);
    let nextItem = null;
    if (direction) {
      nextItem = matrix.findNextItemInMatrix(selectedItem, direction);
    }
    if (nextItem) {
      setSelectedItem(nextItem);
    }
  }

  useDocumentKeyPress("body", onKeyPress);

  return (
    <React.Fragment>
      <ListContainer>
        <ListSection>
          <SecondaryHeading>Website list</SecondaryHeading>
          {websites.map((website, i) => (
            <ListItem data={website} selected={selectedItem === website.name} />
          ))}
        </ListSection>
        <ListSection>
          <SecondaryHeading>Snapshots</SecondaryHeading>
          {snapshots.map((snap, i) => (
            <ListItem data={snap} selected={selectedItem === snap.id} />
          ))}
        </ListSection>
      </ListContainer>
    </React.Fragment>
  );
};

function directionBasedOnKeyCode(keyCode: number): Direction | null {
  if (keyCode === 38) {
    return "up";
  } else if (keyCode === 40) {
    // down
    return "down";
  } else if (keyCode === 37) {
    // left
    return "left";
  } else if (keyCode === 39) {
    // right
    return "right";
  } else {
    return null;
  }
}

interface WebsiteItemProps {
  data: Website;
  selected?: boolean;
}

const ListItem = (props: WebsiteItemProps) => {
  const { selected, data } = props;
  const Paragraph = selected ? WebsiteParagraphSelected : WebsiteParagraph;
  return (
    <React.Fragment key={data.name}>
      <Paragraph>{data.name}</Paragraph>
    </React.Fragment>
  );
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

const ListContainer = styled.div`
  display: flex;
`;

const ListSection = styled.div`
  max-width: 50%;
  width: 100%;
`;
