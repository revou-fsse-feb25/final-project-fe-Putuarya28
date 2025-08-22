"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!email || !password || !confirm) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(
          "Registration successful! Please check your email to confirm your account before logging in."
        );
        setEmail("");
        setPassword("");
        setConfirm("");
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration error:", error); // Log the error
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen -mt-25">
      <Image
        src="/images/login-bg.jpg"
        alt="Register Background"
        width={1920}
        height={1080}
      />
      <div className="absolute  bg-[#fff5ddee] p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl text-[#8b6200] font-bold mb-6 text-center">
          Registration
        </h1>
        <form
          onSubmit={handleSubmit}
          className=" w-full max-w-sm items-center justify-center"
        >
          {error && (
            <div className="mb-4 text-red-600 text-center">{error}</div>
          )}
          {success && (
            <div className="mb-4 text-green-600 text-center">{success}</div>
          )}
          <div className="mb-4">
            <label
              className="block text-[#8b6200] text-sm font-bold mb-2"
              htmlFor="username"
            >
              Email
            </label>
            <input
              className="w-full px-3 py-2 border border-[#b37d00] rounded focus:outline-none focus:ring focus:ring-[#ffc446] text-black"
              id="username"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative mb-6">
            <label
              className="block text-[#8b6200] text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="w-full px-3 py-2 border border-[#b37d00] rounded focus:outline-none focus:ring focus:ring-[#ffc446] text-black"
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-10 text-[#8b6200] hover:text-[#c48900] focus:outline-none"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="relative mb-6">
            <label
              className="block text-[#8b6200] text-sm font-bold mb-2"
              htmlFor="confirm-password"
            >
              Confirm Password
            </label>
            <input
              className="w-full px-3 py-2 border border-[#b37d00] rounded focus:outline-none focus:ring focus:ring-[#ffc446] text-black"
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              placeholder="********"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-10 text-[#8b6200] hover:text-[#c48900] focus:outline-none"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="flex items-center justify-between mb-6">
            <a href="/login" className="text-sm text-[#b37d00] hover:underline">
              Have an account? Login
            </a>
          </div>

          <div className="flex flex-col items-center justify-between">
            <button
              className="w-full py-2 text-white font-semibold rounded bg-[#c48900] hover:bg-[#b37d00]"
              type="submit"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
