"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Props = {
  data: {
    subject: string;
    hours: number;
  }[];
};

export default function SubjectChart({ data }: Props) {
  return (
    <div style={container}>
      <h3 style={title}>Horas por Matéria</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid stroke="#1e293b" />

          <XAxis dataKey="subject" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />

          <Tooltip />

          <Bar dataKey="hours" fill="#22c55e" />
        </BarChart>
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
