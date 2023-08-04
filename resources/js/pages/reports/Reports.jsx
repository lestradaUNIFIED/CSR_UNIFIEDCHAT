import "../../assets/styles/reports.css";
import React from "react";
import {
  Box,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
 } from "@mui/material";
import { Link, Outlet, useLocation } from "react-router-dom";
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded';
const Reports = () => {
  const activeRoute = useLocation();
  const { pathname } = activeRoute;
  const splitLoc = pathname.split("/");
  
  
  const menuItems = [
    { text: "QUEUE", link: "queue" },
    { text: "USERS", link: "users" },
    { text: "CLIENTS", link: "clients" },
  ];  
 // console.log(splitLoc)
  return (
    <Box marginTop={5}>
      <Grid container height={"90vh"}>
        <Grid item height={"89vh"} xs={2}>
          <List disablePadding>
            <ListItem className="report-menu-header">
              <ListItemText>
                <span className="report-menu-header-text">MENU</span>
              </ListItemText>
            </ListItem>
            {menuItems.map((menu, index) => {
              const activeRoute = splitLoc[2] === menu.link;
              return (
                <React.Fragment key={index}>
                  <ListItem disablePadding className={activeRoute ? 'active-menu' : 'report-menu'}>
                    <ListItemButton
                      component={Link}
                      to={`/reports/${menu.link}`}

                    >
                      {menu.text}
                    </ListItemButton>
                    <ArrowRightRoundedIcon fontSize={'large'} className="icon" sx={{display: activeRoute ? 'block' : 'none'}} />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              );
            })}
          </List>
        </Grid>
        <Grid item xs={10}>
          <Outlet />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;
