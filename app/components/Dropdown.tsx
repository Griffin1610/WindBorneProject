"use client";
export function Dropdown({ selected, balloonPaths, setSelected }: { selected: any, balloonPaths: any, setSelected: any }) {
    return (
        <div>
            <label className="mr-2 font-semibold">Filter by Balloon:</label>
            <select
            value={selected ?? "all"}
            onChange={e => setSelected(e.target.value === "all" ? null : Number(e.target.value))}
            className="border rounded px-3 py-1"
            >
            <option value="all">All Balloons ({balloonPaths.length})</option>
            {balloonPaths.map((b: any) => (
                <option key={b.id} value={b.id}>
                Balloon {b.id}
                </option>
            ))}
            </select>
      </div>
    )
}