"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "@/app/lib/firebase";

import {
  getPlans,
  savePlan,
  updatePlanDay,
  deletePlan,
} from "@/app/lib/firestore";

/* ================= TYPES ================= */

type Plan = {
  id: string;
  uid: string;
  day: string;
  subject: string;
  time: string;
  category: string;
  color: string;
};

/* ================= PAGE ================= */

export default function PlanningPage() {
  const [uid, setUid] = useState("");

  const [plans, setPlans] = useState<Plan[]>([]);

  const [subject, setSubject] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("study");

  const [currentMonth, setCurrentMonth] = useState(new Date());

  /* ================= AUTH ================= */

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      setUid(user.uid);
      loadPlans(user.uid);
    });

    return () => unsub();
  }, []);

  /* ================= LOAD ================= */

  async function loadPlans(uid: string) {
    const data = await getPlans(uid);
    setPlans(data as Plan[]);
  }

  /* ================= ADD ================= */

  async function handleAddPlan() {
    if (!subject || !time) return;

    const today = formatDate(new Date());

    await savePlan(
      uid,
      today,
      subject,
      time,
      category,
      getColor(category)
    );

    setSubject("");
    setTime("");

    loadPlans(uid);
  }

  /* ================= CALENDAR ================= */

  function getMonthDays() {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const lastDay = new Date(year, month + 1, 0);

    const days: string[] = [];

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(formatDate(new Date(year, month, i)));
    }

    return days;
  }

  function prevMonth() {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - 1
      )
    );
  }

  function nextMonth() {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1
      )
    );
  }

  /* ================= DRAG ================= */

  function onDragStart(e: any, id: string) {
    e.dataTransfer.setData("id", id);
  }

  async function onDrop(e: any, day: string) {
    const id = e.dataTransfer.getData("id");

    await updatePlanDay(id, day);

    loadPlans(uid);
  }

  async function removePlan(id: string) {
    await deletePlan(id);
    loadPlans(uid);
  }

  /* ================= RENDER ================= */

  const days = getMonthDays();

  return (
    <div style={page}>
      <h1 style={title}>Planejamento Mensal</h1>

      {/* FORM */}

      <div style={form}>
        <input
          placeholder="Ex: Matemática"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          style={input}
        />

        <input
          placeholder="Tempo (ex: 2h)"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={input}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={input}
        >
          <option value="study">Estudo</option>
          <option value="essay">Redação</option>
          <option value="rest">Descanso</option>
          <option value="food">Alimentação</option>
        </select>

        <button onClick={handleAddPlan} style={btn}>
          Adicionar
        </button>
      </div>

      {/* MONTH */}

      <div style={monthControl}>
        <button onClick={prevMonth} style={navBtn}>
          ◀
        </button>

        <h2>
          {currentMonth.toLocaleDateString("pt-BR", {
            month: "long",
            year: "numeric",
          })}
        </h2>

        <button onClick={nextMonth} style={navBtn}>
          ▶
        </button>
      </div>

      {/* CALENDAR */}

      <div style={calendar}>
        {days.map((day) => (
          <div
            key={day}
            style={cell}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, day)}
          >
            <small>{day.split("-")[2]}</small>

            {plans
              .filter((p) => p.day === day)
              .map((p) => (
                <div
                  key={p.id}
                  draggable
                  onDragStart={(e) =>
                    onDragStart(e, p.id)
                  }
                  style={{
                    ...planCard,
                    background: getColor(p.category),
                  }}
                >
                  <span>
                    {p.subject}
                    <br />
                    ⏱ {p.time}
                  </span>

                  <span
                    onClick={() => removePlan(p.id)}
                    style={deleteBtn}
                  >
                    ✕
                  </span>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */

function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}

function getColor(cat: string) {
  if (cat === "study") return "#38bdf8";
  if (cat === "essay") return "#a855f7";
  if (cat === "rest") return "#22c55e";
  if (cat === "food") return "#f97316";

  return "#94a3b8";
}

/* ================= STYLES ================= */

const page = {
  color: "#e5e7eb",
  padding: "30px",
  minHeight: "100vh",
  background:
    "linear-gradient(180deg, #020617 0%, #020617 40%, #000 100%)",
};

const title = {
  fontSize: "32px",
  fontWeight: "bold",
  marginBottom: "25px",
};

const form = {
  display: "flex",
  gap: "12px",
  marginBottom: "25px",
  background: "#020617",
  padding: "15px",
  borderRadius: "14px",
  border: "1px solid #1e293b",
};

const input = {
  background: "#020617",
  border: "1px solid #1e293b",
  padding: "12px 14px",
  color: "#fff",
  borderRadius: "8px",
  outline: "none",
  fontSize: "14px",
  flex: 1,
};

const btn = {
  background: "linear-gradient(90deg,#38bdf8,#0ea5e9)",
  color: "#020617",
  padding: "12px 20px",
  borderRadius: "10px",
  fontWeight: "bold",
  cursor: "pointer",
  border: "none",
};

const monthControl = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "25px",
  background: "#020617",
  padding: "12px 20px",
  borderRadius: "12px",
  border: "1px solid #1e293b",
};

const navBtn = {
  background: "#020617",
  border: "1px solid #1e293b",
  color: "#e5e7eb",
  padding: "6px 14px",
  borderRadius: "8px",
  cursor: "pointer",
};

const calendar = {
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  gap: "14px",
};

const cell = {
  background: "#020617",
  border: "1px solid #1e293b",
  minHeight: "140px",
  padding: "10px",
  borderRadius: "14px",
  display: "flex",
  flexDirection: "column" as const,
};

const planCard = {
  padding: "8px",
  marginTop: "6px",
  borderRadius: "8px",
  fontSize: "12px",
  fontWeight: "500",
  cursor: "grab",
  color: "#020617",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const deleteBtn = {
  cursor: "pointer",
  fontWeight: "bold",
};
