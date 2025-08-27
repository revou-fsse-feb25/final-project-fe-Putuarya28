import React, { useState, useEffect } from "react";
import Image from "next/image";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

type DesignImage = {
  id: number;
  imageUrl: string;
};

const BACKEND_URL = "http://localhost:3000/api"; // Change to your backend port

export default function AdminDesignIdeas() {
  const [images, setImages] = useState<DesignImage[]>([]);
  const [label, setLabel] = useState("kartini");
  const [file, setFile] = useState<File | null>(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    fetchWithAuth(`${BACKEND_URL}/design-images?label=${label}`)
      .then((res) => res.json())
      .then((data) => setImages(Array.isArray(data) ? data : []));
  }, [label]);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setFeedback("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("label", label);
    const res = await fetchWithAuth(`${BACKEND_URL}/design-images`, {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      setFile(null);
      setImages(await res.json());
      setFeedback("Image uploaded!");
      setTimeout(() => setFeedback(""), 2000);
    } else {
      setFeedback("Failed to upload image.");
      setTimeout(() => setFeedback(""), 2000);
    }
  }

  async function handleDelete(id: number) {
    setFeedback("");
    const res = await fetchWithAuth(`${BACKEND_URL}/design-images/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setImages(images.filter((img) => img.id !== id));
      setFeedback("Image deleted!");
      setTimeout(() => setFeedback(""), 2000);
    } else {
      setFeedback("Failed to delete image.");
      setTimeout(() => setFeedback(""), 2000);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-8">
      <h2 className="text-2xl font-bold mb-6">Manage Design Images</h2>
      {feedback && (
        <div className="mb-4 text-center text-green-600 font-medium">
          {feedback}
        </div>
      )}
      <div className="flex gap-4 mb-6 items-center">
        <label className="font-semibold">Category:</label>
        <select
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="kartini">Kartini</option>
          <option value="sabrina">Sabrina</option>
          <option value="balloon">Balloon</option>
          <option value="brides">Brides</option>
          <option value="modern-elegant">Modern Elegant</option>

          {/* Add more labels */}
        </select>
      </div>
      <form onSubmit={handleUpload} className="flex gap-4 mb-8 items-center">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="border px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded transition"
        >
          Upload
        </button>
      </form>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {images.map((img) => (
          <div
            key={img.id}
            className="bg-gray-100 rounded-lg p-3 flex flex-col items-center shadow"
          >
            <Image
              src={img.imageUrl}
              width={120}
              height={120}
              alt={`Design image ${img.id}`}
              className="rounded mb-2 object-cover"
            />
            <button
              onClick={() => handleDelete(img.id)}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
