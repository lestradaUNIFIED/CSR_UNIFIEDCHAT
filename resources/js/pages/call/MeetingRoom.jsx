import { Box } from "@mui/material";
import { useParams, useNavigate, Navigate, useLocation } from "react-router-dom";
import websocket from "../../services/Ws";
import { useEffect, useState } from "react";
import { JaaSMeeting, JitsiMeeting } from "@jitsi/react-sdk";
import useAuth from "../../hooks/useAuth";
import { httpPrivate } from "../../services/Api";
import { Helmet, HelmetProvider } from "react-helmet-async";

import  m from "moment";
function MeetingRoom() {
  const { meetingCode } = useParams();
  const { auth } = useAuth();
  const user = auth?.token.user;
  const loc = useLocation();
  const [endCall, setEndCall] = useState(false); 
  const [vcWs, setVcWs] = useState(
    websocket(`api/chat/${meetingCode}/${"CSR Agent"}`)
  );
  const queue_details = loc.state;

  //console.log(queue_details);

  useEffect(() => {
    vcWs.onopen = (e) => {
      vcWs.onmessage = (event) => {};
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
        queue_status: "ENDED",
        date_end: m().format("YYYY-MM-DD HH:mm:ss"),
        room_id: queue_details.room_id
      })
      .then((response) => {
        
      });

      setEndCall(true);
  };

  return (
    
    endCall ? 
    <Navigate to={'/video-call'} />
    :
    <Box >
    <HelmetProvider >
      <Helmet >
        <title >Meeting Room</title>
      </Helmet>
    </HelmetProvider>
    <JaaSMeeting
      roomName={meetingCode}
      configOverwrite={{
        startWithAudioMuted: true,
        disableModeratorIndicator: true,
        startScreenSharing: true,
        enableEmailInStats: false,
        prejoinPageEnabled: false,
        enableClosePage : true,
        
      }}
      
      interfaceConfigOverwrite={{
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
      }}
      userInfo={{
        displayName: user.full_name,
      }}
      onApiReady={(externalApi) => {
        externalApi.on("readyToClose", () => {
          updateQueue();
        });

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
