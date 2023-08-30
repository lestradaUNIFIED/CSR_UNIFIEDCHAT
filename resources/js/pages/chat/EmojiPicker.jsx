import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data/sets/14/native.json";

const EmojiPicker = (props) => {
  const { setShowEmojis, setMessage } = props;

  const addEmoji = (e) => {
    setMessage((prevMsg) => prevMsg + e.native);
  };

  return (
    <Picker
      data={data}
      onEmojiSelect={addEmoji}
      theme="dark"
      onClickOutside={() => {
        setShowEmojis(false);
      }}
      emojiSize={20}
      emojiButtonSize={40}
      height="0px"
      width={200}
      
      />
  );
};

export default EmojiPicker;
