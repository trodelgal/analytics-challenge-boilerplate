import React, { useEffect, useState, useCallback } from "react";
import TextField from "@material-ui/core/TextField";
import { HoursEvents } from "../../models/event";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer
} from "recharts";
import axios from "axios";
import { getDayString, getStartOfDayTime, OneHour, OneDay, OneWeek } from "../../helpFunctions";
import styled from "styled-components";
import { ChartTitle, ChartCard } from "./style";

const DaySessions: React.FC = () => {
  const [mainDaySessionsData, setMainDaySessionsData] = useState<HoursEvents[]>();
  // const [secondaryDeySessionsData, setSeconaryDeySessionsData] = useState<HoursEvents[]>();
  const [mainOffset, setMainOffset] = useState<number>(0);
  const [secondOffset, setSecondOffset] = useState<number>(-1);
  let mainDate: string = getDayString(Date.now() - mainOffset * OneDay);
  let secondaryDate: string = getDayString(Date.now() - secondOffset * OneDay);

  const fetchMainDaySessionsDate = async () => {
    try {
      const { data } = await axios.get(`http://localhost:3001/events/by-hours/${mainOffset}`);
      console.log(data);
      setMainDaySessionsData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchScondaryDaySessionsDate = async () => {
    try {
      const { data } = await axios.get(`http://localhost:3001/events/by-hours/${secondOffset}`);
      if (mainDaySessionsData) {
        const newMainDaySessionsData = mainDaySessionsData.map(
          (session: HoursEvents, i: number) => {
            return { hour: session.hour, count: session.count, secondCount: data[i].count };
          }
        );
        setMainDaySessionsData(newMainDaySessionsData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMainDaySessionsDate();
  }, [mainOffset]);

  useEffect(() => {
    if (secondOffset !== -1) {
      fetchScondaryDaySessionsDate();
    }
  }, [secondOffset]);

  function handleMainDateChange(date: string) {
    const newOffset: number = Math.round(
      (getStartOfDayTime(Date.now()) - getStartOfDayTime(new Date(date).getTime())) / OneDay
    );
    if (newOffset >= 0) {
      setMainOffset(newOffset);
    }
  }

  function handleSecondaryDateChange(date: string) {
    const newOffset: number = Math.round(
      (getStartOfDayTime(Date.now()) - getStartOfDayTime(new Date(date).getTime())) / OneDay
    );
    if (newOffset >= 0) {
      setSecondOffset(newOffset);
    }
  }
  console.log(mainDaySessionsData);

  return (
    <ChartCard>
        {mainDaySessionsData && mainDaySessionsData[1] ? (
          <ChartTitle>{`Day Sessions`}</ChartTitle>
        ) : (
          <ChartTitle>There is not events on this date</ChartTitle>
        )}
        <div>
          <TextField
            id="date"
            label="Main"
            defaultValue={new Date().toISOString().slice(0, 10)}
            type="date"
            onChange={(e) => handleMainDateChange(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            style={{margin:'3px', width:'40%'}}
          />
          <TextField
            id="date"
            label="Secondary"
            defaultValue={new Date().toISOString().slice(0, 10)}
            type="date"
            onChange={(e) => handleSecondaryDateChange(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            style={{margin:'3px', width:'40%'}}
          />
        </div>
        <ResponsiveContainer width={'100%'} height={200}>
        <LineChart data={mainDaySessionsData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#8884d8"
            name={mainDate}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="secondCount"
            stroke="#82ca9d"
            name={secondaryDate}
            activeDot={{ r: 6 }}
          />
        </LineChart>
        </ResponsiveContainer>
    </ChartCard>
  );
};

export default DaySessions;
