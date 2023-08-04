import "../assets/styles/main.css";
import "../assets/styles/color.css";
import "../assets/styles/login.css";
import "../assets/styles/typography.css";
import "../assets/styles/loader.css";
import UpsLogo from "../assets/images/icons/Unified_Logo-01.png";

import Routers from "../routes/Routers";
import React, { useContext, useEffect, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Badge, Fab, Tooltip } from "@mui/material";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faMessage,
  faUserPlus,
  faTableList,
  faHouseChimney,
  faVideo,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import useAuth from "../hooks/useAuth";
import RolesProvider from "../context/RolesProvider";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import QueueContext from "../context/QueueProvider";
import WebsocketContext from "../context/WebsocketProvider";
import websocket from "../services/Ws";
import QueueIcon from "@mui/icons-material/Queue";
import useFunctions from "../hooks/useFunctions";

const drawerWidth = 200;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 5px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 10px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const Layout = () => {
  const { ROLES } = React.useContext(RolesProvider);
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const activeRoute = useLocation();
  const { pathname } = activeRoute;
  const splitLoc = pathname.split("/");
  const navigate = useNavigate();
  const { auth, setAuth, setSession } = useAuth();
  const user = auth?.token?.user;
  const { queueRows, queueActive } = useContext(QueueContext);
  const { properCase } = useFunctions();
  // console.log(auth)

  const Logout = () => {
    Swal.fire({
      title: "Confirm logout?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      customClass: {
        actions: "my-actions",
        cancelButton: "order-1 right-gap",
        confirmButton: "order-2",
        denyButton: "order-3",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.removeItem("session");
        setSession({});
        setAuth({});
      }
      //else if (result.isDenied) {
      //   Swal.fire("Changes are not saved", "", "info");
      // }
    });
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const menuItems = [
    {
      key: "Dashboard",
      icon: faHouseChimney,
      url: "/",
      iconColor: "#383535",
      allowedRoles: [ROLES.User, ROLES.Admin],
    },
    {
      key: "Chat",
      icon: faMessage,
      url: "/chat",
      iconColor: "#383535",
      allowedRoles: [ROLES.User, ROLES.Admin],
    },
    {
      key: "Video Call",
      icon: faVideo,
      url: "/video-call",
      iconColor: "#383535",
      allowedRoles: [ROLES.User, ROLES.Admin],
    },
    {
      key: "User",
      icon: faUserPlus,
      url: "/user",
      iconColor: "#383535",
      allowedRoles: [ROLES.Admin],
    },
    {
      key: "Reports",
      icon: faTableList,
      url: "/reports",
      iconColor: "#383535",
      allowedRoles: [ROLES.Admin],
    },
  ];

  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <CssBaseline />

        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <img src={UpsLogo} className="logo-img" alt="logo" />
            <Typography variant="h6" noWrap component="div">
              UNIFIED PORTAL
              <div style={{ fontSize: "small" }}>
                <span>Welcome! </span>
                <Link to={`/user/${user?.id}`}>
                  <span style={{ color: "#f7c214" }}>{`${user?.full_name} (${properCase(user?.nick_name || '')})`} </span>
                </Link>
              </div>
            </Typography>
          </Toolbar>
        </AppBar>
        <Box>
          <Drawer variant="permanent" open={open}>
            <DrawerHeader>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === "rtl" ? (
                  <ChevronRightIcon />
                ) : (
                  <ChevronLeftIcon />
                )}
              </IconButton>
            </DrawerHeader>
            <Divider />
            <List
              style={{
                height: "85%",
                paddingBottom: 0,
              }}
            >
              {menuItems.map((menu) => {
                return (
                  <Box key={menu.key}>
                    <ListItem
                      style={{
                        display: menu.allowedRoles.find((role) =>
                          role.includes(user?.user_role)
                        )
                          ? "block"
                          : "none",
                      }}
                    >
                      <div
                        className={
                          `/${splitLoc[1]}` === menu.url ? "active-link" : ""
                        }
                        style={{ width: "100%", height: 25 }}
                      >
                        <ListItemButton
                          component={Link}
                          to={menu.url}
                          sx={{
                            justifyContent: open ? "initial" : "center",
                            px: 2.5,
                            height: "25px",
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 0,
                              mr: open ? 3 : "auto",
                              justifyContent: "center",
                            }}
                          >
                            <FontAwesomeIcon
                              icon={menu.icon}
                              size="lg"
                              style={{ color: menu.iconColor }}
                            />
                          </ListItemIcon>
                          <ListItemText sx={{ opacity: open ? 1 : 0 }}>
                            {" "}
                            <span style={{ fontSize: "smaller" }}>
                              {menu.key}
                            </span>
                          </ListItemText>
                        </ListItemButton>
                      </div>
                    </ListItem>
                    <Divider />
                  </Box>
                );
              })}

              <ListItem
                key="Logout"
                style={{
                  bottom: "-1px",
                  position: "absolute",
                  paddingBottom: 0,
                }}
              >
                <ListItemButton
                  onClick={Logout}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faRightFromBracket}
                      size="lg"
                      style={{ color: "#383535" }}
                    />
                  </ListItemIcon>
                  <ListItemText sx={{ opacity: open ? 1 : 0 }}>
                    <span style={{ fontSize: "small" }}>Logout</span>
                  </ListItemText>
                </ListItemButton>
              </ListItem>
            </List>
          </Drawer>
        </Box>
        <div
          style={{
            height: "80vh",
            maxHeight: "80vh",
            width: "95vw",
            border: 1,
            borderColor: "orange",
            marginLeft: "20px",
            marginTop: "50px",
          }}
        >
          <Box className="App">
            <Routers />
          </Box>
        </div>
      </LocalizationProvider>

      <div style={{ position: "absolute", top: "10%", right: "20px" }}>
        <Badge
          badgeContent={queueRows.length}
          color="secondary"
          anchorOrigin={{ vertical: "top", horizontal: "left" }}
        >
          <Fab sx={{ backgroundColor: queueActive ? "#ff370a" : "#949494" }}>
            <Tooltip title="Queueing">
              <IconButton component={Link} to="/">
                <QueueIcon style={{ fontSize: "large", color: "#121212" }} />
              </IconButton>
            </Tooltip>
          </Fab>
        </Badge>
      </div>
    </Box>
  );
};

export default Layout;
