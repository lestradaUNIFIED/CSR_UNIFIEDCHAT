import { useState, useParams, useRef } from "react";
import httpClient from "../../services/Api";
import {
    Box
} from "@mui/material";
import React from "react"
import LoaderSmall from "../../Components/LoaderSmall";
const  ChatBox = ({socket}) => {
const [loading1, setLoading] = useState(false);
const [chatHistory, setChatHistory] = useState([]);
const {roomCode,  customerId, roomId} = useParams() || 1;
const listBoxEl = useRef(null);
const user = JSON.parse(sessionStorage.getItem("token")).user || { id: 0 };useState(() => {
    let ignore = false;

async function getChatHistory() {

    await httpClient.get('/chat-messages')
}

})


    return(

        <Box className="chat-box" ref={listBoxEl}>
        <ul id="messages" className="Messages-List">
          {chatHistory.map((chat, index) => {
            const messageFromMe = +chat.sender_id === +user.id;
            return (
              <React.Fragment key={`lisMessage${index}`}>
                <li
                  className={
                    messageFromMe
                      ? "Messages-message currentMember"
                      : "Messages-message"
                  }
                >
                  <div className="Message-content">
                    <i className="avatar" ></i>
                    <div className="username"> {chat.sender} </div>
                    <div className="text">{chat.message}</div>
                  </div>
                </li>
              </React.Fragment>
            );
          })}
        </ul>
        <LoaderSmall loading={loading1} />
      </Box>
    )



}

export default ChatBox;


