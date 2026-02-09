"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { profile as profileApi } from "@/lib/api";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import TextArea from "@/components/ui/TextArea";

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
        <p className="text-(--color-text-muted)">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto p-6 md:p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-(--color-text-primary) mb-2">
          Settings
        </h2>
        <p className="text-(--color-text-secondary)">
          Manage your account settings and preferences.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-(--color-status-danger-bg) border border-(--color-status-danger-border) rounded-md">
          <p className="text-(--color-status-danger) text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-900/20 border border-green-500 rounded-md">
          <p className="text-green-400 text-sm">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Section */}
        <div className="lg:col-span-2 bg-(--color-card-bg) border border-(--color-border-primary) rounded-xl p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-(--color-text-primary) mb-6">
            Profile Information
          </h3>

          {/* Avatar */}
          <div className="mb-8">
            <label className="text-sm font-medium text-(--color-text-secondary) block mb-3">
              Profile Picture
            </label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-medium bg-(--color-border-primary) text-(--color-text-muted)">
                {nickname?.charAt(0).toUpperCase() || "U"}
              </div>
              <Button variant="secondary" size="sm">
                Change Avatar
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <TextInput
              label="Nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Enter your nickname"
            />

            <div className="space-y-1.5">
              <TextInput
                label="Email"
                type="email"
                value={user?.email || ""}
                disabled
                className="cursor-not-allowed opacity-60"
              />
              <p className="text-xs text-(--color-text-muted)">
                Email cannot be changed
              </p>
            </div>

            <TextArea
              label="About"
              value={aboutUs}
              onChange={(e) => setAboutUs(e.target.value)}
              rows={4}
              placeholder="Tell us about yourself..."
            />

            <div className="pt-4">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="min-w-[120px]"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>

        {/* Account Info Sidebar */}
        <div className="bg-(--color-card-bg) border border-(--color-border-primary) rounded-xl p-6 h-fit">
          <h3 className="text-base font-semibold text-(--color-text-primary) mb-4">
            Account Information
          </h3>

          <div className="space-y-4">
            <div>
              <p className="text-xs text-(--color-text-muted) mb-1">Personal ID</p>
              <p className="text-sm font-medium text-(--color-text-primary)">
                {user?.personalId}
              </p>
            </div>

            <div>
              <p className="text-xs text-(--color-text-muted) mb-1">User ID</p>
              <p className="text-xs font-mono text-(--color-text-secondary) break-all bg-(--color-input-bg) p-2 rounded border border-(--color-input-border)">
                {user?.id}
              </p>
            </div>

            <div className="pt-4 mt-2 border-t border-(--color-border-primary)">
              <h4 className="text-sm font-medium text-(--color-text-primary) mb-2">
                Danger Zone
              </h4>
              <p className="text-xs text-(--color-text-muted) mb-3">
                Permanently delete your account and all associated data.
              </p>
              <Button variant="danger" size="sm" className="w-full">
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
