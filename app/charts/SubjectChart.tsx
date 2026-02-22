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

type ChartData = {
  subject: string;
  hours: number;
};

type Props = {
  data: ChartData[];
};

export default function SubjectChart({ data }: Props) {
  /* ================= SANITIZA ================= */

  const safeData: ChartData[] = (data || []).map((item) => {
    const hours = Number(item.hours);

    return {
      subject: item.subject || "Outro",
      hours: isFinite(hours) && hours >= 0 ? hours : 0,
    };
  });

  const hasData = safeData.some((item) => item.hours > 0);

  /* ================= FORMAT ================= */

  const formatHours = (value: any) => {
    const num = Number(value);
    return isFinite(num) ? `${num.toFixed(1)} h` : "0.0 h";
  };

  return (
    <div style={container}>
      {/* HEADER */}
      <div style={header}>
        <h2 style={mainTitle}>Estudos por Matéria</h2>
        <span style={subtitle}>Distribuição total</span>
      </div>

      {/* CHART */}
      {hasData ? (
        <div style={chartWrapper}>
          <ResponsiveContainer width="95%" height={300}>
            <BarChart data={safeData}>
              <CartesianGrid
                stroke="#1e293b"
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="subject"
                stroke="#94a3b8"
                tick={{ fontSize: 12 }}
              />

              <YAxis
                stroke="#94a3b8"
                tickFormatter={(v) => `${v}h`}
              />

              <Tooltip
                formatter={formatHours}
                contentStyle={tooltipBox}
                labelStyle={tooltipLabel}
              />

              <Bar
                dataKey="hours"
                fill="#22c55e"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div style={emptyState}>
          Nenhum dado por matéria
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const container = {
  background: "#020617",
  border: "1px solid #1e293b",
  borderRadius: "14px",
  padding: "22px",
};

const header = {
  marginBottom: "16px",
};

const mainTitle = {
  fontSize: "18px",
  fontWeight: "600",
};

const subtitle = {
  fontSize: "12px",
  opacity: 0.6,
};

const chartWrapper = {
  width: "100%",
  display: "flex",
  justifyContent: "center",
};

const tooltipBox = {
  background: "#020617",
  border: "1px solid #1e293b",
  borderRadius: "8px",
  color: "#e5e7eb",
  padding: "8px 10px",
};

const tooltipLabel = {
  color: "#22c55e",
  fontWeight: "bold",
};

const emptyState = {
  height: "300px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#64748b",
};