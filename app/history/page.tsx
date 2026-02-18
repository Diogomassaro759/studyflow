"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "@/app/lib/firebase";
import {
  getSessions,
  Session,
  subjectColors,
} from "@/app/lib/firestore";

/* ================= PAGE ================= */

export default function HistoryPage() {
  const [uid, setUid] = useState("");
  const [sessions, setSessions] = useState<Session[]>([]);

  /* ================= AUTH ================= */

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      setUid(user.uid);

      loadSessions(user.uid);
    });

    return () => unsub();
  }, []);

  /* ================= LOAD ================= */

  async function loadSessions(uid: string) {
    const data = await getSessions(uid);

    setSessions(data);
  }

  /* ================= HELPERS ================= */

  function formatDate(date: any) {
    const d = date.toDate();

    return d.toLocaleDateString("pt-BR");
  }

  function formatTime(sec: number) {
    const min = Math.floor(sec / 60);
    const s = sec % 60;

    return `${min}m ${s}s`;
  }

  /* ================= GROUP ================= */

  const grouped = sessions.reduce(
    (acc: any, s) => {
      const day = formatDate(s.createdAt);

      if (!acc[day]) acc[day] = [];

      acc[day].push(s);

      return acc;
    },
    {}
  );

  /* ================= RENDER ================= */

  return (
    <div style={page}>
      <h1 style={title}>Histórico de Estudos</h1>

      {Object.keys(grouped).length === 0 && (
        <p style={empty}>
          Nenhuma sessão registrada ainda.
        </p>
      )}

      {Object.entries(grouped).map(
        ([day, list]: any) => (
          <section key={day} style={card}>
            <h2 style={dateTitle}>{day}</h2>

            {list.map((s: Session) => (
              <div
                key={s.id}
                style={{
                  ...row,
                  borderLeft: `6px solid ${
                    subjectColors[s.subject] ||
                    "#94a3b8"
                  }`,
                }}
              >
                <div>
                  <b>{s.subject}</b>
                  <div style={time}>
                    ⏱ {formatTime(s.minutes)}
                  </div>
                </div>

                <span style={badge}>
                  Estudo
                </span>
              </div>
            ))}
          </section>
        )
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  minHeight: "100vh",
  padding: "32px",
  background:
    "linear-gradient(180deg,#020617,#000)",
  color: "#e5e7eb",
};

const title = {
  fontSize: "32px",
  marginBottom: "28px",
};

const empty = {
  opacity: 0.6,
};

const card = {
  background: "#020617",
  border: "1px solid #1e293b",
  borderRadius: "16px",
  padding: "20px",
  marginBottom: "24px",
};

const dateTitle = {
  fontSize: "18px",
  marginBottom: "14px",
  opacity: 0.9,
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px",
  borderRadius: "10px",
  background: "#020617",
  border: "1px solid #1e293b",
  marginBottom: "10px",
};

const time = {
  fontSize: "12px",
  opacity: 0.7,
};

const badge = {
  background: "#020617",
  border: "1px solid #1e293b",
  padding: "4px 10px",
  borderRadius: "999px",
  fontSize: "11px",
};
