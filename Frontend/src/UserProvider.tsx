import React from "react";
import { User } from "./types";

export const UserContext = React.createContext<User | null>(null);

const defaults: User = {
  name: "Ash",
};

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = React.useState<User>(defaults);
  // TODO: implement fetching the user here
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
