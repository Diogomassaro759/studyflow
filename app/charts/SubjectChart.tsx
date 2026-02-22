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
  // 👉 LIMPA DADOS COM NaN
  const safeData = data.map((item) => ({
    subject: item.subject,
    hours: isFinite(item.hours) ? item.hours : 0,
  }));

  return (
    <div style={container}>
      <h3 style={title}>Horas por Matéria</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={safeData}>
          <CartesianGrid stroke="#1e293b" />

          <XAxis dataKey="subject" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />

          <Tooltip
            formatter={(value: any) => {
              if (!isFinite(Number(value))) return "0 h";
              return `${Number(value).toFixed(1)} h`;
            }}
            labelStyle={tooltipLabel}
            contentStyle={tooltipBox}
            cursor={{ fill: "rgba(56,189,248,0.1)" }}
          />

          <Bar dataKey="hours" fill="#22c55e" radius={[6, 6, 0, 0]} />
        </BarChart>
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

const title = {
  marginBottom: "15px",
  fontSize: "16px",
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