import React from "react";
import { createContext, useState } from "react";
import { Stack, Box, AvatarGroup } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ChatHead from "../pages/chat/ChatHead";

const ChatWindowContext = createContext({});

export const ChatWindowProvider = ({ children }) => {
  const [chatWindow, setChatWindow] = useState([]);
  const [chatHead, setChatHead] = useState([]);
  const navigate = useNavigate();

  const showChatWindow = (chatInfo) => {
    const { chatRoom } = chatInfo;
  //  console.log(chatRoom);
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
    setChatWindow((prev) =>
      prev.filter((item) => item.chatRoom.id !== room_id)
    );
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
      value={{
        chatWindow,
        setChatWindow,
        chatHead,
        setChatHead,
        showChatWindow,
        minimizeChatWindow,
        closeChatWindow,
        maximizedChatWindow,
        deleteChatHead,
      }}
    >
 
      <div
        style={{
          position: "fixed",
          left: "100px",
          textAlign: "right",
          bottom: "50px",
          zIndex: "99999"
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
          <AvatarGroup max={5} sx={{display: "flex", flexDirection: "column"}} >
          {chatHead.map((value, index) => {
            return (
              
                <Box key={`ChatHead-${value.chatRoom.id}`} sx={{padding: 0.5}}>
                  <ChatHead key={value.chatRoom.id} chatInfo={value} />
                </Box>
              
            );
          })}

          </AvatarGroup>
        </Stack>
      </div>

      {children}
    </ChatWindowContext.Provider>
  );
};

export default ChatWindowContext;
