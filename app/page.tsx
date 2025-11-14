"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { registerUser, loginUser } from "@/lib/auth";
import { onAuthStateChanged } from "firebase/auth";
import { getAuthInstance } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    // Only check auth on client side
    if (typeof window === "undefined") return;
    
    const authInstance = getAuthInstance();
    if (!authInstance) {
      console.warn("Firebase auth is not initialized. Check your .env.local file and restart the server.");
      return;
    }
    
    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
      if (user) {
        router.push("/home");
      }
    });
    
    return () => unsubscribe();
  }, [router]);

  const validateForm = (): boolean => {
    // Full name only required for signup
    if (!isLogin && !fullName.trim()) {
      setError("Full Name is required");
      return false;
    }
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!password) {
      setError("Password is required");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) {
      return;
    }

    const authInstance = getAuthInstance();
    if (!authInstance) {
      setError(
        "Firebase is not configured. Please set up your .env.local file with Firebase credentials and restart the server."
      );
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // Login flow
        await loginUser(email, password);
        router.push("/home");
      } else {
        // Signup flow
        await registerUser(fullName, email, password);
        router.push("/home");
      }
    } catch (err: any) {
      const errorCode = err.code || "";
      const errorMessage = err.message || "";
      
      if (isLogin) {
        // Login errors
        if (
          errorCode === "auth/user-not-found" ||
          errorCode === "auth/invalid-credential" ||
          errorMessage.includes("user-not-found") ||
          errorMessage.includes("invalid-credential")
        ) {
          setError("Invalid email or password. Please try again.");
        } else if (
          errorCode === "auth/wrong-password" ||
          errorMessage.includes("wrong-password")
        ) {
          setError("Incorrect password. Please try again.");
        } else {
          setError(errorMessage || "Login failed. Please try again.");
        }
      } else {
        // Signup errors
        if (
          errorCode === "auth/email-already-in-use" ||
          errorMessage.includes("email-already-in-use")
        ) {
          setError("This email is already registered. Please login instead.");
        } else if (
          errorCode === "auth/weak-password" ||
          errorMessage.includes("weak-password")
        ) {
          setError("Password is too weak. Please use a stronger password.");
        } else {
          setError(errorMessage || "Registration failed. Please try again.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {/* Toggle between Login and Signup */}
        <div className="flex mb-6 border-b">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setError("");
              setFullName("");
              setEmail("");
              setPassword("");
            }}
            className={`flex-1 py-2 px-4 text-center font-medium transition-colors ${
              isLogin
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setError("");
              setFullName("");
              setEmail("");
              setPassword("");
            }}
            className={`flex-1 py-2 px-4 text-center font-medium transition-colors ${
              !isLogin
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Sign Up
          </button>
        </div>

        <h1 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
          </button>

          <div className="text-center text-sm text-gray-600 mt-4">
            {isLogin ? (
              <p>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(false);
                    setError("");
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(true);
                    setError("");
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Login
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

