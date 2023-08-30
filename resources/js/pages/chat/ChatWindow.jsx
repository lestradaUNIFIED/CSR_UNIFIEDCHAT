import "../../assets/styles/chat.css";
import "react-photo-view/dist/react-photo-view.css";
import { Grid, IconButton, Avatar, Slide, Box } from "@mui/material";
import React, { useState, useRef, useEffect, useContext } from "react";
import CloseIcon from "@mui/icons-material/Close";
import WebAssetIcon from "@mui/icons-material/WebAsset";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import useAuth from "../../hooks/useAuth";
import useFunctions from "../../hooks/useFunctions";
import websocket from "../../services/Ws";
import NotificationContext from "../../context/DesktopNotificationProvider";
import ChatWindowContext from "../../context/ChatWindowProvider";
import { httpPlain, httpPrivate } from "../../services/Api";
import m from "moment";
import ChatContext from "../../context/ChatProvider";
import EndChatDialog from "./EndChatDialog";
import ChatList from "./ChatList";
import ChatFooter from "./ChatFooter";
function ChatWindow(props) {
  const { chatInfo, chatList, windowControl, style } = props;
  const { chatRoom } = chatInfo;
  const [chatHistory, setChatHistory] = useState(chatList);
  const [chatActive, setChatActive] = useState(false);
  const { auth } = useAuth();
  const { properCase } = useFunctions();
  const { setNotif } = useContext(NotificationContext);
  const user = auth?.token?.user;
  const wsRef = useRef(null);
  const [recon, setRecon] = useState(true);
  const {
    minimizeChatWindow,
    closeChatWindow,
    maximizedChatWindow,
  } = useContext(ChatWindowContext);

  const [loading, setLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [chatEnded, setChatEnded] = useState(false);
  const { roomState, setRoomState } = useContext(ChatContext);
  const [limit, setLimit] = useState({ start: 0, length: 20 });
  const [scroll, setScroll] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function getChat() {
      setChatHistory([]);
      if (!ignore) {
        setLoading(true);
        await httpPlain
          .get(`/chat-message/messages/${chatRoom?.id}`, {
            params: { start: limit.start, length: limit.length },
          })
          .then((response) => {
            // console.log(response.data);
            const data = response.data;
            setChatHistory(data.reverse());
          })
          .catch((err) => {
            console.log(err);
          });
        setLoading(false);
      }
    }
    getChat();
    return () => {
      ignore = true;
    };
  }, [chatRoom]);

  useEffect(() => {
    if (!wsRef.current && recon && chatRoom?.id) {
      wsRef.current = websocket(
        `api/chat/${chatRoom?.id}/${chatRoom?.customer_id}?client_type=CSR`
      );

      wsRef.current.onopen = (e) => {
        setChatActive(true);
        setRecon(false);
        console.log(`Connected to `, chatRoom?.chat_name);
      };

      wsRef.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        const msgDetails = JSON.parse(message.text);
        const chatMsg = message.chatMessage;
        let realMessage = JSON.parse(message.text);
        realMessage.queue_info = `{"queue_status":"ONGOING", "queue_id": ${chatRoom.current_queue_id}}`;
        const messageFromMe = msgDetails.message_from === "CSR";

        setScroll(true);
        setChatHistory((chatH) => [...chatH, realMessage]);
        if (!messageFromMe) {
          setNotif({
            open: true,
            message: `${msgDetails.sender} : ${msgDetails.message}`,
          });
          setScroll(true)
         // setKey(`${msgDetails.message}${m().format("HH:mm:ss")}`);
        } else {
        }
      };

      wsRef.current.onclose = () => {
        console.log(`Chat disconnected to `, chatRoom?.chat_name);
        setRecon(true);
        setChatActive(false);
        wsRef.current = null;
      };
    }

    return () => {};
  }, [wsRef.current, recon, chatRoom]);

  const closeChat = () => {
    if (wsRef.current) {
      if (wsRef.current.readyState === 1) {
        wsRef.current.close();
        setRecon(true);
      }
    }
    closeChatWindow(chatRoom?.id);
  };

  const minimizeChat = (chatInfo) => {
    if (wsRef.current) {
      if (wsRef.current.readyState === 1) {
        wsRef.current.close();
        setRecon(true);
      }
    }
    minimizeChatWindow(chatInfo);
  };

  const maximizeChat = () => {
    maximizedChatWindow({ chatRoom, chatHistory });
  };

  const updateRoomState = () => {
    if (roomState[chatRoom.room_code]) {
      setRoomState({
        ...roomState,
        [chatRoom.room_code]: {
          ...roomState[chatRoom.room_code],
          unread: 0,
        },
      });
    }
  };

  return (
    <Box>
      <EndChatDialog
        confirmDialogOpen={confirmDialogOpen}
        setConfirmDialogOpen={setConfirmDialogOpen}
        wsRef={wsRef}
        chatRoom={chatRoom}
        chatEnded={chatEnded}
        setChatEnded={setChatEnded}
      />
      <Slide direction="right" in>
        <div>
          <div id="chatWindow" className="chat-window" style={style}>
            <Grid id="window-chat-header" container className="head">
              <Grid item xs={10} sx={{ display: "flex" }}>
                <Avatar
                  sx={{
                    height: 30,
                    width: 30,
                    backgroundColor: "#eb5e00",
                    position: "fixed",
                  }}
                />
                <div className="text">{chatRoom?.chat_name}</div>
              </Grid>
              <Grid item xs={2} sx={{ textAlign: "end" }}>
                <IconButton
                  style={{
                    height: 20,
                    width: 20,
                    display: windowControl ? "inline" : "none",
                    padding: 0,
                  }}
                  onClick={() => {
                    minimizeChat({ chatRoom, chatHistory });
                  }}
                  color="default"
                >
                  <HorizontalRuleIcon style={{ fontSize: "smaller" }} />
                </IconButton>
                <IconButton
                  style={{
                    height: 20,
                    width: 20,
                    paddingLeft: 2,
                    paddingRight: 2,
                    padding: 0,
                    display: windowControl ? "inline" : "none",
                  }}
                  onClick={maximizeChat}
                  color="default"
                >
                  <WebAssetIcon style={{ fontSize: "smaller" }} />
                </IconButton>

                <IconButton
                  style={{
                    height: 20,
                    width: 20,
                    display: windowControl ? "inline" : "none",
                    padding: 0,
                  }}
                  onClick={() => {
                    closeChat();
                  }}
                  color="default"
                >
                  <CloseIcon style={{ fontSize: "smaller" }} />
                </IconButton>
              </Grid>
            </Grid>
            <Grid container>
              <ChatList
                loading={loading}
                chatHistory={chatHistory}
                style={style}
                chatRoom={chatRoom}
                setChatHistory={setChatHistory}
                limit={limit}
                setLimit={setLimit}
                scroll={scroll}
                setScroll={setScroll}
                
              />
            </Grid>
            <Grid
              id="window-chat-footer"
              container
              sx={{ borderTopColor: "#808080", borderTop: 1 }}
            >
              <ChatFooter
                chatRoom={chatRoom}
                wsRef={wsRef}
                chatActive={chatActive}
                setConfirmDialogOpen={setConfirmDialogOpen}
                  
              />
            </Grid>
          </div>
        </div>
      </Slide>
    </Box>
  );
}

export default ChatWindow;
