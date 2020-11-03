import React, { useEffect, useState, useCallback } from "react";
import TextField from "@material-ui/core/TextField";
import { DaysEvents } from "../../models/event";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import axios from "axios";
import { getDayString, getStartOfDayTime, OneHour, OneDay, OneWeek } from "../../helpFunctions";

const WeekSessions: React.FC = () => {
  const [weekSessionsData, setWeekSessionsData] = useState<DaysEvents[]>();
  const [offset, setOffset] = useState<number>(0);

  const fetchWeekSessionsDate = async () => {
    try {
      const { data } = await axios.get(`http://localhost:3001/events/by-days/${offset}`);
      console.log(data);

      setWeekSessionsData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchWeekSessionsDate();
  }, [offset]);

  function handleDateChange(date: string) {
      const newOffset: number = Math.round(
        (getStartOfDayTime(Date.now()) - getStartOfDayTime(new Date(date).getTime())) / OneDay
      );
      if (newOffset >= 0) {
        setOffset(newOffset);
      }
  }

  return (
    <div className="byDaySessions">
      <>
        {(weekSessionsData && weekSessionsData[1]) ? (
          <h2>{`Sessions each day between: ${weekSessionsData[0].date} - ${weekSessionsData[weekSessionsData.length - 1].date}`}</h2>
        ) : (
          <h2>There is not events on this dates</h2>
        )}
        <TextField
          id="date"
          label="End Day"
          defaultValue={new Date().toISOString().slice(0,10)}
          type="date"
          onChange={(e) => handleDateChange(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
          <LineChart width={500} height={300} data={weekSessionsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 6 }} />
          </LineChart>
      </>
    </div>
  );
};

export default WeekSessions;
