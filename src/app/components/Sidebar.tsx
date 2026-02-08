"use client";

import { useState } from "react";
import Link from "next/link";

export default function Sidebar() {
  const [teamsOpen, setTeamsOpen] = useState(true);

  return (
    <aside
      className="w-[160px] min-h-full border-r flex-shrink-0 relative"
      style={{
        backgroundColor: "#1e2127",
        borderColor: "#333b45",
      }}
    >
      {/* Active indicator bar for My Teams */}
      <div className="absolute top-[104px] left-0 w-[6px] h-10 bg-slate-50 rounded-r-[10px]" />

      <nav className="pt-12 flex flex-col gap-2">
        {/* Home */}
        <Link
          href="/"
          className="flex items-center gap-2.5 px-4 py-1.5 hover:opacity-80 transition-opacity"
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <HomeIcon />
          </div>
          <span className="font-semibold text-[#787878] text-sm leading-normal">
            Home
          </span>
        </Link>

        {/* My Teams */}
        <button
          onClick={() => setTeamsOpen(!teamsOpen)}
          className="flex items-center gap-2.5 px-4 py-1.5 w-full text-left hover:opacity-80 transition-opacity"
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <TeamIcon />
          </div>
          <span className="font-semibold text-slate-50 text-sm leading-normal">
            My Teams
          </span>
          <div className="ml-auto">
            <ChevronIcon open={teamsOpen} />
          </div>
        </button>

        {/* Projects (sub-item) */}
        {teamsOpen && (
          <Link
            href="/dashboard/projects/1"
            className="flex items-center gap-2.5 pl-10 py-1.5 hover:opacity-80 transition-opacity"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <ProjectIcon />
            </div>
            <span className="font-semibold text-slate-50 text-sm leading-normal">
              Projects
            </span>
          </Link>
        )}

        {/* Settings */}
        <Link
          href="/settings"
          className="flex items-center gap-2.5 px-4 py-1.5 hover:opacity-80 transition-opacity"
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <SettingsIcon />
          </div>
          <span className="font-semibold text-[#787878] text-sm leading-normal">
            Settings
          </span>
        </Link>
      </nav>
    </aside>
  );
}

