import {
  Box,
  Chip,
  Dialog,
  DialogContentText,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  useTheme,
  useMediaQuery,
  TextField,
  DialogActions,
  Button
} from "@mui/material";
import {
  useParams,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import websocket from "../../services/Ws";
import { useEffect, useState } from "react";
import { JaaSMeeting, JitsiMeeting } from "@jitsi/react-sdk";
import useAuth from "../../hooks/useAuth";
import { httpPrivate } from "../../services/Api";
import { Helmet, HelmetProvider } from "react-helmet-async";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";

import m from "moment";
function MeetingRoom() {
  const { meetingCode } = useParams();
  const { auth } = useAuth();
  const user = auth?.token.user;
  const loc = useLocation();
  const [endCall, setEndCall] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [concernStatus, setConcernStatus] = useState("RESOLVED");
  const [remarks, setRemarks] = useState("");
  const navigate = useNavigate();

  const [vcWs, setVcWs] = useState(
    websocket(`api/chat/${meetingCode}/${"CSR Agent"}`)
  );
  const queue_details = loc.state;

  //console.log(queue_details);

  useEffect(() => {
    vcWs.onopen = (e) => {
      vcWs.onmessage = (event) => { };
    };
    return () => {
      vcWs.onclose = () => {
        setVcWs(websocket(`api/chat/${meetingCode}/${"CSR Agent"}`));
      };
    };
  }, [vcWs, vcWs.onopen, vcWs.onclose, meetingCode]);

  const updateQueue = async () => {
    await httpPrivate
      .put(`queue/action/4/${queue_details.id}`, {
        queue_status: "RESOLVED",
        date_end: m().format("YYYY-MM-DD HH:mm:ss"),
        room_id: queue_details.room_id,
      })
      .then((response) => { });

    setEndCall(true);
  };

  return endCall ? (
    <Navigate to={"/video-call"} />
  ) : (
    <Box>
      <HelmetProvider>
        <Helmet>
          <title>Meeting Room</title>
        </Helmet>
      </HelmetProvider>

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

      <JaaSMeeting
        roomName={meetingCode}
        configOverwrite={{
          startWithAudioMuted: true,
          disableModeratorIndicator: true,
          startScreenSharing: true,
          enableEmailInStats: false,
          prejoinPageEnabled: false,
          enableClosePage: false,
         

        }}

        interfaceConfigOverwrite={{
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,

        }}
        userInfo={{
          displayName: user.nick_name,
        }}
        onApiReady={(externalApi) => {
          
          externalApi.on('readyToClose', () => {
                navigate("/video-call")
          })
          // here you can attach custom event listeners to the Jitsi Meet External API
          // you can also store it locally to execute commands
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = "100vh";
          iframeRef.style.width = "90%";
        }}


      />
    </Box>
  );
}

export default MeetingRoom;
