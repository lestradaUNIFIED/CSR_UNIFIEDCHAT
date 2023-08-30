/*Leonard*/
import Layout from "../Components/Layout";
import Login from "../pages/login/Login";
import useAuth from "../hooks/useAuth";
import Loader from "../Components/Loader";
import { Box } from "@mui/material";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { httpPrivate } from "../services/Api";

import '../bootstrap'


function App() {
  const { auth, session, setAuth, setCategories, setCategoryTemplates } = useAuth();

  useEffect(() => {
    let ignore = false;
    if (!ignore) {
      if (session?.sessionUser?.id) {
        async function loadUserInfo() {
         // console.log('loadUserInfo')
          await httpPrivate
            .get(`/user/${session?.sessionUser?.id}`)
            .then((response) => {
              const token = response.data;
           //   console.log(token)
              setAuth({ token });
            });

          const categories = await httpPrivate.get("/all-category");
          setCategories(categories.data);
          const categoryTemplates = await httpPrivate.get("/category-template");
          setCategoryTemplates(categoryTemplates.data);


        }
        loadUserInfo();
      }
    }

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
      if (auth?.token) {
        
        
      }
  }, [auth?.token])

  //console.log(auth);
  return (
    <Box sx={{ maxHeight: "70vh", height: "70vh" }}>
      <Loader />
      {session?.sessionUser ? (
        !auth?.token ? (
          <Loader />
        ) : (
          <Layout />
        )
      ) : (
        <Box>
          <Login />
        </Box>
      )}
      <div>
        {" "}
        <ToastContainer
          autoClose={5000}
          newestOnTop={true}
          closeOnClick
          pauseOnHover={false}
          pauseOnFocusLoss={false}
        />
      </div>
    </Box>
  );
}
export default App;
