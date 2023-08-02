import { httpPrivate } from "../services/Api";
import { useEffect } from "react";
import useAuth from "./useAuth";

const useHttpPrivate = () => {
    const { auth } = useAuth();

    useEffect(() => {

        const requestIntercept = httpPrivate.interceptors.request.use(
            config => {
                if(!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth.token.token}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );


        const responseIntercept = httpPrivate.interceptors.response.use(
            response => response,
            async (error) => {

                const prevRequest = error?.config;
                if(error?.response.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    conts 
                }
            }
        )

    }, auth);
}