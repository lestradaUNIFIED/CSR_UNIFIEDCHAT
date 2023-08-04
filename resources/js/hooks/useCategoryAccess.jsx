import { useEffect, useState } from "react";

import useCategoryTemplate from "./useCategoryTemplates";
import useAuth from "./useAuth";

const useCategoryAccess = () => {
    const { categoryTemplates } = useCategoryTemplate();
    const { auth } = useAuth();
    const user = auth?.token?.user;
    const [ALLOWED_SUB_CATEGORY, SET_ALLOWED_SUB_CATEGORY] = useState([]);
    const [ALLOWED_CATEGORY, SET_ALLOWED_CATEGORY] = useState([]);


    useEffect(() => {
        
            if(auth?.token && categoryTemplates.length > 0) {
                const USER_CATEGORY_TEMPLATE = JSON.parse(user?.category);
           //     console.log("Templates", categoryTemplates);
                const ALLOWED_TEMPLATE = categoryTemplates.filter(
                    (category_templates) =>
                        USER_CATEGORY_TEMPLATE.toString().includes(
                            category_templates.id
                        )
                );
               SET_ALLOWED_CATEGORY(
                    ALLOWED_TEMPLATE.map((value) => {
                        const CATEGORIES = JSON.parse(value.categories);
                        const CATEGORY =
                            CATEGORIES.category_id === "*"
                                ? ["*"]
                                : JSON.parse(CATEGORIES.category_id);
        
                        for (let cat of CATEGORY) {
                            return cat;
                        }
                    })
                );
        
            }

   

        
    }, [auth?.token, categoryTemplates])

    return { ALLOWED_CATEGORY };
};

export default useCategoryAccess;
