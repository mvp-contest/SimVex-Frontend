"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";
import { Home as HomeIcon, Users, Settings, Box, FolderOpen } from "lucide-react";
import Button from "@/components/ui/Button";

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
      <div className="min-h-screen flex items-center justify-center bg-(--color-page-bg)">
        <p className="text-(--color-text-muted)">Loading...</p>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-(--color-page-bg)">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-4 flex items-center justify-between border-b border-(--color-border-primary) bg-(--color-header-bg)/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Image src="/icons/brand/simvex-logo.svg" alt="SIMVEX" width={32} height={32} />
          <span className="font-bold text-(--color-text-primary) text-xl tracking-tight">SIMVEX</span>
        </div>
        <div className="flex gap-3">
          <Link href="/login">
            <Button variant="ghost" className="text-(--color-text-secondary) hover:text-(--color-text-primary)">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="primary">
              Sign Up
            </Button>
          </Link>
        </div>
      </nav>

      {/* Sidebar (Visual only) */}
      <aside className="fixed left-0 top-0 bottom-0 w-[240px] pt-24 px-4 bg-(--color-sidebar-bg) border-r border-(--color-border-primary) hidden md:block">
        <nav className="flex flex-col gap-1">
          <div className="flex items-center gap-3 px-3 py-2 text-(--color-text-secondary) text-sm font-medium rounded-lg hover:bg-(--color-input-bg) cursor-default transition-colors">
            <HomeIcon size={18} />
            <span>Home</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-(--color-text-secondary) text-sm font-medium rounded-lg hover:bg-(--color-input-bg) cursor-default transition-colors">
            <Users size={18} />
            <span>My Teams</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-(--color-text-secondary) text-sm font-medium rounded-lg hover:bg-(--color-input-bg) cursor-default transition-colors">
            <Settings size={18} />
            <span>Settings</span>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="md:ml-[240px] pt-24 pb-20">
        {/* Hero Section */}
        <section className="px-8 md:px-12 py-16 md:py-24">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-(--color-text-primary) mb-6 leading-tight">
                The new standard in <span className="text-(--color-accent-blue)">3D collaboration</span>
              </h1>
              <p className="text-(--color-text-secondary) text-lg mb-8 leading-relaxed max-w-lg">
                Experience 3D-powered real-time, high-fidelity team collaboration, and project development all on one platform.
              </p>
              <Link href="/register">
                <Button size="lg" className="px-8">
                  Get started for free
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center relative">
              <div className="absolute inset-0 bg-(--color-accent-blue)/20 blur-[100px] rounded-full opacity-50"></div>
              <Image 
                src="/icons/brand/simvex-logo.svg" 
                alt="SIMVEX 3D" 
                width={320} 
                height={320} 
                className="opacity-90 relative z-10 drop-shadow-2xl" 
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-8 md:px-12 py-16">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
            {/* AI Coach & 3D Viewer */}
            <div className="p-8 rounded-2xl bg-(--color-card-bg) border border-(--color-border-primary) hover:border-(--color-accent-blue)/50 transition-colors group">
              <h3 className="text-2xl font-bold text-(--color-text-primary) mb-4">AI Coach & 3D Viewer</h3>
              <p className="text-(--color-text-secondary) text-sm mb-8">High-contrast with 3D viewer and AI-powered assistant.</p>
              <div className="flex items-center justify-center p-12 rounded-xl bg-[#12141b] border border-(--color-border-primary) group-hover:border-(--color-accent-blue)/30 transition-colors">
                <Box size={80} className="text-(--color-text-muted) group-hover:text-(--color-accent-blue) transition-colors" />
              </div>
              <p className="text-center text-(--color-text-muted) text-xs mt-4">© Capabilities</p>
            </div>

            {/* Projects Dashboard */}
            <div className="p-8 rounded-2xl bg-(--color-card-bg) border border-(--color-border-primary) hover:border-(--color-accent-blue)/50 transition-colors group">
              <h3 className="text-2xl font-bold text-(--color-text-primary) mb-4">Projects Dashboard</h3>
              <p className="text-(--color-text-secondary) text-sm mb-8">View and track/access a list of all projects within your team in real-time.</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-[#12141b] border border-(--color-border-primary)">
                  <FolderOpen size={24} className="text-(--color-text-muted) mb-3" />
                  <p className="text-(--color-text-light) text-sm font-medium">Project Alpha</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <span className="text-xs text-(--color-text-muted)">In Progress</span>
                  </div>
                </div>
                <div className="p-5 rounded-xl bg-[#12141b] border border-(--color-border-primary)">
                  <FolderOpen size={24} className="text-(--color-text-muted) mb-3" />
                  <p className="text-(--color-text-light) text-sm font-medium">Team Project</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-xs text-(--color-text-muted)">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* My Teams Section */}
        <section className="px-8 md:px-12 py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-(--color-text-primary) mb-4">My Teams</h2>
            <p className="text-(--color-text-secondary) mb-10 max-w-2xl">Manage and collaborate with your team members on &quot;My Teams&quot; page.</p>
            <div className="p-12 rounded-2xl bg-(--color-card-bg) border border-(--color-border-primary) flex items-center justify-center">
              <div className="h-48 w-full max-w-md flex items-center justify-center rounded-xl bg-[#12141b] border border-(--color-border-primary)">
                <Users size={64} className="text-(--color-text-muted)" />
              </div>
            </div>
          </div>
        </section>

        {/* Q&A Section */}
        <section className="px-8 md:px-12 py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-(--color-text-primary) text-center mb-16">Q&A</h2>
            <div className="space-y-10">
              <div className="bg-(--color-card-bg) p-8 rounded-xl border border-(--color-border-primary)">
                <h3 className="text-xl font-bold text-(--color-text-primary) mb-3">Q1. What exactly is SIMVEX and who is it for?</h3>
                <p className="text-(--color-text-secondary) leading-relaxed">
                  SIMVEX is a powerful 3D collaboration platform designed for small teams and designers, ideal for SV-optimized complex 3D model file format development.
                </p>
              </div>
              <div className="bg-(--color-card-bg) p-8 rounded-xl border border-(--color-border-primary)">
                <h3 className="text-xl font-bold text-(--color-text-primary) mb-3">Q2. Can multiple team members review a 3D model simultaneously?</h3>
                <p className="text-(--color-text-secondary) leading-relaxed">
                  Yes, SIMVEX supports real-time synchronization, allowing all team members to view, rotate, and leave comments on the same 3D model in a shared workspace.
                </p>
              </div>
              <div className="bg-(--color-card-bg) p-8 rounded-xl border border-(--color-border-primary)">
                <h3 className="text-xl font-bold text-(--color-text-primary) mb-3">Q3. How does the AI Assistant help with the 3D learning process?</h3>
                <p className="text-(--color-text-secondary) leading-relaxed">
                  Our AI Coach analyzes 3D workflows in real-time to provide instant suggestions, suggest design improvements, and provide instant answers to technical questions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-8 md:px-12 py-20">
          <div className="max-w-4xl mx-auto text-center bg-linear-to-b from-(--color-card-bg) to-transparent p-12 rounded-3xl border border-(--color-border-primary)">
            <h2 className="text-4xl font-bold text-(--color-text-primary) mb-8">Start with SIMVEX today</h2>
            <Link href="/register">
              <Button size="lg" className="px-10 text-lg">
                Get started for free
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-8 md:px-12 py-8 border-t border-(--color-border-primary) mt-12">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-(--color-text-muted) text-sm">© 2024 SIMVEX. All rights reserved.</p>
            <div className="flex gap-8">
              <Link href="#" className="text-(--color-text-muted) text-sm hover:text-(--color-text-primary) transition-colors">Terms of Use</Link>
              <Link href="#" className="text-(--color-text-muted) text-sm hover:text-(--color-text-primary) transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
