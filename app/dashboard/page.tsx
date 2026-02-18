"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "@/app/lib/firebase";
import { getSessions, getGoal } from "@/app/lib/firestore";
import { subjectColors } from "@/app/lib/firestore";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ================= TYPES ================= */

type Session = {
  subject: string;
  minutes: number;
  createdAt: any;
};

type Goal = {
  daily: number;   // minutos
  weekly: number;
  monthly: number;
};

/* ================= PAGE ================= */

export default function DashboardPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [goal, setGoal] = useState<Goal | null>(null);

  const [chartData, setChartData] = useState<any[]>([]);

  /* ================= AUTH ================= */

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      await loadData(user.uid);
    });

    return () => unsub();
  }, []);

  /* ================= LOAD ================= */

  async function loadData(uid: string) {
    const s = await getSessions(uid);
    setSessions(s);

    setChartData(buildChartData(s));

    const g = await getGoal(uid);
    if (g) setGoal(g);
  }

  /* ================= DATE ================= */

  function getDate(createdAt: any): Date | null {
    if (!createdAt) return null;

    if (createdAt.seconds) {
      return new Date(createdAt.seconds * 1000);
    }

    if (createdAt.toDate) {
      return createdAt.toDate();
    }

    return createdAt instanceof Date ? createdAt : null;
  }

  /* ================= CALC ================= */

  function sumMinutes(filterFn: (d: Date) => boolean) {
    return sessions
      .filter((s) => {
        const d = getDate(s.createdAt);
        return d && filterFn(d);
      })
      .reduce((acc, cur) => acc + cur.minutes, 0);
  }

  function getTodayMinutes() {
    const today = new Date().toDateString();

    return sumMinutes((d) => d.toDateString() === today);
  }

  function getWeekMinutes() {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    return sumMinutes((d) => d >= weekAgo);
  }

  function getMonthMinutes() {
    const now = new Date();

    return sumMinutes(
      (d) =>
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
    );
  }

  /* ================= GRAPH ================= */

  function buildChartData(list: Session[]) {
    const map: Record<string, number> = {};

    list.forEach((s) => {
      map[s.subject] = (map[s.subject] || 0) + s.minutes;
    });

    return Object.keys(map).map((k) => ({
      name: k,
      value: map[k],
      color: subjectColors[k] || "#94a3b8",
    }));
  }

  /* ================= PROGRESS ================= */

  const todayMinutes = getTodayMinutes();
  const weekMinutes = getWeekMinutes();
  const monthMinutes = getMonthMinutes();

  function calcProgress(done: number, goal?: number) {
  if (!goal || isNaN(goal) || goal <= 0) return 0;
  if (!done || isNaN(done)) return 0;

  return Math.min(
    Math.round((done / goal) * 100),
    100
  );
}
const dailyProgress = calcProgress(
  todayMinutes,
  goal?.daily
);

const weeklyProgress = calcProgress(
  weekMinutes,
  goal?.weekly
);

const monthlyProgress = calcProgress(
  monthMinutes,
  goal?.monthly
);

  /* ================= FORMAT ================= */

  function formatMinutes(min: number) {
    if (!min) return "0h 0m";

    const h = Math.floor(min / 60);
    const m = min % 60;

    return `${h}h ${m}m`;
  }

  /* ================= RENDER ================= */

  return (
    <div style={page}>
      <h1 style={title}>Dashboard</h1>

      {/* PROGRESSO DAS METAS */}

      <section style={card}>
        <h2 style={sectionTitle}>Progresso das Metas</h2>

        {goal ? (
          <div style={progressGrid}>
            <ProgressItem
              title="Diária"
              percent={dailyProgress}
              value={formatMinutes(todayMinutes)}
            />

            <ProgressItem
              title="Semanal"
              percent={weeklyProgress}
              value={formatMinutes(weekMinutes)}
            />

            <ProgressItem
              title="Mensal"
              percent={monthlyProgress}
              value={formatMinutes(monthMinutes)}
            />
          </div>
        ) : (
          <p style={{ opacity: 0.7 }}>
            Defina suas metas na aba Metas
          </p>
        )}
      </section>

      {/* RESUMO */}

      <section style={statsGrid}>
        <Stat title="Hoje" value={formatMinutes(todayMinutes)} />
        <Stat title="Semana" value={formatMinutes(weekMinutes)} />
        <Stat title="Mês" value={formatMinutes(monthMinutes)} />
        <Stat title="Sessões" value={sessions.length.toString()} />
      </section>

      {/* GRÁFICO */}

      <section style={card}>
        <h2 style={sectionTitle}>Horas por Matéria</h2>

        <div style={{ height: 320 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label={({ name, value }) =>
                  `${name}: ${Math.round(value / 60)}h`
                }
              >
                {chartData.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function ProgressItem({ title, percent, value }: any) {
  return (
    <div style={progressItem}>
      <h4>{title}</h4>

      <p style={{ marginBottom: 6 }}>{value}</p>

      <div style={progressBarBg}>
        <div
          style={{
            ...progressBarFill,
            width: `${percent}%`,
          }}
        />
      </div>

      <span>{percent}%</span>
    </div>
  );
}

function Stat({ title, value }: any) {
  return (
    <div style={statCard}>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  minHeight: "100vh",
  padding: "32px",
  background: "linear-gradient(180deg,#020617,#000)",
  color: "#e5e7eb",
};

const title = {
  fontSize: "34px",
  fontWeight: "bold",
  marginBottom: "28px",
};

const card = {
  background: "#020617",
  border: "1px solid #1e293b",
  borderRadius: "16px",
  padding: "24px",
  marginBottom: "28px",
};

const sectionTitle = {
  fontSize: "20px",
  marginBottom: "18px",
};

const progressGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "20px",
};

const progressItem = {
  background: "#020617",
  border: "1px solid #1e293b",
  borderRadius: "14px",
  padding: "18px",
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "20px",
  marginBottom: "30px",
};

const statCard = {
  background: "#020617",
  border: "1px solid #1e293b",
  borderRadius: "16px",
  padding: "22px",
  textAlign: "center" as const,
};

const progressBarBg = {
  width: "100%",
  height: "10px",
  background: "#020617",
  border: "1px solid #1e293b",
  borderRadius: "999px",
  overflow: "hidden",
  marginBottom: "6px",
};

const progressBarFill = {
  height: "100%",
  background: "linear-gradient(90deg,#22c55e,#16a34a)",
  transition: "0.4s",
};
