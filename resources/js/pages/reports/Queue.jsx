import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { DataGrid, useGridApiRef, GridToolbar } from "@mui/x-data-grid";
import { httpPrivate } from "../../services/Api";
import { DateTimePicker } from "@mui/x-date-pickers";
import SearchIcon from "@mui/icons-material/Search";
import m from "moment";
import useAuth from "../../hooks/useAuth";
import useMomentLocale from "../../hooks/useMomentLocale";
const QueueReport = () => {
  const [rows, setRows] = useState([]);
  const [dateCriteria, setDateCriteria] = useState("created_at");
  const { toPHTime, getDurationStr } = useMomentLocale();
  const { auth } = useAuth();
  const apiRef = useGridApiRef();

  const columns = [
    {
      field: "fullname",
      headerName: "Caller Name",
      width: 200,
      valueGetter: (params) =>
        `${params.row.firstname || ""} ${params.row.lastname} `,
    },
    {
      field: "csr_fullname",
      headerName: "CSR Name",
      width: 200,
      valueGetter: (params) =>
        `${params.row.csr_firstname || ""} ${params.row.csr_lastname || ""
        } `,
    },
    { field: "category", headerName: "Category", width: 200 },
    { field: "sub_category", headerName: "Sub Category", width: 200 },
    { field: "queue_status", headerName: "Status", width: 200 },
    {
      field: "date_onqueue",
      headerName: "Date Queued",
      width: 200,
      valueGetter: (params) =>
        m(toPHTime(params.row.date_onqueue)).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
    },
    { field: "date_ongoing", headerName: "Date Ongoing", width: 200 },
    { field: "date_end", headerName: "Date Ended", width: 200 },
    {
      field: "duration",
      headerName: "Duration",
      width: 160,
      valueGetter: (params) => getDurationStr(m(params.row.date_ongoing), m(params.row.date_end)),
    },
    { field: "transaction", headerName: "Transaction", width: 150 },
    { field: "date_created", headerName: "Date Created", width: 200 },
  ];

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());

    console.log(payload);

    await httpPrivate
      .post("reports/queue", payload, {
        headers: { Authorization: `Bearer ${auth?.token?.token}` },
      })
      .then((response) => {
        // console.log(response.data);
        setRows(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Box>
      <Grid
        container
        paddingTop={2}
        component={"form"}
        onSubmit={submitHandler}
      >
        <Grid container>
          <Grid item xs={3} paddingRight={1}>
            <TextField
              variant="outlined"
              label="Search"
              size="small"
              name="search_str"
              fullWidth
            />
          </Grid>

          <Grid item xs={2} paddingRight={1}>
            <FormControl fullWidth>
              <InputLabel>Date Criteria</InputLabel>
              <Select
                name="date_criteria"
                value={dateCriteria}
                onChange={(e) => {
                  setDateCriteria(e.target.value);
                }}
                size="small"
                fullWidth
                label="Date Criteria"
              >
                <MenuItem value="created_at">
                  {" "}
                  DATE CREATED
                </MenuItem>
                <MenuItem value="date_onqueue">
                  {" "}
                  DATE QUEUE
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={2} paddingRight={1}>
            <DateTimePicker
              slotProps={{
                textField: {
                  size: "small",
                  label: "From Date",
                  name: "from_date",
                },
              }}
              defaultValue={m()}
              format="YYYY-MM-DD HH:mm:ss"
            />
          </Grid>
          <Grid item xs={2} paddingRight={1}>
            <DateTimePicker
              slotProps={{
                textField: {
                  size: "small",
                  label: "To Date",
                  name: "to_date",
                },
              }}
              defaultValue={m()}
              format="YYYY-MM-DD HH:mm:ss"
            />
          </Grid>
          <Grid item xs={1} paddingRight={1}>
            <Stack direction={"row"} spacing={1}>
              <Button type="submit" variant="contained">
                <SearchIcon fontSize="small" />
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Grid>
      <Grid container paddingTop={2}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
          }}
          pageSizeOptions={[10, 25, 50]}
          apiRef={apiRef}
          density="compact"
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: { csvOptions: { fileName: "Queue" } },
          }}
          style={{ height: "80vh" }}
        />
      </Grid>
    </Box>
  );
};

export default QueueReport;
