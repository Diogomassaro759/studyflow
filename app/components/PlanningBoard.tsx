"use client";

import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useState } from "react";

import {
  Plan,
  updatePlanDay,
} from "@/app/lib/firestore";

type Props = {
  plans: Plan[];
};

export default function PlanningBoard({ plans }: Props) {
  const [items, setItems] = useState<Plan[]>(plans);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const id = active.id as string;
    const newDay = over.id as string;

    setItems((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, day: newDay } : p
      )
    );

    updatePlanDay(id, newDay);
  }

  const days = generateMonthDays();

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div style={layout}>

        {/* SIDEBAR */}
        <div style={sidebar}>
          <h3>Tarefas</h3>

          {items
            .filter((p) => !p.day)
            .map((p) => (
              <TaskCard key={p.id} plan={p} />
            ))}
        </div>

        {/* CALENDÁRIO */}
        <div style={calendar}>
          {days.map((day) => (
            <DayColumn
              key={day}
              day={day}
              plans={items.filter((p) => p.day === day)}
            />
          ))}
        </div>

      </div>
    </DndContext>
  );
}

/* ========================= */

function generateMonthDays() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();

  const days: string[] = [];

  const last = new Date(year, month + 1, 0).getDate();

  for (let i = 1; i <= last; i++) {
    const d = new Date(year, month, i)
      .toISOString()
      .split("T")[0];

    days.push(d);
  }

  return days;
}

/* ========================= */

import { useDraggable, useDroppable } from "@dnd-kit/core";

type TaskProps = {
  plan: Plan;
};

function TaskCard({ plan }: TaskProps) {
  const { attributes, listeners, setNodeRef } =
    useDraggable({
      id: plan.id as string,
    });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        background: plan.color,
        padding: 10,
        borderRadius: 8,
        marginBottom: 8,
        cursor: "grab",
      }}
    >
      <b>{plan.subject}</b>
      <div>{plan.time}</div>
    </div>
  );
}

type DayProps = {
  day: string;
  plans: Plan[];
};

function DayColumn({ day, plans }: DayProps) {
  const { setNodeRef } = useDroppable({
    id: day,
  });

  return (
    <div ref={setNodeRef} style={dayBox}>
      <h4>{day.slice(8)}</h4>

      {plans.map((p) => (
        <TaskCard key={p.id} plan={p} />
      ))}
    </div>
  );
}

/* ========================= */
/* STYLES */
/* ========================= */

const layout = {
  display: "grid",
  gridTemplateColumns: "260px 1fr",
  gap: "20px",
};

const sidebar = {
  background: "#020617",
  padding: "15px",
  borderRadius: "12px",
};

const calendar = {
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  gap: "10px",
};

const dayBox = {
  minHeight: "120px",
  background: "#020617",
  border: "1px solid #1e293b",
  borderRadius: "10px",
  padding: "8px",
};
