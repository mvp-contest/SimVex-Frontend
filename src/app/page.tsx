"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard/teams");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="flex items-center gap-3 mb-6">
        <Image
          src="/icons/brand/simvex-logo.svg"
          alt="Simvex Logo"
          width={60}
          height={60}
        />
        <h1 className="text-5xl font-bold text-white">SIMVEX</h1>
      </div>
      <p className="text-slate-400 text-xl mb-12 text-center max-w-2xl">
        Collaborative 3D Simulation and Visualization Platform
      </p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="px-8 py-3 rounded-md text-lg font-medium transition-opacity hover:opacity-90"
          style={{
            backgroundColor: "var(--accent-blue)",
            color: "#e2e8f0",
          }}
        >
          Log In
        </Link>
        <Link
          href="/register"
          className="px-8 py-3 rounded-md text-lg font-medium transition-opacity hover:opacity-90"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "2px solid var(--card-border)",
            color: "var(--text-light)",
          }}
        >
          Sign Up
        </Link>
      </div>
      <div className="mt-16 grid grid-cols-3 gap-8 max-w-4xl">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: "#333b45" }}>
            <Image src="/icons/navigation/team.svg" alt="Teams" width={32} height={32} />
          </div>
          <h3 className="text-slate-200 font-semibold mb-2">Team Collaboration</h3>
          <p className="text-slate-500 text-sm">Work together with your team on 3D projects</p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: "#333b45" }}>
            <Image src="/icons/navigation/project.svg" alt="Projects" width={32} height={32} />
          </div>
          <h3 className="text-slate-200 font-semibold mb-2">Project Management</h3>
          <p className="text-slate-500 text-sm">Organize and manage your simulation projects</p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: "#333b45" }}>
            <Image src="/icons/brand/cube-preview.svg" alt="3D" width={32} height={32} />
          </div>
          <h3 className="text-slate-200 font-semibold mb-2">3D Visualization</h3>
          <p className="text-slate-500 text-sm">Render and visualize complex 3D models</p>
        </div>
      </div>
    </div>
  );
}
