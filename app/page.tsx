"use client";

import { useEffect, useState } from "react";
import { fetchTankData } from "@/utils/fetchData";
import { calculateKPIs } from "@/utils/calculations";
import Chart from "@/components/Chart";

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [tank, setTank] = useState("All");
  const [timeRange, setTimeRange] = useState("all");

  useEffect(() => {
    fetchTankData().then(setData);
  }, []);

  if (!data.length) return <p className="p-6">Loading...</p>;

  const now = new Date();

  const filteredByTank =
    tank === "All" ? data : data.filter((d) => d.tank_name === tank);

  const filteredData = filteredByTank.filter((d) => {
    if (timeRange === "4d") {
      return now.getTime() - new Date(d.start_time).getTime() <= 4 * 86400000;
    }
    if (timeRange === "7d") {
      return now.getTime() - new Date(d.start_time).getTime() <= 7 * 86400000;
    }
    return true;
  });

  const kpis = calculateKPIs(filteredData);

  const chartData = filteredData.map((d) => ({
    date: new Date(d.start_time).toLocaleDateString(),
    water: d.metrics.Water ?? 0,
  }));

  const tanks = [...new Set(data.map((d) => d.tank_name))];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tank Dashboard</h1>

      {/* Filters */}
      <div className="flex gap-4">
        <select onChange={(e) => setTank(e.target.value)} className="border p-2">
          <option>All</option>
          {tanks.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>

        <button onClick={() => setTimeRange("all")}>All</button>
        <button onClick={() => setTimeRange("4d")}>4 Days</button>
        <button onClick={() => setTimeRange("7d")}>7 Days</button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div>Total Water: {kpis.totalWater}</div>
        <div>Total Energy: {kpis.totalEnergy}</div>
        <div>Water Saved: {kpis.waterSaved}</div>
        <div>Energy Saved: {kpis.energySaved}</div>
        <div>Avg Duration: {kpis.avgDuration.toFixed(2)}</div>
        <div>Efficiency: {kpis.efficiency.toFixed(2)}%</div>
      </div>

      {/* Chart */}
      <div className="mt-6">
        <Chart data={chartData} />
      </div>
    </div>
  );
}