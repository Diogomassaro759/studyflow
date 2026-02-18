"use client";

import { useRouter } from "next/navigation";

export default function Upgrade() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">

      <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full text-center">

        <h1 className="text-3xl font-bold mb-4">
          StudyFlow Pro 🚀
        </h1>

        <p className="text-gray-600 mb-6">
          Desbloqueie IA, atividades, relatórios e
          evolução acelerada.
        </p>

        <ul className="text-left mb-6 space-y-2">

          <li>✅ Questões com IA</li>
          <li>✅ Correção automática</li>
          <li>✅ Gráficos avançados</li>
          <li>✅ Planejamento completo</li>

        </ul>

        <button
          className="bg-blue-600 text-white w-full py-3 rounded-lg font-semibold hover:bg-blue-700"
          onClick={() =>
            alert("PIX em breve 😄")
          }
        >
          Assinar por R$9,90/mês
        </button>

        <button
          onClick={() => router.push("/dashboard")}
          className="mt-4 text-gray-500 text-sm"
        >
          Voltar
        </button>

      </div>

    </div>
  );
}
