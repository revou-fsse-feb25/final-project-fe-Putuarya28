import React, { useState } from "react";
// import { useSession } from "next-auth/react"; // Removed unused import to fix lint error
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import Image from "next/image";

export type OrderDetails = {
  name: string;
  whatsapp: string;
  design: string;
  bust: string;
  waist: string;
  hips: string;
  shoulder: string;
  sleeve: string;
  length: string;
  size: string;
  notes?: string;
  measurementType?: string;
};

interface Props {
  bookingId: number;
  initialDetails?: Partial<OrderDetails>;
  onSuccess?: () => void;
}

export default function OrderDetailsForm({
  bookingId,
  initialDetails = {},
  onSuccess,
}: Props & { status?: string; currentTrackingCode?: string }) {
  // const { data: session } = useSession(); // Removed unused variable to fix lint error
  const [measurementType, setMeasurementType] = useState<string>(
    initialDetails.measurementType || "manual"
  );
  const [details, setDetails] = useState<OrderDetails>({
    name: initialDetails.name || "",
    whatsapp: initialDetails.whatsapp || "",
    design: initialDetails.design || "",
    bust: initialDetails.bust || "",
    waist: initialDetails.waist || "",
    hips: initialDetails.hips || "",
    shoulder: initialDetails.shoulder || "",
    sleeve: initialDetails.sleeve || "",
    length: initialDetails.length || "",
    size: initialDetails.size || "",
    notes: initialDetails.notes || "",
  });
  // Update form if initialDetails changes (e.g. after resend)
  React.useEffect(() => {
    setDetails({
      name: initialDetails.name || "",
      whatsapp: initialDetails.whatsapp || "",
      design: initialDetails.design || "",
      bust: initialDetails.bust || "",
      waist: initialDetails.waist || "",
      hips: initialDetails.hips || "",
      shoulder: initialDetails.shoulder || "",
      sleeve: initialDetails.sleeve || "",
      length: initialDetails.length || "",
      size: initialDetails.size || "",
      notes: initialDetails.notes || "",
    });
    setMeasurementType(initialDetails.measurementType || "manual");
  }, [
    initialDetails.name,
    initialDetails.whatsapp,
    initialDetails.design,
    initialDetails.bust,
    initialDetails.waist,
    initialDetails.hips,
    initialDetails.shoulder,
    initialDetails.sleeve,
    initialDetails.length,
    initialDetails.size,
    initialDetails.notes,
    initialDetails.measurementType,
  ]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    setUploadError("");
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.match(/^image\/(jpeg|png|jpg)$/)) {
      setUploadError("Only JPG, JPEG, PNG files are allowed.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setUploadError("Max file size is 2MB.");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetchWithAuth(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/uploads/design-image`,
      {
        method: "POST",
        body: formData,
      }
    );
    setUploading(false);
    if (res.ok) {
      const data = await res.json();
      setImageUrl(data.url);
      setFeedback("Image uploaded!");
      setTimeout(() => setFeedback(""), 2000);
    } else {
      setUploadError("Failed to upload image.");
    }
  }

  function handleRemoveImage() {
    setImageUrl("");
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setDetails({ ...details, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setFeedback("");
    // Only send relevant fields for the selected measurement type
    let orderDetails: any = {
      name: details.name,
      whatsapp: details.whatsapp,
      design: details.design,
      notes: details.notes,
      measurementType,
      imageUrl,
    };
    if (measurementType === "manual") {
      orderDetails = {
        ...orderDetails,
        bust: details.bust,
        waist: details.waist,
        hips: details.hips,
        shoulder: details.shoulder,
        sleeve: details.sleeve,
        length: details.length,
      };
    } else if (measurementType === "size") {
      orderDetails = {
        ...orderDetails,
        size: details.size,
      };
    }
    // Remove empty fields
    Object.keys(orderDetails).forEach(
      (key) =>
        (orderDetails[key] === "" || orderDetails[key] === undefined) &&
        delete orderDetails[key]
    );
    const res = await fetchWithAuth(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/bookings/${bookingId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderDetails }),
      }
    );
    setLoading(false);
    if (res.ok) {
      setFeedback("OrderDetails details sent!");
      if (onSuccess) onSuccess();
    } else {
      setFeedback("Failed to send Order details.");
    }
    setTimeout(() => setFeedback(""), 2000);
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl shadow"
      >
        <h3 className="text-lg font-bold mb-2">Order Details</h3>
        {feedback && (
          <div className="text-green-600 font-medium mb-2">{feedback}</div>
        )}
        <div className="mb-4">
          <label className="font-semibold mr-4">Measurement Type:</label>
          <label className="mr-4">
            <input
              type="radio"
              name="measurementType"
              value="manual"
              checked={measurementType === "manual"}
              onChange={() => setMeasurementType("manual")}
            />{" "}
            Manual Measurement
          </label>
          <label>
            <input
              type="radio"
              name="measurementType"
              value="size"
              checked={measurementType === "size"}
              onChange={() => setMeasurementType("size")}
            />{" "}
            Size
          </label>
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">
            Upload Design Image:
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            onChange={handleImageUpload}
            disabled={uploading}
          />
          <div className="text-xs text-gray-500 mt-1">
            Accepted: JPG, JPEG, PNG. Max size: 2MB.
          </div>
          {uploading && (
            <div className="text-purple-600 mt-2">Uploading...</div>
          )}
          {uploadError && (
            <div className="text-red-600 mt-2">{uploadError}</div>
          )}
          {imageUrl && (
            <div className="mt-2 flex items-center gap-4">
              <Image
                src={imageUrl}
                alt="Design"
                width={200}
                height={200}
                className="rounded border object-contain cursor-pointer"
              />
              <button
                type="button"
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={handleRemoveImage}
              >
                Remove
              </button>
            </div>
          )}
        </div>
        {measurementType === "manual" ? (
          <>
            <div>
              <label className="block font-semibold mb-1" htmlFor="bust">
                Bust:
              </label>
              <input
                type="text"
                name="bust"
                id="bust"
                value={details.bust}
                onChange={handleChange}
                className="border px-3 py-2 rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1" htmlFor="waist">
                Waist:
              </label>
              <input
                type="text"
                name="waist"
                id="waist"
                value={details.waist}
                onChange={handleChange}
                className="border px-3 py-2 rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1" htmlFor="hips">
                Hips:
              </label>
              <input
                type="text"
                name="hips"
                id="hips"
                value={details.hips}
                onChange={handleChange}
                className="border px-3 py-2 rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1" htmlFor="shoulder">
                Shoulder:
              </label>
              <input
                type="text"
                name="shoulder"
                id="shoulder"
                value={details.shoulder}
                onChange={handleChange}
                className="border px-3 py-2 rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1" htmlFor="sleeve">
                Sleeve:
              </label>
              <input
                type="text"
                name="sleeve"
                id="sleeve"
                value={details.sleeve}
                onChange={handleChange}
                className="border px-3 py-2 rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1" htmlFor="length">
                Length:
              </label>
              <input
                type="text"
                name="length"
                id="length"
                value={details.length}
                onChange={handleChange}
                className="border px-3 py-2 rounded w-full"
                required
              />
            </div>
          </>
        ) : (
          <div>
            <label className="block font-semibold mb-1" htmlFor="size">
              Size:
            </label>
            <select
              name="size"
              id="size"
              value={details.size}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
              required
            >
              <option value="">Select size</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
          </div>
        )}
        <div>
          <label className="block font-semibold mb-1" htmlFor="name">
            Name:
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={details.name}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1" htmlFor="whatsapp">
            WhatsApp:
          </label>
          <input
            type="text"
            name="whatsapp"
            id="whatsapp"
            value={details.whatsapp}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1" htmlFor="design">
            Design:
          </label>
          <input
            type="text"
            name="design"
            id="design"
            value={details.design}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded transition"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Order Details"}
        </button>
      </form>
    </>
  );
}
