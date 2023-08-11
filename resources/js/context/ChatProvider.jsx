import { createContext, useState, useEffect, useRef, useContext } from "react";
import useAuth from "../hooks/useAuth";
import m from 'moment';
import websocket from "../services/Ws";
import NotificationContext from "./DesktopNotificationProvider";
import useCategoryAccess from "../hooks/useCategoryAccess";
const ChatContext = createContext({});

export const ChatProvider = ({ children }) => {
  
  const getRoomState = () => {
    return JSON.parse(sessionStorage.getItem("roomState")) || {};
  }

  const [lastChat, setLastChat] = useState({});
  const [roomState, setRoomState] = useState(getRoomState());
  const [recon, setRecon] = useState(false);
  const [ws, setWs] = useState(null);
  const [chatActive, setChatActive] = useState(false);
  const { auth } = useAuth();
  const { ALLOWED_CATEGORY } = useCategoryAccess();
  const { setNotif } = useContext(NotificationContext);
  const user = auth?.token?.user 
  const wsRef = useRef(null);
  
  useEffect(() => {
    let ignore = false;
    if (!wsRef.current && !recon && ALLOWED_CATEGORY.length > 0) {
      wsRef.current = websocket(`api/chat?csr_id=${user?.id}`);

      wsRef.current.onopen = (e) => {
        open(e);
        function open(e) {
          setChatActive(true);
          setWs(true);
          setRecon(true);
          console.log("Chat Connected", m().format("YYYY-MM-DD HH:mm:ss"));
        }
      };
      wsRef.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        const msgDetails = JSON.parse(message.text);
        let realMessage = JSON.parse(message.text);
        realMessage.queue_info = `{"queue_status":"ONGOING", "queue_id": ${realMessage.queue_id}}`;
        const messageFromMe = msgDetails.message_from === "CSR";
        
        if(ALLOWED_CATEGORY.find((cat) => cat === '*' ? true : +cat === realMessage.category_id)) {
          setLastChat(realMessage);
          if (!messageFromMe) {
            setNotif({
              open: true,
              message: `${msgDetails.sender} : ${msgDetails.message}`,
            });
          } 

        }
       
        
      };

      wsRef.current.onclose = () => {
        console.log("Chat Disconnected to ", m().format("YYYY-MM-DD HH:mm:ss"));
        setChatActive(false);

        setTimeout(() => {
          wsRef.current = null;
          setWs(false);
          setRecon(false);
        }, 5000);
        ignore = false;
      };
    }

    return () => {
      //  wsRef.current?.close();
      ignore = true;
      //ws.close();
    };

    // setWs(chatWs);
  }, [wsRef.current, recon, ALLOWED_CATEGORY]);


  useEffect(() => {
    //  console.log(chatHistory)
    if (!roomState[lastChat.room_code] && lastChat.room_code) {

      const newRoomState = {...roomState, [lastChat.room_code]: {unread : 1, lastMessage: lastChat.message}}
      saveRoomState(newRoomState);


    } else {
      if (lastChat.message_from === "CUSTOMER") {
        const updateRoomState = {
          ...roomState,
          [lastChat.room_code]: {
            ...roomState[lastChat.room_code],
            unread: roomState[lastChat.room_code]?.unread + 1,
            lastMessage: lastChat.message,
          },
        };
       
        saveRoomState(updateRoomState);
      } else {
        const updateRoomState = {
          ...roomState,
          [lastChat.room_code]: {
            ...roomState[lastChat.room_code],
            lastMessage: lastChat.message,
          },
        }
        saveRoomState(updateRoomState);
      }
    }
    
  }, [lastChat]);

  const saveRoomState = (roomState) => {
      setRoomState(roomState)
      sessionStorage.setItem("roomState", JSON.stringify(roomState));
  }
  
  return (
    <ChatContext.Provider
      value={{ lastChat, setLastChat, roomState, setRoomState : saveRoomState}}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
