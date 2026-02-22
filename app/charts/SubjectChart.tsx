"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Props = {
  data: {
    day: string;
    hours: number;
  }[];
};

export default function StudyChart({ data }: Props) {
  // LIMPA NaN
  const safeData = data.map((item) => ({
    day: item.day,
    hours: isFinite(item.hours) ? item.hours : 0,
  }));

  return (
    <div style={container}>
      <div style={header}>
        <h3>Horas de Estudo por Dia</h3>
        <span style={subtitle}>Últimos 7 dias</span>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={safeData}>
          <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />

          <XAxis dataKey="day" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />

          <Tooltip
            formatter={(value: any) => {
              if (!isFinite(Number(value))) return "0 h";
              return `${Number(value).toFixed(1)} h`;
            }}
            contentStyle={tooltipBox}
            labelStyle={tooltipLabel}
          />

          <Line
            type="monotone"
            dataKey="hours"
            stroke="#38bdf8"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ================= STYLES ================= */

const container = {
  background: "#020617",
  border: "1px solid #1e293b",
  borderRadius: "14px",
  padding: "20px",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "12px",
};

const subtitle = {
  fontSize: "13px",
  opacity: 0.6,
};

const tooltipBox = {
  background: "#020617",
  border: "1px solid #1e293b",
  borderRadius: "8px",
  color: "#e5e7eb",
};

const tooltipLabel = {
  color: "#38bdf8",
  fontWeight: "bold",
};