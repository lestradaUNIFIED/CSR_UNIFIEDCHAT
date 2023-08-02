import { createContext } from "react";

const RolesContext = createContext({});

export const RolesProvider = ({ children }) => {
  const ROLES = {
    User: "1210",
    Admin: "5150",
  };

  return (
    <RolesContext.Provider value={{ ROLES }}>{children}</RolesContext.Provider>
  );
};

export default RolesContext;
