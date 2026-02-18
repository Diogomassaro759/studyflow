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
  return (
    <div style={container}>
      <h3 style={title}>Horas por Dia</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid stroke="#1e293b" />
          <XAxis dataKey="day" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip />

          <Line
            type="monotone"
            dataKey="hours"
            stroke="#38bdf8"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ================= */

const container = {
  background: "#020617",
  border: "1px solid #1e293b",
  borderRadius: "14px",
  padding: "20px",
};

const title = {
  marginBottom: "15px",
  fontSize: "16px",
};
