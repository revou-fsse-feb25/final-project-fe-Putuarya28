import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { fetchWithAuth } from "@/lib/fetchWithAuth";

export default function BookingForm() {
  const router = useRouter();
  // const { data: session } = useSession();
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    date: "",
    time: "",
    serviceType: "online",
    measurementType: "manual",
    size: "",
    bust: "",
    waist: "",
    hip: "",
    shoulder: "",
    sleeve: "",
    kebayaLength: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/available-dates`
    )
      .then((res) => res.json())
      .then((data: { date: string }[]) =>
        setAvailableDates(data.map((d) => d.date.slice(0, 10)))
      );
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetchWithAuth(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
        }/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Booking failed.");
      }
      setSubmitted(true);
      setRedirecting(true);
      setTimeout(() => {
        router.replace("/dashboard-user");
      }, 2000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Something went wrong. Please try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Book an Appointment
      </h2>
      {error && (
        <div className="text-red-600 text-center font-semibold mb-4">
          {error}
        </div>
      )}
      {submitted ? (
        <div className="text-green-600 text-center font-semibold">
          Thank you! Your appointment has been booked.
          <br />
          {redirecting && (
            <span className="text-gray-700 block mt-2">
              You will be redirected to your dashboard...
            </span>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium" htmlFor="name">
              Name
            </label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2"
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium" htmlFor="email">
              Email
            </label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2"
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium" htmlFor="whatsapp">
              Whatsapp
            </label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2"
              type="text"
              id="whatsapp"
              name="whatsapp"
              value={form.whatsapp}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium" htmlFor="serviceType">
              Service Type
            </label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2"
              id="serviceType"
              name="serviceType"
              value={form.serviceType}
              onChange={handleChange}
              required
            >
              <option value="online">Full Online Services</option>
              <option value="store">Store Visit</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium" htmlFor="date">
              Date
            </label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2"
              id="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            >
              <option value="">Select a date</option>
              {availableDates.map((date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium" htmlFor="time">
              Time
            </label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2"
              type="time"
              id="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium" htmlFor="measurementType">
              Measurement Option
            </label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2"
              id="measurementType"
              name="measurementType"
              value={form.measurementType}
              onChange={handleChange}
              required
            >
              <option value="manual">Manual Measurement (recommended)</option>
              <option value="size">Choose Size</option>
            </select>
          </div>
          {form.measurementType === "size" && (
            <div>
              <label className="block mb-1 font-medium" htmlFor="size">
                Size
              </label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2"
                id="size"
                name="size"
                value={form.size}
                onChange={handleChange}
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
          {form.measurementType === "manual" && (
            <>
              <div>
                <label className="block mb-1 font-medium" htmlFor="bust">
                  Bust (cm)
                </label>
                <input
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  type="number"
                  id="bust"
                  name="bust"
                  value={form.bust}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium" htmlFor="waist">
                  Waist (cm)
                </label>
                <input
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  type="number"
                  id="waist"
                  name="waist"
                  value={form.waist}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium" htmlFor="hip">
                  Hip (cm)
                </label>
                <input
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  type="number"
                  id="hip"
                  name="hip"
                  value={form.hip}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium" htmlFor="shoulder">
                  Shoulder Width (cm)
                </label>
                <input
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  type="number"
                  id="shoulder"
                  name="shoulder"
                  value={form.shoulder}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium" htmlFor="sleeve">
                  Sleeve Length (cm)
                </label>
                <input
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  type="number"
                  id="sleeve"
                  name="sleeve"
                  value={form.sleeve}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label
                  className="block mb-1 font-medium"
                  htmlFor="kebayaLength"
                >
                  Kebaya Length (cm)
                </label>
                <input
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  type="number"
                  id="kebayaLength"
                  name="kebayaLength"
                  value={form.kebayaLength}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="block mb-1 font-medium" htmlFor="notes">
              Notes (optional)
            </label>
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2"
              name="notes"
              rows={3}
              value={form.notes}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition"
          >
            Book Appointment
          </button>
        </form>
      )}
    </div>
  );
}
