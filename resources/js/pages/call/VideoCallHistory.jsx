import "../../assets/styles/call.css";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import {
  Box,
  Chip,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button

} from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../context/AuthProvider";
import { httpPrivate } from "../../services/Api";
import WifiCallingIcon from "@mui/icons-material/WifiCalling";
import CallEndIcon from "@mui/icons-material/CallEnd";
import { useNavigate } from "react-router-dom";
import useMomentLocale from "../../hooks/useMomentLocale";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline"

import m from "moment";
const VideoCallHistory = () => {
  const { auth } = useContext(AuthContext);
  const { getDurationStr } = useMomentLocale();
  const [rows, setRows] = useState([]);
  const user = auth?.token?.user;
  const apiRef = useGridApiRef();
  const navigate = useNavigate();

  const [state, setState] = useState({});
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [concernStatus, setConcernStatus] = useState("RESOLVED");
  const [remarks, setRemarks] = useState("");
  const [selectedRow, setSelectedRow] = useState({});
  const columns = [
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              display:
                params.row.queue_status !== "RESOLVED"
                  ? "block"
                  : "none",
            }}
          >
            <Stack direction={"row"}>
              <Tooltip title="Reconnect">
                <IconButton
                  onClick={() => {
                    navigate(
                      `/video-call/meeting/${params.row.room_code}`,
                      {
                        state: params.row,
                      }
                    );
                  }}
                  style={{ color: "#017a22" }}
                >
                  <WifiCallingIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="End Call">
                <IconButton
                  onClick={() => {
                    setSelectedRow(params.row)
                    setDialogOpen(true);
                  }}
                  style={{ color: "#cf0408" }}
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
      width: 120,
      renderCell: (params) => {
        const colors = {
          RESOLVED: "success",
          PENDING: "warning",
          ONGOING: "error",
        };
        return (
          <Chip sx={{fontSize: "inherit"}}
            label={params.row.queue_status}
            color={colors[params.row.queue_status]}
          />
        );
      },
    },
    {
      field: "remarks",
      headerName: "Remarks",
      width: 200,
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
        `${params.row.csr_firstname || ""} ${params.row.csr_lastname || ""
        } `,
    },
    { field: "date_onqueue", headerName: "Date Queued", width: 130 },
    { field: "date_ongoing", headerName: "Date Ongoing", width: 130 },
    { field: "date_end", headerName: "Date Ended", width: 130 },
    {
      field: "duration",
      headerName: "Duration",
      width: 150,
      valueGetter: (params) =>
        getDurationStr(
          m(params.row.date_ongoing),
          m(params.row.date_end)
        ),
    },
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

  const endCall = async () => {
    const { id, room_id } = selectedRow;
    setDialogOpen(false);
   
    await httpPrivate
      .put(`queue/action/4/${id}`, {
        queue_status: concernStatus,
        date_end: m().format("YYYY-MM-DD HH:mm:ss"),
        room_id: room_id,
        remarks: remarks
      })
      .then((response) => {
        setState(response.data);
      })
      .catch((err) => {
        console.log(err);
      });

  };

  return (
    <Box>
      <Dialog fullScreen={fullScreen} open={dialogOpen} fullWidth>
        <DialogTitle>{"End Call?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>Choose status.</DialogContentText>
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
          <Button
            autoFocus
            onClick={() => {
              setDialogOpen(false);
            }}
          >
            CANCEL
          </Button>
          <Button autoFocus onClick={endCall}>
            AGREE
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container sx={{ height: "86vh", marginTop: 3 }}>
        <Grid item xs={12} />
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
          }}
          pageSizeOptions={[10, 25, 50]}
          apiRef={apiRef}
          density="compact"
          className="data-grid"
          style={{ height: "100%", fontSize: "11px" }}
        />
      </Grid>
    </Box>
  );
};

export default VideoCallHistory;
