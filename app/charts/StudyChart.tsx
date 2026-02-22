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
  /* ================= CLEAN DATA ================= */

  const safeData = data
    .map((item) => ({
      day: item.day || "",
      hours: Number.isFinite(item.hours) ? item.hours : 0,
    }))
    // Ordena por data
    .sort((a, b) => {
      const da = new Date(a.day.split("/").reverse().join("-"));
      const db = new Date(b.day.split("/").reverse().join("-"));
      return da.getTime() - db.getTime();
    });

  /* ================= MAX Y ================= */

  const maxValue =
    Math.max(...safeData.map((d) => d.hours), 1) + 0.5;

  return (
    <div style={container}>
      <div style={header}>
        <h3>Horas de Estudo por Dia</h3>
        <span style={subtitle}>Últimos 7 dias</span>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={safeData}>
          <CartesianGrid
            stroke="#1e293b"
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="day"
            stroke="#94a3b8"
            tick={{ fontSize: 12 }}
          />

          <YAxis
            stroke="#94a3b8"
            domain={[0, maxValue]}
            tickFormatter={(v) => `${v}h`}
            tick={{ fontSize: 12 }}
          />

          <Tooltip content={<CustomTooltip />} />

          <Line
            type="monotone"
            dataKey="hours"
            stroke="#38bdf8"
            strokeWidth={3}
            dot={{
              r: 5,
              stroke: "#38bdf8",
              strokeWidth: 2,
              fill: "#020617",
            }}
            activeDot={{
              r: 7,
              stroke: "#38bdf8",
              strokeWidth: 2,
              fill: "#020617",
            }}
            animationDuration={800}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ================= TOOLTIP ================= */

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  const value = payload[0]?.value;

  const hours = Number.isFinite(value)
    ? value.toFixed(2)
    : "0.00";

  return (
    <div style={tooltipBox}>
      <p style={tooltipLabel}>{label}</p>
      <p>{hours} horas</p>
    </div>
  );
}

/* ================= STYLES ================= */

const container = {
  background: "#020617",
  border: "1px solid #1e293b",
  borderRadius: "16px",
  padding: "20px",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
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
  padding: "8px 12px",
  color: "#e5e7eb",
};

const tooltipLabel = {
  color: "#38bdf8",
  fontWeight: "600",
  marginBottom: "4px",
};