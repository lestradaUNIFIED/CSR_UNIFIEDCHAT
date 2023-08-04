import httpClient from "../services/Api";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await httpClient.get("/refresh", {
      withCredentials: true,
    });

    setAuth((prev) => {
      return { ...prev, accessToken: response.data.token.token };
    });

    return response.data.token.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
