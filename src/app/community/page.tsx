"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Loader2, MessageSquare, Pin, Plus } from "lucide-react";

type Post = {
  id: string;
  title: string;
  body: string;
  tag: string | null;
  pinned: boolean;
  createdAt: string;
  replyCount: number;
  author: { name: string | null; image: string | null } | null;
};

export default function CommunityPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tag, setTag] = useState("");

  useEffect(() => {
    fetch("/api/community")
      .then((r) => r.json())
      .then((d) => setPosts(d.posts ?? []))
      .finally(() => setLoading(false));
  }, []);

  async function submit() {
    if (!session) {
      toast.error("Sign in to post");
      return;
    }
    if (title.length < 5 || body.length < 10) {
      toast.error("Title 5+ chars, body 10+ chars");
      return;
    }
    const res = await fetch("/api/community", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body, tag: tag || undefined }),
    });
    if (!res.ok) {
      toast.error("Post failed");
      return;
    }
    const data = await res.json();
    setPosts((p) => [
      {
        ...data.post,
        replyCount: 0,
        author: { name: session.user?.name ?? null, image: null },
      },
      ...p,
    ]);
    setOpen(false);
    setTitle("");
    setBody("");
    setTag("");
    toast.success("Posted!");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Community Q&A</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Ask fellow BD students + alumni. Counselors jump in too.
          </p>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium"
        >
          <Plus className="h-4 w-4" /> New post
        </button>
      </div>

      {open && (
        <div className="mb-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-2">
          <label htmlFor="post-title" className="sr-only">Post title</label>
          <input
            id="post-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1.5 text-sm"
          />
          <label htmlFor="post-body" className="sr-only">Post body</label>
          <textarea
            id="post-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your question…"
            rows={5}
            className="w-full rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1.5 text-sm"
          />
          <div className="flex items-center gap-2">
            <label htmlFor="post-tag" className="sr-only">Tag</label>
            <input
              id="post-tag"
              value={tag}
              onChange={(e) => setTag(e.target.value.toUpperCase())}
              placeholder="Tag (e.g. IELTS, VISA)"
              className="rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1.5 text-sm"
            />
            <button
              onClick={submit}
              className="ml-auto rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 text-sm font-medium"
            >
              Post
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map((p) => (
            <Link
              href={`/community/${p.id}`}
              key={p.id}
              className="block rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 hover:border-blue-400 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {p.pinned && (
                      <Pin className="h-3.5 w-3.5 text-blue-600" />
                    )}
                    {p.tag && (
                      <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                        {p.tag}
                      </span>
                    )}
                  </div>
                  <h2 className="font-semibold">{p.title}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                    {p.body}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {p.author?.name ?? "Anonymous"} ·{" "}
                    {new Date(p.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap">
                  <MessageSquare className="h-3 w-3" />
                  {p.replyCount}
                </div>
              </div>
            </Link>
          ))}
          {posts.length === 0 && (
            <div className="text-center py-16 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
              <MessageSquare className="h-10 w-10 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-700 dark:text-gray-300 font-medium">No posts yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {session ? "Be the first to start a discussion." : "Sign in to start the first discussion."}
              </p>
              {session && (
                <button
                  onClick={() => setOpen(true)}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
                >
                  <Plus className="h-4 w-4" /> New post
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
