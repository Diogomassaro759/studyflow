"use client";

import { auth } from "@/app/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Settings() {
  const router = useRouter();

  async function logout() {
    await signOut(auth);
    router.push("/login");
  }

  return (
    <div>

      <h1 className="text-2xl font-bold mb-6">
        ⚙️ Configurações
      </h1>

      <button
        onClick={logout}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Sair da Conta
      </button>

    </div>
  );
}
