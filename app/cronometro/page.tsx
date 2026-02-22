"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "@/app/lib/firebase";

import {
  getPlans,
  saveSession,
  Plan,
} from "@/app/lib/firestore";

/* ================= PAGE ================= */

export default function TimerPage() {
  const [uid, setUid] = useState("");

  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] =
    useState<Plan | null>(null);

  const [secondsLeft, setSecondsLeft] =
    useState(0);

  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [finished, setFinished] = useState(false);

  /* ================= AUTH ================= */

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      setUid(user.uid);

      const p = await getPlans(user.uid);

      setPlans(p);
    });

    return () => unsub();
  }, []);

  /* ================= TIMER ================= */

  useEffect(() => {
    if (!running) return;
    if (paused) return;
    if (secondsLeft <= 0) return;

    const i = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);

    return () => clearInterval(i);
  }, [running, paused, secondsLeft]);

  useEffect(() => {
    if (secondsLeft === 0 && running) {
      setRunning(false);
      setFinished(true);
      setPaused(false);
    }
  }, [secondsLeft, running]);

  /* ================= TIME PARSER ================= */

  function parseTimeToSeconds(time: string) {
    if (!time) return 0;

    const hMatch = time.match(/(\d+)h/);
    const mMatch = time.match(/(\d+)m/);

    const hours = hMatch ? Number(hMatch[1]) : 0;
    const minutes = mMatch ? Number(mMatch[1]) : 0;

    return hours * 3600 + minutes * 60;
  }

  /* ================= SELECT ================= */

  function handleSelect(plan: Plan) {
    if (running) return;

    setSelectedPlan(plan);

    const totalSeconds =
      parseTimeToSeconds(plan.time);

    if (totalSeconds <= 0) {
      alert("Tempo inválido no planejamento.");
      return;
    }

    setSecondsLeft(totalSeconds);

    setFinished(false);
    setPaused(false);
  }

  /* ================= CONTROLS ================= */

  function start() {
    if (secondsLeft <= 0) return;

    setRunning(true);
    setPaused(false);
  }

  function pause() {
    setPaused(true);
  }

  function resume() {
    setPaused(false);
  }

  /* ================= SAVE ================= */

  async function save() {
    if (!uid || !selectedPlan) return;

    const totalMinutes = Math.round(
      parseTimeToSeconds(selectedPlan.time) / 60
    );

    await saveSession(
      uid,
      selectedPlan.subject,
      totalMinutes
    );

    alert("Sessão salva!");

    setSelectedPlan(null);
    setFinished(false);
    setSecondsLeft(0);
  }

  /* ================= FORMAT ================= */

  function format() {
    const m = Math.floor(secondsLeft / 60);
    const s = secondsLeft % 60;

    return `${String(m).padStart(2, "0")}:${String(
      s
    ).padStart(2, "0")}`;
  }

  /* ================= RENDER ================= */

  return (
    <div style={page}>
      <h1 style={title}>Cronômetro</h1>

      {/* PLANS */}

      <section style={card}>
        <h2 style={sectionTitle}>
          Escolha seu Plano
        </h2>

        {plans.map((p) => (
          <button
            key={p.id}
            style={{
              ...planBtn,
              border:
                selectedPlan?.id === p.id
                  ? "2px solid #38bdf8"
                  : "1px solid #1e293b",
            }}
            onClick={() => handleSelect(p)}
          >
            <b>{p.subject}</b> — {p.time}
          </button>
        ))}
      </section>

      {/* TIMER */}

      <section style={card}>
        <h2 style={sectionTitle}>Timer</h2>

        <div style={timer}>{format()}</div>

        {/* START */}

        {!running && !finished && (
          <button
            onClick={start}
            style={btnPrimary}
          >
            Iniciar
          </button>
        )}

        {/* PAUSE / RESUME */}

        {running && !finished && (
          <>
            {!paused ? (
              <button
                onClick={pause}
                style={btnYellow}
              >
                Pausar
              </button>
            ) : (
              <button
                onClick={resume}
                style={btnPrimary}
              >
                Continuar
              </button>
            )}
          </>
        )}

        {/* SAVE */}

        {finished && (
          <>
            <p
              style={{
                textAlign: "center",
                marginBottom: 12,
              }}
            >
              Tempo concluído!
            </p>

            <button
              onClick={save}
              style={btnGreen}
            >
              Salvar no Dashboard
            </button>
          </>
        )}
      </section>
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
  fontSize: "32px",
  fontWeight: "bold",
  marginBottom: "24px",
};

const card = {
  background: "#020617",
  border: "1px solid #1e293b",
  borderRadius: "16px",
  padding: "24px",
  marginBottom: "24px",
};

const sectionTitle = {
  fontSize: "20px",
  marginBottom: "16px",
};

const planBtn = {
  width: "100%",
  background: "#020617",
  color: "#fff",
  padding: "14px",
  borderRadius: "10px",
  cursor: "pointer",
  marginBottom: "10px",
  textAlign: "left" as const,
};

const timer = {
  fontSize: "64px",
  fontWeight: "bold",
  textAlign: "center" as const,
  marginBottom: "20px",
};

const btnPrimary = {
  width: "100%",
  background: "linear-gradient(90deg,#38bdf8,#0ea5e9)",
  border: "none",
  borderRadius: "12px",
  padding: "14px",
  fontWeight: "bold" as const,
  cursor: "pointer",
  color: "#020617",
};

const btnGreen = {
  width: "100%",
  background: "linear-gradient(90deg,#22c55e,#16a34a)",
  border: "none",
  borderRadius: "12px",
  padding: "14px",
  fontWeight: "bold" as const,
  cursor: "pointer",
  color: "#020617",
};

const btnYellow = {
  width: "100%",
  background: "linear-gradient(90deg,#facc15,#eab308)",
  border: "none",
  borderRadius: "12px",
  padding: "14px",
  fontWeight: "bold" as const,
  cursor: "pointer",
  color: "#020617",
};