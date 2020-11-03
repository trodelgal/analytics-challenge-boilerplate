import React from "react";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import WeekSessions from '../components/tiles/WeekSessions'
import DaySessions from '../components/tiles/DaySessions'

export interface Props {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
}

const DashBoard: React.FC = () => {
  return (
    <>
    {/* <WeekSessions/> */}
    <DaySessions/>
    </>
  );
};

export default DashBoard;
