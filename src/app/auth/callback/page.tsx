/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabaseClient";

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const { error: sessionError } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        router.push("/dashboard");
      } catch (err: any) {
        console.error("Auth error:", err);
        setError("Authentication failed. Please try logging in again.");

        setTimeout(() => {
          router.push("/");
        }, 3000);
      }
    };

    handleAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
      {!error ? (
        <div>
          <div className="relative flex justify-center items-center mb-6">
            <div className="absolute animate-ping h-12 w-12 rounded-full bg-blue-400 opacity-20"></div>
            <div className="relative rounded-full h-10 w-10 border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
          </div>
          <h2 className="text-xl font-bold text-slate-800 animate-pulse">
            Authenticating...
          </h2>
          <p className="text-slate-500 mt-2 text-sm">
            Please wait while we redirect you.
          </p>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-100 max-w-sm">
          <div className="text-red-500 mb-4 text-4xl">⚠️</div>
          <h2 className="text-lg font-bold text-slate-800">{error}</h2>
          <p className="text-slate-500 mt-2 text-sm text-balance">
            Redirecting you back to login...
          </p>
        </div>
      )}
    </div>
  );
}
