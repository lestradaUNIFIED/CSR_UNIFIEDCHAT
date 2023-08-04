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
  
  useEffect(() => {
    let ignore = false;
    const loadCategories = async () => {
      const response = await httpPrivate.get("/all-category");
      setCategories(response.data);
    };
    if (!ignore) {
      loadCategories();
    }

    return () => {
      ignore = true;
    };
  }, []);


  useEffect(() => {
    async () => {
      
    }
    let ignore = false;
    const loadTemplates = async () => {
      const response = await httpPrivate.get("/category-template");
      setCategoryTemplates(response.data);
    };
    if (!ignore) {
      loadTemplates();
    }

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, session, setSession, categories, categoryTemplates }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
