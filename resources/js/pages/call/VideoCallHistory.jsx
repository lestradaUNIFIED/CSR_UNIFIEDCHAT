import "../../assets/styles/call.css";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { Box, Chip, Grid, IconButton, Stack, Tooltip } from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../context/AuthProvider";
import { httpPrivate } from "../../services/Api";
import WifiCallingIcon from "@mui/icons-material/WifiCalling";
import CallEndIcon from '@mui/icons-material/CallEnd';
import { Link, useNavigate } from "react-router-dom";
import { Oval } from "react-loader-spinner";
import m from 'moment';
const VideoCallHistory = () => {
  const { auth } = useContext(AuthContext);
  const [rows, setRows] = useState([]);
  const user = auth?.token?.user;
  const apiRef = useGridApiRef();
  const navigate = useNavigate();

  const [state, setState] = useState({});
  const columns = [
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (

            <Box sx={{display: params.row.queue_status === 'VIDEO CALL ONGOING' ? 'block' : 'none'}}>
            
            <Stack direction={'row'} >
            <Tooltip title="Reconnect">
              <IconButton
                onClick={() => {
                  navigate(
                    `/video-call/meeting/${params.row.room_code}`,
                    {
                        state: params.row
                    }
                  )
                }}

                style={{color: '#017a22'}}
              >
                <WifiCallingIcon />
              </IconButton>
              
            </Tooltip>
            <Tooltip title="End Call">
              <IconButton
                onClick={async () => {
                    const { id, room_id} = params.row;
                    await httpPrivate
                    .put(`queue/action/4/${id}`, {
                      queue_status: "ENDED",
                      date_end: m().format("YYYY-MM-DD HH:mm:ss"),
                      room_id: room_id
                    })
                    .then((response) => {
                        setState(response.data);
                    }).catch(err => {
                        console.log(err);
                    });
     
                }}

                style={{color: '#cf0408'}}
              >
                <CallEndIcon />
              </IconButton>
            </Tooltip>
   
            </Stack>

          </Box>
        );
      },
    },
    {
      field: "queue_status",
      headerName: "Status",
      width: 200,
      renderCell: (params) => {
        return (
          <Chip
            label={params.row.queue_status}
            color={params.row.queue_status === "ENDED" ? "info" : "warning"}
          />
        );
      },
    },
    {
      field: "fullname",
      headerName: "Customer",
      width: 200,
      valueGetter: (params) =>
        `${params.row.firstname || ""} ${params.row.lastname} `,
    },
    {
      field: "csr_fullname",
      headerName: "CSR",
      width: 200,
      valueGetter: (params) =>
        `${params.row.csr_firstname || ""} ${params.row.csr_lastname || ""} `,
    },
    { field: "date_onqueue", headerName: "Date Queued", width: 200 },
    { field: "date_ongoing", headerName: "Date Ongoing", width: 200 },
    { field: "date_end", headerName: "Date Ended", width: 200 },
    { field: "duration", headerName: "Duration", width: 200 },
    { field: "transaction", headerName: "Transaction", width: 150 },
  ];

  useEffect(() => {
    let ignore = false;
    if (!ignore) {
      async function getVideoCallRows() {
        return await httpPrivate
          .get(`video-call/${user.id}`)
          .then((response) => {
            setRows(response.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }

      getVideoCallRows();
    }

    return () => {
      ignore = true;
    };
  }, [state]);




  return (
    <Box>
    <Grid container sx={{ height: "86vh", marginTop: 3 }}>
        <Grid item xs={12} />
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
          pageSizeOptions={[10, 25, 50]}
          apiRef={apiRef}
          density="compact"
          className="data-grid"
          style={{ height: "100%" }}
        
          
        />
      </Grid>
    </Box>
  );
};

export default VideoCallHistory;
