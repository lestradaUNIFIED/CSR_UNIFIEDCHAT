import { createContext, useState, useEffect, useRef, useContext } from "react";
import useAuth from "../hooks/useAuth";
import m from 'moment';
import websocket from "../services/Ws";
import NotificationContext from "./DesktopNotificationProvider";

const ChatContext = createContext({});

export const ChatProvider = ({ children }) => {
  const [lastChat, setLastChat] = useState({});
  const [roomState, setRoomState] = useState({});
  const [recon, setRecon] = useState(false);
  const [ws, setWs] = useState(null);
  const [chatActive, setChatActive] = useState(false);
  const { auth } = useAuth();
  const { setNotif } = useContext(NotificationContext);
  const user = auth?.token?.user 
  const wsRef = useRef(null);
  
  useEffect(() => {
    let ignore = false;
    if (!wsRef.current && !recon) {
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

        setLastChat(realMessage);
        if (!messageFromMe) {
          setNotif({
            open: true,
            message: `${msgDetails.sender} : ${msgDetails.message}`,
          });
        } else {
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
  }, []);

  useEffect(() => {
    //  console.log(chatHistory)

    if (!roomState[lastChat.room_code] && lastChat.room_code) {
      setRoomState((prev) => ({
        ...prev,
        [lastChat.room_code]: { unread: 1, lastMessage: lastChat.message },
      }));
    } else {
      if (lastChat.message_from === "CUSTOMER") {
        setRoomState({
          ...roomState,
          [lastChat.room_code]: {
            ...roomState[lastChat.room_code],
            unread: roomState[lastChat.room_code]?.unread + 1,
            lastMessage: lastChat.message,
          },
        });
      } else {
        setRoomState({
          ...roomState,
          [lastChat.room_code]: {
            ...roomState[lastChat.room_code],
            lastMessage: lastChat.message,
          },
        });
      }
    }
  }, [lastChat]);

  return (
    <ChatContext.Provider
      value={{ lastChat, setLastChat, roomState, setRoomState }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
