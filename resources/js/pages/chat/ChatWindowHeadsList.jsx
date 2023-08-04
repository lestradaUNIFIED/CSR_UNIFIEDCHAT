import { useContext, useState } from "react";
import Draggable from "react-draggable";
import ChatWindowContext from "../../context/ChatWindowProvider";
import ChatWindow from "./ChatWindow";
const ChatWindowHeadList = () => {
  const { chatWindow } = useContext(ChatWindowContext);
  const [zIndex, setZIndex] = useState(9999);
  return chatWindow.map((value, index) => {
    return (
      <Draggable
        key={value.chatRoom.id}
        defaultPosition={{ x: 300, y: 100 }}
        onMouseDown={() => {
          setZIndex((zIndex) => zIndex + 1);
        }}
      >
        <div
          style={{ zIndex: zIndex, position: "absolute" }}
          onClick={() => { setZIndex((zIndex) => zIndex + 1);}}
        >
          <ChatWindow
            key={value.chatRoom.id}
            chatInfo={value}
            chatList={value.chatHistory}
            windowControl
            style={{
              height: "400px",
              width: "650px",
              display: "block",
            }}
          />
        </div>
      </Draggable>
    );
  });
};

export default ChatWindowHeadList;
