import React, { useEffect, useState, useCallback } from "react";
import TextField from "@material-ui/core/TextField";
import { weeklyRetentionObject } from "../../models/event";
import axios from "axios";
import { getDayString, getStartOfDayTime, OneHour, OneDay, OneWeek } from "../../helpFunctions";
import { withStyles, Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Event, Filter } from "../../models/event";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

interface RowProps {
  event: Event;
  key: string;
}
interface eventFilter {
  events: Event[];
  more: boolean;
}

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

const Row: React.FC<RowProps> = ({ event }) => {
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {event.name}
        </TableCell>
        <TableCell>{event.distinct_user_id}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Event Details
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Browser</TableCell>
                    <TableCell>OS</TableCell>
                    <TableCell>URL</TableCell>
                    <TableCell>Session</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={event._id}>
                    <TableCell component="th" scope="row">
                      {event.date}
                    </TableCell>
                    <TableCell>{event.browser}</TableCell>
                    <TableCell>{event.os}</TableCell>
                    <TableCell>{event.url}</TableCell>
                    <TableCell>{event.session_id}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  })
);

const EventsLog: React.FC = () => {
  const [filteredEvent, setFilteredEvent] = useState<eventFilter>();
  const [sorting, setSorting] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [browser, setBrowser] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [offset, setOffset] = useState<number>(10);
  const classes = useStyles();

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSorting(event.target.value as string);
  };

  const fetchEvent = useCallback(async () => {
    const { data } = await axios.get(
      `http://localhost:3001/events/all-filtered?sorting=${sorting}&type=${type}&browser=${browser}&search=${search}&offset=${offset}`
    );
    console.log(data);
    setFilteredEvent(data);
  }, []);

  useEffect(() => {
    fetchEvent();
  }, [sorting, type, browser, search, offset]);

  return (
    <div>
      <div>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Sort</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={sorting}
            onChange={handleChange}
          >
            <MenuItem value={'+date'}>+Date</MenuItem>
            <MenuItem value={'-date'}>-Date</MenuItem>
          </Select>
        </FormControl>
        {/* <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={age}
            onChange={handleChange}
          >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Browser</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={age}
            onChange={handleChange}
          >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl> */}
      </div>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>User</TableCell>
              <TableCell>Event Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEvent && filteredEvent.events ? (
              filteredEvent.events.map((event) => <Row key={event._id} event={event} />)
            ) : (
              <h1>Loadung</h1>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default EventsLog;
