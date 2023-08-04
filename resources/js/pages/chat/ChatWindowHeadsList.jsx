import { useContext, useRef, useState } from "react";
import Draggable from "react-draggable";
import ChatWindowContext from "../../context/ChatWindowProvider";
import ChatWindow from "./ChatWindow";
const ChatWindowHeadList = () => {
  const { chatWindow } = useContext(ChatWindowContext);
  const [zIndex, setZIndex] = useState(9999);
 
    const bringToFront = (index) => {
        document.getElementById(`chatbox-${index}`).style.zIndex = zIndex;
    }
    
  return chatWindow.map((value, index) => {
    return (
      <Draggable
        key={value.chatRoom.id}
        defaultPosition={{ x: 300, y: 100 }}
       onStop={()=> {setZIndex((z) => z+1); bringToFront(index)}}
       
      >
        <div 
          style={{zIndex: 999, position: "absolute", display: "flex", height: "400px", padding: 0}}
          onClick={() => { setZIndex((z) => z + 1); bringToFront(index)}}
          id={`chatbox-${index}`}
        >
           
          <ChatWindow
            key={value.chatRoom.id}
            chatInfo={value}
            chatList={value.chatHistory}
            windowControl
            style={{
              width: "650px",
              listHeight: "31vh"
            }}
          />
        </div>
      </Draggable>
    );
  });
};

export default ChatWindowHeadList;
