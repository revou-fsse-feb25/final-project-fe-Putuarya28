"use client";
import React, { useState } from "react";

const designCategories = [
  { key: "kartini", label: "Kartini" },
  { key: "balloon", label: "Balloon" },
  { key: "sabrina", label: "Sabrina" },
  { key: "brides", label: "Brides" },
  { key: "modern-elegant", label: "Modern Elegant" },
];

const BACKEND_URL = "http://localhost:3000/api";

const DesignPage = () => {
  const [activeCategory, setActiveCategory] = useState(designCategories[0].key);
  const [images, setImages] = useState<{ id: number; imageUrl: string }[]>([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    setLoading(true);
    fetch(`${BACKEND_URL}/design-images?label=${activeCategory}`)
      .then((res) => res.json())
      .then((data) => setImages(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Design Ideas</h1>

      {/* Navigation */}
      <div className="flex justify-center mb-8 gap-4">
        {designCategories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-4 py-2 rounded-full font-semibold transition ${
              activeCategory === cat.key
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-blue-100"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Designs Grid */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {images.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">
              No images found for this category.
            </div>
          ) : (
            images.map((img, idx) => (
              <div
                key={img.id}
                className="bg-white rounded-xl shadow flex flex-col overflow-hidden"
              >
                <div className="w-full h-180 bg-gray-100 flex items-center justify-center">
                  <img
                    src={img.imageUrl}
                    alt={`Design ${idx + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
};

export default DesignPage;
