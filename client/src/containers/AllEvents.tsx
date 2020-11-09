import React from "react";
import { Interpreter } from "xstate";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import { useService } from "@xstate/react";
import EventsLog from "../components/tiles/EventsLog";

export interface Props {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    minHeight: "750px",
    flexDirection: "column",
  },
}));

const AllEvent: React.FC<Props> = ({ authService }) => {
  const [authState, sendAuth] = useService(authService);
  const currentUser = authState?.context?.user;
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      {currentUser && currentUser.isAdmin && (
        <EventsLog />
      )}
    </Paper>
  );
};

export default AllEvent;