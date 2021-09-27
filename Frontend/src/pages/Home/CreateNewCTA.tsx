import React from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button";

export default function CreateNewURLCTA() {
  return (
    <div>
      <h3 className="mb-6">You have no registered URLs!</h3>
      <Link to="/new-url-watcher" component={Button}>
        Create new URL
      </Link>
    </div>
  );
}
