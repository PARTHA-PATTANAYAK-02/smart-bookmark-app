/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/src/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

interface Bookmark {
  id: string;
  title: string;
  url: string;
  user_id: string;
  created_at: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/");
      } else {
        setUser(data.user);
      }
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
        router.push("/");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const fetchBookmarks = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (data) {
      setTimeout(() => {
        setBookmarks(data);
      }, 0);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchBookmarks(user.id);
    }
  }, [user, fetchBookmarks]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("bookmarks-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarks" },
        (payload: any) => {
          if (payload.eventType === "INSERT") {
            const newBookmark = payload.new as Bookmark;
            if (newBookmark.user_id === user.id) {
              setBookmarks((prev) => [newBookmark, ...prev]);
            }
          } else if (payload.eventType === "DELETE") {
            setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id));
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Handlers
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const addBookmark = async () => {
    if (!user || !title || !url) return;

    await supabase.from("bookmarks").insert({
      title,
      url,
      user_id: user.id,
    });

    setTitle("");
    setUrl("");
  };

  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans text-gray-900">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-800">
              Dashboard
            </h1>
            <p className="text-gray-500 font-medium">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="cursor-pointer w-full md:w-auto px-6 py-2.5 bg-gray-100 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all font-semibold text-gray-600"
          >
            Logout
          </button>
        </header>

        {/* Input Form Card */}
        <div className="bg-white p-8 rounded-3xl shadow-sm mb-10 border border-gray-100">
          <h2 className="text-lg font-bold mb-5 text-gray-700">Add New Link</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <input
              className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all"
              placeholder="Title (e.g. My Portfolio)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all"
              placeholder="URL (https://...)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <button
            onClick={addBookmark}
            className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-blue-200 active:scale-98"
          >
            Save Bookmark
          </button>
        </div>

        {/* Bookmark List */}
        <div className="grid grid-cols-1 gap-4">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="flex items-center justify-between bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group"
            >
              <div className="flex-1 min-w-0 pr-4">
                <h3 className="font-bold text-gray-800 text-lg truncate mb-1">
                  {bookmark.title}
                </h3>
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 hover:text-blue-700 text-sm font-medium transition-colors break-all"
                >
                  {bookmark.url}
                </a>
              </div>
              <button
                onClick={() => deleteBookmark(bookmark.id)}
                className="cursor-pointer shrink-0 ml-4 px-5 py-2.5 text-sm font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95"
              >
                Delete
              </button>
            </div>
          ))}

          {bookmarks.length === 0 && (
            <div className="text-center py-24 text-gray-400 bg-white rounded-3xl border-2 border-dashed border-gray-100">
              <p className="text-lg">No bookmarks saved yet.</p>
              <p className="text-sm">Start by adding a link above!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
