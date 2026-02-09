"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";
import { Home as HomeIcon, Users, Settings, Box, FolderOpen } from "lucide-react";

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
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-4 flex items-center justify-between" style={{ backgroundColor: "rgba(17, 17, 17, 0.8)", backdropFilter: "blur(10px)" }}>
        <div className="flex items-center gap-2">
          <Image src="/icons/brand/simvex-logo.svg" alt="SIMVEX" width={24} height={24} />
          <span className="font-bold text-white text-lg">SIMVEX</span>
        </div>
        <div className="flex gap-3">
          <Link href="/login" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Login
          </Link>
          <Link href="/register" className="px-4 py-2 text-sm font-medium rounded-md" style={{ backgroundColor: "var(--accent-blue)", color: "white" }}>
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-[200px] pt-20 px-4" style={{ backgroundColor: "#1e2127" }}>
        <nav className="flex flex-col gap-2">
          <div className="flex items-center gap-2 px-3 py-2 text-slate-400 text-sm">
            <HomeIcon size={18} />
            <span>Home</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 text-slate-400 text-sm">
            <Users size={18} />
            <span>My Teams</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 text-slate-400 text-sm">
            <Settings size={18} />
            <span>Settings</span>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-[200px] pt-20">
        {/* Hero Section */}
        <section className="px-12 py-20">
          <div className="max-w-6xl mx-auto grid grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                The new standard in 3D collaboration, SIMVEX
              </h1>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Experience 3D-powered real-time, high-fidelity team collaboration, and project development all on one platform.
              </p>
              <Link href="/register" className="inline-block px-6 py-3 rounded-md font-medium" style={{ backgroundColor: "white", color: "#111" }}>
                Get started for free
              </Link>
            </div>
            <div className="flex items-center justify-center">
              <Image src="/icons/brand/simvex-logo.svg" alt="SIMVEX 3D" width={300} height={300} className="opacity-90" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-12 py-16">
          <div className="max-w-6xl mx-auto grid grid-cols-2 gap-8">
            {/* AI Coach & 3D Viewer */}
            <div className="p-8 rounded-xl" style={{ backgroundColor: "#1e2127", border: "1px solid #333b45" }}>
              <h3 className="text-xl font-bold text-white mb-4">AI Coach & 3D Viewer</h3>
              <p className="text-slate-400 text-sm mb-6">High-contrast with 3D viewer and AI-powered assistant.</p>
              <div className="flex items-center justify-center p-8 rounded-lg" style={{ backgroundColor: "#12141b" }}>
                <Box size={80} className="text-slate-600" />
              </div>
              <p className="text-center text-slate-500 text-xs mt-4">© Capabilities</p>
            </div>

            {/* Projects Dashboard */}
            <div className="p-8 rounded-xl" style={{ backgroundColor: "#1e2127", border: "1px solid #333b45" }}>
              <h3 className="text-xl font-bold text-white mb-4">Projects Dashboard</h3>
              <p className="text-slate-400 text-sm mb-6">View and track/access a list of all projects within your team in real-time.</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg" style={{ backgroundColor: "#12141b" }}>
                  <FolderOpen size={24} className="text-slate-500 mb-2" />
                  <p className="text-slate-300 text-sm font-medium">Project Alpha</p>
                  <div className="flex items-center gap-1 mt-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="text-xs text-slate-500">In Progress</span>
                  </div>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: "#12141b" }}>
                  <FolderOpen size={24} className="text-slate-500 mb-2" />
                  <p className="text-slate-300 text-sm font-medium">SV Renderer</p>
                  <div className="flex items-center gap-1 mt-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="text-xs text-slate-500">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* My Teams Section */}
        <section className="px-12 py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">My Teams</h2>
            <p className="text-slate-400 mb-8">Manage and collaborate with your team members on &quot;My Teams&quot; page.</p>
            <div className="p-8 rounded-xl" style={{ backgroundColor: "#1e2127", border: "1px solid #333b45" }}>
              <div className="h-64 flex items-center justify-center rounded-lg" style={{ backgroundColor: "#12141b" }}>
                <Users size={60} className="text-slate-600" />
              </div>
            </div>
          </div>
        </section>

        {/* Q&A Section */}
        <section className="px-12 py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-white text-center mb-16">Q&A</h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-3">Q1. What exactly is SIMVEX and who is it for?</h3>
                <p className="text-slate-400 leading-relaxed">
                  SIMVEX is a powerful 3D collaboration platform designed for small teams and designers, ideal for SV-optimized complex 3D model file format development.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-3">Q2. Can multiple team members review a 3D model simultaneously?</h3>
                <p className="text-slate-400 leading-relaxed">
                  Yes, SIMVEX supports real-time synchronization, allowing all team members to view, rotate, and leave comments on the same 3D model in a shared workspace.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-3">Q3. How does the AI Assistant help with the 3D learning process?</h3>
                <p className="text-slate-400 leading-relaxed">
                  Our AI Coach analyzes 3D workflows in real-time to provide instant suggestions, suggest design improvements, and provide instant answers to technical questions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-12 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-8">Start with SIMVEX today</h2>
            <Link href="/register" className="inline-block px-8 py-4 rounded-md font-medium text-lg" style={{ backgroundColor: "white", color: "#111" }}>
              Get started for free
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-12 py-8 border-t" style={{ borderColor: "#333b45" }}>
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <p className="text-slate-500 text-sm">© 2024 SIMVEX</p>
            <div className="flex gap-6">
              <Link href="#" className="text-slate-500 text-sm hover:text-slate-300">Terms of Use</Link>
              <Link href="#" className="text-slate-500 text-sm hover:text-slate-300">Privacy Policy</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
