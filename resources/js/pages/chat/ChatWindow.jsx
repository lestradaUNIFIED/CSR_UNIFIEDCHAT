import "../../assets/styles/chat.css";
import {
  Grid,
  Grow,
  IconButton,
  List,
  Divider,
  TextField,
  InputAdornment,
  ListItem,
  Avatar,
} from "@mui/material";
import React, {
  Component,
  useState,
  useRef,
  useEffect,
  useContext,
} from "react";
import CloseIcon from "@mui/icons-material/Close";
import WebAssetIcon from "@mui/icons-material/WebAsset";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SupportAgentSharpIcon from "@mui/icons-material/SupportAgentSharp";
import PhotoIcon from "@mui/icons-material/Photo";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import useAuth from "../../hooks/useAuth";
import useFunctions from "../../hooks/useFunctions";
import websocket from "../../services/Ws";
import NotificationContext from "../../context/DesktopNotificationProvider";
import { Oval } from "react-loader-spinner";
import ChatWindowContext from "../../context/ChatWindowProvider";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

import  m from "moment";
function ChatWindow(props) {
  const { chatInfo, chatList } = props;
  const { chatRoom } = chatInfo;
  const [show, setShow] = useState(true);
  const [chatHistory, setChatHistory] = useState(chatList);
  const [message, setMessage] = useState("");
  const [chatActive, setChatActive] = useState(false);
  const { auth } = useAuth();
  const { properCase } = useFunctions();
  const { setNotif } = useContext(NotificationContext);
  const user = auth?.token?.user;
  const wsRef = useRef(null);
  const chatListRef = useRef(null);
  const [key, setKey] = useState(chatRoom.id);
  const [recon, setRecon] = useState(true);
  const { minimizeChatWindow, closeChatWindow, maximizedChatWindow } =
    useContext(ChatWindowContext);
  const [showEmojis, setShowEmojis] = useState(false);
  useEffect(() => {
    if (!wsRef.current && recon) {
      wsRef.current = websocket(
        `api/chat/${chatRoom.id}/${chatRoom.customer_id}`
      );

      wsRef.current.onopen = (e) => {
        setChatActive(true);
        setRecon(false);
        // console.log(wsRef.current);
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
          setNotif({
            open: true,
            message: `${msgDetails.sender} : ${msgDetails.message}`,
          });
          setKey(`${msgDetails.message}${m().format("HH:mm:ss")}`);
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

  useEffect(() => {
    chatListRef.current.scroll({
      top: chatListRef.current.scrollHeight,
    });
  }, [chatHistory]);

  const sendMessage = (e) => {
    e.preventDefault();

    if (wsRef.current.readyState !== 1) {
      alert("Cannot Send Message at this time!");
    } else {
      wsRef.current?.send(
        JSON.stringify({
          chat_room_id: chatRoom.id,
          receiver_id: chatRoom.customer_id,
          message: message,
          sender_id: user?.id,
          sender: properCase(user?.nick_name),
          room_code: chatRoom.room_code,
          message_from: "CSR",
        })
      );

      setMessage("");
    }
  };

  const closeChat = () => {
    wsRef.current.close();
    
    closeChatWindow(chatRoom.id);
  };

  const minimizeChat = (chatInfo) => {
    wsRef.current.close();
    setRecon(true);

    minimizeChatWindow(chatInfo);
  };

const maximizeChat = () => {

  maximizedChatWindow({chatRoom, chatHistory})
}

  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);

    setMessage((prevMsg) => prevMsg + emoji);
  };

  return (
    <Grow in>
      <div>
        {showEmojis && (
          <div
            style={{
              position: "absolute",
              top: "-80px",
              left: "0px",
              borderRadius: "20px",
              backgroundColor: "red",
              padding: 0,
              maxWidth: "180px",
              maxHeight: "100px",
              zIndex: "99999",
            }}
          >
            <Picker
              data={data}
              onEmojiSelect={addEmoji}
              theme="dark"
              onClickOutside={() => {
                setShowEmojis(false);
              }}
              emojiSize={20}
              emojiButtonSize={30}
              style={{ height: "100px" }}
            />
          </div>
        )}
        <div
          id="chatWindow"
          className="chat-window"
          style={{ display: show ? "block" : "none" }}
           >
          <Grid id="window-chat-header" container className="head">
            <Grid item xs={1}>
              <Avatar
                sx={{ height: 30, width: 30, backgroundColor: "#eb5e00" }}
              />
            </Grid>
            <Grid item xs={7} className="text">
              {chatRoom.chat_name}
            </Grid>
            <Grid item xs={4}>
              <IconButton
                style={{ height: 20, width: 20 }}
                onClick={() => {
                  minimizeChat({ chatRoom, chatHistory });
                }}
              >
                <HorizontalRuleIcon
                  style={{ color: "#fff", fontSize: "smaller" }}
                />
              </IconButton>
              <IconButton
                style={{
                  height: 20,
                  width: 20,
                  paddingLeft: 2,
                  paddingRight: 2,
                }}
                onClick={maximizeChat}
              >
                <WebAssetIcon style={{ color: "#fff", fontSize: "smaller" }} />
              </IconButton>

              <IconButton
                style={{ height: 20, width: 20 }}
                onClick={() => {
                  closeChat();
                }}
              >
                <CloseIcon style={{ color: "#fff", fontSize: "smaller" }} />
              </IconButton>
            </Grid>
          </Grid>
          <Grid id="window-chat-list" container>
            <Grid item xs={12}>
              <List
                sx={{
                  height: "300px",
                  maxWidth: "350px",
                  overflow: "auto",
                  marginLeft: 1,
                  paddingRight: 1,
                }}
                ref={chatListRef}
              >
                <ListItem disablePadding sx={{ paddingBottom: 1 }}>
                  <Grid container style={{ display: "block" }}>
                    <Grid container>
                      <Grid item xs={12}>
                        <Avatar sx={{ position: "relative", left: "45%" }} />
                      </Grid>
                    </Grid>
                    <Grid container>
                      <Grid item xs={12}>
                        <div
                          style={{
                            textAlign: "center",
                            fontSize: "small",
                            fontWeight: "bold",
                          }}
                        >
                          {chatRoom.chat_name}
                        </div>
                      </Grid>
                    </Grid>
                    <Grid container>
                      <Grid item xs={12}>
                        <Divider />
                      </Grid>
                    </Grid>
                  </Grid>
                </ListItem>
                {Object.entries(
                  chatHistory.reduce((chat, row) => {
                    const { queue_info } = row;
                    if (!chat[queue_info]) {
                      chat[queue_info] = [];
                    }
                    chat[queue_info].push(row);

                    return chat;
                  }, {})
                ).map(([queue, chats]) => {
                  const queue_info = JSON.parse(
                    queue ||
                      `"{"queue_status":"ONGOING", "queue_id" : ${chatRoom.current_queue_id}}"`
                  );
                  return (
                    <React.Fragment key={queue}>
                      {chats.map((chat, index) => {
                        const messageFromMe = chat.message_from === "CSR";
                        const sender = messageFromMe ? chat.csr : chat.customer;
                        return (
                          <React.Fragment key={`lisMessage${index}${queue}`}>
                            <li
                              className={
                                messageFromMe
                                  ? "Messages-message currentMember"
                                  : "Messages-message"
                              }
                            >
                              <div className="Message-content">
                                <div className="avatar">
                                  {!messageFromMe && (
                                    <AccountCircleIcon
                                      sx={{
                                        height: "25px",
                                        width: "25px",
                                      }}
                                      style={{
                                        color: "#1178f5",
                                      }}
                                    />
                                  )}
                                  {messageFromMe && (
                                    <SupportAgentSharpIcon
                                      sx={{
                                        height: "25px",
                                        width: "25px",
                                      }}
                                      style={{
                                        color: "#fc821e",
                                      }}
                                    />
                                  )}
                                </div>
                                <div
                                  className="text"
                                  style={{
                                    fontSize: "x-small",
                                    textAlign: messageFromMe ? "end" : "start",
                                  }}
                                >
                                  {chat.message}
                                  {/*
                                                <img
                                                  src={`data:image/jpeg;base64,${chat.message}`}
                                                />
                                                */}

                                  <div className="timestamp">
                                    {m(chat.created_at).format(
                                      "YYYY-MM-DD HH:mm:ss"
                                    )}
                                  </div>
                                </div>
                              </div>
                            </li>
                          </React.Fragment>
                        );
                      })}
                      <div
                        style={{
                          paddingBottom: 30,
                          marginTop: 30,
                          fontWeight: "bold",
                          display:
                            queue_info.queue_status === "ONGOING"
                              ? "none"
                              : "block",
                        }}
                      >
                        <Divider light={false}>
                          {queue_info.queue_status}
                        </Divider>
                      </div>
                    </React.Fragment>
                  );
                })}
              </List>
            </Grid>
          </Grid>
          <Grid
            id="window-chat-footer"
            container
            sx={{ borderTopColor: "#808080", borderTop: 1 }}
          >
            {+chatRoom.status_code === 3 && <Grid></Grid>}
            {!(+chatRoom.status_code === 3) && (
              <Grid
                item
                xs={12}
                sx={{ padding: 1 }}
                component={"form"}
                onSubmit={sendMessage}
              >
                <Grid container gap={1}>
                  <Grid item xs={12}>
                    <TextField
                      sx={{
                        borderRadius: 4,
                        border: 1,
                        borderColor: "#888888",
                        paddingLeft: 1,
                      }}
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowEmojis(!showEmojis);
                              }}
                            >
                              <EmojiEmotionsIcon style={{ color: "#006aff" }} />
                            </IconButton>
                          </InputAdornment>
                        ),
                        startAdornment: (
                          <Oval height={20} width={20} visible={!chatActive} />
                        ),
                        disableUnderline: true,
                      }}
                      onChange={(e) => {
                        setMessage(e.target.value);
                      }}
                      value={message}
                      disabled={!chatActive}
                      autoFocus
                      variant="standard"
                    />
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Grid>
        </div>
      </div>
    </Grow>
  );
}

export default ChatWindow;
