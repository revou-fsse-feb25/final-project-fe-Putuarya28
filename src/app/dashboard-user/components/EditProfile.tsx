"use client";

import React, { useEffect, useState } from "react";
import { updateUserProfile, fetchUserProfile } from "./api";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useUserProfile } from "./UserProfileContext";

export default function EditProfile() {
  const { data: session, status } = useSession();
  const { profile, refreshProfile, setProfile } = useUserProfile() as {
    profile: import("./UserProfileContext").UserProfile | null;
    refreshProfile: () => Promise<void>;
    setProfile: React.Dispatch<
      React.SetStateAction<import("./UserProfileContext").UserProfile | null>
    >;
  };
  const [name, setName] = useState<string>(profile?.name ?? "");
  const [profilePic, setProfilePic] = useState<string>(
    profile?.profilePic ?? ""
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Sync local state with context profile when it changes
  useEffect(() => {
    if (profile) {
      setName(profile.name ?? "");
      setProfilePic(profile.profilePic ?? "");
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      setError("No user ID in session");
      setLoading(false);
      return;
    }
    if (!profile) {
      fetchUserProfile(session)
        .then((data) => {
          setName(data.name ?? "");
          setProfilePic(data.profilePic ?? "");
          setProfile({
            name: data.name ?? "",
            email: data.email ?? "",
            profilePic: data.profilePic ?? "",
          });
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to load profile");
          setLoading(false);
        });
    }
    // eslint-disable-next-line
  }, [session, status]);

  // Store the file to upload in state
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  // For previewing before upload
  const [previewPic, setPreviewPic] = useState<string>("");
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileToUpload(file);
    setPreviewPic(URL.createObjectURL(file)); // preview only
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    let uploadedProfilePic = profilePic;
    try {
      if (!session) throw new Error("No user ID in session");
      // If a new file is selected, upload it first
      if (fileToUpload) {
        const formData = new FormData();
        formData.append("file", fileToUpload);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error("Failed to upload image");
        const data = await res.json();
        uploadedProfilePic = data.url;
        setProfilePic(uploadedProfilePic); // set to real URL after upload
        setPreviewPic(""); // clear preview
      }
      await updateUserProfile({ name, profilePic: uploadedProfilePic });
      setSuccess("Profile updated!");
      setProfile((prev) =>
        prev ? { ...prev, name, profilePic: uploadedProfilePic } : prev
      );
      await refreshProfile();
      setFileToUpload(null);
    } catch {
      setError("Failed to update profile");
    }
    setSaving(false);
    setTimeout(() => setSuccess(""), 2000);
  }

  if (loading) return <div>Loading...</div>;

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
      <form
        className="bg-white rounded shadow p-4 max-w-md"
        onSubmit={handleSubmit}
      >
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <div className="mb-4">
          <label className="block font-semibold mb-1">Name</label>
          <input
            type="text"
            value={name ?? ""}
            onChange={(e) => setName(e.target.value)}
            className="border px-3 py-2 rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="border px-3 py-2 rounded w-full cursor-pointer"
          />
          {(previewPic || profilePic) && (
            <Image
              src={previewPic || profilePic}
              alt="Profile"
              width={80}
              height={80}
              style={{ width: 80, height: 80, objectFit: "cover" }}
              className="mt-2 rounded-full"
            />
          )}
        </div>
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </section>
  );
}
