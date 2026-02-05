"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

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

        <form className="space-y-5">
          {/* Full Name */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <UserIcon />
            </div>
            <input
              type="text"
              placeholder="Full Name"
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

          {/* Confirm Password */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <LockIcon />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
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
              <EyeOffIcon />
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
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                    stroke="#F8FAFC"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <span style={{ color: "var(--text-muted)" }} className="text-[14px]">
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
            className="w-full h-[64px] rounded-md text-[18px] font-medium transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "var(--button-bg)",
              color: "var(--button-text)",
            }}
          >
            Create Account
          </button>

          {/* Login Link */}
          <div className="text-center pt-6">
            <span style={{ color: "var(--text-light)" }} className="text-[14px]">
              Already have an account?{" "}
              <Link href="/login" style={{ color: "var(--text-light)" }} className="underline">
                Log In
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

function UserIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.831 11.605C16.309 12.302 17.568 13.389 18.475 14.747C19.382 16.106 19.902 17.686 19.979 19.318C19.99 19.467 19.97 19.617 19.921 19.759C19.873 19.901 19.797 20.032 19.697 20.143C19.597 20.255 19.476 20.346 19.341 20.411C19.206 20.475 19.059 20.512 18.91 20.519C18.76 20.526 18.61 20.503 18.47 20.451C18.329 20.4 18.2 20.321 18.09 20.219C17.981 20.116 17.893 19.994 17.831 19.857C17.77 19.72 17.736 19.573 17.732 19.423C17.651 17.69 16.904 16.055 15.649 14.857C14.393 13.659 12.725 12.991 10.99 12.991C9.255 12.991 7.586 13.659 6.331 14.857C5.075 16.055 4.329 17.69 4.247 19.423C4.227 19.716 4.093 19.99 3.873 20.186C3.654 20.381 3.366 20.483 3.072 20.469C2.779 20.456 2.502 20.327 2.302 20.112C2.101 19.897 1.993 19.612 2 19.318C2.077 17.686 2.597 16.106 3.504 14.748C4.41 13.389 5.67 12.302 7.147 11.605C6.2 10.815 5.52 9.754 5.198 8.564C4.877 7.374 4.929 6.114 5.349 4.955C5.769 3.796 6.536 2.795 7.545 2.087C8.554 1.38 9.757 1 10.989 1C12.222 1 13.424 1.38 14.433 2.087C15.442 2.795 16.209 3.796 16.629 4.955C17.049 6.114 17.101 7.374 16.78 8.564C16.458 9.754 15.778 10.815 14.831 11.605ZM14.74 6.995C14.74 6.001 14.345 5.047 13.641 4.344C12.938 3.641 11.984 3.245 10.99 3.245C9.995 3.245 9.041 3.641 8.338 4.344C7.635 5.047 7.24 6.001 7.24 6.995C7.24 7.99 7.635 8.944 8.338 9.647C9.041 10.35 9.995 10.745 10.99 10.745C11.984 10.745 12.938 10.35 13.641 9.647C14.345 8.944 14.74 7.99 14.74 6.995Z"
        fill="#64748B"
      />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg
      width="20"
      height="16"
      viewBox="0 0 20 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 0H2C0.9 0 0 0.9 0 2V14C0 15.1 0.9 16 2 16H18C19.1 16 20 15.1 20 14V2C20 0.9 19.1 0 18 0ZM18 4L10 9L2 4V2L10 7L18 2V4Z"
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
