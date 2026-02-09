"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/api";
import { useAuth } from "@/app/context/AuthContext";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center p-4 bg-(--color-page-bg)">
      <div className="w-full max-w-[500px] bg-(--color-card-bg) border border-(--color-card-border) rounded-2xl p-8 sm:p-12 shadow-xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-(--color-text-primary) mb-2">
            Welcome Back
          </h1>
          <p className="text-(--color-text-secondary)">
            Please sign in to continue
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-(--color-status-danger-bg) border border-(--color-status-danger-border) rounded-md text-(--color-status-danger) text-sm text-center">
              {error}
            </div>
          )}

          {/* Email Address */}
          <div className="relative">
            <div className="absolute left-3 top-[38px] -translate-y-1/2 text-(--color-text-muted) z-10">
              <Mail size={20} />
            </div>
            <TextInput
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <div className="absolute left-3 top-[38px] -translate-y-1/2 text-(--color-text-muted) z-10">
              <Lock size={20} />
            </div>
            <TextInput
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] -translate-y-1/2 text-(--color-text-muted) hover:text-(--color-text-primary) transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-base"
            >
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center pt-2">
            <span className="text-sm text-(--color-text-muted)">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-(--color-accent-blue) hover:underline font-medium"
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
