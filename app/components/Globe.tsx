"use client";
import { useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import type { BalloonPath } from "../types";

const GlobeLib = dynamic(() => import("react-globe.gl"), { ssr: false });

type GlobeProps = {
  balloonPaths: BalloonPath[];
  selectedBalloonId?: number | null;
};

export default function Globe({ balloonPaths, selectedBalloonId }: GlobeProps) {
  const globeRef = useRef<any>(null);

  const paths = useMemo(() => {
    return balloonPaths
      .filter(b => b.coordinates.length >= 2)
      .map(b => ({
        id: b.id,
        color: b.color,
        coords: b.coordinates.map(c => [c.lat, c.lng, 0.01]),
      }));
  }, [balloonPaths]);

  useEffect(() => {
    const g = globeRef.current;
    if (!g || selectedBalloonId == null) return;

    const balloon = balloonPaths.find(b => b.id === selectedBalloonId);
    if (!balloon || balloon.coordinates.length === 0) return;

    const avgLat = balloon.coordinates.reduce((s, c) => s + c.lat, 0) / balloon.coordinates.length;
    const avgLng = balloon.coordinates.reduce((s, c) => s + c.lng, 0) / balloon.coordinates.length;

    g.pointOfView({ lat: avgLat, lng: avgLng, altitude: 2.5 }, 1000);
  }, [selectedBalloonId, balloonPaths]);

  return (
    <div style={{ width: "100%", height: "600px" }}>
      <GlobeLib
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundColor="rgba(0,0,0,0)"
        pathsData={paths}
        pathPoints="coords"
        pathPointLat={p => p[0]}
        pathPointLng={p => p[1]}
        pathPointAlt={p => p[2]}
        pathColor={(p: any) => p.color}
        pathStroke={2.5}
        pathDashLength={0.1}
        pathDashGap={0.008}
        pathDashAnimateTime={20000}
      />
    </div>
  );
}
