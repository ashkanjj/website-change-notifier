import React from "react";
import styled from "styled-components";
import useWebsites from "../../hooks/useWebsites";
import { WebsiteList } from "./components/WebsiteList";

const MainParagraph = styled.p`
  font-size: ${(props) => props.theme.fontSize["3xl"]};
`;

const WebsitesContainer = styled.div`
  width: 100%;
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

  // TODO: load the snapshots here based on the selected WebsiteList which we get from WebsiteList
  // const snapshots = useSnapshots();
  return (
    <>
      <MainParagraph>Website Change Excluder</MainParagraph>
      <WebsitesContainer>
        <WebsiteList />
      </WebsitesContainer>
    </>
  );
};

export default Home;
