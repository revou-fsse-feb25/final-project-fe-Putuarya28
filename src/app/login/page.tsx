"use client";
import React, { useState, Suspense } from "react";
import { signIn, getSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function LoginPageInner() {
  const searchParams = useSearchParams();
  const redirect = searchParams?.get("redirect") || "/dashboard-admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setIsLoading(false);
    } else {
      const session = await getSession();
      // After successful login and session check
      if (session?.user?.role === "admin") {
        window.location.href = "/dashboard-admin";
      } else {
        window.location.href =
          redirect === "/dashboard-admin" ? "/" : redirect || "/";
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/login-bg.jpg"
          alt="Register Background"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>
      <div className="absolute bg-[#fff5ddee] p-8 rounded-lg shadow-md w-full max-w-md z-10">
        <h1 className="text-2xl text-[#8b6200] font-bold mb-6 text-center">
          Login
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm text-[#8b6200] font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-[#b37d00] rounded focus:outline-none focus:ring focus:ring-[#ffc446] text-black"
            />
          </div>
          <div className="relative mb-6">
            <label
              htmlFor="password"
              className="block text-sm text-[#8b6200] font-medium mb-2"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-[#b37d00] rounded focus:outline-none focus:ring focus:ring-[#ffd981da]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-9 text-[#8b6200] hover:text-[#c48900] focus:outline-none"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="flex items-center justify-between mb-6">
            <a
              href="/register"
              className="text-sm text-[#b37d00] hover:underline"
            >
              Don&apos;t have an account? Register
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 text-white font-semibold rounded ${
              isLoading ? "bg-gray-400" : "bg-[#c48900] hover:bg-[#b37d00]"
            }`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

const LoginPage = () => (
  <Suspense>
    <LoginPageInner />
  </Suspense>
);

export default LoginPage;
