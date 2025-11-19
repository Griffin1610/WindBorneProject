import { NextResponse } from "next/server";

export async function GET() {
    try {
        const promises = [];
        for (let hour = 0; hour <= 23; hour++) {
        const paddedHour = String(hour).padStart(2, "0");
        promises.push(
            fetch(`https://a.windbornesystems.com/treasure/${paddedHour}.json`)
            .then((res) => (res.ok ? res.json() : []))
            .catch(() => [])
            );
        }
        const results = await Promise.all(promises);
        return NextResponse.json(results);
    } catch (err) {
        return NextResponse.json(
        { error: "WindBorne API error", details: err instanceof Error ? err.message : null },
        { status: 500 }
        );
    }
}
