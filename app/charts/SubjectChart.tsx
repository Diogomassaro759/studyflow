"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

type Props = {
  data: {
    subject: string;
    hours: number;
  }[];
};

const COLORS = [
  "#38bdf8",
  "#22c55e",
  "#facc15",
  "#f97316",
  "#a855f7",
  "#ec4899",
];

export default function SubjectChart({ data }: Props) {
  return (
    <div style={container}>
      <div style={header}>
        <h3 style={title}>Horas por Matéria</h3>
        <span style={subtitle}>Distribuição</span>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.4} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="#020617" />

          <XAxis
            dataKey="subject"
            stroke="#64748b"
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            stroke="#64748b"
            tickLine={false}
            axisLine={false}
          />

          <Tooltip
            contentStyle={tooltipBox}
            labelStyle={tooltipLabel}
            cursor={{ fill: "rgba(56,189,248,0.1)" }}
          />

          <Bar
            dataKey="hours"
            radius={[6, 6, 0, 0]}
            fill="url(#barGradient)"
          >
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={COLORS[i % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ================= STYLES ================= */

const container = {
  background: "linear-gradient(180deg,#020617,#020617cc)",
  border: "1px solid #1e293b",
  borderRadius: "18px",
  padding: "22px",
  boxShadow: "0 0 20px rgba(34,197,94,0.08)",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
};

const title = {
  fontSize: "17px",
  fontWeight: "bold",
};

const subtitle = {
  fontSize: "12px",
  color: "#64748b",
};

const tooltipBox = {
  background: "#020617",
  border: "1px solid #1e293b",
  borderRadius: "8px",
  padding: "8px 12px",
};

const tooltipLabel = {
  color: "#22c55e",
  fontWeight: "bold",
};