"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await register(formData.email, formData.username, formData.password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
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

          <h1 className="text-white text-4xl font-bold mb-2">Create account</h1>
          <p className="text-[#787878] text-lg mb-8">
            Sign up to start collaborating on 3D projects
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
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full bg-[#1E2127] border-2 border-[#333B45] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#64748B] transition"
                placeholder="Choose a username"
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
                placeholder="Create a password"
                required
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="w-full bg-[#1E2127] border-2 border-[#333B45] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#64748B] transition"
                placeholder="Confirm your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#64748B] hover:bg-[#526075] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </form>

          <p className="text-center text-[#787878] mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#64748B] hover:text-white transition"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-[#1E2127] items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-white text-4xl font-bold mb-4">
            Join the Community
          </h2>
          <p className="text-[#787878] text-lg">
            Collaborate with teams worldwide on 3D projects
          </p>
        </div>
      </div>
    </div>
  );
}
