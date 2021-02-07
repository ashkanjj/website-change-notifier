import React, { useState } from "react";
import styled from "styled-components";
import SecondaryHeading from "../../components/SecondaryHeading";
import useSnapshots from "../../hooks/useSnapshots";
import useWebsites from "../../hooks/useWebsites";
import { WebsiteSnapshots } from "./components/WebsiteSnapshots";

const MainParagraph = styled.p`
  font-size: ${(props) => props.theme.fontSize["3xl"]};
`;

const snapshots = [
  { name: "20 Aug 2020 21:21:32" },
  { name: "20 Aug 2020 21:21:35" },
  { name: "20 Aug 2020 21:21:36" },
  { name: "20 Aug 2020 21:21:38" },
].map((d) => ({
  ...d,
  id: d.name.replace(/ /g, "-"), // this is temporary until we do it for real in the API
}));

const Home = () => {
  return (
    <>
      <MainParagraph>Website Change Excluder</MainParagraph>
      <WebsiteSnapshots />
    </>
  );
};

export default Home;
