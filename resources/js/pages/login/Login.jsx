import "../../assets/styles/login.css";
import { HelmetProvider, Helmet } from "react-helmet-async";
import UnifiedLogo from "../../assets/images/icons/Unified_Logo-01.png";
import UpsInput from "../../Components/UpsInput";
import UpsButton from "../../Components/UpsButton";
import { Suspense, useContext } from "react";
// import { useState } from "react";

/*Leonard*/
import Swal from "sweetalert2";
import AuthContext from "../../context/AuthProvider";
import { httpPrivate, httpAuth } from "../../services/Api";
function Login() {
  const { setSession, setAuth } = useContext(AuthContext);
  const HandleSubmit = async (event) => {
    event.preventDefault();
    // console.log('Event', event);

    const formData = new FormData(event.currentTarget);
    const loginCredentials = {
      userid: formData.get("userid"),
      password: formData.get("password"),
    };
    await httpAuth.get("/sanctum/csrf-cookie").then((response) => {
      console.log(response);
      httpPrivate
        .post("/login", loginCredentials)
        .then((response) => {
          //  console.log(response.data);
          const token = response.data;
          const sessionUser = {
            id: response.data.user.id,
          };
          setAuth({ token });
          setSession({ sessionUser });
          sessionStorage.setItem("session", JSON.stringify({ sessionUser }));
        })
        .catch((error, response) => {
          console.log("Unauthorized!", error, response);
          //     alert('Unauthorized!')
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.message,
          });
        });
    });
  };

  return (
    <div className="container">
      <form id="formLogin" onSubmit={HandleSubmit}>
        <div className="container">
          <div className="login-body shadow bg-white">
            <HelmetProvider>
              <Suspense fallback={null}>
                <Helmet>
                  <title>Login</title>
                </Helmet>
              </Suspense>
            </HelmetProvider>

            <div className="login-wrapper">
              <div className={"login-left"}>
                <h1 className="mt-1 m-0">Login to your account</h1>

                <UpsInput
                  placeholder="Username"
                  type="text"
                  name="userid"
                  id="userid"
                />
                <UpsInput
                  placeholder="Password"
                  type="password"
                  name="password"
                  id="password"
                />
                {
                  <div className="container justify-content-right">
                    <a
                      href="/forgotpassword"
                      className="ups-link mt-1 m-0"
                      style={{ textAlign: "right", paddingRight: "7em" }}
                    >
                      forgot password
                    </a>
                  </div>
                }

                {
                  <UpsButton
                    type="submit"
                    text="Sign In"
                    style={{ width: "30%", marginTop: "1em" }}
                  />
                }
              </div>
              <div className={"login-right bg-yellow-gradient"}>
                <img
                  src={UnifiedLogo}
                  className="login-icon mt-5 mb-3"
                  alt=""
                />

                <span className="blob1"></span>
                <span className="blob2"></span>
                <span className="blob3"></span>
                <span className="blob4"></span>
              </div>
            </div>
          </div>
          <div></div>
        </div>
      </form>
    </div>
  );
}

export default Login;
// Login.propTypes = {
//   setIsLoggedIn: PropTypes.func.isRequired,
// };
