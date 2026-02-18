import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial",
        gap: "20px",
      }}
    >
      <h1>📚 StudyFlow</h1>

      <p>Organize seus estudos.</p>

      <Link href="/login">
        <button
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "none",
            background: "#000",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Começar
        </button>
      </Link>
    </main>
  );
}
