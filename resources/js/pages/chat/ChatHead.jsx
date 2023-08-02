import "../../assets/styles/chat.css";
import { Fab, Zoom, Box, Badge } from "@mui/material";
import { useState, useRef, useEffect, useContext } from "react";
import CloseIcon from "@mui/icons-material/Close";
import websocket from "../../services/Ws";
import ChatWindowContext from "../../context/ChatWindowProvider";
import m from "moment";
const ChatHead = (props) => {
  const { deleteChatHead } = props;
  const { chatRoom } = props.chatInfo;
  const initials = `${chatRoom?.chat_name?.charAt(
    0
  )}${chatRoom?.chat_name?.charAt(chatRoom?.chat_name?.lastIndexOf(" ") + 1)}`;
  const [closeButton, setCloseButton] = useState(false);
  const wsRef = useRef(null);
  const [recon, setRecon] = useState(true);
  const [chatActive, setChatActive] = useState(false);
  const [msgCount, setMsgCount] = useState(0);  
  const [chatHistory, setChatHistory] = useState(props.chatInfo.chatHistory);

  const { showChatWindow } = useContext(ChatWindowContext);

  useEffect(() => {
    if (!wsRef.current && recon) {
      wsRef.current = websocket(
        `api/chat/${chatRoom.id}/${chatRoom.customer_id}`
      );
      wsRef.current.onopen = (e) => {
        setChatActive(true);
        setRecon(false);
     //   console.log('Chat head WS',wsRef.current);
      };

      wsRef.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        const msgDetails = JSON.parse(message.text);
        const chatMsg = message.chatMessage;
        let realMessage = JSON.parse(message.text);
        realMessage.queue_info = `{"queue_status":"ONGOING", "queue_id": ${chatRoom.current_queue_id}}`;
        const messageFromMe = msgDetails.message_from === "CSR";

        setChatHistory((chatH) => [...chatH, realMessage]);
        
        if (!messageFromMe) {
          setMsgCount((prevCount) => prevCount + 1);
       //   console.log(msgCount)
        } else {
        }
      };
    }
    wsRef.current.onclose = () => {
      setRecon(true);
      setChatActive(false);
      wsRef.current = null;
    };
    return () => {};
  }, [wsRef.current, recon]);



  return (
    <Box>
      <Zoom in>
        <Box>
          <Badge color="secondary" badgeContent={msgCount} >
          <Fab
            color={chatActive ? "primary" : "default"}
            onMouseEnter={(e) => {
              //  e.stopPropagation();
              setCloseButton(true);
            }}
            onMouseLeave={(e) => {
              //    e.stopPropagation();
              setCloseButton(false);
            }}
            disabled={!chatActive}
          >
            <div
              className="closeChatHeadButton"
              style={{
                display: closeButton ? "flex" : "none",
              }}
              onMouseEnter={(e) => {
                //  e.stopPropagation();
                setCloseButton(true);
              }}
              onMouseLeave={(e) => {
                //    e.stopPropagation();
                setCloseButton(false);
              }}
              onClick={deleteChatHead}
              size="small"
            >
              <CloseIcon fontSize="small" style={{ color: "#ddd" }} />
            </div>
            <div
              onClick={() => {showChatWindow({chatRoom, chatHistory})}}
              style={{
                fontSize: "small",
                fontWeight: "bold",
                position: "fixed",
                display: "block",
                height: "inherit",
                width: "inherit",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <span
                style={{
                  alignContent: "center",
                  display: "block",
                  position: "relative",
                  top: "35%",
                }}
              >
                {initials}
              </span>
            </div>
          </Fab>
          </Badge>
        
        </Box>
      </Zoom>
    </Box>
  );
};

export default ChatHead;
