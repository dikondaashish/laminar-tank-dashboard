"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function Chart({ data }: any) {
  return (
    <BarChart width={600} height={300} data={data}>
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="water" />
    </BarChart>
  );
}