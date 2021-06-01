import React, { useState, useEffect, useMemo } from "react";
import { zip } from "lodash";
import { Website, Snapshot } from "../../../types";
import styled from "styled-components";
import SecondaryHeading from "../../../components/SecondaryHeading";
import useDocumentKeyPress from "../../../contexts/useDocumentKeyPress";
import useSnapshots from "../../../hooks/useSnapshots";
import useWebsites from "../../../hooks/useWebsites";
import {
  Direction,
  MatrixItem,
  OnScreenMatrix,
} from "../../../components/onScreenMatrix";
import MatrixParagraph from "./MatrixParagraph";

interface SelectedItem {
  name: string;
  type: "Website" | "snapshot";
}

export const WebsiteSnapshots = (props: {}) => {
  const { isLoading: websiteLoading, data } = useWebsites();
  const [selectedItem, setSelectedItem] = useState<MatrixItem>();
  const { snapshots, isLoading: snapshotLoading, isError } = useSnapshots(
    selectedItem && selectedItem.type === "website" && selectedItem.id
  );

  useEffect(() => {
    // only initially set the first loaded website
    if (!selectedItem && data.length) {
      setSelectedItem({ id: data[0].id, type: "website" });
    }
  }, [selectedItem, data]);

  const matrix = useMemo(() => {
    const wids = data.map((d) => ({ id: d.id, type: "website" }));
    const sids = snapshots.map((d) => ({ id: d.id, type: "snapshot" }));
    return new OnScreenMatrix(wids, sids);
  }, [data, snapshots]);

  function handleOnKeyPress(e: KeyboardEvent) {
    const direction = directionBasedOnKeyCode(e.keyCode);
    let nextItem = null;
    if (direction) {
      nextItem = matrix.findNextItemInMatrix(selectedItem.id, direction);
      console.log("nextItem", nextItem);
    }
    if (nextItem) {
      setSelectedItem(nextItem);
    }
  }

  useDocumentKeyPress("body", handleOnKeyPress);

  return (
    <Container>
      <Cols>
        <Col>
          <SecondaryHeading>Website list</SecondaryHeading>
          {data.map((website, i) => (
            <MatrixParagraph
              selected={selectedItem?.id === website.id}
              onClick={() => {
                setSelectedItem({ id: website.id, type: "website" });
              }}
            >
              {website.url}
            </MatrixParagraph>
          ))}
        </Col>
        <Col>
          <SecondaryHeading>Snapshots</SecondaryHeading>
          {snapshots.map((snap, i) => (
            <MatrixParagraph
              onClick={() => {
                setSelectedItem({ id: snap.id, type: "snapshot" });
              }}
              selected={selectedItem?.id === snap.id}
            >
              {snap.date}
            </MatrixParagraph>
          ))}
        </Col>
      </Cols>
    </Container>
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

const Cols = styled.div`
  display: flex;
`;

const Col = styled.div`
  max-width: 50%;
  width: 100%;
`;

const Container = styled.div`
  width: 100%;
`;

const ListContainer = styled.div`
  display: flex;
`;

const ListSection = styled.div`
  max-width: 50%;
  width: 100%;
`;
