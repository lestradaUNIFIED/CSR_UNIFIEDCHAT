import { useEffect, useState } from "react";
import { httpPrivate } from "../services/Api";
const useCategory = () => {
  const [categories, setCategories] = useState([]);

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
  return {
    categories,
  };
};

export default useCategory;
