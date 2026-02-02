import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-4">SimTheme</h1>
      <p style={{ color: "var(--text-muted)" }} className="text-lg mb-8">
        Root Path
      </p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="px-6 py-3 rounded-md text-[16px] font-medium transition-opacity hover:opacity-90"
          style={{
            backgroundColor: "var(--button-bg)",
            color: "var(--button-text)",
          }}
        >
          Login
        </Link>
        <Link
          href="/register"
          className="px-6 py-3 rounded-md text-[16px] font-medium transition-opacity hover:opacity-90"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "2px solid var(--card-border)",
            color: "var(--text-light)",
          }}
        >
          Register
        </Link>
      </div>
    </div>
  );
}
