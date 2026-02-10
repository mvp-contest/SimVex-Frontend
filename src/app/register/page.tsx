"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/api";
import { useAuth } from "@/app/context/AuthContext";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import { User, Mail, Lock, Eye, EyeOff, Check } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!agreed) {
      setError("You must agree to the terms");
      return;
    }

    setLoading(true);
    try {
      const res = await auth.register({
        personalId: email.split("@")[0],
        email,
        password,
        nickname,
      });
      
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
      console.error("Register error:", err);
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-(--color-page-bg)">
      <div className="w-full max-w-[500px] bg-(--color-card-bg) border border-(--color-card-border) rounded-2xl p-8 sm:p-12 shadow-xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-(--color-text-primary) mb-2">
            Create Account
          </h1>
          <p className="text-(--color-text-secondary)">
            Join us and start creating
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-(--color-status-danger-bg) border border-(--color-status-danger-border) rounded-md text-(--color-status-danger) text-sm text-center">
              {error}
            </div>
          )}

          {}
          <div className="relative">
            <div className="absolute left-3 top-[38px] -translate-y-1/2 text-(--color-text-muted) z-10">
              <User size={20} />
            </div>
            <TextInput
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              className="pl-10"
            />
          </div>

          {}
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

          {}
          <div className="relative">
            <div className="absolute left-3 top-[38px] -translate-y-1/2 text-(--color-text-muted) z-10">
              <Lock size={20} />
            </div>
            <TextInput
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
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

          {}
          <div className="relative">
            <div className="absolute left-3 top-[38px] -translate-y-1/2 text-(--color-text-muted) z-10">
              <Lock size={20} />
            </div>
            <TextInput
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="pl-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-[38px] -translate-y-1/2 text-(--color-text-muted) hover:text-(--color-text-primary) transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                agreed 
                  ? "bg-(--color-accent-blue) border-(--color-accent-blue) text-white" 
                  : "bg-(--color-input-bg) border-(--color-input-border) text-transparent hover:border-(--color-text-muted)"
              }`}
              onClick={() => setAgreed(!agreed)}
            >
              <Check size={14} strokeWidth={3} />
            </button>
            <span className="text-sm text-(--color-text-muted)">
              I agree to the{" "}
              <Link href="/terms" className="text-(--color-accent-blue) hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-(--color-accent-blue) hover:underline">
                Privacy Policy
              </Link>
            </span>
          </div>

          {}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-base"
            >
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </div>

          {}
          <div className="text-center pt-2">
            <span className="text-sm text-(--color-text-muted)">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-(--color-accent-blue) hover:underline font-medium"
              >
                Log In
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
