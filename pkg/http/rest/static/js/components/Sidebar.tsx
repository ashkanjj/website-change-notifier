import { Link, List, ListItem } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import React from "react";

const Sidebar = () => {
  const props = {
    a: {
      _hover: { textDecoration: "none" },
      _focus: {
        outline: "none",
      },
    },
    listItem: {
      borderRadius: "5px",
      layerStyle: "box",
      _hover: {
        background: "gray.400",
        listStyle: "none",
      },
    },
  };
  return (
    <List fontSize="md" _hover={{ listStyle: "none" }}>
      <ListItem {...props.listItem}>
        <Link as={RouterLink} to="/" {...props.a} _activeLink={}>
          Snapshots
        </Link>
      </ListItem>
      <ListItem {...props.listItem}>
        <Link as={RouterLink} to="/exclusions" {...props.a}>
          Exclusions
        </Link>
      </ListItem>
    </List>
  );
};

export default Sidebar;
