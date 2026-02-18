import { db } from "./firebase";

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  setDoc,
  Timestamp,
} from "firebase/firestore";

/* ================= COLORS ================= */

export const subjectColors: Record<string, string> = {
  Matemática: "#38bdf8",
  História: "#a855f7",
  Redação: "#f97316",
  Português: "#22c55e",
  Física: "#ef4444",
  Química: "#facc15",
  Biologia: "#14b8a6",
  Geografia: "#ec4899",
};

/* ================= TYPES ================= */

export type Session = {
  id?: string;
  uid: string;
  subject: string;
  minutes: number;
  createdAt: any;
};

export type Plan = {
  id?: string;
  uid: string;
  day: string;
  subject: string;
  time: string;
  category: string;
  color: string;
  createdAt: any;
};

export type Goal = {
  id?: string;
  uid: string;
  daily: number;
  weekly: number;
  monthly: number;
  updatedAt: any;
};

export type Essay = {
  id?: string;
  uid: string;
  theme: string;
  text: string;
  createdAt: any;
};

export type Routine = {
  id?: string;
  uid: string;
  study: number;
  rest: number;
  food: number;
  createdAt: any;
};

export type DailyRoutine = {
  id?: string;
  uid: string;
  day: string;
  study: number;
  rest: number;
  food: number;
  essayTime: number;
  essayTheme: string;
};

/* ================= SESSIONS ================= */

export async function saveSession(
  uid: string,
  subject: string,
  minutes: number
) {
  await addDoc(collection(db, "sessions"), {
    uid,
    subject,
    minutes,
    createdAt: Timestamp.now(),
  });
}

export async function getSessions(uid: string): Promise<Session[]> {
  const q = query(
    collection(db, "sessions"),
    where("uid", "==", uid),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Session),
  }));
}

/* ================= PLANS ================= */

export async function savePlan(
  uid: string,
  day: string,
  subject: string,
  time: string,
  category: string,
  color: string
) {
  await addDoc(collection(db, "plans"), {
    uid,
    day,
    subject,
    time,
    category,
    color,
    createdAt: Timestamp.now(),
  });
}

export async function getPlans(uid: string): Promise<Plan[]> {
  const q = query(
    collection(db, "plans"),
    where("uid", "==", uid),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Plan),
  }));
}

export async function updatePlanDay(id: string, day: string) {
  await updateDoc(doc(db, "plans", id), { day });
}

export async function deletePlan(id: string) {
  await deleteDoc(doc(db, "plans", id));
}

/* ================= GOALS ================= */

export async function saveGoal(
  uid: string,
  daily: number,
  weekly: number,
  monthly: number
) {
  await setDoc(doc(db, "goals", uid), {
    uid,
    daily,
    weekly,
    monthly,
    updatedAt: Timestamp.now(),
  });
}

export async function getGoal(uid: string): Promise<Goal | null> {
  const ref = doc(db, "goals", uid);

  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...(snap.data() as Goal),
  };
}

/* ================= ESSAYS ================= */

export async function saveEssay(
  uid: string,
  theme: string,
  text: string
) {
  await addDoc(collection(db, "essays"), {
    uid,
    theme,
    text,
    createdAt: Timestamp.now(),
  });
}

export async function getEssays(uid: string): Promise<Essay[]> {
  const q = query(
    collection(db, "essays"),
    where("uid", "==", uid),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Essay),
  }));
}

/* ================= STREAK ================= */

export async function updateStreak(uid: string) {
  const ref = doc(db, "streaks", uid);

  const snap = await getDoc(ref);

  const today = new Date().toDateString();

  if (!snap.exists()) {
    await setDoc(ref, {
      count: 1,
      lastDate: today,
    });

    return 1;
  }

  const data: any = snap.data();

  const last = new Date(data.lastDate);
  const now = new Date();

  const diff =
    (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);

  if (diff <= 1.5) {
    const count = data.count + 1;

    await updateDoc(ref, {
      count,
      lastDate: today,
    });

    return count;
  }

  await updateDoc(ref, {
    count: 1,
    lastDate: today,
  });

  return 1;
}

export async function getStreak(uid: string) {
  const ref = doc(db, "streaks", uid);

  const snap = await getDoc(ref);

  if (!snap.exists()) return 0;

  return snap.data().count;
}

/* ================= ROUTINE ================= */

export async function saveRoutine(
  uid: string,
  study: number,
  rest: number,
  food: number
) {
  await setDoc(doc(db, "routines", uid), {
    uid,
    study,
    rest,
    food,
    createdAt: Timestamp.now(),
  });
}

export async function getRoutine(
  uid: string
): Promise<Routine | null> {
  const ref = doc(db, "routines", uid);

  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return snap.data() as Routine;
}

/* ================= DAILY ROUTINE ================= */

export async function saveDailyRoutine(
  uid: string,
  day: string,
  study: number,
  rest: number,
  food: number,
  essayTime: number,
  essayTheme: string
) {
  const q = query(
    collection(db, "dailyRoutines"),
    where("uid", "==", uid),
    where("day", "==", day)
  );

  const snap = await getDocs(q);

  if (!snap.empty) {
    await updateDoc(doc(db, "dailyRoutines", snap.docs[0].id), {
      study,
      rest,
      food,
      essayTime,
      essayTheme,
      updatedAt: Timestamp.now(),
    });

    return;
  }

  await addDoc(collection(db, "dailyRoutines"), {
    uid,
    day,
    study,
    rest,
    food,
    essayTime,
    essayTheme,
    createdAt: Timestamp.now(),
  });
}

export async function getDailyRoutine(
  uid: string,
  day: string
): Promise<DailyRoutine | null> {
  const q = query(
    collection(db, "dailyRoutines"),
    where("uid", "==", uid),
    where("day", "==", day)
  );

  const snap = await getDocs(q);

  if (snap.empty) return null;

  const d = snap.docs[0];

  return {
    id: d.id,
    ...(d.data() as DailyRoutine),
  };
}
/* ================= AUTH ================= */

export async function isUserAuthorized(
  uid: string
): Promise<boolean> {

  const ref = doc(db, "authorizedUsers", uid);

  const snap = await getDoc(ref);

  return snap.exists();
}

export async function authorizeUser(
  uid: string,
  email: string,
  role = "student"
) {
  await setDoc(doc(db, "authorizedUsers", uid), {
    email,
    role,
    createdAt: Timestamp.now(),
  });
}
