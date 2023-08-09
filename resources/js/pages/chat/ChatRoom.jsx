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
  Badge,
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
import ChatWindow from "./ChatWindow";
import ChatWindowHeadList from "./ChatWindowHeadsList";
import DoDisturbOffIcon from "@mui/icons-material/DoDisturbOff";
import ChatContext from "../../context/ChatProvider";
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

  //console.log('Auth', auth);
  //const wsURL = `ws://172.168.1.212:8086/api/chat/${roomCode}/${user.full_name}`;
  //const wsURL = `ws://localhost:3002/api/chat/${roomCode}/${user.full_name}`;

  //const websocketURL = `wss://unifiedchatapi.azurewebsites.net/api/chat/${roomCode}/${user.full_name}`;

  const isChatRoomValid = true;
  const [recon, setRecon] = useState(false);
  const [hover, setHover] = useState(false);
  //const pickerRef = useRef();
  const { setNotif } = useContext(NotificationContext);
  const wsRef = useRef(null);
  const { dialog, setDialog } = useDialog();
  const [concernStatus, setConcernStatus] = useState("RESOLVED");
  const [remarks, setRemarks] = useState("");
  const { properCase } = useFunctions();
  const [selectedTab, setSelectedTab] = useState(+roomStatus - 1 || 1);
  const [roomByStatus, setRoomByStatus] = useState({});
  const { showChatWindow } = useContext(ChatWindowContext);
  const { generateColor } = useRandomColorGenerator();
  const [chatMessageReady, setChatMessageReady] = useState(false);
  const {roomState, setRoomState} = useContext(ChatContext);
 


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
   
      getChatRooms();
    }

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (roomId) {
      setChatRoom(chatRooms.find((rm) => rm.id === +roomId));
      setChatMessageReady(true);
      //  console.log(chatRooms.find(rm => rm.id === +roomId));
    } else {
      setChatMessageReady(false);
      setChatRoom({});
    }
  }, [roomId, chatRooms]);

  const onChange = (event) => {
    //   console.log(event.target.value)
    setState({ message: event.target.value });
  };

  const connectWebSocket = (value) => {
    //  alert('change connect')

    //   setWs(new WebSocket(websocketURL));
    setRoomState({
      ...roomState,
      [value.room_code]: { ...roomState[value.room_code], unread: 0 },
    });
    setChatRoom(value);
  };

  //console.log(user);

  useEffect(() => {
    if (chatRoom?.status_code === "3" || chatRoom?.status_code === "1") {
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

  //console.log('Chat Rooms', chatRooms);

  //return (<Navigate to="/notfound" />);

  //console.log(isChatRoomValid);

  const onTabChange = (e, val) => {
    navigate("/chat");
    setSelectedTab(val);
    setChatMessageReady(false);
  };

  return (
    <Box paddingTop={3.5}>
      <HelmetProvider>
        <Helmet>
          <title>Chat</title>
        </Helmet>
      </HelmetProvider>
      {!isChatRoomValid && <NotFound />}

      {isChatRoomValid && (
        <Box>
          <Dialog fullScreen={fullScreen} open={confirmDialogOpen} fullWidth>
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

          <Divider />

          <Tabs value={selectedTab} onChange={onTabChange}>
            <Tab
              icon={<AccessTimeFilledRoundedIcon color="error" />}
              iconPosition="start"
              value={1}
              label={`ONGOING (${roomByStatus["1"]?.length || 0})`}
            />
            <Tab
              icon={<PauseCircleFilledIcon color="warning" />}
              iconPosition="start"
              value={3}
              label={`PENDING (${roomByStatus["3"]?.length || 0})`}
            />
            <Tab
              icon={<CheckCircleRoundedIcon color="success" />}
              iconPosition="start"
              value={2}
              label={`DONE (${roomByStatus["2"]?.length || 0})`}
            />
            <Tab
              icon={<QueueIcon color="info" />}
              iconPosition="start"
              value={0}
              label={`WAITING (${roomByStatus["0"]?.length || 0})`}
            />
            <Tab
              icon={<DoDisturbOffIcon color="error" />}
              iconPosition="start"
              value={4}
              label={`CANCELLED (${roomByStatus["4"]?.length || 0})`}
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
                          height: "90vh",
                          maxHeight: "80vh",
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
                                    <div>
                                      <ListItemButton
                                        onClick={() => {
                                          connectWebSocket(value);
                                        }}
                                        component={Link}
                                        to={`/chat/dm/${value.room_code}/${value.customer_id}/${value.id}/${value.current_queue_id}/${value.status_code}`}
                                        sx={{
                                          height: "50px",
                                        }}
                                        key={`ListItemButton${index}`}
                                      >
                                        <ListItemAvatar
                                          key={`ListItemAvatar${index}`}
                                        >
                                          <Badge
                                            badgeContent={
                                              roomState[value.room_code]?.unread
                                            }
                                            color="error"
                                          >
                                            <Avatar
                                              key={`Avatar${index}`}
                                              sx={{
                                                height: "30px",
                                                width: "30px",
                                                bgcolor: "#036ffc",
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
                                          </Badge>

                                          <span
                                            style={{
                                              position: "relative",
                                              top: "-10px",
                                              right: "-20px",
                                            }}
                                          >
                                            <Tooltip title="Ongoing">
                                              <AccessTimeFilledRoundedIcon
                                                style={{
                                                  display:
                                                    value.status_code === "2"
                                                      ? "flex"
                                                      : "none",
                                                  height: 10,
                                                  width: 10
                                                }}
                                                color="error"
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
                                                }}
                                                color="warning"
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
                                                }}
                                                color="success"
                                              />
                                            </Tooltip>
                                          </span>
                                        </ListItemAvatar>

                                        <div>
                                          <div className="chat-room-header">
                                            {displayName}
                                          </div>

                                          <div className="chat-message-preview">
                                            {(roomState[value.room_code]?.lastMessage ||  value.last_message).substring(
                                              0,
                                              20
                                            ) + "..."}
                                          </div>
                                        </div>
                                      </ListItemButton>
                                    </div>
                                    <div
                                      style={{
                                        position: "relative",
                                        top: "-90%",
                                        textAlign: "end",
                                        width: "15%",
                                        right: "-85%",
                                        display: "flex",
                                      }}
                                    >
                                      <Tooltip title="Pop-out Chat">
                                        <IconButton
                                          sx={{ padding: 0, display: "flex" }}
                                          onClick={() => {
                                            showChatWindow({
                                              chatRoom: value,
                                              chatHistory: [],
                                            });
                                          }}
                                        >
                                          <LaunchIcon
                                            style={{
                                              fontSize: "small",
                                            }}
                                          />
                                        </IconButton>
                                      </Tooltip>
                                    </div>
                                  </li>
                                  <Divider />
                                </React.Fragment>
                              );
                            })}
                          </List>
                        </React.Fragment>
                      </Grid>
                      <Grid item xs={10}>
                        <Grid container>
                          <Grid
                            item
                            xs={12}
                            sx={{
                              borderBottomWidth: 0,
                              borderBottom: 0,
                              borderBottomColsor: "#999999",
                              height: "80vh",
                            }}
                          >
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
                            {chatMessageReady && (
                              <Box sx={{ height: "100%" }}>
                                <ChatWindow
                                  chatInfo={{ chatRoom, chatHistory: [] }}
                                  chatList={[]}
                                  key={roomId}
                                  style={{ listHeight: "69vh" }}
                                />
                              </Box>
                            )}
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
