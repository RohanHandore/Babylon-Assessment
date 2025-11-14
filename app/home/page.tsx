"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logoutUser, getUserData } from "@/lib/auth";
import { onAuthStateChanged } from "firebase/auth";
import { getAuthInstance } from "@/lib/firebase";

export default function HomePage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    const authInstance = getAuthInstance();
    if (!authInstance) {
      router.push("/");
      return;
    }
    
    const unsubscribe = onAuthStateChanged(authInstance, async (user) => {
      if (!user) {
        router.push("/");
        return;
      }

      try {
        // Try to get user data from Firestore first
        const userData = await getUserData(user.uid);
        if (userData) {
          setUserName(userData.fullName);
        } else if (user.displayName) {
          // Fallback to displayName from auth
          setUserName(user.displayName);
        } else {
          setUserName(user.email || "User");
        }
      } catch (error) {
        // Fallback to displayName or email
        setUserName(user.displayName || user.email || "User");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await logoutUser();
      router.push("/");
    } catch (error: any) {
      alert("Logout failed: " + error.message);
    } finally {
      setLogoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Hey, {userName}! You&apos;re successfully logged in.
        </h1>
        
        <button
          onClick={handleLogout}
          disabled={logoutLoading}
          className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {logoutLoading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
}

