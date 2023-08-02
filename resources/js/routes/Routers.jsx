import { Routes, Route } from "react-router-dom";
import { useContext } from "react";
import Dashboard from "../pages/dashboard/Dashboard";
import ChatRoom from "../pages/chat/ChatRoom";
import MeetingRoom from "../pages/call/MeetingRoom";
import NotFound from "../pages/notfound/notfound";
import Register from "../pages/register/register";
import Unauthorized from "../pages/unauthorized/Unauthorized";
import RequireAuth from "../Components/RequireAuth";
import Reports from "../pages/reports/Reports";
import User from "../pages/user/User";
import RolesContext from "../context/RolesProvider";
import QueueReport from "../pages/reports/Queue";
import UserReports from "../pages/reports/Users";
import ReportsIndex from "../pages/reports/Index";
import VideoCallHistory from "../pages/call/VideoCallHistory";
import CategoryTemplate from "../pages/user/CategoryTemplate";
function Routers() {
  const { ROLES } = useContext(RolesContext);

  return (
    <Routes>
      {/* <Route path="/login" element={<Login />} /> */}
      {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      <Route path="/" element={<Dashboard />}></Route>
      <Route path="/chat/" element={<ChatRoom />} />
      <Route
        path="/chat/dm/:roomCode/:customerId/:roomId/:queueId/:roomStatus"
        element={<ChatRoom />}
      />
      <Route path="/chat/dm/:roomCode/:customerId/:roomId" element={<ChatRoom />} />

      <Route
        path="/video-call/meeting/:meetingCode"
        element={<MeetingRoom />}
      />

      <Route path="/video-call" element={<VideoCallHistory />} />
     

      <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
      <Route path="/user" element={<User />} />
      <Route path="/user/category-template" element={<CategoryTemplate />} />
        
        <Route path="/register" element={<Register />} />
      </Route>

      <Route path="/user/:userId" element={<Register />} />

      <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
        <Route path="/reports" element={<Reports />}>
          <Route index element={<ReportsIndex />} />
          <Route path="/reports/queue" element={<QueueReport />} />
          <Route path="/reports/users" element={<UserReports />} />
        </Route>
      </Route>

      <Route path="/*" element={<NotFound />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
    </Routes>
  );
}

export default Routers;
