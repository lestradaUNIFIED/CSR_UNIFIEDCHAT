import "../../assets/styles/dashboard.css";

/*LEONARD */
import { Box, Grid, Fab, styled, keyframes } from "@mui/material";

import { useContext, useEffect, useState } from "react";
import { httpPrivate } from "../../services/Api";
import { DataGrid, gridColumnGroupsLookupSelector, useGridApiRef } from "@mui/x-data-grid";
import { IconButton, Stack, Tooltip } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCommentDots,
  faVideo,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import m from "moment";
//import { randomNumberBetween } from "@mui/x-data-grid/utils/utils";
import Swal from "sweetalert2";
import { Navigate } from "react-router-dom";
import websocket from "../../services/Ws";
import useAuth from "../../hooks/useAuth";
import RolesContext from "../../context/RolesProvider";
import WebsocketContext from "../../context/WebsocketProvider";
import QueueContext from "../../context/QueueProvider";
import { Helmet, HelmetProvider } from "react-helmet-async";
import useMomentLocale from "../../hooks/useMomentLocale";
import useCategoryAccess from "../../hooks/useCategoryAccess";
import ChatWindowHeadList from "../chat/ChatWindowHeadsList";
import ChatWindowContext from "../../context/ChatWindowProvider";
function Dashboard() {
  const { queueRows, setQueueRows, queueActive } = useContext(QueueContext);
  const { auth } = useAuth();
  const { wsRef } = useContext(WebsocketContext);
  const { ROLES } = useContext(RolesContext);
  const [state, setState] = useState({ data: {} });
  const [alertLevel, setAlertLevel] = useState(0);
  const { momentLocal, toPHTime } = useMomentLocale();
  const {ALLOWED_CATEGORY} = useCategoryAccess();
  const {showChatWindow } = useContext(ChatWindowContext); 
  //console.log(session);

  const user = auth?.token?.user;

  //const ws = new WebSocket(`url/chat/queue`)
  // const [notifWs, setNotifWs] = useState(websocket("chat/notification"));
  //const [ongoingWs, setOngoingWs] = useState(websocket("chat/ongoing"));

  useEffect(() => {
  
    async function loadData() {
      const data = await httpPrivate.get("/callqueues");
      setQueueRows(data.data.filter((row) => ALLOWED_CATEGORY.find((val) => val === '*' ? true : (+val === +row.category_id))));
    }

    let ignore = false;

    if (!ignore && ALLOWED_CATEGORY.length > 0) {
      loadData();
    }

    return () => {
      ignore = true;
    };
  }, [state, ALLOWED_CATEGORY]);

  useEffect(() => {
    let ignore = false;
    let chatQCount = 0;
    let vcQCount = 0;

    if (!ignore) {
      for (let data of queueRows) {
        if (data.queue_status === "WAITING") {
          if (data.transaction === "CHAT") {
            chatQCount++;
          }
          if (data.transaction === "VIDEO CALL") {
            vcQCount++;
          }
        }
      } //
    }

    setChatQueCount(chatQCount);
    setVcQueCount(vcQCount);

    return () => {
      ignore = true;
    };
  }, [queueRows]);


  // console.log(ws);
  const apiRef = useGridApiRef();
  const columns = [
    {
      field: "action_chatqueue",
      headerName: "Action",
      width: 100,
      renderCell: (params) => {
        return (
          <Box visibility={user.user_role !== ROLES.Admin}>
            <Stack
              direction="row"
              spacing={0}
              display={params.row.queue_status === "WAITING" ? "block" : "none"}
            >
              <Box
                sx={{
                  display:
                    params.row.queue_status === "WAITING" &&
                    params.row.transaction === "CHAT"
                      ? "block"
                      : "none",
                }}
              >
                <Tooltip title="Go Chat">
                  <span>
                    <IconButton
                      disabled={params.row.queue_status !== "WAITING"}
                      onClick={UpdateQueue({
                        id: params.row.id,
                        queue_status: "ONGOING",
                        date_ongoing: m().format("YYYY-MM-DD HH:mm:ss"),
                        customer_id: params.row.caller_id,
                        room_code: params.row.room_code,
                        chat_name: `${params.row.firstname} ${params.row.lastname}`,
                        room_id: params.row.room_id,
                      })}
                    >
                      <FontAwesomeIcon
                        icon={faCommentDots}
                        shake
                        style={{ color: "#4df410" }}
                      />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>

              <Box
                display={
                  params.row.queue_status === "WAITING" &&
                  params.row.transaction === "VIDEO CALL"
                    ? "block"
                    : "none"
                }
              >
                <Tooltip title="Go Video Call">
                  <span>
                    <IconButton
                      onClick={UpdateQueue({
                        id: params.row.id,
                        queue_status: "ONGOING",
                        date_ongoing: m().format("YYYY-MM-DD HH:mm:ss"),
                        customer_id: params.row.caller_id,
                        room_id: params.row.room_id,
                        chat_name: `${params.row.firstname} ${params.row.lastname}`,
                      })}
                    >
                      <FontAwesomeIcon
                        icon={faVideo}
                        shake
                        style={{ color: "#0588fa" }}
                      />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
            </Stack>
          </Box>
        );
      },
    },
    {
      field: "category",
      headerName: "Category",
      width: 200,
    },
    {
      field: "sub_category",
      headerName: "Sub Category",
      width: 200,
    },
    {
      field: "fullname",
      headerName: "Caller Name",
      width: 200,
      valueGetter: (params) =>
        `${params.row.firstname || ""} ${params.row.lastname} `,
    },
    {
      field: "csr_fullname",
      headerName: "CSR Name",
      width: 200,
      valueGetter: (params) =>
        `${params.row.csr_firstname || ""} ${params.row.csr_lastname || ""} `,
    },
    { field: "queue_status", headerName: "Status", width: 200 },
    {
      field: "date_onqueue",
      headerName: "Date Queued",
      width: 200,
      
    },
    { field: "date_ongoing", headerName: "Date Ongoing", width: 200 },
    { field: "date_end", headerName: "Date Ended", width: 200 },
    { field: "transaction", headerName: "Transaction", width: 150 },
  ];

  const UpdateQueue = (queue) => (e) => {
   // console.log(queue);

    Swal.fire({
      title: "Update this Queue?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      customClass: {
        actions: "my-actions",
        cancelButton: "order-1 right-gap",
        confirmButton: "order-2",
        denyButton: "order-3",
      },
    }).then(async (result) => {
      async function updateQueueStatus() {
        return await httpPrivate
          .put(`/update-queue/${queue.id}`, queue)
          .then((response) => {
            return response.data;
          });
      }

      if (result.isConfirmed) {
        //ongoingWs.send(JSON.stringify({ queue: queue, rows: rows }));
        queue.remove = true;
        queue.csr_id = user.id;
        const updates = await updateQueueStatus();
        const updated_queue = updates.queue;
        const updated_chat_room = updates.chat_room;

        wsRef.current.send(JSON.stringify(queue));
        // const chatWs = websocket(`/api/chat/${queue}`)
        //console.log(updates);
        updated_queue.room_code = updated_chat_room.room_code;
        updated_queue.room_id = updated_chat_room.id; 
        showChatWindow({chatRoom: updated_chat_room, chatHistory: []})
        setState({ data: updated_queue });

        
       
            
      }

      //else if (result.isDenied) {
      //   Swal.fire("Changes are not saved", "", "info");
      // }
    });
  };

  const [chatQueCount, setChatQueCount] = useState(0);
  const [vcQueCount, setVcQueCount] = useState(0);

  // setTimeout(() => {
  //   setState(randomNumberBetween(1000000, 100, 100000000));
  // }, 60000);

  // useState(() => {
  //   ongoingWs.onopen = (e) => {
  //     open(e);
  //     function open(e) {}
  //   };

  //   ongoingWs.onmessage = (e) => {
  //     const data = JSON.parse(e.data);
  //     const message = JSON.parse(data.message);
  //     const queue = message.queue;
  //     const datarows = message.rows;
  //     // console.log(e.data);
  //     // console.log('Queue', queue);
  //     // console.log('Rows', datarows);

  //     setRows(datarows.filter((row) => +row.id !== +queue.id));
  //   };

  //   return () => {
  //     ongoingWs.onclose = () => {
  //       setOngoingWs(websocket("chat/ongoing"));
  //     };
  //   };
  // }, [ongoingWs, ongoingWs.onopen]);

 
  if (state.data.queue_status === "ONGOING" && state.data.transaction==='VIDEO CALL') {
    const url = `/video-call/meeting/${state.data.room_code}`;
    return <Navigate to={url} state={state.data} />;
  }

  return (
    <Box>
       <HelmetProvider>
        <Helmet>
          <title>Dashboard</title>
        </Helmet>
      </HelmetProvider>
      <Grid
        container
        gap={1}
        spacing={{ xs: 0 }}
        columns={{ xs: 12 }}
        className="grid-container mb-2"
      >
        <Grid item xs={2} className="grid-item-container">
          <div className="status-label">CHAT ONQUEUE</div>
          <div className="grid-item">{chatQueCount}</div>
        </Grid>
        <Grid item xs={2} className="grid-item-container">
          <div className="status-label">VIDEO CALL ONQUEUE</div>
          <div className="grid-item">{vcQueCount}</div>
        </Grid>
      </Grid>

      <Box sx={{ maxWidth: "100%", overflowX: "scroll" }}>
        <Box>
          <FontAwesomeIcon
            icon={faCircle}
            style={{
              color: queueActive ? "#00910c" : "#737373",
              paddingRight: 10,
              height: 8,
              width: 8,
            }}
          />
          {queueActive ? "CONNECTED TO LIVE QUEUE" : "CONNECTING..."}
        </Box>
        <DataGrid
          rows={queueRows}
          columns={columns}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[10, 25, 50]}
          apiRef={apiRef}
          density="compact"
          sx={{ height: "66vh", fontSize: "9pt" }}
        
        />
      </Box>
    </Box>
  );
}

export default Dashboard;
