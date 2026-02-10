"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import Image from "next/image";

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    profileImage: "",
  });
  const [security, setSecurity] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setProfile({
        username: user.username,
        email: user.email,
        profileImage: user.profileImage || "",
      });
      setProfileImage(user.profileImage || null);
    }
  }, [user]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChangeImage = () => {
    fileInputRef.current?.click();
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const updatedUser = await api.updateProfile(user.id, {
        username: profile.username,
        email: profile.email,
        profileImage: profileImage || undefined,
      });
      updateUser(updatedUser);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError("");
    setSuccess("");

    if (security.newPassword !== security.confirmPassword) {
      setError("New password and confirm password do not match!");
      return;
    }

    if (security.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await api.changePassword(user.id, {
        oldPassword: security.oldPassword,
        newPassword: security.newPassword,
      });
      setSuccess("Password changed successfully!");
      setSecurity({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-[#787878] text-lg">Manage your account settings</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg mb-6">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl">
        {/* Profile Photo Card */}
        <div className="bg-[#1E2127] border-2 border-[#333B45] rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">Profile Photo</h2>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          <div className="flex items-center gap-6 mb-6">
            {profileImage ? (
              <Image
                src={profileImage}
                alt="Profile"
                width={120}
                height={120}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-[120px] h-[120px] rounded-full bg-[#C5D0E1]" />
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleChangeImage}
              className="flex-1 bg-[#333B45] hover:bg-[#3f4854] text-white font-semibold py-3 rounded-lg transition"
            >
              Change Photo
            </button>
            <button
              onClick={handleRemoveImage}
              className="flex-1 border-2 border-red-500 text-red-500 hover:bg-red-500/10 font-semibold py-3 rounded-lg transition"
            >
              Remove Photo
            </button>
          </div>
        </div>

        {/* Profile Settings Card */}
        <div className="bg-[#1E2127] border-2 border-[#333B45] rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">Profile Settings</h2>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                value={profile.username}
                onChange={(e) =>
                  setProfile({ ...profile, username: e.target.value })
                }
                className="w-full bg-[#131620] border-2 border-[#333B45] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#64748B] transition"
                required
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                className="w-full bg-[#131620] border-2 border-[#333B45] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#64748B] transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#64748B] hover:bg-[#526075] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>

        {/* Security Card */}
        <div className="bg-[#1E2127] border-2 border-[#333B45] rounded-lg p-6 lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-6">Change Password</h2>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Old Password
              </label>
              <input
                type="password"
                value={security.oldPassword}
                onChange={(e) =>
                  setSecurity({ ...security, oldPassword: e.target.value })
                }
                className="w-full bg-[#131620] border-2 border-[#333B45] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#64748B] transition"
                required
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                New Password
              </label>
              <input
                type="password"
                value={security.newPassword}
                onChange={(e) =>
                  setSecurity({ ...security, newPassword: e.target.value })
                }
                className="w-full bg-[#131620] border-2 border-[#333B45] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#64748B] transition"
                required
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={security.confirmPassword}
                onChange={(e) =>
                  setSecurity({ ...security, confirmPassword: e.target.value })
                }
                className="w-full bg-[#131620] border-2 border-[#333B45] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#64748B] transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#64748B] hover:bg-[#526075] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
