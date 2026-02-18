"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

import { auth } from "@/app/lib/firebase";

import {
  getGoal,
  getStreak,
  getSessions,
} from "@/app/lib/firestore";

/* ================= TYPES ================= */

type Goal = {
  daily: number;
  weekly: number;
  monthly: number;
};

type Session = {
  subject: string;
  minutes: number;
};

/* ================= PAGE ================= */

export default function ProfilePage() {
  const [email, setEmail] = useState("");

  const [goal, setGoal] = useState<Goal | null>(null);
  const [streak, setStreak] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);

  const [theme, setTheme] = useState("dark");

  const router = useRouter();

  /* ================= THEME ================= */

  useEffect(() => {
    const saved = localStorage.getItem("theme");

    if (saved) {
      setTheme(saved);
      document.body.className = saved;
    }
  }, []);

  function toggleTheme() {
    const newTheme = theme === "dark" ? "light" : "dark";

    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.className = newTheme;
  }

  /* ================= AUTH ================= */

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/");
        return;
      }

      setEmail(user.email || "");

      loadData(user.uid);
    });

    return () => unsub();
  }, []);

  /* ================= LOAD ================= */

  async function loadData(uid: string) {
    const g = await getGoal(uid);
    const s = await getStreak(uid);
    const sessions = await getSessions(uid);

    setGoal(g);
    setStreak(s);

    if (!sessions || sessions.length === 0) {
      setTotalMinutes(0);
      return;
    }

    const total = sessions.reduce(
      (sum, s) => sum + (s.minutes || 0),
      0
    );

    setTotalMinutes(total);
  }

  /* ================= LOGOUT ================= */

  async function handleLogout() {
    await signOut(auth);

    document.cookie = "user=; path=/; max-age=0";

    router.push("/");
  }

  /* ================= HELPERS ================= */

  function formatTime(min: number) {
    const h = Math.floor(min / 60);
    const m = min % 60;

    return `${h}h ${m}min`;
  }

  function formatGoal(min: number) {
    return (min / 60).toFixed(1) + "h";
  }

  /* ================= RENDER ================= */

  return (
    <div style={page}>

      <div style={card}>

        <h1 style={title}> Meu Perfil</h1>

        {/* INFO */}

        <div style={row}>
          <span>Email</span>
          <strong>{email}</strong>
        </div>

        <div style={row}>
          <span>🔥 Streak</span>
          <strong>{streak} dias</strong>
        </div>

        <div style={row}>
          <span>⏱ Tempo Total</span>
          <strong>{formatTime(totalMinutes)}</strong>
        </div>

        <hr style={divider} />

        {/* GOALS */}

        <h3 style={subtitle}> Metas</h3>

        {goal ? (
          <>
            <div style={row}>
              <span>Diária</span>
              <strong>{formatGoal(goal.daily)}</strong>
            </div>

            <div style={row}>
              <span>Semanal</span>
              <strong>{formatGoal(goal.weekly)}</strong>
            </div>

            <div style={row}>
              <span>Mensal</span>
              <strong>{formatGoal(goal.monthly)}</strong>
            </div>
          </>
        ) : (
          <p style={muted}>Nenhuma meta definida</p>
        )}

        <hr style={divider} />

        {/* THEME */}

        <h3 style={subtitle}> Aparência</h3>

        <button onClick={toggleTheme} style={themeBtn}>
          {theme === "dark"
            ? " Modo Claro"
            : " Modo Escuro"}
        </button>

      </div>

      {/* LOGOUT */}

      <button onClick={handleLogout} style={logoutBtn}>
         Sair da Conta
      </button>

    </div>
  );
}

/* ================= STYLES ================= */

const page: any = {
  minHeight: "100vh",
  background:
    "linear-gradient(180deg,#020617,#000)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "20px",
  color: "#fff",
  padding: "20px",
};

const card: any = {
  width: "100%",
  maxWidth: "480px",
  background: "#020617",
  border: "1px solid #1e293b",
  borderRadius: "18px",
  padding: "28px",
  boxShadow: "0 0 40px rgba(56,189,248,0.12)",
};

const title: any = {
  fontSize: "28px",
  marginBottom: "20px",
  textAlign: "center",
};

const subtitle: any = {
  fontSize: "18px",
  marginBottom: "10px",
};

const row: any = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "12px",
  fontSize: "15px",
};

const divider: any = {
  border: "none",
  borderTop: "1px solid #1e293b",
  margin: "18px 0",
};

const muted: any = {
  opacity: 0.6,
  fontSize: "14px",
};

const themeBtn: any = {
  width: "100%",
  padding: "12px",
  background: "#020617",
  border: "1px solid #38bdf8",
  borderRadius: "10px",
  color: "#38bdf8",
  fontWeight: "bold",
  cursor: "pointer",
};

const logoutBtn: any = {
  background:
    "linear-gradient(90deg,#ef4444,#dc2626)",
  border: "none",
  padding: "12px 30px",
  borderRadius: "10px",
  fontWeight: "bold",
  color: "#fff",
  cursor: "pointer",
};
