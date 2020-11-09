import React, { useState, useCallback, useEffect, lazy, Suspense } from "react";
import { Interpreter } from "xstate";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Button } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import { Event } from "../models/event";
import { useService } from "@xstate/react";
import axios from "axios";
import { DashbordLayout, DashbordLine } from "../components/tiles/style";
const WeekSessions = lazy(() => import("../components/tiles/WeekSessions"));
const DaySessions = lazy(() => import("../components/tiles/DaySessions"));
const RetentionCohort = lazy(() => import("../components/tiles/RetentionCohort"));
const Map = lazy(() => import("../components/tiles/Map"));
const UrlPie = lazy(() => import("../components/tiles/UrlPie"));
const OsBar = lazy(() => import("../components/tiles/OsBar"));

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
                <Suspense fallback={<h1>Loading...</h1>}>
                  <WeekSessions />
                </Suspense>
                <Suspense fallback={<h1>Loading...</h1>}>
                  <DaySessions />
                </Suspense>
              </DashbordLine>
              <Suspense fallback={<h1>Loading...</h1>}>
                <Map allEvents={allEvents} />
              </Suspense>
              <DashbordLine>
                <Suspense fallback={<h1>Loading...</h1>}>
                  <UrlPie allEvents={allEvents!} />
                </Suspense>
                <Suspense fallback={<h1>Loading...</h1>}>
                  <OsBar allEvents={allEvents!} />
                </Suspense>
              </DashbordLine>
              <Suspense fallback={<h1>Loading...</h1>}>
                <RetentionCohort />
              </Suspense>
            </DashbordLayout>
          </Paper>
        </>
      )}
    </Paper>
  );
};

export default DashBoard;
