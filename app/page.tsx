"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-[#14171C] text-white">
      <nav className="w-full h-[88px] border-b-2 border-[#333B45] flex items-center justify-between px-8">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12">
            <Image
              src="/SIMVEX_logo_2.svg"
              alt="SIMVEX"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-3xl font-bold">SIMVEX</span>
        </div>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-6 py-2 text-lg font-semibold hover:text-[#64748B] transition"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-6 py-2 bg-[#64748B] hover:bg-[#526075] text-white font-semibold rounded-lg transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-6">
            Collaborative 3D Design Platform
          </h1>
          <p className="text-2xl text-[#787878] mb-12">
            Work together in real-time on 3D projects with your team
          </p>
          <div className="flex gap-6 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-[#64748B] hover:bg-[#526075] text-white text-xl font-semibold rounded-lg transition"
            >
              Start Creating
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 border-2 border-[#333B45] hover:border-[#64748B] text-white text-xl font-semibold rounded-lg transition"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-6xl mx-auto">
          <div className="bg-[#1E2127] border-2 border-[#333B45] rounded-lg p-8">
            <h3 className="text-2xl font-semibold mb-4">Real-time Collaboration</h3>
            <p className="text-[#787878]">
              Work together with your team on 3D models in real-time
            </p>
          </div>
          <div className="bg-[#1E2127] border-2 border-[#333B45] rounded-lg p-8">
            <h3 className="text-2xl font-semibold mb-4">Multiple Formats</h3>
            <p className="text-[#787878]">
              Support for GLTF, OBJ, STL and more 3D file formats
            </p>
          </div>
          <div className="bg-[#1E2127] border-2 border-[#333B45] rounded-lg p-8">
            <h3 className="text-2xl font-semibold mb-4">Team Management</h3>
            <p className="text-[#787878]">
              Organize projects and collaborate with team members
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
