import { createContext, useState, useEffect } from "react";
import { httpPrivate } from "../services/Api";
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [session, setSession] = useState(
    JSON.parse(sessionStorage.getItem("session"))
  );
  const [categories, setCategories] = useState([]);
  const [categoryTemplates, setCategoryTemplates] = useState([]);
  const [ALLOWED_CATEGORY, SET_ALLOWED_CATEGORY] = useState([]);

  const GET_ALLOWED_CATEGORY = (CATEGORY) => {
      SET_ALLOWED_CATEGORY(CATEGORY);
  }
  
  return (
    <AuthContext.Provider value={{ auth, setAuth, session, setSession, categories, categoryTemplates, setCategories, setCategoryTemplates, ALLOWED_CATEGORY, SET_ALLOWED_CATEGORY : GET_ALLOWED_CATEGORY }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
