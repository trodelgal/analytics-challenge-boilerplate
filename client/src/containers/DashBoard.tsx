import React from "react";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import WeekSessions from '../components/tiles/WeekSessions'
import RetentionCohort from '../components/tiles/RetentionCohort'
import DaySessions from '../components/tiles/DaySessions'

export interface Props {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
}

const DashBoard: React.FC = () => {
  return (
    <>
    {/* <WeekSessions/> */}
    <DaySessions/>
    <RetentionCohort/>
    </>
  );
};

export default DashBoard;
