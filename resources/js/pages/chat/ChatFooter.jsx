import {
  Grid,
  TextField,
  InputAdornment,
  Box,
  IconButton,
  ImageList,
  ImageListItem,
  Tooltip,
  ImageListItemBar,
} from "@mui/material";

import { Oval } from "react-loader-spinner";
import { useState, useRef, useEffect, useContext } from "react";
import useAuth from "../../hooks/useAuth";
import useFunctions from "../../hooks/useFunctions";
import ChatContext from "../../context/ChatProvider";
import EmojiPicker from "./EmojiPicker";

import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import DoDisturbAltRoundedIcon from "@mui/icons-material/DoDisturbAltRounded";
import PhotoIcon from "@mui/icons-material/Photo";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";

const ChatFooter = (props) => {
  const { chatRoom, wsRef, chatActive, setConfirmDialogOpen } = props;
  const [showEmojis, setShowEmojis] = useState(false);
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);
  const [base64Array, setBase64Array] = useState([]);
  const [uploadDetails, setUploadDetails] = useState({
    file: null,
    loaded: null,
  });
  const uploadFileRef = useRef(null);
  const [size, setSize] = useState({ height: 0, width: 200 });
  const { properCase } = useFunctions();
  const { roomState, setRoomState } = useContext(ChatContext);
  const { auth } = useAuth();
  const { user } = auth?.token;
  useEffect(() => {
    if (images.length === 0) {
      setSize({ height: 0 });
    }
  }, [images]);

  const handleImageDelete = (imgSelect) => {
    setImages((prevImages) =>
      [...prevImages].filter((img) => !(img === imgSelect))
    );

    const reader = new FileReader();
    let rawData = new ArrayBuffer();
    reader.loadend = () => {};
    reader.onload = (e) => {
      rawData = e.target.result;
      setBase64Array((arr) =>
        [...arr].filter((item) => !(item === ARRAY_BUFFER_TO_BASE64(rawData)))
      );
      //console.log('Raw Data', rawData);
      //console.log('BASE 64', ARRAY_BUFFER_TO_BASE64(rawData))
      // base64_array_buffer.push(ARRAY_BUFFER_TO_BASE64(rawData));
    };
    reader.readAsArrayBuffer(imgSelect);
  };

  const updateRoomState = () => {
    if (roomState[chatRoom.room_code]) {
      setRoomState({
        ...roomState,
        [chatRoom.room_code]: {
          ...roomState[chatRoom.room_code],
          unread: 0,
        },
      });
    }
  };

  const handleFileChange = (e) => {
    //console.log(e.target.files);
    setUploadDetails({ file: e.target.files[0] });

    Object.values(e.target.files).forEach((val) => {
      setImages((prevImages) => [...prevImages, val]);

      const reader = new FileReader();
      let rawData = new ArrayBuffer();
      reader.loadend = () => {};
      reader.onload = (e) => {
        rawData = e.target.result;
        setBase64Array((arr) => [...arr, ARRAY_BUFFER_TO_BASE64(rawData)]);

        //console.log('Raw Data', rawData);
        //console.log('BASE 64', ARRAY_BUFFER_TO_BASE64(rawData))
        // base64_array_buffer.push(ARRAY_BUFFER_TO_BASE64(rawData));
      };
      reader.readAsArrayBuffer(val);
    });

    setSize({ height: 100 });

    e.target.value = "";
    // setState({ images: (prevImages) => [...prevImages, e.target.files] });
  };
  const sendMessage = (e) => {
    e.preventDefault();

    async function sendText(msg) {
      await wsRef.current?.send(
        JSON.stringify({
          chat_room_id: chatRoom?.id,
          receiver_id: chatRoom?.customer_id,
          message: msg,
          sender_id: user?.id,
          sender: properCase(user?.nick_name),
          room_code: chatRoom?.room_code,
          message_from: "CSR",
        })
      );
    }

    async function sendImages() {
      await wsRef.current?.send(
        JSON.stringify({
          chat_room_id: chatRoom?.id,
          receiver_id: chatRoom?.customer_id,
          message: JSON.stringify(base64Array),
          sender_id: user?.id,
          sender: properCase(user?.nick_name),
          room_code: chatRoom?.room_code,
          message_from: "CSR",
        })
      );
    }

    if (wsRef.current.readyState !== 1) {
      alert("Cannot Send Message at this time!");
    } else {
      if (message === "" && images.length === 0) {
        return;
      }

      if (message === "" && images.length > 0) {
        sendImages();
        sendText("Sent a Photo.");
        setImages((img) => []);
        setBase64Array((b64arr) => []);
      } else if (message !== "" && images.length > 0) {
        sendText(message);
        sendImages();
        sendText("Sent a Photo.");

        setMessage("");
        setImages((img) => []);
        setBase64Array((b64arr) => []);
      } else if (message !== "") {
        sendText(message);
        setMessage("");
      }
    }
  };

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  const ARRAY_BUFFER_TO_BASE64 = (ARRAY_BUFFER) => {
    let binary = "";
    const bytes = new Uint8Array(ARRAY_BUFFER);
    const len = bytes.byteLength;

    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    return window.btoa(binary);
  };

  return (
    <Box sx={{ width: "98%" }}>
      <Grid container>
        {+chatRoom?.status_code === 3 && (
          <Grid item xs={12}>
            <div className="chat-ended"> {`CHAT ${chatRoom.status_desc}`} </div>
          </Grid>
        )}
        {!(+chatRoom?.status_code === 3) && (
          <Grid
            item
            xs={12}
            sx={{ padding: 0 }}
            component={"form"}
            onSubmit={sendMessage}
          >
            <Grid container gap={0}>
              {showEmojis && (
               <Grid container > 
                      <Grid item xs={12} sx={{textAlign: "end", bgcolor: "green"}}>
                  
                  <div
                    style={{
                      position: "relative",
                      bottom: "300px",
                      left: "60%",
                      borderRadius: "20px",
                      backgroundColor: "red",
                      padding: 0,
                      height: "0px",
                      zIndex: "99999",
                      display: showEmojis ? "block" : "none",
                    }}
                  >
                    <EmojiPicker
                      setMessage={setMessage}
                      setShowEmojis={setShowEmojis}
                    />
                  </div>
                </Grid>
               </Grid>

        
              )}

              <Grid item xs={12}>
                <TextField
                  sx={{
                    border: 1,
                    borderRadius: 4,
                    margin: 1,
                    marginBottom: 0,
                    paddingLeft: 1,
                    paddingRight: 1,
                    borderColor: "#969696",
                  }}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="Clear Message">
                          <span>
                            <IconButton
                              onClick={() => {
                                setMessage("");
                              }}
                              style={{
                                display: message === "" ? "none" : "flex",
                              }}
                            >
                              <CloseIcon />
                            </IconButton>
                          </span>
                        </Tooltip>

                        <IconButton type="submit">
                          <SendIcon color="primary" />
                        </IconButton>

                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowEmojis(!showEmojis);
                          }}
                          disabled={!chatActive}
                        >
                          <EmojiEmotionsIcon style={{ color: "#006aff" }} />
                        </IconButton>

                        <Tooltip title="Photo">
                          <span>
                            <IconButton
                              component="label"
                              sx={{
                                padding: 0.3,
                              }}
                              disabled={!chatActive}
                            >
                              <input
                                type="file"
                                accept="image/*,video/*"
                                style={{
                                  display: "none",
                                }}
                                onChange={handleFileChange}
                                name="file"
                                multiple
                                ref={uploadFileRef}
                              />
                              <PhotoIcon
                                style={{
                                  color: "#0747f5",
                                }}
                              />
                            </IconButton>
                          </span>
                        </Tooltip>

                        <Tooltip title="End Chat">
                          <span>
                            <IconButton
                              onClick={() => {
                                setConfirmDialogOpen(true);
                              }}
                              sx={{
                                padding: 0.3,
                              }}
                              disabled={!chatActive}
                            >
                              <DoDisturbAltRoundedIcon
                                style={{
                                  color: "#fc0303",
                                }}
                              />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </InputAdornment>
                    ),
                    startAdornment: (
                      <Oval height={20} width={20} visible={!chatActive} />
                    ),
                    disableUnderline: true,
                  }}
                  disabled={!chatActive}
                  autoFocus
                  variant="standard"
                  value={message}
                  onChange={onChange}
                  onFocus={updateRoomState}
                />
              </Grid>
              <Grid item sx={{ textAlign: "right" }}></Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
      <div style={{ height: 0 }}>
        <ImageList
          cols={15}
          sx={{
            marginLeft: 3,
            marginRight: 3,
            height: size.height,
            backgroundColor: "gray",
            opacity: 0.8,
            position: "relative",
            bottom: "180px",
            borderRadius: 2,
          }}
          gap={5}
        >
          {images.map((img, index) => {
            const fileType = img.type.split("/");
            return (
              <ImageListItem
                key={index}
                sx={{
                  border: 1,
                  margin: 0.5,
                }}
              >
                {fileType[0] === "image" && (
                  <img
                    src={URL.createObjectURL(img)}
                    style={{
                      width: 105,
                      height: 90,
                      objectFit: "scale-down",
                    }}
                  />
                )}
                {fileType[0] === "video" && (
                  <video src={URL.createObjectURL(img)}></video>
                )}

                <ImageListItemBar
                  position="top"
                  actionIcon={
                    <Tooltip title="Remove">
                      <IconButton
                        onClick={() => {
                          handleImageDelete(img);
                        }}
                      >
                        <CloseIcon
                          fontSize="small"
                          style={{
                            color: "#fca103",
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  }
                  actionPosition="right"
                />
              </ImageListItem>
            );
          })}
        </ImageList>
      </div>
    </Box>
  );
};

export default ChatFooter;
