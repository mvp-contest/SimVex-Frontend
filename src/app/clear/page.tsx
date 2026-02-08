"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ClearPage() {
  const router = useRouter();

  useEffect(() => {
    // localStorage 완전 초기화
    localStorage.clear();
    console.log("localStorage cleared completely");
    
    // 3초 후 로그인 페이지로 리다이렉트
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-4">
          Clearing Data...
        </h1>
        <p className="text-slate-400 mb-4">
          Resetting your session data.
        </p>
        <p className="text-slate-500 text-sm">
          Redirecting to login page...
        </p>
      </div>
    </div>
  );
}
