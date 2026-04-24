import { TankCycle } from "@/types";

export async function fetchTankData(): Promise<TankCycle[]> {
  const res = await fetch(
    "https://gist.githubusercontent.com/anuragmitra4/438023264eeb039fe2e7280176c7a0a3/raw"
  );

  if (!res.ok) throw new Error("Failed to fetch data");

  const rawData: any[] = await res.json();

  return rawData.map((item) => ({
    id: item.id,
    tank_name: item.tank_name,
    start_time: item.start_time,
    end_time: item.end_time,
    metrics: {
      energy: item.metrics?.energy ?? 0,
      Water: item.metrics?.Water ?? item.metrics?.water ?? 0,
      time: item.metrics?.time ?? 0,
    },
    savings: {
      energy: item.savings?.energy ?? 0,
      Water: item.savings?.Water ?? item.savings?.water ?? 0,
      time: item.savings?.time ?? 0,
    },
  }));
}