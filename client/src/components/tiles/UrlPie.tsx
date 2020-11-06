import React, { useState, useCallback, useEffect } from "react";
import { PieChart, Pie, Legend, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { Event } from "../../models/event";
import { ChartTitle, PieChartCard } from "./style";

interface Props {
  allEvents: Event[];
}
interface PieData {
  name: string;
  value: number;
}

const UrlPie: React.FC<Props> = ({ allEvents }) => {
  const [chartData, setChartData] = useState<PieData[]>();
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  function getPieData(events: Event[]): PieData[] | undefined {
    let urls: string[] = [];
    if (events) {
      events.forEach((event) => {
        if (!urls.includes(event.url)) {
          urls.push(event.url);
        }
      });
      const pieDataFormat: PieData[] = urls.map((url) => {
        let counter: number = 0;
        for (let i = 0; i < events.length; i++) {
          if (url === events[i].url) {
            counter++;
          }
        }
        return { name: url.slice(7), value: counter };
      });
      return pieDataFormat;
    }
  }

  useEffect(() => {
    const pieData = getPieData(allEvents);
    setChartData(pieData);
  }, [allEvents]);

  return (
    <PieChartCard>
      <ChartTitle>Page Views</ChartTitle>
      <ResponsiveContainer width={'100%'} height={300}>
      <PieChart >
        <Pie dataKey="value" data={chartData} cx="50%" cy="50%" outerRadius={80} label>
          {chartData &&
            chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index]} />)}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
      </ResponsiveContainer>
    </PieChartCard>
  );
};

export default UrlPie;
