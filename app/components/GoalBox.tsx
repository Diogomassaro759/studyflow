"use client";

import { useState } from "react";

import {
  saveGoal,
  Goal,
} from "@/app/lib/firestore";

type Props = {
  uid: string;
  goal: Goal | null;
};

export default function GoalBox({ uid, goal }: Props) {

  const [daily, setDaily] = useState<number>(goal?.daily || 0);
  const [weekly, setWeekly] = useState<number>(goal?.weekly || 0);
  const [monthly, setMonthly] = useState<number>(goal?.monthly || 0);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSave() {
    try {
      setLoading(true);
      setMsg("");

      await saveGoal(uid, daily, weekly, monthly);

      setMsg("Metas salvas com sucesso!");

    } catch (err) {
      console.error(err);
      setMsg("Erro ao salvar metas");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={box}>

      <h3 style={title}>Metas de Estudo</h3>

      <div style={grid}>

        <div>
          <label>Diária (h)</label>
          <input
            type="number"
            value={daily}
            min={0}
            onChange={(e) => setDaily(Number(e.target.value))}
            style={input}
          />
        </div>

        <div>
          <label>Semanal (h)</label>
          <input
            type="number"
            value={weekly}
            min={0}
            onChange={(e) => setWeekly(Number(e.target.value))}
            style={input}
          />
        </div>

        <div>
          <label>Mensal (h)</label>
          <input
            type="number"
            value={monthly}
            min={0}
            onChange={(e) => setMonthly(Number(e.target.value))}
            style={input}
          />
        </div>

      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        style={btn}
      >
        {loading ? "Salvando..." : "Salvar Metas"}
      </button>

      {msg && <p style={msgStyle}>{msg}</p>}

    </div>
  );
}

/* ================= STYLES ================= */

const box = {
  background: "#020617",
  border: "1px solid #1e293b",
  borderRadius: "14px",
  padding: "20px",
};

const title = {
  fontSize: "18px",
  marginBottom: "15px",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "15px",
  marginBottom: "15px",
};

const input = {
  width: "100%",
  padding: "8px",
  borderRadius: "8px",
  border: "1px solid #1e293b",
  background: "#020617",
  color: "#fff",
};

const btn = {
  background: "#38bdf8",
  color: "#000",
  padding: "10px",
  borderRadius: "8px",
  width: "100%",
  fontWeight: "bold" as const,
  cursor: "pointer",
};

const msgStyle = {
  marginTop: "10px",
  fontSize: "14px",
};
