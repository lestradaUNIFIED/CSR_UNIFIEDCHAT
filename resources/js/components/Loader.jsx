import { Oval } from "react-loader-spinner";
import React, { useCallback, useState, useMemo, useEffect } from "react";
import { httpPrivate, httpAuth } from "../services/Api";
import useAuth from "../hooks/useAuth";

const useAxiosLoader = () => {
  const [counter, setCounter] = useState(0);
  
  const inc = useCallback(
    () => setCounter((counter) => counter + 1),
    [setCounter]
  );
  const dec = useCallback(
    () => setCounter((counter) => counter - 1),
    [setCounter]
  );

  const interceptors = useMemo(
    () => ({
      request: (config) => {
        inc();
        
        return config;
      },
      response: (response) => {
        dec();
        return response;
      },
      error: (error) => {
        dec();
        return Promise.reject(error);
      },
    }),
    [inc, dec]
  );

  useEffect(() => {
    // add request interceptors
    httpPrivate.interceptors.request.use(
      interceptors.request,
      interceptors.error
    );
    httpAuth.interceptors.request.use(interceptors.request, interceptors.error);

    // add response interceptors
    httpPrivate.interceptors.response.use(
      interceptors.response,
      interceptors.error
    );
    httpAuth.interceptors.response.use(
      interceptors.response,
      interceptors.error
    );
    return () => {
      // remove all intercepts when done
      httpPrivate.interceptors.request.eject(interceptors.request);
      httpPrivate.interceptors.request.eject(interceptors.error);
      httpPrivate.interceptors.response.eject(interceptors.response);
      httpPrivate.interceptors.response.eject(interceptors.error);

      httpAuth.interceptors.request.eject(interceptors.request);
      httpAuth.interceptors.request.eject(interceptors.error);
      httpAuth.interceptors.response.eject(interceptors.response);
      httpAuth.interceptors.response.eject(interceptors.error);
    };
  }, [interceptors]);

  return [counter > 0];
};

const Loader = (props) => {
  const check = props.loading == null ? false : props.loading;
  const [loader] = useAxiosLoader();

  // console.log('auth 01', auth)
  return (
    <div
      className="axios-loading"
      style={{ display: loader ? "block" : "none" }}
    >
      <span className="axios-loading-indicator">
        <Oval
          height={120}
          width={120}
          color="#2b2b2b"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="#2b2b2b"
          strokeWidth={6}
          strokeWidthSecondary={6}
        />
      </span>
    </div>
  );
};

export default Loader;
