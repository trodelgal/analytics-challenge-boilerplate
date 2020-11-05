import React, { useState, useCallback, useRef } from "react";
import TextField from "@material-ui/core/TextField";
import { eventName, browser, sorting, Event } from "../../models/event";
import { getDayString,} from "../../helpFunctions";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { EventLogContainer, FilterBar } from "./style";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import useFilterData from "./UseFilterData";

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
          {event.user_name}
        </TableCell>
        <TableCell> {event.name}</TableCell>
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
                      {getDayString(event.date)}
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
      minWidth: "70%",
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  })
);

const EventsLog: React.FC = () => {
  const [sorting, setSorting] = useState<sorting>("");
  const [type, setType] = useState<eventName>("");
  const [browser, setBrowser] = useState<browser>("");
  const [search, setSearch] = useState<string>("");
  const [offset, setOffset] = useState<number>(10);
  const { data, error, loading, hasMore } = useFilterData(sorting, type, browser, search, offset);
  const classes = useStyles();

  const observer:any = useRef();
  const lastOneRef = useCallback((node:any)=>{
    if(loading) return
    if(observer && observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries=>{
      if(entries[0].isIntersecting && hasMore){
        setOffset(prevOffset=> prevOffset + 10)
      }
    })
    if(node)observer.current.observe(node)
  },[loading,hasMore]);


  const handleSortChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSorting(event.target.value as sorting);
    setOffset(10);
  };
  const handleBrowserChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setBrowser(event.target.value as browser);
    setOffset(10);
  };
  const handleTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setType(event.target.value as eventName);
    setOffset(10);
  };
  const handleSearchChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSearch(event.target.value as string);
    setOffset(10);
  };

  return (
    <EventLogContainer>
      <FilterBar>
        <TextField
          id="standard-basic"
          label="Standard"
          autoComplete="on"
          onChange={handleSearchChange}
        />
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Sort</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={sorting}
            onChange={handleSortChange}
          >
            <MenuItem value={"+date"}>+Date</MenuItem>
            <MenuItem value={"-date"}>-Date</MenuItem>
            <MenuItem value={""}>clean</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={type}
            onChange={handleTypeChange}
          >
            <MenuItem value={"login"}>login</MenuItem>
            <MenuItem value={"signup"}>signup</MenuItem>
            <MenuItem value={"admin"}>admin</MenuItem>
            <MenuItem value={""}>clean</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Browser</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={browser}
            onChange={handleBrowserChange}
          >
            <MenuItem value={"chrome"}>chrome</MenuItem>
            <MenuItem value={"firefox"}>firefox</MenuItem>
            <MenuItem value={"safari"}>safari</MenuItem>
            <MenuItem value={"edge"}>edge</MenuItem>
            <MenuItem value={"ie"}>ie</MenuItem>
            <MenuItem value={"other"}>other</MenuItem>
            <MenuItem value={""}>clean</MenuItem>
          </Select>
        </FormControl>
        {
        data&&
          <div>event counter: {data.length}</div>
        }
      </FilterBar>
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
            {data &&
              data.map((event,i) =>{
                if(data.length === i+1){
                  
                  return(
                    <>
                    <Row key={event._id} event={event} />
                    <div ref={lastOneRef} />
                    </>
                    )
                }
                return <Row key={event._id} event={event} />
              }) 
            }
            {
              loading &&
                <h1>Loading</h1>
            }
            {
              error &&
                <h1>Error</h1>
            }
          </TableBody>
        </Table>
      </TableContainer>
    </EventLogContainer>
  );
};

export default EventsLog;
