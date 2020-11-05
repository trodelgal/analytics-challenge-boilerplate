import React, { useState, useCallback, useEffect } from "react";
import { Interpreter } from "xstate";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Button } from "@material-ui/core";
import { Link as RouterLink, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import { Event } from "../models/event";
import { useService } from "@xstate/react";
import WeekSessions from "../components/tiles/WeekSessions";
import RetentionCohort from "../components/tiles/RetentionCohort";
import DaySessions from "../components/tiles/DaySessions";
import Map from "../components/tiles/Map";
import UrlPie from "../components/tiles/UrlPie";
import OsBar from "../components/tiles/OsBar";
import axios from "axios";
import { DashbordLayout, DashbordLine } from "../components/tiles/style";

export interface Props {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
}));

const DashBoard: React.FC<Props> = ({ authService }) => {
  const [allEvents, setAllEvents] = useState<Event[]>();
  const [authState, sendAuth] = useService(authService);
  const currentUser = authState?.context?.user;
  const classes = useStyles();

  const fetchAllEvents = useCallback(async () => {
    const { data } = await axios.get(`http://localhost:3001/events/all`);
    setAllEvents(data);
  }, []);

  useEffect(() => {
    fetchAllEvents();
  }, []);

  return (
    <Paper className={classes.paper}>
      {currentUser && currentUser.isAdmin && (
        <>
          <DashbordLine>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Events Statistics
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              component={RouterLink}
              to="/admin/events"
              data-test="bankaccount-new"
            >
              All Events
            </Button>
          </DashbordLine>
          <Paper>
            <DashbordLayout>
              <DashbordLine>
                <WeekSessions />
                <DaySessions />
              </DashbordLine>
              <Map allEvents={allEvents} />
              <DashbordLine>
                <UrlPie allEvents={allEvents!} />
                <OsBar allEvents={allEvents!} />
              </DashbordLine>
              <RetentionCohort />
            </DashbordLayout>
          </Paper>
        </>
      )}
    </Paper>
  );
};

export default DashBoard;
