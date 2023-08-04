import { useState } from "react";

export default function useToken() {
  const getToken = () => {
    const tokenString = sessionStorage.getItem("token");
    const userToken = JSON.parse(tokenString);
    return userToken?.token;
  };
  
  const [token, setToken] = useState(getToken());
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({id: 0});
    
  const checkIfLoggedIn = (loggedIn) => {
    setIsLoggedIn(loggedIn);
  }
 
  const saveToken = (userToken) => {
    sessionStorage.setItem("token", JSON.stringify(userToken));
    setToken(userToken.token);
  };

  const saveUserInfo = (userInfo) => {
    setUserInfo(userInfo);
  }

  return {
    setToken: saveToken,
    token,
    setIsLoggedIn : checkIfLoggedIn,
    isLoggedIn,
    userInfo,
    setUserInfo : saveUserInfo
  };
}
