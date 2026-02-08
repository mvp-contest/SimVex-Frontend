"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/api";
import { useAuth } from "@/app/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await auth.login({ email, password });
      
      const userData = {
        id: res.id,
        email: res.email,
        nickname: res.profile.nickname,
        personalId: res.personalId,
      };
      
      const token = `user-${res.id}`;
      login(token, userData);
      router.push("/dashboard/teams");
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div
        className="w-full max-w-[678px] rounded-[14px] p-12"
        style={{
          backgroundColor: "var(--card-bg)",
          border: "3px solid var(--card-border)",
        }}
      >
        <h1 className="text-[28px] font-normal text-white text-center mb-12">
          Welcome Back
        </h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          {/* Email Address */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Image
                src="/icons/auth/email.svg"
                alt="Email"
                width={20}
                height={16}
              />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-[58px] rounded-md pl-12 pr-4 text-[15px] outline-none"
              style={{
                backgroundColor: "var(--input-bg)",
                border: "2px solid var(--input-border)",
                color: "var(--text-muted)",
              }}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Image
                src="/icons/auth/lock.svg"
                alt="Lock"
                width={18}
                height={20}
              />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-[58px] rounded-md pl-12 pr-12 text-[15px] outline-none"
              style={{
                backgroundColor: "var(--input-bg)",
                border: "2px solid var(--input-border)",
                color: "var(--text-muted)",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <Image
                src="/icons/auth/eye-off.svg"
                alt="Toggle password"
                width={20}
                height={16}
              />
            </button>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[64px] rounded-md text-[18px] font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{
                backgroundColor: "var(--button-bg)",
                color: "var(--button-text)",
              }}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center pt-6">
            <span
              style={{ color: "var(--text-light)" }}
              className="text-[14px]"
            >
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                style={{ color: "var(--text-light)" }}
                className="underline"
              >
                Sign Up
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
