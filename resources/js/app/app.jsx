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
  const { auth, session, setAuth } = useAuth();
  
  useEffect(() => {
    let ignore = false;
    if (!ignore) {
      if (session?.sessionUser?.id) {
        async function loadUserInfo() {
          await httpPrivate
            .get(`/user/${session?.sessionUser?.id}`)
            .then((response) => {
              const token = response.data;
           //   console.log(token)
              setAuth({ token });
            });
        }

        loadUserInfo();
      }
    }

    return () => {
      ignore = true;
    };
  }, []);

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
