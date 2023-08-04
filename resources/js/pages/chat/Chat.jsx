
import React from 'react';
import {
    Box,
    Drawer,
    IconButton,
    ListItemText,
    TextField,
    List,
    ListItem,
    Divider,
    Toolbar,
    Stack,
    Paper,
    ListItemButton,
    Avatar,
    ListItemAvatar,
    Grid
  } from "@mui/material";

import httpClient from "../../services/Api";
import { useState } from "react";
import LoaderSmall from "../../Components/LoaderSmall";
import { Link, useParams } from 'react-router-dom';
import ChatRoom from './ChatRoom';
import ChatBox from './ChatBox';
function Chat() {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const {roomCode, customerId, roomId} = useParams();
  useState(() => {
  setLoading(true);
    async function getChatRooms() {
      await httpClient.get("/chat-rooms").then((response) => {
        setChatRooms(response.data);
      });
      setLoading(false);
    }

    getChatRooms();
  }, []);

  return (

    <Box>
    <Grid container spacing={1}>
      <Grid
        sx={{
          width: "20%",
          borderRightWidth: 1,
          borderRight: 1,
          borderRightColor: "#999999",
          maxHeight: "80vh",
          overflow: "auto",
          fontSize: "smaller",
        }}
      >
        <List sx={{ fontSize: 8 }}>
          <LoaderSmall loading={loading} />
          {chatRooms.map((value, index) => {
            return (
              <React.Fragment key={`Fragment${index}`}>
                <li
                  className="chat-room"
                >
                  <ListItemButton
                    component={Link}
                    to={`/chat/dm/${value.room_code}/${value.customer_id}/${value.id}`}
                    sx={{ height: "50px" }}
                    key={`ListItemButton${index}`}
                  >
                    <ListItemAvatar key={`ListItemAvatar${index}`}>
                      <Avatar
                        key={`Avatar${index}`}
                        sx={{ height: "25px", width: "25px" }}
                      >
                        {value.chat_name.charAt(0)}{" "}
                      </Avatar>
                    </ListItemAvatar>
                    <div>
                      <div className="chat-room-header">
                        {value.chat_name}
                      </div>
                      <div className="chat-message-preview">
                        Click to view messages
                      </div>
                    </div>
                  </ListItemButton>
                </li>
                <Divider />
              </React.Fragment>
            );
          })}
        </List>
      </Grid>

      <Grid>
          <Box className="chat-box" >

            {
                () => {
                      
                        roomCode !== undefined ?
                        <ChatBox />
                        :
                        <Box></Box>
   
                }
            }
            
            <LoaderSmall loading={loading} />
          </Box>
        </Grid>


    </Grid>
  </Box>

  );
}

export default Chat;
