import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
  useMediaQuery,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  TextField,
  Button
} from "@mui/material";
import { useState } from "react";
import { httpPrivate } from "../../services/Api";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import useAuth from "../../hooks/useAuth";
import m from "moment";
import { useNavigate } from "react-router-dom";
const EndChatDialog = (props) => {
  const {chatRoom, wsRef, confirmDialogOpen, setConfirmDialogOpen, chatEnded, setChatEnded} = props
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [concernStatus, setConcernStatus] = useState("RESOLVED");
  const [remarks, setRemarks] = useState("");
  const { auth } = useAuth();
  const { user } = auth?.token;
  const navigate = useNavigate();
  const closeDialog = () => {
    setConfirmDialogOpen(false);
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

  return (
    <Dialog
      fullScreen={fullScreen}
      open={confirmDialogOpen}
      fullWidth
      sx={{ zIndex: "999999999999" }}
    >
      <DialogTitle>{"End Chat?"}</DialogTitle>
      <DialogContent>
        <DialogContentText>Choose the status of the concern.</DialogContentText>
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
  );
};

export default EndChatDialog;
