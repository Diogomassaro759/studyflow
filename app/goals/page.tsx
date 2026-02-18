"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "@/app/lib/firebase";
import { saveGoal, getGoal } from "@/app/lib/firestore";

export default function GoalsPage() {
  const [uid, setUid] = useState("");

  // Sempre em HORAS (string para input)
  const [daily, setDaily] = useState("");
  const [weekly, setWeekly] = useState("");
  const [monthly, setMonthly] = useState("");

  /* ================= AUTH ================= */

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      setUid(user.uid);

      const g = await getGoal(user.uid);

      if (g) {
        // Converte minutos → horas (com 1 casa decimal)
        setDaily((g.daily / 60).toFixed(1));
        setWeekly((g.weekly / 60).toFixed(1));
        setMonthly((g.monthly / 60).toFixed(1));
      }
    });

    return () => unsub();
  }, []);

  /* ================= SAVE ================= */

  async function handleSave() {
    if (!uid) {
      alert("Usuário não autenticado");
      return;
    }

    if (!daily || !weekly || !monthly) {
      alert("Preencha todas as metas");
      return;
    }

    const dailyHours = Number(daily);
    const weeklyHours = Number(weekly);
    const monthlyHours = Number(monthly);

    if (
      isNaN(dailyHours) ||
      isNaN(weeklyHours) ||
      isNaN(monthlyHours)
    ) {
      alert("Digite apenas números válidos");
      return;
    }

    if (dailyHours <= 0 || weeklyHours <= 0 || monthlyHours <= 0) {
      alert("As metas devem ser maiores que zero");
      return;
    }

    // Converte para MINUTOS (padrão do banco)
    const dailyMin = Math.round(dailyHours * 60);
    const weeklyMin = Math.round(weeklyHours * 60);
    const monthlyMin = Math.round(monthlyHours * 60);

    await saveGoal(uid, dailyMin, weeklyMin, monthlyMin);

    alert("✅ Metas salvas com sucesso!");
  }

  /* ================= UI ================= */

  return (
    <div style={page}>
      <div style={card}>
        <h1 style={title}>Metas de Estudo</h1>

        <div style={field}>
          <label>Meta Diária (horas)</label>
          <input
            type="number"
            min="0"
            step="0.5"
            value={daily}
            onChange={(e) => setDaily(e.target.value)}
            style={input}
          />
        </div>

        <div style={field}>
          <label>Meta Semanal (horas)</label>
          <input
            type="number"
            min="0"
            step="0.5"
            value={weekly}
            onChange={(e) => setWeekly(e.target.value)}
            style={input}
          />
        </div>

        <div style={field}>
          <label>Meta Mensal (horas)</label>
          <input
            type="number"
            min="0"
            step="0.5"
            value={monthly}
            onChange={(e) => setMonthly(e.target.value)}
            style={input}
          />
        </div>

        <button onClick={handleSave} style={btn}>
          Salvar Metas
        </button>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  minHeight: "100vh",
  background: "linear-gradient(180deg,#020617,#000)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "#fff",
};

const card = {
  background: "#020617",
  border: "1px solid #1e293b",
  padding: "32px",
  borderRadius: "18px",
  width: "100%",
  maxWidth: "420px",
};

const title = {
  textAlign: "center" as const,
  marginBottom: "24px",
  fontSize: "26px",
};

const field = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "6px",
  marginBottom: "18px",
};

const input = {
  padding: "12px",
  background: "#020617",
  border: "1px solid #1e293b",
  color: "#fff",
  borderRadius: "8px",
};

const btn = {
  width: "100%",
  padding: "14px",
  background: "linear-gradient(90deg,#38bdf8,#0ea5e9)",
  color: "#020617",
  fontWeight: "bold",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
};
