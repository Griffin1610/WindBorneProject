"use client";
import { useEffect, useState } from "react";
import type { BalloonPath } from "../app/types";
import Globe from "../app/components/Globe";
import { Dropdown } from "./components/Dropdown";

function generateColor(index: number, total: number) {
  return `hsl(${(index * 360) / total}, 80%, 60%)`;
}

export default function Page() {
  const [balloonPaths, setBalloonPaths] = useState<BalloonPath[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<"loading" | "error" | "ready">("loading");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/balloons");
        if (!res.ok) throw new Error();

        const data = await res.json();
        const map = new Map<number, BalloonPath["coordinates"]>();

        data.forEach((hourData: number[][], hour: number) => {
          hourData.forEach((pos, balloonId) => {
            if (!map.has(balloonId)) map.set(balloonId, []);
            map.get(balloonId)!.push({
              lat: pos[0],
              lng: pos[1],
              alt: pos[2],
              hour,
            });
          });
        });

        const total = map.size;
        const paths = Array.from(map.entries())
          .map(([id, coords]) => ({
            id,
            color: generateColor(id, total),
            coordinates: coords.sort((a, b) => a.hour - b.hour),
          }))
          .filter(p => p.coordinates.length >= 2);

        setBalloonPaths(paths);
        setStatus("ready");
      } catch {
        setStatus("error");
      }
    })();
  }, []);

  if (status === "loading") return <p>Loading balloon data...</p>;
  if (status === "error") return <p>Error loading balloon data.</p>;

  const visible = selected == null
    ? balloonPaths
    : balloonPaths.filter(p => p.id === selected);

  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-10">WindBorne Balloon Data</h1>
      <Dropdown  selected={selected} balloonPaths={balloonPaths} setSelected={setSelected}/>
      <div>
        <Globe balloonPaths={visible} selectedBalloonId={selected} />
      </div>
    </div>
  );
}
