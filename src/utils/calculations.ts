import { TankCycle } from "@/types";

export function calculateKPIs(data: TankCycle[]) {
  let totalWater = 0;
  let totalEnergy = 0;
  let waterSaved = 0;
  let energySaved = 0;
  let totalDuration = 0;

  data.forEach((item) => {
    const water = item.metrics.Water ?? 0;
    const savedWater = item.savings.Water ?? 0;

    totalWater += water;
    totalEnergy += item.metrics.energy;
    waterSaved += savedWater;
    energySaved += item.savings.energy;

    const start = new Date(item.start_time).getTime();
    const end = new Date(item.end_time).getTime();
    totalDuration += (end - start) / 1000;
  });

  return {
    totalWater,
    totalEnergy,
    waterSaved,
    energySaved,
    avgDuration: data.length ? totalDuration / data.length : 0,
    efficiency:
      totalWater + waterSaved > 0
        ? (waterSaved / (totalWater + waterSaved)) * 100
        : 0,
  };
}