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
  const [touched, setTouched] = useState({ title: false, body: false });
  const [submitting, setSubmitting] = useState(false);

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
    setTouched({ title: true, body: true });
    if (title.length < 5 || body.length < 10) {
      toast.error("Title 5+ chars, body 10+ chars");
      return;
    }
    setSubmitting(true);
    try {
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
      setTouched({ title: false, body: false });
      toast.success("Posted!");
    } finally {
      setSubmitting(false);
    }
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
          className="inline-flex items-center gap-1 rounded-none bg-[#E0FE9C] hover:bg-[#CDEE78] text-black px-4 py-2 text-sm font-semibold uppercase tracking-wide"
        >
          <Plus className="h-4 w-4" /> New post
        </button>
      </div>

      {open && (
        <div className="mb-6 rounded-none border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111111] p-4 space-y-2">
          <div>
            <label htmlFor="post-title" className="sr-only">Post title</label>
            <input
              id="post-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, title: true }))}
              placeholder="Title"
              aria-invalid={touched.title && title.length > 0 && title.length < 5 ? "true" : "false"}
              className="w-full rounded-none border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111111] px-2 py-1.5 text-sm"
            />
            {touched.title && title.length > 0 && title.length < 5 && (
              <p className="mt-1 text-xs text-red-600">Title must be at least 5 characters ({title.length}/5)</p>
            )}
          </div>
          <div>
            <label htmlFor="post-body" className="sr-only">Post body</label>
            <textarea
              id="post-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, body: true }))}
              placeholder="Write your question…"
              rows={5}
              aria-invalid={touched.body && body.length > 0 && body.length < 10 ? "true" : "false"}
              className="w-full rounded-none border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111111] px-2 py-1.5 text-sm"
            />
            {touched.body && body.length > 0 && body.length < 10 && (
              <p className="mt-1 text-xs text-red-600">Body must be at least 10 characters ({body.length}/10)</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="post-tag" className="sr-only">Tag</label>
            <input
              id="post-tag"
              value={tag}
              onChange={(e) => setTag(e.target.value.toUpperCase())}
              placeholder="Tag (e.g. IELTS, VISA)"
              className="rounded-none border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111111] px-2 py-1.5 text-sm"
            />
            <button
              onClick={submit}
              disabled={submitting || title.length < 5 || body.length < 10}
              className="ml-auto rounded-none bg-[#E0FE9C] hover:bg-[#CDEE78] text-black px-4 py-1.5 text-sm font-semibold uppercase tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Posting…" : "Post"}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-black dark:text-[#E0FE9C]" />
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map((p) => (
            <Link
              href={`/community/${p.id}`}
              key={p.id}
              className="block rounded-none border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111111] p-4 hover:border-[#E0FE9C] transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {p.pinned && (
                      <Pin className="h-3.5 w-3.5 text-black dark:text-[#E0FE9C]" />
                    )}
                    {p.tag && (
                      <span className="px-1.5 py-0.5 text-[10px] font-medium rounded-none bg-[#E0FE9C] text-black">
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
            <div className="text-center py-16 rounded-none border border-dashed border-gray-200 dark:border-gray-800">
              <MessageSquare className="h-10 w-10 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-700 dark:text-gray-300 font-medium">No posts yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {session ? "Be the first to start a discussion." : "Sign in to start the first discussion."}
              </p>
              {session && (
                <button
                  onClick={() => setOpen(true)}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-none bg-[#E0FE9C] hover:bg-[#CDEE78] text-black text-sm font-semibold uppercase tracking-wide"
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
