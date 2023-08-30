import { Oval, RotatingLines } from "react-loader-spinner";
import {
  Grid,
  List,
  ListItem,
  Avatar,
  Divider,
  Box,
  Fab,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import React, { useRef, useEffect, useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import useFunctions from "../../hooks/useFunctions";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SupportAgentSharpIcon from "@mui/icons-material/SupportAgentSharp";
import m from "moment";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import httpClient from "../../services/Api";
const ChatList = (props) => {
  const {
    loading,
    chatHistory,
    style,
    chatRoom,
    setChatHistory,
    limit,
    setLimit,
    scroll,
    setScroll
  } = props;
  const chatListRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [newItemsLoading, setNewItemsLoading] = useState(false);
  const { tryJSONParse } = useFunctions();
  

  useEffect(() => {
    if(scroll) {
      scrollToBottom({behavior: 'smooth'})
    }
    
  }, [chatListRef, chatHistory])
 
  const handleScroll = (element) => {
    // console.log(element.scrollHeight, element.scrollTop, element.clientHeight)
    const scrollHeight = element.scrollHeight - element.scrollTop;
    if ( (scrollHeight - element.clientHeight) <= 5) {
      setShowScrollButton(false);
    } else {
      setShowScrollButton(true);
    }

    if (element.scrollTop === 0) {
         setLimit({ ...limit, start: limit.start + 20 });
         setScroll(false);
         loadNewChat({ ...limit, start: limit.start + 20 })
         
     // setNewItemsLoading(true);
    }
  };

  
  const loadNewChat = async (limit) => {
    setNewItemsLoading(true);
    await httpClient
      .get(`/chat-message/messages/${chatRoom?.id}`, {
        params: { start: limit.start, length: limit.length },
      })
      .then((response) => {
        const data = response.data;
        const newData = data.reverse().concat(chatHistory);
        setChatHistory(newData);

      });
    setNewItemsLoading(false);
    
  
  }
  const scrollToBottom = (option) => {
    chatListRef?.current?.scroll({
      top: chatListRef.current.scrollHeight,
      behavior: option?.behavior,
    });
  };



  return (
    <Box sx={{ width: "100%" }}>
      <Grid id="window-chat-list" container>
        {loading && (
          <Grid item xs={12} sx={{ height: style.listHeight }}>
            <div style={{ position: "relative", top: "45%", left: "45%" }}>
              <Oval height={50} width={50} />
            </div>
          </Grid>
        )}
        {!loading && (
          <Grid item xs={12}>
            <List
              sx={{
                maxHeight: "100%",
                height: style.listHeight,
                maxWidth: "100%",
                overflow: "auto",
                marginLeft: 1,
                paddingRight: 1,
                display: "flex",
                flexDirection: "column",
              }}
              ref={chatListRef}
              onScroll={(e) => {
                handleScroll(e.target);
              }}
            >
              <ListItem disablePadding sx={{ paddingBottom: 1 }}>
                <Grid container style={{ display: "block" }}>
                  <Grid container>
                    <Grid item xs={12}>
                      <Avatar sx={{ alignContent: "center" }} />
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
                        {chatRoom?.chat_name}
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

              {newItemsLoading && (
                <ListItem sx={{ width: "100%" }}>
                  <Grid container>
                    <Grid item xs={12}>
                      <ListItemIcon sx={{position: "relative", left: "45%"}} >
                          <RotatingLines height={50} width={50} strokeColor="green" strokeWidth="3" />
                      </ListItemIcon>
                    </Grid>
                  </Grid>
                </ListItem>
              )}
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
                      const image_message = tryJSONParse(chat.message, null);
                      if (chat.message === "Sent a Photo.") {
                        return;
                      }

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
                            <Grid container className="Message-content">
                              <Grid item className="avatar">
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
                              </Grid>
                              <Grid item className="text">
                                <div
                                  style={{
                                    fontSize: "x-small",
                                    textAlign: messageFromMe ? "end" : "start",
                                  }}
                                >
                                  {Array.isArray(image_message) ? (
                                    <div className="photo-viewer">
                                      {" "}
                                      <PhotoProvider maskOpacity={0.8}>
                                        {image_message?.map((imgUrl, index) => (
                                          <PhotoView
                                            key={`PhotoView-${chat.id}-${index}`}
                                            src={`data:image/jpeg;base64,${imgUrl}`}
                                          >
                                            <img
                                              key={`img-${chat.id}-${index}`}
                                              style={{
                                                height: 200,
                                                width: "150px",
                                                borderRadius: "10px",
                                                margin: 2,
                                                objectFit: "scale-down",
                                                backgroundColor: "white",
                                              }}
                                              src={`data:image/jpeg;base64,${imgUrl}`}
                                              className="img"
                                            />
                                          </PhotoView>
                                        ))}
                                      </PhotoProvider>
                                    </div>
                                  ) : (
                                    chat.message
                                  )}
                                  {/*
                                    <img
                                      src={`data:image/jpeg;base64,${chat.message}`}
                                    />
                                    */}
                                </div>
                              </Grid>
                              <Grid container className="timestamp">
                                {m(chat.created_at).format(
                                  "YYYY-MM-DD HH:mm:ss"
                                )}
                              </Grid>
                            </Grid>
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
                      <Divider light={false}>{queue_info.queue_status}</Divider>
                    </div>
                  </React.Fragment>
                );
              })}
              <ListItem></ListItem>
            </List>
          </Grid>
        )}
      </Grid>
      <div style={{ height: 0 }}>
        <Fab
          id="scrolldown-button"
          size="small"
          color="primary"
          sx={{ display: showScrollButton ? "flex" : "none" }}
          className="chat-list-footer"
          onClick={() => {
            scrollToBottom();
          }}
        >
          <ArrowDownwardIcon fontSize="inherit" />
        </Fab>
      </div>
    </Box>
  );
};

export default ChatList;
