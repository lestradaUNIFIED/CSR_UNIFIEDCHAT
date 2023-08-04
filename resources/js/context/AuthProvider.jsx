import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [session, setSession] = useState(
    JSON.parse(sessionStorage.getItem("session"))
  );
  return (
    <AuthContext.Provider value={{ auth, setAuth, session, setSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
