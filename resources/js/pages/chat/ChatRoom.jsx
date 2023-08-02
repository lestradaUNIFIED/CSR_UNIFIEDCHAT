import { Helmet, HelmetProvider } from "react-helmet-async";
import {
  Box,
  IconButton,
  TextField,
  List,
  Divider,
  ListItemButton,
  Avatar,
  ListItemAvatar,
  Tooltip,
  Dialog,
  useTheme,
  useMediaQuery,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  InputAdornment,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Tabs,
  Tab,
  Stack,
  Slide,
} from "@mui/material";
import { useEffect, useState, useRef, useContext } from "react";
import "../../assets/styles/chat.css";
import SendIcon from "@mui/icons-material/Send";
import { Grid } from "@mui/material";
import React from "react";
import { Link, Navigate, useParams, useNavigate } from "react-router-dom";
import LoaderSmall from "../../Components/LoaderSmall";
import m from "moment";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import websocket from "../../services/Ws";
import SupportAgentSharpIcon from "@mui/icons-material/SupportAgentSharp";
import NotFound from "../notfound/notfound";
import useAuth from "../../hooks/useAuth";
import { CHAT_API, httpPrivate } from "../../services/Api";
import RolesContext from "../../context/RolesProvider";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import DoDisturbAltRoundedIcon from "@mui/icons-material/DoDisturbAltRounded";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PhotoIcon from "@mui/icons-material/Photo";
import NotificationContext from "../../context/DesktopNotificationProvider";
import InfiniteScroll from "react-infinite-scroll-component";
import { Oval } from "react-loader-spinner";
import { Resizable } from "react-resizable";
import CloseIcon from "@mui/icons-material/Close";
import useDialog from "../../hooks/useDialog";
import useFunctions from "../../hooks/useFunctions";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled";
import TabPanel from "../../Components/TabPanel";
import QueueIcon from "@mui/icons-material/Queue";
import LaunchIcon from "@mui/icons-material/Launch";
import ChatWindowContext from "../../context/ChatWindowProvider";
import useRandomColorGenerator from "../../hooks/useRandomColorGenerator";

