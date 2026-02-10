"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#14171C]">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-12">
            <div className="relative w-12 h-12">
              <Image
                src="/SIMVEX_logo_2.svg"
                alt="SIMVEX"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-white text-3xl font-bold">SIMVEX</span>
          </div>

          <h1 className="text-white text-4xl font-bold mb-2">Welcome back</h1>
          <p className="text-[#787878] text-lg mb-8">
            Sign in to your account to continue
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full bg-[#1E2127] border-2 border-[#333B45] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#64748B] transition"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full bg-[#1E2127] border-2 border-[#333B45] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#64748B] transition"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#64748B] hover:bg-[#526075] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-center text-[#787878] mt-6">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-[#64748B] hover:text-white transition"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-[#1E2127] items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-white text-4xl font-bold mb-4">
            Collaborative 3D Design
          </h2>
          <p className="text-[#787878] text-lg">
            Work together in real-time on 3D projects
          </p>
        </div>
      </div>
    </div>
  );
}
