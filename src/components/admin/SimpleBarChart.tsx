"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface BarDatum {
  name: string;
  total: number;
  fill: string;
}

/**
 * Small vertical bar chart used on the admin dashboard. Kept in its own module so the dashboard can load it
 * (and the whole recharts library) with next/dynamic after the stat cards have rendered.
 */
export default function SimpleBarChart({ data, countLabel }: { data: BarDatum[]; countLabel: string }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
        <CartesianGrid stroke="#e4e4e7" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
        <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
        <Tooltip cursor={{ fill: "#f4f4f5" }} contentStyle={{ border: "1px solid #e4e4e7", borderRadius: 2, fontSize: 12 }} />
        <Bar dataKey="total" name={countLabel} radius={[2, 2, 0, 0]} maxBarSize={72}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
