import { useContext, useRef, useState } from "react";
import Draggable from "react-draggable";
import ChatWindowContext from "../../context/ChatWindowProvider";
import ChatWindow from "./ChatWindow";
const ChatWindowHeadList = () => {
  const { chatWindow } = useContext(ChatWindowContext);
  const [zIndex, setZIndex] = useState(999);
  const divRef = useRef(null);
  return chatWindow.map((value, index) => {
    return (
      <Draggable
        key={value.chatRoom.id}
        defaultPosition={{ x: 300, y: 100 }}
       onStop={()=> {setZIndex((z) => z+1)}}
      >
        <div
          style={{ zIndex: zIndex, position: "absolute", display: "flex", height: "400px", padding: 0 }}
          onClick={() => { setZIndex((z) => z + 1)}}
        >
            {zIndex}
          <ChatWindow
            key={value.chatRoom.id}
            chatInfo={value}
            chatList={value.chatHistory}
            windowControl
            style={{
              width: "650px",
              height: "400px",
              listHeight: "31vh"
            }}
          />
        </div>
      </Draggable>
    );
  });
};

export default ChatWindowHeadList;