function ChatRoom() {
  // const messages = this.state.messages;

  const { roomCode, customerId, roomId, queueId, roomStatus } =
    useParams() || 1;
  const { auth } = useAuth();
  const { ROLES } = useContext(RolesContext);
  const [state, setState] = useState({ message: "", sender: "", images: [] });
  const [chatRooms, setChatRooms] = useState([]);
  const [loading1, setLoading1] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [unreadClass, setUnreadClass] = useState("chat-room");
  const [sbOpen, setSbOpen] = useState({
    open: false,
    severity: "info",
    message: "",
  });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [chatEnded, setChatEnded] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [chatRoom, setChatRoom] = useState({});
  const [chatActive, setChatActive] = useState(false);
  const [lastMessage, setLastMessage] = useState("");
  const [images, setImages] = useState([]);
  const [chatLength, setChatLength] = useState({ start: 0, length: 20 });

  const navigate = useNavigate();
  const user = auth?.token.user;
  const listBoxEl = useRef(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [uploadDetails, setUploadDetails] = useState({
    file: null,
    loaded: null,
  });
  //console.log('Auth', auth);
  //const wsURL = `ws://172.168.1.212:8086/api/chat/${roomCode}/${user.full_name}`;
  //const wsURL = `ws://localhost:3002/api/chat/${roomCode}/${user.full_name}`;

  //const websocketURL = `wss://unifiedchatapi.azurewebsites.net/api/chat/${roomCode}/${user.full_name}`;

  const [size, setSize] = useState({ height: 0, width: 200 });
  const isChatRoomValid = true;
  const [ws, setWs] = useState(null);
  const [recon, setRecon] = useState(false);
  const [hover, setHover] = useState(false);
  //const pickerRef = useRef();
  const { setNotif } = useContext(NotificationContext);
  const wsRef = useRef(null);
  const { dialog, setDialog } = useDialog();
  const [base64Array, setBase64Array] = useState([]);
  const [concernStatus, setConcernStatus] = useState("RESOLVED");
  const [remarks, setRemarks] = useState("");
  const { properCase } = useFunctions();
  const [selectedTab, setSelectedTab] = useState(+roomStatus - 1 || 1);
  const [roomByStatus, setRoomByStatus] = useState({});
  const { showChatWindow } = useContext(ChatWindowContext);

  const { generateColor } = useRandomColorGenerator();
  useEffect(() => {
    if (images.length === 0) {
      setSize({ height: 0 });
    }
  }, [images]);

  useEffect(() => {
    let ignore = false;

    if (!ignore && roomId && customerId && !recon && !wsRef.current) {
      wsRef.current = websocket(`api/chat/${roomId}/${customerId}`);

      wsRef.current.onopen = (e) => {
        open(e);
        function open(e) {
          setChatActive(true);
          setWs(true);
          setRecon(true);
          console.log(
            "Chat Connected ",
            m().format("YYYY-MM-DD HH:mm:ss"),
            wsRef.current
          );
        }
      };
      wsRef.current.onmessage = (event) => {
        //   console.log(event.data);

        const message = JSON.parse(event.data);

        const msgDetails = JSON.parse(message.text);

        const chatMsg = message.chatMessage;
        let realMessage = JSON.parse(message.text);
        //console.log(realMessage);
        realMessage.queue_info = `{"queue_status":"ONGOING", "queue_id": ${queueId}}`;
        const messageFromMe = msgDetails.message_from === "CSR";

        // console.log();
        setChatHistory((chatH) => [...chatH, realMessage]);
        if (!messageFromMe) {
          setLastMessage(`${msgDetails.sender} : ${msgDetails.message}`);
          setNotif({
            open: true,
            message: `${msgDetails.sender} : ${msgDetails.message}`,
          });
        } else {
        }
      };

      wsRef.current.onclose = () => {
        console.log("Chat Disconnected!", m().format("YYYY-MM-DD HH:mm:ss"));
        setChatActive(false);

        setTimeout(() => {
          wsRef.current = null;
          setWs(false);
          setRecon(false);
        }, 5000);
        ignore = false;
      };
    }
    return () => {
      //  wsRef.current?.close();
      ignore = true;
      //ws.close();
    };

    // setWs(chatWs);
  }, [roomId, customerId, recon, wsRef]);

  useEffect(() => {
    if (isChatRoomValid) {
      listBoxEl?.current?.scroll({
        top: listBoxEl.current?.scrollHeight,
        behavior: "smooth",
      });
      // listBoxEl?.current?.addEventListener("DOMNodeInserted", (event) => {
      //   const { currentTarget: target } = event;
      //   target.scroll({ top: target.scrollHeight, behavior: "smooth" });
      // });
    }
  }, [isChatRoomValid, chatHistory]);

  useEffect(() => {
    let ignore = false;
    if (!ignore) {
      async function getChatRooms() {
        const API_URL =
          user?.user_role === ROLES.User
            ? `/chat-rooms/${user.id}`
            : `/chat-rooms`;
        await httpPrivate
          .get(API_URL)
          .then((response) => {
            //   console.log(response);
          


            setChatRooms(response.data);
            setRoomByStatus(
              response.data.reduce((room, row) => {
                const { status_code } = row;
                if (!room[+status_code - 1]) {
                  room[+status_code - 1] = [];
                }
                room[+status_code - 1].push(row);

                return room;
              }, {})
            );
          })
          .catch((error) => {
            //   console.log(error);
          });
      }
      console.log("ROOM!!! ");
      getChatRooms();
    }

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    if (roomId) {
      async function getChatRoom() {
        await httpPrivate.get(`/chat-room/${roomId}`).then((response) => {
          setChatRoom(response.data);
        });
      }

      async function getChat() {
        setChatHistory([]);
        setLoading1(true);

        if (!ignore) {
          await httpPrivate
            .get(`/chat-message/messages/${roomId}`, {
              params: { start: chatLength.start, length: chatLength.length },
            })
            .then((response) => {
              // console.log(response.data);
              setChatHistory(response.data);
            })
            .catch((err) => {
              console.log(err);
            });
        }
        setLoading1(false);
      }
      setImages([]);
      setUnreadClass("chat-room");
      getChatRoom();
      getChat();
      setSelectedTab(+roomStatus - 1);
    }
    return () => {
      ignore = true;
    };
  }, [roomId]);

  const onChange = (event) => {
    //   console.log(event.target.value)
    setState({ message: event.target.value });
  };

  const connectWebSocket = (room_status) => {
    //  alert('change connect')

    //   setWs(new WebSocket(websocketURL));
    if (wsRef.current) {
      wsRef.current.close();
    }
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

  const onSubmit = (event) => {
    event.preventDefault();
    //   console.log("send");
    //saveMessage();
    if (state.message === "" && images.length === 0) {
      return;
    }

    if (state.message === "" && images.length > 0) {
      console.log(base64Array.length);
      setChatHistory((chatH) => [
        ...chatH,
        {
          chat_room_id: roomId,
          receiver_id: customerId,
          message: base64Array.toString(),
          sender_id: user.id,
          sender: "CSR Agent",
          room_code: roomCode,
          message_from: "CSR",
          queue_info: `{"queue_status":"ONGOING", "queue_id": ${queueId}}`,
        },
      ]);
    } else {
    }
    let base64_array_buffer = [];

    if (!(wsRef.current.readyState === 1)) {
      alert("CANNOT SEND MESSAGE RIGHT NOW!");
    } else {
      wsRef.current?.send(
        JSON.stringify({
          chat_room_id: roomId,
          receiver_id: customerId,
          message: state.message,
          sender_id: user.id,
          sender: properCase(user.nick_name),
          room_code: roomCode,
          message_from: "CSR",
          images: JSON.stringify(base64_array_buffer),
        })
      );
      setState({ message: "" });
    }

    // websocket.close();
  };
  //console.log(user);

  useEffect(() => {
    if (chatRoom.status_code === "3" || chatRoom.status_code === "1") {
      setChatEnded(true);
    } else {
      setChatEnded(false);
    }
  }, [chatRoom]);

  let dummyItems = [];
  for (let i = 1; i <= 300; i++) {
    dummyItems.push(i);
  }

  const closeDialog = () => {
    setConfirmDialogOpen(false);
  };

  //console.log(chatRooms)

  const confirmEndChat = async () => {
    setConfirmDialogOpen(false);

    const closeChat = async () => {
      return await httpPrivate
        .put(`queue/action/4/${queueId}`, {
          queue_status: concernStatus,
          remarks: remarks,
          date_end: m().format("YYYY-MM-DD HH:mm:ss"),
          room_id: roomId,
        })
        .then((response) => {
          return response.data;
        });
    };

    wsRef?.current?.send(
      JSON.stringify({
        chat_room_id: roomId,
        receiver_id: customerId,
        message: `CSR set the chat status to ${concernStatus}`,
        sender_id: user.id,
        sender: "CSR Agent",
        room_code: roomCode,
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

  const openDialog = () => {
    setConfirmDialogOpen(true);
  };
  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setState({ message: state.message + emoji });
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

  const handleUpload = () => {
    const formData = new FormData();

    images.forEach((img) => {
      formData.append("file", img);
    });

    CHAT_API.post("/upload", formData, {
      onUploadProgress: (ProgressEvent) => {
        setUploadDetails({
          loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100,
        });
      },
    })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
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

  //console.log('Chat Rooms', chatRooms);

  //return (<Navigate to="/notfound" />);

  //console.log(isChatRoomValid);

  const onTabChange = (e, val) => {
    navigate("/chat");
    setSelectedTab(val);
  };

  return (
    <Box paddingTop={3}>
      <HelmetProvider>
        <Helmet>
          <title>Chat</title>
        </Helmet>
      </HelmetProvider>
      {!isChatRoomValid && <NotFound />}

      {isChatRoomValid && (
        <Box>
          <Divider />

          <Tabs value={selectedTab} onChange={onTabChange}>
            <Tab
              icon={
                <AccessTimeFilledRoundedIcon style={{ color: "#0a9103" }} />
              }
              iconPosition="start"
              value={1}
              label={`ONGOING (${roomByStatus["1"]?.length || 0})`}
            />
            <Tab
              icon={<PauseCircleFilledIcon style={{ color: "#eb7005" }} />}
              iconPosition="start"
              value={3}
              label={`PENDING (${roomByStatus["3"]?.length || 0})`}
            />
            <Tab
              icon={<CheckCircleRoundedIcon style={{ color: "#c70d00" }} />}
              iconPosition="start"
              value={2}
              label={`DONE (${roomByStatus["2"]?.length || 0})`}
            />
            <Tab
              icon={<QueueIcon style={{ color: "#eb7005" }} />}
              iconPosition="start"
              value={0}
              label={`WAITING (${roomByStatus["0"]?.length || 0})`}
            />
          </Tabs>

          <Divider />

          {Object.entries(roomByStatus).map(([status, rooms]) => {
            return (
              <React.Fragment key={`tabpanel-${status}`}>
                <TabPanel value={selectedTab} index={+status}>
                  <Grid container className="main-chat-box">
                    <Grid container>
                      <Grid
                        sx={{
                          borderRightWidth: 1,
                          borderRight: 1,
                          borderRightColor: "#999999",
                          maxHeight: "95vh",
                          overflow: "auto",
                          fontSize: "smaller",
                          marginRight: 0,
                          marginLeft: 0,
                        }}
                        item
                        xs={2}
                      >
                        <React.Fragment key={`List${status}`}>
                          <List
                            sx={{ fontSize: 8 }}
                            key={`roomlist-${status}`}
                            disablePadding
                          >
                            <li className="cb-header-container">
                              <h1 className="cb-header">Chat</h1>
                            </li>

                            {rooms.map((value, index) => {

                              const bgColor = generateColor();
                              const nameArray = (value.chat_name || " ").split(
                                " "
                              );
                              const displayName = `${nameArray[0].charAt(0)}. ${
                                nameArray[nameArray.length - 1]
                              }`;

                              return (
                                <React.Fragment
                                  key={`room-${value.id}-${index}-${status}`}
                                >
                                  <li
                                    className={
                                      value.room_code === roomCode
                                        ? "selected-chat-room"
                                        : unreadClass
                                    }
                                    key={`${index}${status}`}
                                  >
                                    <ListItemButton
                                      component={Link}
                                      onClick={async () => {
                                        connectWebSocket(chatRoom.status_code);
                                      }}
                                      to={`/chat/dm/${value.room_code}/${value.customer_id}/${value.id}/${value.current_queue_id}/${value.status_code}`}
                                      sx={{ height: "50px" }}
                                      key={`ListItemButton${index}`}
                                    >
                                      <ListItemAvatar
                                        key={`ListItemAvatar${index}`}
                                      >
                                        <Avatar
                                          key={`Avatar${index}`}
                                          sx={{
                                            height: "30px",
                                            width: "30px",
                                            backgroundColor: "#" + bgColor,
                                          }}
                                        >
                                          <span
                                            style={{
                                              fontSize: "small",
                                              fontWeight: "bold",
                                            }}
                                          >
                                            {`${nameArray[0].charAt(
                                              0
                                            )}${nameArray[
                                              nameArray.length - 1
                                            ].charAt(0)}`}
                                          </span>
                                        </Avatar>
                                        <span
                                          style={{
                                            position: "relative",
                                            top: "-10px",
                                            right: "-18px",
                                          }}
                                        >
                                          <Tooltip title="Ongoing">
                                            <AccessTimeFilledRoundedIcon
                                              style={{
                                                display:
                                                  value.status_code === "2"
                                                    ? "flex"
                                                    : "none",
                                                fontSize: "small",
                                                color: "#0a9103",
                                              }}
                                            />
                                          </Tooltip>
                                          <Tooltip title="Pending">
                                            <PauseCircleFilledIcon
                                              style={{
                                                display:
                                                  value.status_code === "4"
                                                    ? "flex"
                                                    : "none",
                                                fontSize: "small",
                                                color: "#eb7005",
                                              }}
                                            />
                                          </Tooltip>
                                          <Tooltip title="Resolved">
                                            <CheckCircleRoundedIcon
                                              style={{
                                                display:
                                                  value.status_code === "3"
                                                    ? "flex"
                                                    : "none",
                                                fontSize: "small",
                                                color: "#c70d00",
                                              }}
                                            />
                                          </Tooltip>
                                        </span>
                                      </ListItemAvatar>

                                      <div>
                                        <div className="chat-room-header">
                                          {displayName}
                                        </div>
                                        <div className="chat-message-preview">
                                          {value.last_message.substring(0, 20) +
                                            "..."}
                                        </div>
                                      </div>
                                    </ListItemButton>
                                  </li>
                                  <Divider />
                                </React.Fragment>
                              );
                            })}
                          </List>
                        </React.Fragment>
                      </Grid>
                      <Grid item xs={10}>
                        {roomId && (
                          <Grid container>
                            <Grid item xs={11}>
                              <div className="convo-header">
                                <Avatar
                                  sx={{
                                    display: "flex",
                                    fontSize: "smaller",
                                  }}
                                >
                                  {`${chatRoom?.chat_name?.charAt(
                                    0
                                  )}${chatRoom?.chat_name?.charAt(
                                    chatRoom?.chat_name?.lastIndexOf(" ") + 1
                                  )}`}
                                </Avatar>
                                <span className="text">
                                  {chatRoom.chat_name}
                                </span>
                              </div>
                            </Grid>
                            <Grid
                              item
                              xs={1}
                              className="convo-header"
                              sx={{ textAlign: "end" }}
                            >
                              <span className="icon">
                                <Tooltip title="Pop-out Chat">
                                  <IconButton
                                    onClick={() => {
                                      showChatWindow({
                                        chatHistory,
                                        chatRoom,
                                      });
                                    }}
                                  >
                                    <LaunchIcon style={{ fontSize: "large" }} />
                                  </IconButton>
                                </Tooltip>
                              </span>
                            </Grid>
                          </Grid>
                        )}

                        <Grid container>
                          <Grid
                            item
                            xs={12}
                            sx={{
                              borderBottomWidth: 1,
                              borderBottom: 1,
                              borderBottomColor: "#999999",
                            }}
                          >
                            <Box
                              className="chat-box"
                              ref={listBoxEl}
                              id="chatbox"
                            >
                              {roomCode && (
                                <InfiniteScroll dataLength={20} hasMore={true}>
                                  <ul
                                    id="messages"
                                    className="Messages-List"
                                    key={`chatlist-${status}`}
                                    style={{ paddingRight: 10 }}
                                  >
                                    <LoaderSmall loading={loading1} />

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
                                          `{"queue_status":"ONGOING", "queue_id" : ${queueId}}`
                                      );
                                      return (
                                        <React.Fragment key={queue}>
                                          {chats.map((chat, index) => {
                                            const messageFromMe =
                                              chat.message_from === "CSR";
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

                                                    <Slide
                                                      direction="left"
                                                      in
                                                      mountOnEnter
                                                    >
                                                      <div className="text">
                                                        {chat.message}
                                                        {/*
                                              <img
                                                src={`data:image/jpeg;base64,${chat.message}`}
                                              />
                                              */}

                                                        <div className="timestamp">
                                                          {m(
                                                            chat.created_at
                                                          ).format(
                                                            "YYYY-MM-DD HH:mm:ss"
                                                          )}
                                                        </div>
                                                      </div>
                                                    </Slide>
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
                                                queue_info.queue_status ===
                                                "ONGOING"
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
                                  </ul>
                                </InfiniteScroll>
                              )}
                              {roomCode === undefined && (
                                <Box
                                  sx={{
                                    position: "relative",
                                    top: "48%",
                                    left: "40%",
                                    width: "400px",
                                  }}
                                >
                                  Select a Convo
                                </Box>
                              )}
                            </Box>
                          </Grid>
                        </Grid>
                        <Grid container>
                          <Grid item xs={12}>
                            {roomCode && !chatEnded && (
                              <Box
                                component={"form"}
                                onSubmit={onSubmit}
                                className="chat-field"
                                encType="multipart/form-data"
                              >
                                <Dialog
                                  fullScreen={fullScreen}
                                  open={confirmDialogOpen}
                                  fullWidth
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
                                        >
                                          <MenuItem value="RESOLVED">
                                            <Chip
                                              icon={
                                                <CheckCircleOutlineIcon
                                                  style={{ color: "#007002" }}
                                                />
                                              }
                                              label="Resolved"
                                            />
                                          </MenuItem>
                                          <MenuItem value="PENDING">
                                            <Chip
                                              icon={
                                                <PauseCircleOutlineIcon
                                                  style={{ color: "#f78e05" }}
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
                                          InputLabelProps={{ shrink: true }}
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

                                <Grid container className="chat-form">
                                  <Grid item xs={12} paddingRight={3}>
                                    <TextField
                                      type="text"
                                      onChange={(e) => {
                                        onChange(e);
                                      }}
                                      value={state.message}
                                      sx={{
                                        marginLeft: 2,
                                        paddingTop: 0.5,
                                        paddingLeft: 1.5,
                                        paddingRight: 1.5,
                                        borderRadius: 5,
                                        border: 1,
                                        fontSize: "small",
                                        borderColor: "#9e9e9e",
                                      }}
                                      fullWidth
                                      InputProps={{
                                        endAdornment: (
                                          <InputAdornment position="end">
                                            <Stack direction={"row"} gap={0}>
                                              <Tooltip title="Emoji">
                                                <IconButton
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowEmojis(!showEmojis);
                                                  }}
                                                  sx={{ padding: 0.3 }}
                                                >
                                                  <EmojiEmotionsIcon
                                                    fontSize="small"
                                                    style={{ color: "#0747f5" }}
                                                  />
                                                </IconButton>
                                              </Tooltip>
                                              <Tooltip title="Send">
                                                <IconButton
                                                  type="submit"
                                                  sx={{ padding: 0.3 }}
                                                >
                                                  <SendIcon
                                                    style={{ color: "#0747f5" }}
                                                    fontSize="small"
                                                  />
                                                </IconButton>
                                              </Tooltip>

                                              <Tooltip title="Photo">
                                                <IconButton
                                                  component="label"
                                                  sx={{ padding: 0.3 }}
                                                >
                                                  <input
                                                    type="file"
                                                    accept="image/*"
                                                    style={{ display: "none" }}
                                                    onChange={handleFileChange}
                                                    name="file"
                                                    multiple
                                                  />
                                                  <PhotoIcon
                                                    style={{ color: "#0747f5" }}
                                                    fontSize="small"
                                                  />
                                                </IconButton>
                                              </Tooltip>

                                              <Tooltip title="End Chat">
                                                <IconButton
                                                  onClick={() => {
                                                    setConfirmDialogOpen(true);
                                                  }}
                                                  sx={{ padding: 0.3 }}
                                                >
                                                  <DoDisturbAltRoundedIcon
                                                    fontSize="small"
                                                    style={{ color: "#fc0303" }}
                                                  />
                                                </IconButton>
                                              </Tooltip>
                                            </Stack>
                                          </InputAdornment>
                                        ),
                                        disableUnderline: true,
                                        style: {
                                          textAlign: "center",
                                        },
                                        startAdornment: (
                                          <Oval
                                            height={20}
                                            width={20}
                                            color="#2b2b2b"
                                            wrapperStyle={{}}
                                            wrapperClass=""
                                            visible={!chatActive}
                                            ariaLabel="oval-loading"
                                            secondaryColor="#2b2b2b"
                                            strokeWidth={6}
                                            strokeWidthSecondary={6}
                                          />
                                        ),
                                      }}
                                      autoFocus={true}
                                      size="small"
                                      variant="standard"
                                      disabled={!chatActive}
                                    />
                                  </Grid>

                                  <Grid item xs={6}>
                                    {showEmojis && (
                                      <div
                                        style={{
                                          position: "absolute",
                                          top: "320px",
                                          right: "180px",
                                          maxWidth: "320px",
                                          borderRadius: "20px",
                                          backgroundColor: "red",
                                          padding: 0,
                                        }}
                                      >
                                        <Picker
                                          data={data}
                                          onEmojiSelect={addEmoji}
                                          theme="dark"
                                          onClickOutside={() => {
                                            setShowEmojis(false);
                                          }}
                                        />
                                      </div>
                                    )}
                                  </Grid>
                                </Grid>
                              </Box>
                            )}

                            <div
                              className="chat-ended"
                              style={{
                                display: chatEnded ? "block" : "none",
                                margin: 10,
                              }}
                            >
                              --- {`CHAT ${chatRoom.status_desc}`} ---
                            </div>
                          </Grid>
                        </Grid>
                        <Grid container>
                          <Grid item xs={12}>
                            <ImageList
                              cols={10}
                              sx={{ padding: 0, height: size.height }}
                              gap={5}
                            >
                              {images.map((img, index) => {
                                return (
                                  <ImageListItem key={index} sx={{ border: 1 }}>
                                    <img
                                      src={URL.createObjectURL(img)}
                                      style={{ width: 105, height: 30 }}
                                    />

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
                                              style={{ color: "#fca103" }}
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
                </TabPanel>
              </React.Fragment>
            );
          })}
        </Box>
      )}
    </Box>
  );
}

export default ChatRoom;
