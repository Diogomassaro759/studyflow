"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { auth } from "@/app/lib/firebase";

import { signInWithEmailAndPassword } from "firebase/auth";

import { isUserAuthorized } from "@/app/lib/firestore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  async function handleSubmit() {
    try {
      const res = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const uid = res.user.uid;

      // Verifica se está autorizado
      const allowed = await isUserAuthorized(uid);

      if (!allowed) {
        alert("Acesso não autorizado.");
        await auth.signOut();
        return;
      }

      document.cookie = "user=true; path=/";

      router.push("/dashboard");

    } catch (err: any) {
      alert("Email ou senha inválidos.");
    }
  }

  return (
    <div style={page}>

      <h1 style={title}>
        Entrar
      </h1>

      <input
        style={input}
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        style={input}
        type="password"
        placeholder="Senha"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button style={button} onClick={handleSubmit}>
        Entrar
      </button>

    </div>
  );
}

/* ===== ESTILO ===== */

const page: any = {
  minHeight: "100vh",
  background: "#020617",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "15px",
  color: "#fff",
};

const title: any = {
  fontSize: "28px",
  marginBottom: "10px",
};

const input: any = {
  width: "260px",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #334155",
  background: "#020617",
  color: "#fff",
};

const button: any = {
  width: "260px",
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  background: "#38bdf8",
  color: "#020617",
  fontWeight: "bold",
  cursor: "pointer",
};
