import Link from "next/link";

export default function Header() {
  return (
    <header
      className="h-[60px] flex items-center justify-between px-5 border-b-2 flex-shrink-0"
      style={{
        backgroundColor: "var(--background)",
        borderColor: "#333b45",
      }}
    >
      <Link href="/" className="flex items-center gap-2.5">
        <div className="w-[34px] h-[34px] flex items-center justify-center">
          <SimvexLogo />
        </div>
        <span className="font-bold text-slate-200 text-xl leading-normal">
          SIMVEX
        </span>
      </Link>
      <span className="font-semibold text-slate-200 text-lg leading-normal">
        Haeyoung
      </span>
    </header>
  );
}

function SimvexLogo() {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 51 51"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M25.5 3L46 15V37L25.5 49L5 37V15L25.5 3Z"
        stroke="#94a3b8"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M25.5 3L46 15L25.5 27L5 15L25.5 3Z"
        stroke="#94a3b8"
        strokeWidth="1"
        fill="none"
      />
      <line x1="25.5" y1="27" x2="25.5" y2="49" stroke="#94a3b8" strokeWidth="1" />
      <text
        x="25.5"
        y="33"
        textAnchor="middle"
        fill="#94a3b8"
        fontSize="12"
        fontWeight="bold"
        fontFamily="Arial, Helvetica, sans-serif"
      >
        SV
      </text>
    </svg>
  );
}
