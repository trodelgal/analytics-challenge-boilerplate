import React,{useState,useCallback,useEffect} from "react";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import { Event } from "../models/event";
import WeekSessions from '../components/tiles/WeekSessions'
import RetentionCohort from '../components/tiles/RetentionCohort'
import DaySessions from '../components/tiles/DaySessions'
import Map from '../components/tiles/Map'
import UrlPie from '../components/tiles/UrlPie'
import OsBar from '../components/tiles/OsBar'
import EventsLog from '../components/tiles/EventsLog'
import axios from 'axios'

export interface Props {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
}

const DashBoard: React.FC = () => {
  const [allEvents, setAllEvents] = useState<Event[]>();

  const fetchAllEvents = useCallback(async () => {
    const { data } = await axios.get(`http://localhost:3001/events/all`);
    setAllEvents(data);
  }, []);

  useEffect(() => {
    fetchAllEvents();
  }, []);

  return (
    <>
    {/* <WeekSessions/> */}
    {/* <DaySessions/> */}
    {/* <RetentionCohort/> */}
    <EventsLog/>
    {/* <Map allEvents={allEvents}/> */}
    {/* <UrlPie allEvents={allEvents!}/> */}
    {/* <OsBar allEvents={allEvents!}/> */}
    </>
  );
};

export default DashBoard;
