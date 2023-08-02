import { Box, Grid, Button } from "@mui/material";
import { Link } from "react-router-dom";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import { useState, useEffect } from "react";
import { httpPrivate, httpAuth } from "../../services/Api";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import m from "moment";
import { Helmet, HelmetProvider } from "react-helmet-async";
import useAuth from "../../hooks/useAuth";
import CategoryIcon from '@mui/icons-material/Category';
const User = () => {
  const [rows, setRows] = useState([]);
  const { auth } = useAuth();

 // console.log("Auth", auth);

  const navigate = useNavigate();
  useEffect(() => {
    let ignore = false;
    async function getUsers() {
      await httpPrivate
        .get("user",{headers : {Authorization: `Bearer ${auth?.token?.token}`}} )
        .then((response) => {
          setRows(response.data);
          //        console.log(response);
        });
    }
    if (!ignore) {
      getUsers();
    }
    return () => {
      ignore = true;
    };
  }, []);

  const apiRef = useGridApiRef();
  //let columnIndex = 0;

  const columns = [
    {
      field: "id",
      headerName: "#",
      filterable: false,
    },
    {
      field: "lastname",
      headerName: "Lastname",
      width: 200,
      editable: true,
      valueGetter: (params) => `${params.row.lastname.toUpperCase()} `,
    },
    {
      field: "firstname",
      headerName: "FirstName",
      width: 200,
      valueGetter: (params) => `${params.row.firstname.toUpperCase()} `,
    },
    {
      field: "full_name",
      headerName: "Full Name",
      width: 200,
      valueGetter: (params) => `${params.row.full_name.toUpperCase()} `,
    },
    {
      field: "nick_name",
      headerName: "Nickname",
      width: 200,
      valueGetter: (params) =>
        `${(
          params.row.nick_name.trim() || params.row.firstname
        ).toUpperCase()}` || "",
    },
    {
      field: "userid",
      headerName: "User-ID",
      width: 200,
      valueGetter: (params) => `${params.row.userid.toUpperCase()} `,
    },

    {
      field: "email",
      headerName: "Email",
      width: 200,
    },

    {
      field: "user_role",
      headerName: "User Role",
      width: 200,
      valueGetter: (params) =>
        params.row.user_role === "1210" ? "User" : "Admin",
    },

    {
      field: "created_at",
      headerName: "Date Created",
      width: 200,
      valueGetter: (params) =>
        m(params.row.created_at).format("YYYY-MM-DD HH:mm:ss"),
    },
  ];

  return (
    <Box paddingTop={1}>
      <HelmetProvider>
        <Helmet>
          <title>User Maintenance</title>
        </Helmet>
      </HelmetProvider>
      <Grid container paddingTop={2}>
        <Grid container gap={0.5}>
        <Grid item >
            <Button component={Link} to="/register" variant="contained" size="small">
              <PersonAddAltRoundedIcon style={{color: "#ff5500"}} /> Add User
            </Button>

          </Grid>
          <Grid item>
            <Button component={Link} to="/user/category-template" variant="contained" size="small">
              <CategoryIcon style={{color: "#ff5500"}} /> Category Access Template
            </Button>

          </Grid>
          
        </Grid>
      </Grid>
      <Grid container paddingTop={2}>
        <DataGrid
          rows={rows}
          columns={columns}
          density="compact"
          initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
          pageSizeOptions={[10, 25, 50]}
          apiRef={apiRef}
          onRowDoubleClick={(params) => {
            navigate(`/user/${params.row.id}`);
          }}
          style={{ height: "80vh" }}
        />
      </Grid>
    </Box>
  );
};

export default User;
