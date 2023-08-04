import { createContext, useContext, useState, useEffect, useRef } from "react";
import websocket from "../services/Ws";
import QueueContext from "./QueueProvider";
import NotificationContext from "./DesktopNotificationProvider";
import useToastify from "../hooks/useToastify";
import m from "moment";
import useAuth from "../hooks/useAuth";
import useCategoryAccess from "../hooks/useCategoryAccess";
const WebsocketContext = createContext("");

export const WebsocketProvider = ({ children }) => {
  const wsRef = useRef(null);
  const { setQueueActive, setQueueRows } = useContext(QueueContext);
  const [recon, setRecon] = useState(false);
  const [sbOpen, setSbOpen] = useState({
    open: false,
    severity: "info",
    message: "",
  });
  const { auth } = useAuth();
  const user = auth?.token?.user;
  const { setNotif } = useContext(NotificationContext);
  const { createToast } = useToastify();
  const { ALLOWED_CATEGORY } = useCategoryAccess();


  useEffect(() => {
    let ignore = false;

    if (!wsRef.current && !recon && auth?.token && ALLOWED_CATEGORY.length > 0) {
      wsRef.current = websocket("chat/queue");

      console.log("Live Queue Status", wsRef.current.readyState);
      wsRef.current.onopen = (e) => {
        open(e);
        function open(e) {
          setQueueActive(true);
          setRecon(true);
          console.log("Queueing Active", m().format("YYYY-MM-DD HH:mm:ss"));
           
     //     console.log(ALLOWED_CATEGORY)
        }
      };
      wsRef.current.onmessage = (e) => {
        const data = JSON.parse(e.data);
        const dataTxt = JSON.parse(data.text);

        dataTxt.date_onqueue = m(dataTxt.date_onqueue).format("YYY-MM-DD HH:mm:ss");
        // console.log(e);
       
        if (dataTxt.remove) {
          setSbOpen({
            open: true,
            severity: "warning",
            message: `${dataTxt.chat_name} was removed to the queue. `,
          });

          createToast({
            type: "warning",
            message: `${dataTxt.chat_name} was removed to the queue. `,
          });

          setQueueRows((prevRows) =>
            [...prevRows].filter((row) => +row.id !== +dataTxt.id)
          );
        }
        else if(dataTxt.cancel) {
          setSbOpen({
            open: true,
            severity: "error",
            message: `${dataTxt.chat_name} cancelled queue. `,
          });

          createToast({
            type: "error",
            message: `${dataTxt.chat_name} cancelled queue. `,
          });

          setQueueRows((prevRows) =>
            [...prevRows].filter((row) => +row.id !== +dataTxt.id)
          );

        }
        
        else {
          if (dataTxt.queue_status === "WAITING") {
         
      //        console.log(ALLOWED_CATEGORY);
              if (ALLOWED_CATEGORY.find((cat) => cat === '*' ? true : +cat === dataTxt.category_id)) {
                setSbOpen({
                  open: true,
                  severity: "info",
                  message: `${dataTxt.firstname} ${dataTxt.lastname} was added to the queue. `,
                });
                setQueueRows((prevRows) => [...prevRows, dataTxt]);
    
                createToast({
                  type: "info",
                  message: `${dataTxt.firstname} ${dataTxt.lastname} was added to the queue. `,
                });
  
              }
            
  
            

          }
        }

        // setNotif({ open: true, message: sbOpen.message });
      };

      wsRef.current.onclose = () => {
        console.log(
          "Live Queue Disconnected",
          wsRef.current.readyState,
          m().format("YYYY-MM-DD HH:mm:ss")
        );

        setQueueActive(false);
        setTimeout(() => {
          setRecon(false);
          wsRef.current = null;
        }, 5000);
        ignore = false;
      };
    }
    return () => {
      ignore = true;
    };
  }, [wsRef, recon, auth?.token, ALLOWED_CATEGORY]);

  return (
    <WebsocketContext.Provider value={{ wsRef, sbOpen, setSbOpen }}>
      {children}
    </WebsocketContext.Provider>
  );
};

export default WebsocketContext;