function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 10L10 3L17 10M5 8V16C5 16.55 5.45 17 6 17H9V12H11V17H14C14.55 17 15 16.55 15 16V8"
        stroke="#787878"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TeamIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7 9C8.66 9 10 7.66 10 6C10 4.34 8.66 3 7 3C5.34 3 4 4.34 4 6C4 7.66 5.34 9 7 9ZM7 11C4.67 11 0 12.17 0 14.5V17H14V14.5C14 12.17 9.33 11 7 11ZM13 9C14.66 9 16 7.66 16 6C16 4.34 14.66 3 13 3C12.71 3 12.43 3.03 12.16 3.1C12.69 3.89 13 4.89 13 6C13 7.11 12.69 8.11 12.16 8.9C12.43 8.97 12.71 9 13 9ZM14.04 11.13C15.22 12.06 16 13.27 16 14.5V17H20V14.5C20 12.46 16.5 11.35 14.04 11.13Z"
        fill="#787878"
      />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform ${open ? "rotate-90" : ""}`}
    >
      <path
        d="M4 3L8 6L4 9"
        stroke="#94a3b8"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProjectIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 2L2 6L10 10L18 6L10 2ZM2 14L10 18L18 14M2 10L10 14L18 10"
        stroke="#f8fafc"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 12.5C11.38 12.5 12.5 11.38 12.5 10C12.5 8.62 11.38 7.5 10 7.5C8.62 7.5 7.5 8.62 7.5 10C7.5 11.38 8.62 12.5 10 12.5Z"
        stroke="#787878"
        strokeWidth="1.5"
      />
      <path
        d="M16.17 12.5C16.08 12.7 16.05 12.92 16.1 13.13C16.15 13.34 16.26 13.53 16.42 13.68L16.47 13.73C16.6 13.86 16.7 14.02 16.77 14.19C16.84 14.36 16.87 14.55 16.87 14.73C16.87 14.92 16.84 15.1 16.77 15.28C16.7 15.45 16.6 15.6 16.47 15.74C16.34 15.87 16.18 15.97 16.01 16.04C15.84 16.11 15.65 16.14 15.47 16.14C15.28 16.14 15.1 16.11 14.92 16.04C14.75 15.97 14.6 15.87 14.46 15.74L14.41 15.69C14.26 15.53 14.07 15.42 13.86 15.37C13.65 15.32 13.43 15.35 13.23 15.44C13.04 15.52 12.87 15.66 12.76 15.83C12.64 16.01 12.58 16.21 12.58 16.42V16.58C12.58 16.95 12.43 17.31 12.17 17.58C11.91 17.84 11.55 17.99 11.18 17.99C10.81 17.99 10.45 17.84 10.19 17.58C9.93 17.31 9.78 16.95 9.78 16.58V16.49C9.77 16.27 9.7 16.06 9.57 15.89C9.44 15.71 9.26 15.58 9.05 15.51C8.85 15.42 8.63 15.39 8.42 15.44C8.21 15.49 8.02 15.6 7.87 15.76L7.82 15.81C7.68 15.94 7.53 16.04 7.36 16.11C7.19 16.18 7 16.21 6.82 16.21C6.63 16.21 6.45 16.18 6.27 16.11C6.1 16.04 5.95 15.94 5.81 15.81C5.68 15.67 5.58 15.52 5.51 15.35C5.44 15.17 5.41 14.99 5.41 14.8C5.41 14.62 5.44 14.43 5.51 14.26C5.58 14.09 5.68 13.93 5.81 13.8L5.86 13.75C6.02 13.6 6.13 13.41 6.18 13.2C6.23 12.99 6.2 12.77 6.11 12.57C6.03 12.38 5.89 12.21 5.72 12.1C5.54 11.98 5.34 11.92 5.13 11.92H4.97C4.6 11.92 4.24 11.77 3.97 11.51C3.71 11.24 3.56 10.88 3.56 10.51C3.56 10.14 3.71 9.78 3.97 9.52C4.24 9.26 4.6 9.11 4.97 9.11H5.06C5.28 9.1 5.49 9.03 5.66 8.9C5.84 8.77 5.97 8.59 6.04 8.38C6.13 8.18 6.16 7.96 6.11 7.75C6.06 7.54 5.95 7.35 5.79 7.2L5.74 7.15C5.61 7.01 5.51 6.86 5.44 6.69C5.37 6.51 5.34 6.33 5.34 6.14C5.34 5.96 5.37 5.77 5.44 5.6C5.51 5.43 5.61 5.27 5.74 5.14C5.88 5.01 6.03 4.91 6.2 4.84C6.38 4.77 6.56 4.74 6.75 4.74C6.93 4.74 7.12 4.77 7.29 4.84C7.46 4.91 7.62 5.01 7.75 5.14L7.8 5.19C7.95 5.35 8.14 5.46 8.35 5.51C8.56 5.56 8.78 5.53 8.98 5.44H9.05C9.24 5.36 9.41 5.22 9.52 5.05C9.64 4.87 9.7 4.67 9.7 4.46V4.3C9.7 3.93 9.85 3.57 10.11 3.3C10.38 3.04 10.74 2.89 11.11 2.89C11.48 2.89 11.84 3.04 12.1 3.3C12.36 3.57 12.51 3.93 12.51 4.3V4.39C12.52 4.61 12.58 4.82 12.71 4.99C12.83 5.17 13.01 5.3 13.22 5.37C13.42 5.46 13.64 5.49 13.85 5.44C14.06 5.39 14.25 5.28 14.4 5.12L14.45 5.07C14.59 4.94 14.74 4.84 14.91 4.77C15.08 4.7 15.27 4.67 15.45 4.67C15.64 4.67 15.82 4.7 16 4.77C16.17 4.84 16.32 4.94 16.46 5.07C16.59 5.21 16.69 5.36 16.76 5.53C16.83 5.71 16.86 5.89 16.86 6.08C16.86 6.26 16.83 6.45 16.76 6.62C16.69 6.79 16.59 6.95 16.46 7.08L16.41 7.13C16.25 7.28 16.14 7.47 16.09 7.68C16.04 7.89 16.07 8.11 16.16 8.31V8.38C16.24 8.57 16.38 8.74 16.55 8.85C16.73 8.97 16.93 9.03 17.14 9.03H17.3C17.67 9.03 18.03 9.18 18.29 9.45C18.56 9.71 18.71 10.07 18.71 10.44C18.71 10.81 18.56 11.17 18.29 11.44C18.03 11.7 17.67 11.85 17.3 11.85H17.21C16.99 11.86 16.78 11.92 16.61 12.05C16.43 12.17 16.3 12.35 16.17 12.5Z"
        stroke="#787878"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
