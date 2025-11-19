"use client";
import { useEffect, useState } from "react";
import type { BalloonData } from "../app/types";

export default function Page() {
  const [balloons, setBalloons] = useState<BalloonData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBalloons() {
      try {
        const res = await fetch("/api/balloons");
        if (!res.ok) throw new Error("Failed to fetch balloon data");
        const data = await res.json();
        setBalloons(data);
      } catch (err: any) {
        setError(err.message || "error");
      } finally {
        setLoading(false);
      }
    }

    fetchBalloons();
  }, []);

  if (loading) return <p>Loading balloon data...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="bg-white text-black p-4">
      <h1>WindBorne Balloon Data (Past 24 Hours)</h1>
      <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
        {JSON.stringify(balloons, null, 2)}
      </pre>
    </div>
  );
}
