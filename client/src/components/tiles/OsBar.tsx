import React, { useState, useCallback, useEffect } from "react";
import {
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  } from 'recharts';
import { Event } from "../../models/event";

interface Props {
  allEvents: Event[];
}
interface ChartData {
  name: string;
  system: number;
}

const OsBar: React.FC<Props> = ({ allEvents }) => {
  const [chartData, setChartData] = useState<ChartData[]>();

  function getPieData(events: Event[]): ChartData[] | undefined {
    let ops: string[] = [];
    if (events) {
      events.forEach((event) => {
        if (!ops.includes(event.os)) {
          ops.push(event.os);
        }
      });
      const pieDataFormat: ChartData[] = ops.map((os) => {
        let counter: number = 0;
        for (let i = 0; i < events.length; i++) {
          if (os === events[i].os) {
            counter++;
          }
        }
        return { name: os, system: counter };
      });
      return pieDataFormat;
    }
  }

  useEffect(() => {
    const x = getPieData(allEvents);
    setChartData(x);
  }, [allEvents]);

  return (
    <div>
      <h2>Distribution of the events by Operating System</h2>
      <BarChart
        width={500}
        height={300}
        data={chartData}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="system" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default OsBar;