import "react-toastify/dist/ReactToastify.css";

import { toast } from "react-toastify";

const useToastify = () => {
  const createToast = (toastInfo) => {
    switch (toastInfo.type) {
      case "info":
        toast.info(toastInfo.message, {style : {
          color: '#ffffff',
          backgroundColor: '#053ef7'
        }} );
        break;
      case "warning":
        toast.warning(toastInfo.message, {style : {
          color: '#ffffff',
          backgroundColor: '#f77605'
        }});
        break;
      case "success":
        toast.success(toastInfo.message);
        break;
    }
  };

  return {
    createToast
  };
};

export default useToastify;
