import { useEffect, useState } from "react";
import { httpPrivate } from "../services/Api";
const useCategoryTemplate = () => {
  const [categoryTemplates, setCategoryTemplates] = useState([]);

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
  return {
    categoryTemplates,
  };
};

export default useCategoryTemplate;
