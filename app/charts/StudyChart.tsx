"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
} from "recharts";

type Props = {
  data: {
    day: string;
    hours: number;
  }[];
};

export default function StudyChart({ data }: Props) {
  return (
    <div style={container}>
      <div style={header}>
        <h3 style={title}>Horas de Estudo por Dia</h3>
        <span style={subtitle}>Últimos 7 dias</span>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <defs>
            <linearGradient id="studyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="#020617" />

          <XAxis
            dataKey="day"
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
            cursor={{ stroke: "#38bdf8", strokeDasharray: "4 4" }}
          />

          {/* Area sombra */}
          <Area
            type="monotone"
            dataKey="hours"
            fill="url(#studyGradient)"
            stroke="none"
          />

          {/* Linha principal */}
          <Line
            type="monotone"
            dataKey="hours"
            stroke="#38bdf8"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
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
  boxShadow: "0 0 20px rgba(56,189,248,0.08)",
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
  color: "#38bdf8",
  fontWeight: "bold",
};