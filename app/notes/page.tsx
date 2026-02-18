"use client";

import { useEffect, useState } from "react";

const subjects = [
  "Matemática",
  "Português",
  "Biologia",
  "História",
  "Geografia",
  "Física",
  "Química",
  "Redação (ENEM)",
];

const days = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo",
];

export default function Planning() {
  const [plans, setPlans] = useState<any[]>([]);
  const [day, setDay] = useState(days[0]);
  const [subject, setSubject] = useState(subjects[0]);
  const [minutes, setMinutes] = useState(60);

  /* Load */
  useEffect(() => {
    const saved =
      localStorage.getItem("studyflow_plans") || "[]";

    setPlans(JSON.parse(saved));
  }, []);

  /* Save */
  function save(data: any[]) {
    localStorage.setItem(
      "studyflow_plans",
      JSON.stringify(data)
    );

    setPlans(data);
  }

  /* Add */
  function addPlan() {
    const list = [
      ...plans,
      {
        id: Date.now(),
        day,
        subject,
        minutes,
        done: false,
      },
    ];

    save(list);
  }

  /* Toggle */
  function toggle(id: number) {
    const list = plans.map((p) =>
      p.id === id ? { ...p, done: !p.done } : p
    );

    save(list);
  }

  /* Remove */
  function remove(id: number) {
    const list = plans.filter((p) => p.id !== id);

    save(list);
  }

  return (
    <div style={page}>

      <h1 style={title}>Planejamento</h1>

      {/* Form */}
      <div style={form}>

        <select
          value={day}
          onChange={(e) => setDay(e.target.value)}
          style={input}
        >
          {days.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>

        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          style={input}
        >
          {subjects.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <input
          type="number"
          min="10"
          step="10"
          value={minutes}
          onChange={(e) =>
            setMinutes(Number(e.target.value))
          }
          style={input}
        />

        <button style={btn} onClick={addPlan}>
          Adicionar
        </button>

      </div>

      {/* List */}
      <div style={list}>

        {plans.map((p) => (
          <div key={p.id} style={row}>

            <div>
              <strong>{p.day}</strong> — {p.subject}
              <br />
              <small>{p.minutes} min</small>
            </div>

            <div style={actions}>

              <button
                style={{
                  ...doneBtn,
                  background: p.done
                    ? "#22c55e"
                    : "#334155",
                }}
                onClick={() => toggle(p.id)}
              >
                {p.done ? "Feito" : "Pendente"}
              </button>

              <button
                style={delBtn}
                onClick={() => remove(p.id)}
              >
                X
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

/* ================== ESTILO ================== */

const page: any = {
  minHeight: "100vh",
  background: "#020617",
  color: "#fff",
  padding: "40px",
};

const title: any = {
  fontSize: "32px",
  marginBottom: "25px",
};

const form: any = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr auto",
  gap: "10px",
  marginBottom: "25px",
};

const input: any = {
  padding: "10px",
  background: "#020617",
  border: "1px solid #334155",
  color: "#fff",
  borderRadius: "8px",
};

const btn: any = {
  background: "#38bdf8",
  border: "none",
  borderRadius: "8px",
  fontWeight: "bold",
  cursor: "pointer",
};

const list: any = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const row: any = {
  background: "#020617",
  border: "1px solid #1e293b",
  borderRadius: "12px",
  padding: "15px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const actions: any = {
  display: "flex",
  gap: "10px",
};

const doneBtn: any = {
  padding: "6px 12px",
  border: "none",
  borderRadius: "6px",
  color: "#fff",
  cursor: "pointer",
};

const delBtn: any = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  padding: "6px 10px",
  cursor: "pointer",
};
