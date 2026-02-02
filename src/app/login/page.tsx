"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

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

        <form className="space-y-5">
          {/* Email Address */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <EmailIcon />
            </div>
            <input
              type="email"
              placeholder="Email Address"
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
              <LockIcon />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
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
              <EyeOffIcon />
            </button>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full h-[64px] rounded-md text-[18px] font-medium transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "var(--button-bg)",
                color: "var(--button-text)",
              }}
            >
              Log In
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center pt-6">
            <span style={{ color: "var(--text-light)" }} className="text-[14px]">
              Don&apos;t have an account?{" "}
              <Link href="/register" style={{ color: "var(--text-light)" }} className="underline">
                Sign Up
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

function EmailIcon() {
  return (
    <svg
      width="26"
      height="20"
      viewBox="0 0 26 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 0C2.312 0 1.724 0.245 1.235 0.734C0.746 1.223 0.501 1.812 0.5 2.5V17.5C0.5 18.188 0.745 18.776 1.235 19.266C1.725 19.756 2.313 20.001 3 20H23C23.688 20 24.276 19.755 24.766 19.266C25.256 18.777 25.501 18.188 25.5 17.5V2.5C25.5 1.812 25.255 1.224 24.766 0.735C24.277 0.246 23.688 0.001 23 0H3ZM13 11.25L3 5V17.5H23V5L13 11.25ZM13 8.75L23 2.5H3L13 8.75ZM3 5V2.5V17.5V5Z"
        fill="#64748B"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="18"
      height="20"
      viewBox="0 0 18 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.5 7.778H2.25C1.653 7.778 1.081 8.012 0.659 8.429C0.237 8.845 0 9.411 0 10V17.778C0 18.367 0.237 18.932 0.659 19.349C1.081 19.766 1.653 20 2.25 20H15.75C16.347 20 16.919 19.766 17.341 19.349C17.763 18.932 18 18.367 18 17.778V10C18 9.411 17.763 8.845 17.341 8.429C16.919 8.012 16.347 7.778 15.75 7.778H13.5M4.5 7.778V4.444C4.5 3.266 4.974 2.135 5.818 1.302C6.662 0.468 7.807 0 9 0C10.193 0 11.338 0.468 12.182 1.302C13.026 2.135 13.5 3.266 13.5 4.444V7.778M4.5 7.778H13.5M9 12.222V15.556"
        stroke="#64748B"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="20"
      height="16"
      viewBox="0 0 20 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.73 1.073C9.15 1.024 9.58 1 10 1C14.66 1 18.4 3.903 20 8C19.61 8.997 19.09 9.935 18.44 10.788M4.52 2.519C2.48 3.764 0.9 5.693 0 8C1.6 12.097 5.34 15 10 15C11.93 15.01 13.83 14.484 15.48 13.48M7.88 5.88C7.6 6.159 7.38 6.489 7.23 6.853C7.08 7.217 7 7.608 7 8.002C7 8.396 7.08 8.786 7.23 9.15C7.38 9.514 7.6 9.844 7.88 10.123C8.16 10.402 8.49 10.623 8.85 10.773C9.22 10.924 9.61 11.002 10 11.002C10.4 11.002 10.79 10.924 11.15 10.773C11.51 10.623 11.84 10.402 12.12 10.123"
        stroke="#64748B"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 0L18 16"
        stroke="#64748B"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
