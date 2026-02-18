"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "@/app/lib/firebase";

import {
  saveEssay,
  getEssays,
  Essay,
} from "@/app/lib/firestore";

const themes = [
  "Desafios da educação no Brasil",
  "Impactos das redes sociais na juventude",
  "Desigualdade social no século XXI",
  "Violência contra a mulher",
  "Meio ambiente e sustentabilidade",
  "Fake news e democracia",
  "Saúde mental dos jovens",
  "Acesso à tecnologia nas escolas",
];

export default function RedacaoPage() {

  const [uid, setUid] = useState<string | null>(null);

  const [theme, setTheme] = useState("");
  const [text, setText] = useState("");

  const [essays, setEssays] = useState<Essay[]>([]);

  const [loading, setLoading] = useState(true);

  /* ====================== */

  useEffect(() => {

    const unsub = onAuthStateChanged(auth, async (user) => {

      if (!user) {
        setUid(null);
        setLoading(false);
        return;
      }

      setUid(user.uid);

      const data = await getEssays(user.uid);
      setEssays(data);

      setLoading(false);
    });

    return () => unsub();

  }, []);

  /* ====================== */

  function randomTheme() {
    const t =
      themes[Math.floor(Math.random() * themes.length)];

    setTheme(t);
  }

  /* ====================== */

  async function handleSave() {

    if (!uid || !theme || !text) {
      alert("Preencha tudo");
      return;
    }

    await saveEssay(uid, theme, text);

    setTheme("");
    setText("");

    const data = await getEssays(uid);
    setEssays(data);

    alert("Redação salva!");
  }

  /* ====================== */

  if (loading) {
    return <div style={loadingBox}>Carregando...</div>;
  }

  if (!uid) {
    return <div style={loadingBox}>Faça login</div>;
  }

  /* ====================== */

  return (
    <div style={page}>

      <h1 style={title}> Redação ENEM</h1>

      {/* Criar */}

      <div style={box}>

        <h2>Nova Redação</h2>

        <input
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder="Tema"
          style={input}
        />

        <button onClick={randomTheme} style={btn2}>
          Tema Aleatório
        </button>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escreva sua redação..."
          style={textarea}
        />

        <button onClick={handleSave} style={btn}>
          Salvar
        </button>

      </div>

      {/* Histórico */}

      <h2 style={section}>Histórico</h2>

      {essays.map((e) => (
        <div key={e.id} style={essayBox}>
          <h3>{e.theme}</h3>
          <p>{e.text}</p>
        </div>
      ))}

    </div>
  );
}

/* ====================== */
/* STYLES */
/* ====================== */

const page = {
  color: "#fff",
  padding: "20px",
};

const title = {
  fontSize: "32px",
  marginBottom: "25px",
};

const box = {
  background: "#020617",
  border: "1px solid #1e293b",
  borderRadius: "14px",
  padding: "20px",
  marginBottom: "40px",
};

const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "8px",
  background: "#020617",
  border: "1px solid #334155",
  color: "#fff",
};

const textarea = {
  width: "100%",
  minHeight: "180px",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "8px",
  background: "#020617",
  border: "1px solid #334155",
  color: "#fff",
};

const btn = {
  background: "#38bdf8",
  color: "#000",
  padding: "10px 18px",
  borderRadius: "8px",
  fontWeight: "bold",
};

const btn2 = {
  background: "#1e293b",
  color: "#fff",
  padding: "8px 14px",
  borderRadius: "8px",
  marginBottom: "10px",
  marginLeft: "5px",
};

const section = {
  fontSize: "22px",
  marginBottom: "15px",
};

const essayBox = {
  background: "#020617",
  border: "1px solid #1e293b",
  padding: "15px",
  borderRadius: "12px",
  marginBottom: "15px",
};

const loadingBox = {
  minHeight: "60vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "#fff",
};
