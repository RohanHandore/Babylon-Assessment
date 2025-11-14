"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { registerUser, loginUser, signInWithGoogle } from "@/lib/auth";
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
  const [googleLoading, setGoogleLoading] = useState(false);

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

  const handleGoogleSignIn = async () => {
    setError("");
    setGoogleLoading(true);

    const authInstance = getAuthInstance();
    if (!authInstance) {
      setError(
        "Firebase is not configured. Please set up your .env.local file with Firebase credentials and restart the server."
      );
      setGoogleLoading(false);
      return;
    }

    try {
      await signInWithGoogle();
      router.push("/home");
    } catch (err: any) {
      const errorCode = err.code || "";
      if (errorCode === "auth/popup-closed-by-user") {
        setError("Sign-in was cancelled. Please try again.");
      } else if (errorCode === "auth/popup-blocked") {
        setError("Popup was blocked. Please allow popups and try again.");
      } else {
        setError(err.message || "Google sign-in failed. Please try again.");
      }
    } finally {
      setGoogleLoading(false);
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
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* Google Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {googleLoading ? (
            <span>Signing in...</span>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Sign in with Google</span>
            </>
          )}
        </button>

        <div className="text-center text-sm text-gray-600 mt-4">
            {isLogin ? (
              <p>
                Don&apos;t have an account?{" "}
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
      </div>
    </div>
  );
}

