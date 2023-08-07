import "../../assets/styles/chat.css";
import "react-photo-view/dist/react-photo-view.css";
import {
  Grid,
  IconButton,
  List,
  Divider,
  TextField,
  InputAdornment,
  ListItem,
  Avatar,
  Slide,
  Box,
  Tooltip,
  ImageList,
  ImageListItemBar,
  ImageListItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  useTheme,
  useMediaQuery,
  DialogTitle,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Chip,
  Button,
  Alert,
} from "@mui/material";
import React, {
  Component,
  useState,
  useRef,
  useEffect,
  useContext,
} from "react";
import CloseIcon from "@mui/icons-material/Close";
import WebAssetIcon from "@mui/icons-material/WebAsset";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SupportAgentSharpIcon from "@mui/icons-material/SupportAgentSharp";
import PhotoIcon from "@mui/icons-material/Photo";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import useAuth from "../../hooks/useAuth";
import useFunctions from "../../hooks/useFunctions";
import websocket from "../../services/Ws";
import NotificationContext from "../../context/DesktopNotificationProvider";
import { Oval } from "react-loader-spinner";
import ChatWindowContext from "../../context/ChatWindowProvider";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import DoDisturbAltRoundedIcon from "@mui/icons-material/DoDisturbAltRounded";
import { httpPrivate } from "../../services/Api";
import m from "moment";
import Loader from "../../Components/Loader";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate } from "react-router-dom";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import { PhotoProvider, PhotoView } from "react-photo-view";
function ChatWindow(props) {
  const { chatInfo, chatList, windowControl, style } = props;
  const { chatRoom } = chatInfo;
  const [show, setShow] = useState(true);
  const [chatHistory, setChatHistory] = useState(chatList);
  const [message, setMessage] = useState("");
  const [chatActive, setChatActive] = useState(false);
  const { auth } = useAuth();
  const { properCase, tryJSONParse } = useFunctions();
  const { setNotif } = useContext(NotificationContext);
  const user = auth?.token?.user;
  const wsRef = useRef(null);
  const chatListRef = useRef(null);
  const [key, setKey] = useState(chatRoom.id);
  const [recon, setRecon] = useState(true);
  const {
    minimizeChatWindow,
    closeChatWindow,
    maximizedChatWindow,
  } = useContext(ChatWindowContext);
  const [showEmojis, setShowEmojis] = useState(false);
  const [images, setImages] = useState([]);
  const [size, setSize] = useState({ height: 0, width: 200 });
  const [uploadDetails, setUploadDetails] = useState({
    file: null,
    loaded: null,
  });
  const [base64Array, setBase64Array] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [concernStatus, setConcernStatus] = useState("RESOLVED");
  const [remarks, setRemarks] = useState("");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [chatEnded, setChatEnded] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (images.length === 0) {
      setSize({ height: 0 });
    }
  }, [images]);

  useEffect(() => {
    let ignore = false;

    async function getChat() {
      setChatHistory([]);
      if (!ignore) {
        setLoading(true);
        await httpPrivate
          .get(`/chat-message/messages/${chatRoom.id}`)
          .then((response) => {
            // console.log(response.data);
            setChatHistory(response.data);
          })
          .catch((err) => {
            console.log(err);
          });
        setLoading(false);
      }
    }
    setImages([]);
    getChat();

    return () => {
      ignore = true;
    };
  }, [chatRoom]);

  useEffect(() => {
    if (!wsRef.current && recon) {
      wsRef.current = websocket(
        `api/chat/${chatRoom.id}/${chatRoom.customer_id}`
      );

      wsRef.current.onopen = (e) => {
        setChatActive(true);
        setRecon(false);
        // console.log(wsRef.current);
      };

      wsRef.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        const msgDetails = JSON.parse(message.text);
        const chatMsg = message.chatMessage;
        let realMessage = JSON.parse(message.text);
        realMessage.queue_info = `{"queue_status":"ONGOING", "queue_id": ${chatRoom.current_queue_id}}`;
        const messageFromMe = msgDetails.message_from === "CSR";

        setChatHistory((chatH) => [...chatH, realMessage]);
        if (!messageFromMe) {
          setNotif({
            open: true,
            message: `${msgDetails.sender} : ${msgDetails.message}`,
          });
          setKey(`${msgDetails.message}${m().format("HH:mm:ss")}`);
        } else {
        }
      };
    }
    wsRef.current.onclose = () => {
      setRecon(true);
      setChatActive(false);
      wsRef.current = null;
    };
    return () => {};
  }, [wsRef.current, recon]);

  useEffect(() => {
    chatListRef?.current?.scroll({
      top: chatListRef.current.scrollHeight,
    });
  }, [chatHistory]);
  const closeDialog = () => {
    setConfirmDialogOpen(false);
  };

  const sendMessage = (e) => {
    e.preventDefault();

    async function sendText(msg) {
      await wsRef.current?.send(
        JSON.stringify({
          chat_room_id: chatRoom.id,
          receiver_id: chatRoom.customer_id,
          message: msg,
          sender_id: user?.id,
          sender: properCase(user?.nick_name),
          room_code: chatRoom.room_code,
          message_from: "CSR",
        })
      );
    }
    async function sendImages() {
      await wsRef.current?.send(
        JSON.stringify({
          chat_room_id: chatRoom.id,
          receiver_id: chatRoom.customer_id,
          message: JSON.stringify(base64Array),
          sender_id: user?.id,
          sender: properCase(user?.nick_name),
          room_code: chatRoom.room_code,
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

  const closeChat = () => {
    wsRef.current.close();
    closeChatWindow(chatRoom.id);
  };

  const minimizeChat = (chatInfo) => {
    wsRef.current.close();
    setRecon(true);

    minimizeChatWindow(chatInfo);
  };

  const maximizeChat = () => {
    maximizedChatWindow({ chatRoom, chatHistory });
  };

  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);

    setMessage((prevMsg) => prevMsg + emoji);
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
    // setState({ images: (prevImages) => [...prevImages, e.target.files] });
  };
  const confirmEndChat = async () => {
    setConfirmDialogOpen(false);

    const closeChat = async () => {
      return await httpPrivate
        .put(`queue/action/4/${chatRoom.current_queue_id}`, {
          queue_status: concernStatus,
          remarks: remarks,
          date_end: m().format("YYYY-MM-DD HH:mm:ss"),
          room_id: chatRoom.id,
        })
        .then((response) => {
          return response.data;
        });
    };

    wsRef?.current?.send(
      JSON.stringify({
        chat_room_id: chatRoom.id,
        receiver_id: chatRoom.customer_id,
        message: `CSR set the chat status to ${concernStatus}`,
        sender_id: user.id,
        sender: "CSR Agent",
        room_code: chatRoom.room_code,
        message_from: "CSR",
      })
    );

    const updatedChatRoom = await closeChat();

    if (concernStatus === "RESOLVED") {
      chatRoom.status_code = "3";
      chatRoom.status_desc = "DONE";

      setChatEnded(true);
    } else {
    }
    //console.log(updatedChatRoom.status_code)
    navigate("/");
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
  return (
    <Box>
      <Dialog
        fullScreen={fullScreen}
        open={confirmDialogOpen}
        fullWidth
        sx={{ zIndex: "999999999999" }}
      >
        <DialogTitle>{"End Chat?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Choose the status of the concern.
          </DialogContentText>
          <Grid container paddingTop={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={concernStatus}
                fullWidth
                label="Status"
                onChange={(e) => {
                  setConcernStatus(e.target.value);
                }}
                size="small"
                MenuProps={{ style: { zIndex: "9999999999999999999999999" } }}
              >
                <MenuItem value="RESOLVED">
                  <Chip
                    icon={
                      <CheckCircleOutlineIcon
                        style={{
                          color: "#007002",
                        }}
                      />
                    }
                    label="Resolved"
                  />
                </MenuItem>
                <MenuItem value="PENDING">
                  <Chip
                    icon={
                      <PauseCircleOutlineIcon
                        style={{
                          color: "#f78e05",
                        }}
                      />
                    }
                    label="Pending"
                  />
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid container paddingTop={2}>
            <FormControl fullWidth>
              <TextField
                size="small"
                fullWidth
                label="Remarks"
                InputLabelProps={{
                  shrink: true,
                }}
                multiline
                value={remarks}
                onChange={(e) => {
                  setRemarks(e.currentTarget.value);
                }}
              />
            </FormControl>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={closeDialog}>
            CANCEL
          </Button>
          <Button autoFocus onClick={confirmEndChat}>
            AGREE
          </Button>
        </DialogActions>
      </Dialog>
      <Slide direction="right" in>
        <div>
          <div id="chatWindow" className="chat-window" style={style}>
            <Grid id="window-chat-header" container className="head">
              <Grid item xs={10} sx={{ display: "flex" }}>
                <Avatar
                  sx={{
                    height: 30,
                    width: 30,
                    backgroundColor: "#eb5e00",
                    position: "fixed",
                  }}
                />
                <div className="text">{chatRoom.chat_name}</div>
              </Grid>
              <Grid item xs={2} sx={{ textAlign: "end" }}>
                <IconButton
                  style={{
                    height: 20,
                    width: 20,
                    display: windowControl ? "inline" : "none",
                    padding: 0,
                  }}
                  onClick={() => {
                    minimizeChat({ chatRoom, chatHistory });
                  }}
                  color="default"
                >
                  <HorizontalRuleIcon style={{ fontSize: "smaller" }} />
                </IconButton>
                <IconButton
                  style={{
                    height: 20,
                    width: 20,
                    paddingLeft: 2,
                    paddingRight: 2,
                    padding: 0,
                    display: windowControl ? "inline" : "none",
                  }}
                  onClick={maximizeChat}
                  color="default"
                >
                  <WebAssetIcon style={{ fontSize: "smaller" }} />
                </IconButton>

                <IconButton
                  style={{
                    height: 20,
                    width: 20,
                    display: windowControl ? "inline" : "none",
                    padding: 0,
                  }}
                  onClick={() => {
                    closeChat();
                  }}
                  color="default"
                >
                  <CloseIcon style={{ fontSize: "smaller" }} />
                </IconButton>
              </Grid>
            </Grid>
            <Grid id="window-chat-list" container>
              {loading && (
                <Grid item xs={12} sx={{ height: style.listHeight }}>
                  <div
                    style={{ position: "relative", top: "45%", left: "45%" }}
                  >
                    <Oval height={50} width={50} />
                  </div>
                </Grid>
              )}
              {!loading && (
                <Grid item xs={12}>
                  <List
                    sx={{
                      maxHeight: "70vh",
                      height: style.listHeight,
                      maxWidth: "100%",
                      overflow: "auto",
                      marginLeft: 1,
                      paddingRight: 1,
                    }}
                    ref={chatListRef}
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
                              {chatRoom.chat_name}
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
                            const image_message = tryJSONParse(
                              chat.message,
                              null
                            );
                            if (chat.message === "Sent a Photo.") {
                              return;
                            }

                            const sender = messageFromMe
                              ? chat.csr
                              : chat.customer;
                            return (
                              <React.Fragment
                                key={`lisMessage${index}${queue}`}
                              >
                                <li
                                  className={
                                    messageFromMe
                                      ? "Messages-message currentMember"
                                      : "Messages-message"
                                  }
                                >
                                  <div className="Message-content">
                                    <div className="avatar">
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
                                    </div>
                                    <div
                                      className="text"
                                      style={{
                                        fontSize: "x-small",
                                        textAlign: messageFromMe
                                          ? "end"
                                          : "start",
                                      }}
                                    >
                                      {Array.isArray(image_message) ? (
                                        <div className="photo-viewer">
                                          {" "}
                                          <PhotoProvider maskOpacity={0.8}>
                                            {image_message?.map(
                                              (imgUrl, index) => (
                                                <PhotoView
                                                  key={`PhotoView-${chat.id}-${index}`}
                                                  src={`data:image/jpeg;base64,${imgUrl}`}
                                                >
                                                  <embed
                                                    key={`img-${chat.id}-${index}`}
                                                    style={{
                                                      height: 100,
                                                      width: "100px",
                                                      borderRadius: "10px",
                                                      padding: 0.5,
                                                    }}
                                                    src={`data:image/jpeg;base64,${imgUrl}`}
                                                    className="img"
                                                  />
                                                </PhotoView>
                                              )
                                            )}
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

                                      <div className="timestamp">
                                        {m(chat.created_at).format(
                                          "YYYY-MM-DD HH:mm:ss"
                                        )}
                                      </div>
                                    </div>
                                  </div>
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
                            <Divider light={false}>
                              {queue_info.queue_status}
                            </Divider>
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </List>
                </Grid>
              )}
            </Grid>
            <Grid
              id="window-chat-footer"
              container
              sx={{ borderTopColor: "#808080", borderTop: 1 }}
            >
              {+chatRoom.status_code === 3 && (
                <Grid item xs={12}>
                  <div className="chat-ended">
                    {" "}
                    {`CHAT ${chatRoom.status_desc}`}{" "}
                  </div>
                </Grid>
              )}
              {!(+chatRoom.status_code === 3) && (
                <Grid
                  item
                  xs={12}
                  sx={{ padding: 1 }}
                  component={"form"}
                  onSubmit={sendMessage}
                >
                  <Grid container gap={1}>
                    {showEmojis && (
                      <div
                        style={{
                          position: "relative",
                          bottom: "430px",
                          left: "70%",
                          borderRadius: "20px",
                          backgroundColor: "red",
                          padding: 0,
                          width: "0",
                          height: "0px",
                          zIndex: "99999",
                          display: showEmojis ? "block" : "none",
                        }}
                      >
                        <Picker
                          data={data}
                          onEmojiSelect={addEmoji}
                          theme="dark"
                          onClickOutside={() => {
                            setShowEmojis(false);
                          }}
                          emojiSize={20}
                          emojiButtonSize={30}
                          height="0px"
                        />
                      </div>
                    )}
                    <Grid item xs={12}>
                      <TextField
                        sx={{
                          borderRadius: 4,
                          border: 1,
                          borderColor: "#888888",
                          paddingLeft: 1,
                          paddingRight: 1,
                        }}
                        fullWidth
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowEmojis(!showEmojis);
                                }}
                                disabled={!chatActive}
                              >
                                <EmojiEmotionsIcon
                                  style={{ color: "#006aff" }}
                                />
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
                                    />
                                    <PhotoIcon
                                      style={{
                                        color: "#0747f5",
                                      }}
                                      fontSize="small"
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
                                      fontSize="small"
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
                            <Oval
                              height={20}
                              width={20}
                              visible={!chatActive}
                            />
                          ),
                          disableUnderline: true,
                        }}
                        onChange={(e) => {
                          setMessage(e.target.value);
                        }}
                        value={message}
                        disabled={!chatActive}
                        autoFocus
                        variant="standard"
                      />
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={12}>
                      <Grid container>
                        <Grid item xs={12}>
                          <ImageList
                            cols={10}
                            sx={{
                              padding: 0,
                              height: size.height,
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
                                  }}
                                >
                                  {fileType[0] === "image" && (
                                    <img
                                      src={URL.createObjectURL(img)}
                                      style={{
                                        width: 105,
                                        height: 30,
                                      }}
                                    />
                                  )}
                                  {
                                    fileType[0] === "video" && 
                                    <video src={URL.createObjectURL(img)}></video> 
                                  }

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
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </div>
        </div>
      </Slide>
    </Box>
  );
}

export default ChatWindow;
