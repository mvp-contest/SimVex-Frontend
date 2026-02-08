"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { profile as profileApi } from "@/lib/api";

export default function SettingsPage() {
  const { user } = useAuth();
  const [nickname, setNickname] = useState("");
  const [aboutUs, setAboutUs] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user?.id) {
      loadProfile();
    } else if (!user) {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const loadProfile = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await profileApi.get(user.id);
      setNickname(data.nickname || "");
      setAboutUs(data.aboutUs || "");
    } catch (err) {
      console.error("Failed to load profile:", err);
      // 프로필이 없으면 user 정보로 초기화
      setNickname(user.nickname || "");
      setAboutUs("");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;
    try {
      setSaving(true);
      setError("");
      setSuccess("");
      await profileApi.update(user.id, { nickname, aboutUs });
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-400">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <h2 className="font-semibold text-slate-200 text-xl leading-normal mb-1">
        Settings
      </h2>
      <p className="font-medium text-slate-500 text-sm leading-normal mb-8">
        Manage your account settings and preferences.
      </p>

      {error && (
        <div className="mb-4 p-4 bg-red-900/20 border border-red-500 rounded-md">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-900/20 border border-green-500 rounded-md">
          <p className="text-green-400 text-sm">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div
          className="lg:col-span-2 rounded-lg p-6"
          style={{
            backgroundColor: "#1e2127",
            border: "1px solid #333b45",
          }}
        >
          <h3 className="font-semibold text-slate-200 text-lg leading-normal mb-6">
            Profile Information
          </h3>

          {/* Avatar */}
          <div className="mb-6">
            <label className="font-medium text-slate-400 text-sm leading-normal block mb-3">
              Profile Picture
            </label>
            <div className="flex items-center gap-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-medium"
                style={{ backgroundColor: "#333b45", color: "#94a3b8" }}
              >
                {nickname?.charAt(0).toUpperCase() || "U"}
              </div>
              <button
                className="px-4 py-2 rounded-md text-sm font-medium transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: "#333b45",
                  color: "#e2e8f0",
                }}
              >
                Change Avatar
              </button>
            </div>
          </div>

          {/* Nickname */}
          <div className="mb-6">
            <label className="font-medium text-slate-400 text-sm leading-normal block mb-2">
              Nickname
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full h-10 rounded-md px-4 text-sm outline-none"
              style={{
                backgroundColor: "var(--input-bg)",
                border: "1px solid var(--input-border)",
                color: "var(--text-light)",
              }}
              placeholder="Enter your nickname"
            />
          </div>

          {/* Email (Read-only) */}
          <div className="mb-6">
            <label className="font-medium text-slate-400 text-sm leading-normal block mb-2">
              Email
            </label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full h-10 rounded-md px-4 text-sm outline-none opacity-60 cursor-not-allowed"
              style={{
                backgroundColor: "var(--input-bg)",
                border: "1px solid var(--input-border)",
                color: "var(--text-light)",
              }}
            />
            <p className="text-slate-500 text-xs mt-1">
              Email cannot be changed
            </p>
          </div>

          {/* About Us */}
          <div className="mb-6">
            <label className="font-medium text-slate-400 text-sm leading-normal block mb-2">
              About
            </label>
            <textarea
              value={aboutUs}
              onChange={(e) => setAboutUs(e.target.value)}
              rows={4}
              className="w-full rounded-md px-4 py-3 text-sm outline-none resize-none"
              style={{
                backgroundColor: "var(--input-bg)",
                border: "1px solid var(--input-border)",
                color: "var(--text-light)",
              }}
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 rounded-md text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{
              backgroundColor: "var(--accent-blue)",
              color: "#e2e8f0",
            }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Account Info Sidebar */}
        <div
          className="rounded-lg p-6"
          style={{
            backgroundColor: "#1e2127",
            border: "1px solid #333b45",
          }}
        >
          <h3 className="font-semibold text-slate-200 text-base leading-normal mb-4">
            Account Information
          </h3>

          <div className="space-y-4">
            <div>
              <p className="text-slate-500 text-xs mb-1">Personal ID</p>
              <p className="text-slate-200 text-sm font-medium">
                {user?.personalId}
              </p>
            </div>

            <div>
              <p className="text-slate-500 text-xs mb-1">User ID</p>
              <p className="text-slate-200 text-sm font-mono text-xs break-all">
                {user?.id}
              </p>
            </div>

            <div className="pt-4 border-t" style={{ borderColor: "#333b45" }}>
              <h4 className="font-semibold text-slate-200 text-sm mb-2">
                Danger Zone
              </h4>
              <p className="text-slate-500 text-xs mb-3">
                Permanently delete your account and all associated data.
              </p>
              <button
                className="w-full py-2 rounded-md text-xs font-medium transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: "#7f1d1d",
                  color: "#fca5a5",
                  border: "1px solid #991b1b",
                }}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
