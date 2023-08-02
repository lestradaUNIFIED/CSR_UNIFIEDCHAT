import React from "react";
import { createContext, useState } from "react";
import { Stack, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ChatWindow from "../pages/chat/ChatWindow";
import ChatHead from "../pages/chat/ChatHead";


const ChatWindowContext = createContext({});



export const ChatWindowProvider = ({ children }) => {
  const [chatWindow, setChatWindow] = useState([]);
  const [chatHead, setChatHead] = useState([]);
  const navigate = useNavigate();



  const showChatWindow = (chatInfo) => {
    const { chatRoom } = chatInfo;
    if (
      chatWindow.findIndex((value) => value.chatRoom.id === chatRoom.id) === -1
    ) {
      setChatWindow((cw) => [...cw, chatInfo]);
      deleteChatHead(chatInfo);
    }
  };
  
  const deleteChatHead = (chatInfo) => {
    const { chatRoom } = chatInfo;
    //  alert("deleteChatHead");
    setChatHead((prev) =>
      prev.filter((value) => !(value.chatRoom.id === chatRoom.id))
    );
  };
  
  const closeChatWindow = (room_id) => {
  
    setChatWindow((prev) => prev.filter((item) => (item.chatRoom.id !== room_id)));
  };

  const maximizedChatWindow = (chatInfo) => {
    //console.log(chatInfo);
    const { chatRoom } = chatInfo;
 //   setSelectedTab(+chatRoom.status_code - 1);
    navigate(
      `/chat/dm/${chatRoom.room_code}/${chatRoom.customer_id}/${chatRoom.id}/${chatRoom.current_queue_id}/${chatRoom.status_code}`
    );
  };

  const minimizeChatWindow = (chatInfo) => {
    const { chatRoom } = chatInfo;
    setChatHead((heads) => [...heads, chatInfo]);
   // console.log(chatHead);
    closeChatWindow(chatRoom.id);
  };

  return (
    <ChatWindowContext.Provider
      value={{ chatWindow, setChatWindow, chatHead, setChatHead, showChatWindow, minimizeChatWindow, closeChatWindow, maximizedChatWindow }}
    >
      

      {children}
      <div
        style={{
          position: "fixed",
          textAlign: "right",
          bottom: "0px",
          right: "80px",
          borderBottom: 1,
          borderBottomColor: "#888888",
          zIndex: "500",
        }}
      >
        <Stack
          direction={"row"}
          gap={1}
          sx={{
            display: "flex",
            flexDirection: "row-reverse",
            height: "100%",
          }}
        >
          {chatWindow.map((value, index) => {
            return (
              <React.Fragment key={index}>
                <Box>
                 <ChatWindow key={value.chatRoom.id} chatInfo={value} chatList={value.chatHistory} />
                </Box>
              </React.Fragment>
            );
          })}
        </Stack>
      </div>

      <div
        style={{
          position: "fixed",
          right: "10px",
          textAlign: "right",
          bottom: "50px"
        }}
      >
        <Stack
          gap={2}
          sx={{
            display: "flex",
            flexDirection: "column-reverse",
            height: "100%",
          }}
        >
          {chatHead.map((value, index) => {
            return (
              <React.Fragment key={index}>
                <Box>
                  <ChatHead
                    key={value.chatRoom.id}
                    chatInfo={value}
                  />
                </Box>
              </React.Fragment>
            );
          })}
        </Stack>
      </div>
    </ChatWindowContext.Provider>
  );
};

export default ChatWindowContext;
