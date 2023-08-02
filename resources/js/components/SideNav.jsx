//import avatar1 from "../assets/images/sample/avatar1.png";
//import iconVerified from "../assets/images/icons/icon-verified.png";
import iconHome from "../assets/images/icons/icon-home.png";
import iconHomeActive from "../assets/images/icons/icon-home-active.png";
//import iconFeed from "../assets/images/icons/icon-device-message.png";
import UpsLogo from "../assets/images/icons/Unified_Logo-01.png";
import iconMenu from "../assets/images/icons/hamburger-line-default.png";

/*Leonard*/
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import useToken from "../services/Auth";
import { Navigate } from "react-router-dom";

function SideNav() {
  const { token, setToken } = useToken();
  const Logout = () => {
    Swal.fire({
      title: "Confirm logout?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      customClass: {
        actions: "my-actions",
        cancelButton: "order-1 right-gap",
        confirmButton: "order-2",
        denyButton: "order-3",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.removeItem("token");
        setToken("");
      }
      //else if (result.isDenied) {
      //   Swal.fire("Changes are not saved", "", "info");
      // }
    });
  };

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="side-nav-container">
      <div className="side-nav">
        <div className="side-header mb-2">
          <img
            src={iconMenu}
            className="icon"
            style={{ width: "30px", height: "30px" }}
            alt=""
          />
          <img src={UpsLogo} className="logo-img" alt="" />
          <span className="logo-brand">Unified Portal</span>
        </div>
        {/* <hr className="divider" /> */}
        <div className="menu-list-con">
          <ul className="menu-list">
            <li className="menu-item-active">
              <span className="icon">
                <img src={iconHomeActive} className="icon" alt="" srcSet="" />
              </span>
              Dashboard
            </li>
            <li className="menu-item">
              <span className="icon">
                <img src={iconHome} className="icon" alt="" srcSet="" />
              </span>
              News Feed
            </li>
            <li className="menu-item">
              <span className="icon">
                <img src={iconHome} className="icon" alt="" srcSet="" />
              </span>
              Account Settings
            </li>
            <li className="menu-item">
              <span className="icon">
                <img src={iconHome} className="icon" alt="" srcSet="" />
              </span>
              FAQ
            </li>
            <li className="menu-item">
              <span className="icon">
                <img src={iconHome} className="icon" alt="" srcSet="" />
              </span>
              Help
            </li>
            <li
              className="menu-item"
              style={{ cursor: "pointer" }}
              onClick={Logout}
            >
              <span className="icon">
                <FontAwesomeIcon icon={faRightFromBracket} size="2xl" />
              </span>
              Logout
            </li>

            <li
              className="menu-item"
              style={{
                bottom: "-20px",
                position: "absolute",
                paddingBottom: 0,
              }}
            >
              <span className="icon">
                <img src={iconHome} alt="" srcSet="" />
              </span>
              My Profile
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SideNav;
