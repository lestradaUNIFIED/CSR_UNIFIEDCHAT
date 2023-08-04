import "../../assets/styles/register.css";
import Alert from "@mui/material/Alert";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  Collapse,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  ListItemText,
  ListSubheader,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import AttachEmailRoundedIcon from "@mui/icons-material/AttachEmailRounded";
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
import PasswordRoundedIcon from "@mui/icons-material/PasswordRounded";
import { httpPrivate } from "../../services/Api";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import useAuth from "../../hooks/useAuth";
import useCategoryTemplate from "../../hooks/useCategoryTemplates";
import { Link, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RolesContext from "../../context/RolesProvider";

const Register = ({ userInfo }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fullName, setFullName] = useState("");
  const [userLevel, setUserLevel] = useState("1210");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({ severity: "info", message: "" });
  const { auth } = useAuth();
  const [dialog, setDialog] = useState({ open: false, content: "" });
  const [state, setState] = useState({});
  const [category, setCategory] = useState([1]);
  const user = auth?.token?.user;
  const { userId } = useParams();
  const { ROLES } = useContext(RolesContext);
  const { categoryTemplates } = useCategoryTemplate();

  useEffect(() => {
    setFullName(`${firstName} ${lastName}`);
  }, [lastName, firstName]);

  useEffect(() => {
    let ignore = false;
    if (userId) {
      if (!ignore) {
        async function loadUser() {
          await httpPrivate.get(`/user/${userId}`).then((response) => {
            const userSelected = response.data.user;
           // console.log(response.data.user);
            //console.log(document.getElementById('formRegister'));
            setLastName(userSelected.lastname);
            setFirstName(userSelected.firstname);
            setUserLevel(userSelected.user_role);

            setCategory(JSON.parse(userSelected.category));

            document.getElementById("lastname").value = userSelected.lastname;
            document.getElementById("firstname").value = userSelected.firstname;
            document.getElementById("email").value = userSelected.email;
            document.getElementById("userid").value = userSelected.userid;
            document.getElementById("nick_name").value =
              userSelected.nick_name.trim() || userSelected.firstname;
          });
        }
        loadUser();
      }
    }
    return () => {
      ignore = true;
    };
  }, [state, userId]);

  const register = async (event) => {
    event.preventDefault();
    //console.log(event.target);
    const formData = new FormData(document.getElementById("formRegister"));
    const payload = Object.fromEntries(formData.entries());

    payload.category = JSON.stringify(category);

    if (payload.password !== confirmPassword) {
      setOpen(true);
      setAlert({ severity: "error", message: "Passwords did not match!" });
      setTimeout(() => {
        setOpen(false);
      }, 8000);
    } else {
      setDialog({ open: false, content: "" });
      if (userId) {
        Object.keys(payload).forEach((key) => {
          payload[key] === "" && delete payload[key];
        });
        // console.log(payload);

        await httpPrivate
          .put(`/user/${userId}`, payload)
          .then((response) => {
            const responseData = response.data;

            setState(response.data);
            setOpen(true);
            setAlert({ severity: "info", message: "User Info Updated!" });
            setTimeout(() => {
              setOpen(false);
            }, 5000);
          })
          .catch((error) => {
            setOpen(true);
            setAlert({
              severity: "error",
              message: error?.response?.data?.message,
            });
            setTimeout(() => {
              setOpen(false);
            }, 5000);
          });
      } else {
        payload.created_by_userid = user.id;
        await httpPrivate
          .post("/user", payload)
          .then((response) => {
            // console.log(response);
            const responseData = response.data;
            if (responseData?.message_type === "error") {
              setOpen(true);
              setAlert({ severity: "error", message: responseData.message });
              setTimeout(() => {
                setOpen(false);
              }, 8000);
            } else {
              setOpen(true);
              setAlert({ severity: "success", message: "User Created!" });

              setTimeout(() => {
                setOpen(false);
              }, 5000);
              document.getElementById("formRegister").reset();
              setFullName("");
            }
          })
          .catch((error) => {
            setOpen(true);
            setAlert({
              severity: "error",
              message: error?.response?.data?.message,
            });
            setTimeout(() => {
              setOpen(false);
            }, 8000);
          });
      }
    }

    // const payload = {
    //   lastname: formData.get("lastname"),
    //   firstname: formData.get("firstname")
    // };
  };
 // console.log(categoryTemplates)
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const handleCategoryChange = (event) => {
    const {
      target: { value },
    } = event;
   // console.log(value);
    setCategory(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <Box
      component={"form"}
      onSubmit={(e) => {
        e.preventDefault();
        setDialog({
          open: true,
          content: userId
            ? "This will update existing user info"
            : "This will add new user.",
        });
      }}
      id="formRegister"
      paddingTop={1}
    >
      <Dialog open={dialog.open} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Save</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialog.content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={register} autoFocus variant="contained">
            SAVE
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setDialog({ open: false, content: "" });
            }}
          >
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>
      <CssBaseline />

      <Grid
        container
        gap={1}
        style={{ paddingTop: 1, paddingLeft: 10 }}
        className="grid-container"
      >
        <Grid container>
          <Grid item xs={12} height={1}></Grid>
        </Grid>

        <Grid container className="header">
          <Grid item>
            <IconButton
              component={Link}
              to="/user"
              size="medium"
              className="backIcon"
              style={{ color: "#ffffff" }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Grid>
          <Grid item xs={11}>
            <span className="headerText">Registration</span>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={12}>
            <Collapse in={open}>
              <Alert
                severity={alert.severity}
                variant="filled"
                action={
                  <IconButton
                    color="inherit"
                    aria-label="close"
                    size="small"
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    <CancelRoundedIcon />
                  </IconButton>
                }
              >
                {alert.message}
              </Alert>
            </Collapse>
          </Grid>
        </Grid>

        <Grid container paddingTop={2}>
          <Grid item xs={3} paddingRight={1}>
            <TextField
              size="small"
              fullWidth
              label="Lastname"
              required
              onChange={(e) => {
                setLastName(e.target.value);
              }}
              InputLabelProps={{ shrink: true }}
              defaultValue={lastName}
              id="lastname"
              name="lastname"
            />
          </Grid>
          <Grid item xs={3} paddingRight={1}>
            <TextField
              name="firstname"
              id="firstname"
              label="Firstname"
              fullWidth
              size="small"
              required
              onChange={(e) => {
                setFirstName(e.currentTarget.value);
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
        <Grid container gap={1} paddingTop={2}>
          <Grid item xs={6} paddingRight={1}>
            <TextField
              name="full_name"
              id="full_name"
              label="Fullname"
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
              InputLabelProps={{ shrink: true }}
              value={fullName}
            />
          </Grid>
        </Grid>
        <Grid container gap={1} paddingTop={2}>
          <Grid item xs={6} paddingRight={1}>
            <TextField
              name="nick_name"
              id="nick_name"
              label="Nick Name"
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        <Grid container gap={1} paddingTop={2}>
          <Grid item xs={6} paddingRight={1}>
            <TextField
              name="email"
              id="email"
              type={"email"}
              label="Email Address"
              fullWidth
              required
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachEmailRoundedIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        <Grid container paddingTop={2}>
          <Grid item xs={3} paddingRight={1}>
            <TextField
              name="userid"
              id="userid"
              label="Username"
              fullWidth
              required
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountBoxRoundedIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        <Grid container paddingTop={2} gap={1}>
          <Grid item xs={3} paddingRight={1}>
            <TextField
              name="password"
              id="password"
              label="Password"
              fullWidth
              required={userId ? false : true}
              size="small"
              type="password"
              placeholder="UNCHANGED"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PasswordRoundedIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={3} paddingRight={1}>
            <TextField
              label="Confirm Password"
              fullWidth
              size="small"
              type="password"
              required={userId ? false : true}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PasswordRoundedIcon />
                  </InputAdornment>
                ),
              }}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
          </Grid>
        </Grid>
        <Grid container paddingTop={2}>
          <Grid item xs={3} paddingRight={1}>
            <FormControl
              fullWidth
              size="small"
              disabled={user.user_role !== ROLES.Admin}
            >
              <InputLabel>Access Level</InputLabel>
              <Select
                label="Access Level"
                id="user_role"
                name="user_role"
                size="small"
                fullWidth
                value={userLevel}
                onChange={(e) => {
                  setUserLevel(e.target.value);
                }}
              >
                <MenuItem value={ROLES.User} selected>
                  USER
                </MenuItem>
                <MenuItem value={ROLES.Admin}>ADMIN </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} paddingRight={1}>
            {/* <Autocomplete
                multiple
                disableCloseOnSelect
                id="category"
                name="category"
                label="Categories"
                options={categories}
                getOptionLabel={(option) => option.category}
                defaultValue={category}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox checked={selected} />
                    {option.category}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="Categories" placeholder="" size="small" />
                )}
                
              /> */}
            <FormControl fullWidth>
              <InputLabel>Categories</InputLabel>

              <Select
                disabled={user?.user_role !== ROLES.Admin}
                fullWidth
                multiple
                label="Categories"
                id="category"
                name="category"
                size="small"
                value={category}
                input={<OutlinedInput label="Categories" />}
                renderValue={(selected) => {
                  return (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => {
                        const cat = categoryTemplates.find(
                          (c) => c.id === value
                        );
                        return (
                          <Chip
                            key={value}
                            label={cat?.template_name}
                            deleteIcon={
                              <CancelRoundedIcon
                                onMouseDown={(event) => event.stopPropagation()}
                              /> 
                            }
                            onDelete={() => {
                              
                              user?.user_role === ROLES.Admin ?
                              setCategory(
                                category.filter((c) => !(+c === +value))
                              )
                              :
                              ''

                            }}
                            size="small"
                          />
                        );
                      })}
                    </Box>
                  );
                }}
                MenuProps={MenuProps}
                onChange={(e) => {
                  handleCategoryChange(e);
                }}
              >
                {categoryTemplates.map((value, index) => (
                  <MenuItem key={value.id} value={value.id}>
                  <Checkbox checked={!(category.indexOf(value.id) ===  -1)} />
                  <ListItemText >{value.template_name}</ListItemText>
                    
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container paddingTop={2}>
          <Grid item xs={2} paddingRight={2}>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Register;
