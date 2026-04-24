"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

export default function Chart({ data }: any) {
  return (
    <LineChart width={600} height={300} data={data}>
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="water" />
    </LineChart>
  );
}