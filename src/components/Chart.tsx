"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Chart({ data }: any) {
  return (
    <div className="w-full h-105">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 16, right: 24, left: 8, bottom: 8 }}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="water" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}