"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "@/app/lib/firebase";
import { getSessions, getGoal } from "@/app/lib/firestore";

import StudyChart from "@/app/charts/StudyChart";
import SubjectChart from "@/app/charts/SubjectChart";

/* ================= TYPES ================= */

type Session = {
  subject: string;
  minutes: number;
  createdAt: any;
};

type Goal = {
  daily: number;
  weekly: number;
  monthly: number;
};

/* ================= PAGE ================= */

export default function DashboardPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [goal, setGoal] = useState<Goal | null>(null);

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
    setSessions(Array.isArray(s) ? s : []);

    const g = await getGoal(uid);
    if (g) setGoal(g);
  }

  /* ================= DATE ================= */

  function getDate(createdAt: any): Date | null {
    if (!createdAt) return null;

    if (createdAt?.seconds) {
      return new Date(createdAt.seconds * 1000);
    }

    if (createdAt?.toDate) {
      return createdAt.toDate();
    }

    return createdAt instanceof Date ? createdAt : null;
  }

  /* ================= CALC ================= */

  const today = new Date();

  const sumMinutes = (filterFn: (d: Date) => boolean) => {
    return sessions.reduce((acc, s) => {
      const d = getDate(s.createdAt);

      if (!d || !filterFn(d)) return acc;

      return acc + (Number(s.minutes) || 0);
    }, 0);
  };

  const todayMinutes = sumMinutes(
    (d) => d.toDateString() === today.toDateString()
  );

  const weekMinutes = sumMinutes((d) => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return d >= weekAgo;
  });

  const monthMinutes = sumMinutes((d) => {
    return (
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  });

  /* ================= PROGRESS ================= */

  function calcProgress(done: number, goal?: number) {
    if (!goal || goal <= 0) return 0;

    const percent = (done / goal) * 100;

    return isFinite(percent)
      ? Math.min(Math.round(percent), 100)
      : 0;
  }

  /* ================= FORMAT ================= */

  function formatMinutes(min: number) {
    if (!isFinite(min) || min <= 0) return "0h 0m";

    const total = Math.floor(min);

    const h = Math.floor(total / 60);
    const m = total % 60;

    return `${h}h ${m}m`;
  }

  /* ================= CHART DATA ================= */

  /* 👉 Linha: por dia */
  const studyLineData = useMemo(() => {
    const map: Record<string, number> = {};

    sessions.forEach((s) => {
      const d = getDate(s.createdAt);
      if (!d) return;

      const key = d.toLocaleDateString("pt-BR");

      map[key] = (map[key] || 0) + s.minutes / 60;
    });

    return Object.entries(map)
      .sort(
        (a, b) =>
          new Date(a[0].split("/").reverse().join("-")).getTime() -
          new Date(b[0].split("/").reverse().join("-")).getTime()
      )
      .map(([day, hours]) => ({
        day,
        hours: Number(hours.toFixed(1)),
      }));
  }, [sessions]);

  /* 👉 Barras: por matéria */
  const subjectBarData = useMemo(() => {
    const map: Record<string, number> = {};

    sessions.forEach((s) => {
      if (!s.subject) return;

      const subject = s.subject.trim();

      if (!subject) return;

      map[subject] =
        (map[subject] || 0) + s.minutes / 60;
    });

    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([subject, hours]) => ({
        subject,
        hours: Number(hours.toFixed(1)),
      }));
  }, [sessions]);

  /* ================= RENDER ================= */

  return (
    <div style={page}>
      <h1 style={title}>Dashboard</h1>

      {/* PROGRESSO */}
      <section style={card}>
        <h2 style={sectionTitle}>Progresso das Metas</h2>

        {goal ? (
          <div style={progressGrid}>
            <ProgressItem
              title="Diária"
              value={formatMinutes(todayMinutes)}
              percent={calcProgress(todayMinutes, goal.daily)}
            />

            <ProgressItem
              title="Semanal"
              value={formatMinutes(weekMinutes)}
              percent={calcProgress(weekMinutes, goal.weekly)}
            />

            <ProgressItem
              title="Mensal"
              value={formatMinutes(monthMinutes)}
              percent={calcProgress(monthMinutes, goal.monthly)}
            />
          </div>
        ) : (
          <p style={{ opacity: 0.6 }}>
            Defina suas metas
          </p>
        )}
      </section>

      {/* RESUMO */}
      <section style={statsGrid}>
        <Stat title="Hoje" value={formatMinutes(todayMinutes)} />
        <Stat title="Semana" value={formatMinutes(weekMinutes)} />
        <Stat title="Mês" value={formatMinutes(monthMinutes)} />
        <Stat title="Sessões" value={String(sessions.length)} />
      </section>

      {/* GRÁFICOS */}
      <section style={chartsGrid}>
        <StudyChart data={studyLineData} />
        <SubjectChart data={subjectBarData} />
      </section>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function ProgressItem({ title, value, percent }: any) {
  return (
    <div style={progressItem}>
      <h4>{title}</h4>
      <p>{value}</p>

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
  border: "1px solid #1e293b",
  borderRadius: "16px",
  padding: "22px",
  textAlign: "center" as const,
};

const chartsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "24px",
};

const progressBarBg = {
  height: "10px",
  border: "1px solid #1e293b",
  borderRadius: "999px",
  overflow: "hidden",
};

const progressBarFill = {
  height: "100%",
  background: "linear-gradient(90deg,#22c55e,#16a34a)",
  transition: "0.4s",
};