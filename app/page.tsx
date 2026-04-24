"use client";

import { useEffect, useState } from "react";
import { fetchTankData } from "@/utils/fetchData";
import { calculateKPIs } from "@/utils/calculations";
import Chart from "@/components/Chart";

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [tank, setTank] = useState("All");
  const [timeRange, setTimeRange] = useState("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  useEffect(() => {
    fetchTankData().then(setData);
  }, []);

  if (!data.length) return <p className="p-6">Loading...</p>;

  const now = new Date();
  const isCustomRangeInvalid =
    timeRange === "custom" &&
    customStartDate !== "" &&
    customEndDate !== "" &&
    new Date(customStartDate).getTime() > new Date(customEndDate).getTime();

  const filteredByTank =
    tank === "All" ? data : data.filter((d) => d.tank_name === tank);

  const filteredData = filteredByTank.filter((d) => {
    const dataPointTime = new Date(d.start_time).getTime();

    if (Number.isNaN(dataPointTime)) return false;

    if (timeRange === "4d") {
      return now.getTime() - dataPointTime <= 4 * 86400000;
    }
    if (timeRange === "7d") {
      return now.getTime() - dataPointTime <= 7 * 86400000;
    }
    if (timeRange === "custom") {
      if (isCustomRangeInvalid) return false;

      if (customStartDate !== "") {
        const customStart = new Date(customStartDate);
        customStart.setHours(0, 0, 0, 0);
        if (dataPointTime < customStart.getTime()) return false;
      }

      if (customEndDate !== "") {
        const customEnd = new Date(customEndDate);
        customEnd.setHours(23, 59, 59, 999);
        if (dataPointTime > customEnd.getTime()) return false;
      }

      return true;
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

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border p-2"
        >
          <option value="all">All</option>
          <option value="4d">4 Days</option>
          <option value="7d">7 Days</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {timeRange === "custom" && (
        <div className="mt-3 flex flex-wrap gap-3 items-center">
          <label className="flex items-center gap-2">
            <span>From</span>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="border p-2"
            />
          </label>

          <label className="flex items-center gap-2">
            <span>To</span>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="border p-2"
            />
          </label>

          {isCustomRangeInvalid && (
            <p className="text-sm text-red-600">End date must be on or after start date.</p>
          )}
        </div>
      )}

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