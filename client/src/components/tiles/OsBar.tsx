import React, { useState, useCallback, useEffect } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Event } from "../../models/event";
import { ChartTitle, PieChartCard } from "./style";

interface Props {
  allEvents: Event[];
}
interface ChartData {
  name: string;
  system: number;
}

const OsBar: React.FC<Props> = ({ allEvents }) => {
  const [chartData, setChartData] = useState<ChartData[]>();

  function getbarData(events: Event[]): ChartData[] | undefined {
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
    const barData = getbarData(allEvents);
    setChartData(barData);
  }, [allEvents]);

  return (
    <PieChartCard>
      <ChartTitle>operating system usage</ChartTitle>
      <ResponsiveContainer width={"100%"} height={250}>
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="system" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </PieChartCard>
  );
};

export default OsBar;
