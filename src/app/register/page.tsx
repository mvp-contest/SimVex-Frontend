"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/api";
import { useAuth } from "@/app/context/AuthContext";

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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div
        className="w-full max-w-[678px] rounded-[14px] p-12"
        style={{
          backgroundColor: "var(--card-bg)",
          border: "3px solid var(--card-border)",
        }}
      >
        <h1 className="text-[28px] font-normal text-white text-center mb-12">
          Create Your Account
        </h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          {/* Full Name */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Image
                src="/icons/auth/user.svg"
                alt="User"
                width={20}
                height={20}
              />
            </div>
            <input
              type="text"
              placeholder="Full Name"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              className="w-full h-[58px] rounded-md pl-12 pr-4 text-[15px] outline-none"
              style={{
                backgroundColor: "var(--input-bg)",
                border: "2px solid var(--input-border)",
                color: "var(--text-muted)",
              }}
            />
          </div>

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

          {/* Confirm Password */}
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
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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

          {/* Terms Checkbox */}
          <div className="flex items-center gap-3 py-4">
            <div
              className="w-6 h-6 rounded flex items-center justify-center cursor-pointer"
              style={{
                backgroundColor: "var(--input-bg)",
                border: "2px solid var(--input-border)",
              }}
              onClick={() => setAgreed(!agreed)}
            >
              {agreed && (
                <Image
                  src="/icons/action/checkmark.svg"
                  alt="Checked"
                  width={14}
                  height={14}
                />
              )}
            </div>
            <span
              style={{ color: "var(--text-muted)" }}
              className="text-[14px]"
            >
              I agree to the{" "}
              <Link href="/terms" style={{ color: "var(--text-light)" }}>
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" style={{ color: "var(--text-light)" }}>
                Privacy Policy
              </Link>
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[64px] rounded-md text-[18px] font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{
              backgroundColor: "var(--button-bg)",
              color: "var(--button-text)",
            }}
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          {/* Login Link */}
          <div className="text-center pt-6">
            <span
              style={{ color: "var(--text-light)" }}
              className="text-[14px]"
            >
              Already have an account?{" "}
              <Link
                href="/login"
                style={{ color: "var(--text-light)" }}
                className="underline"
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
