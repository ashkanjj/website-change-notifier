import React from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import VStack from "../../components/VStack";

export default () => {
  return (
    <div>
      <VStack spacing="1rem">
        <p>Well done! You registered an URL &#127881; </p>
        <Link to="/" component={Button}>
          URLs list
        </Link>
      </VStack>
    </div>
  );
};
