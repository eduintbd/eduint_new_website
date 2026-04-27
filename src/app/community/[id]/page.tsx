"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Send } from "lucide-react";

type Reply = {
  id: string;
  body: string;
  createdAt: string;
  author: { name: string | null; image: string | null } | null;
};

type Post = {
  id: string;
  title: string;
  body: string;
  tag: string | null;
  pinned: boolean;
  createdAt: string;
  author: { name: string | null; image: string | null } | null;
  replies: Reply[];
};

export default function CommunityThreadPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch(`/api/community/${id}`)
      .then((r) => r.json())
      .then((d) => setPost(d.post ?? null))
      .finally(() => setLoading(false));
  }, [id]);

  async function submitReply() {
    if (!session) {
      toast.error("Sign in to reply");
      return;
    }
    if (reply.length < 2) {
      toast.error("Reply is too short");
      return;
    }
    setBusy(true);
    const res = await fetch(`/api/community/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: reply }),
    });
    setBusy(false);
    if (!res.ok) {
      toast.error("Could not post reply");
      return;
    }
    const { reply: r } = await res.json();
    setPost((p) =>
      p
        ? {
            ...p,
            replies: [
              ...p.replies,
              {
                ...r,
                author: { name: session.user?.name ?? null, image: null },
              },
            ],
          }
        : p
    );
    setReply("");
    toast.success("Reply posted");
  }

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  if (!post)
    return (
      <div className="text-center py-16 text-sm text-gray-500">
        Thread not found.
      </div>
    );

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/community"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-4"
      >
        <ArrowLeft className="h-4 w-4" /> Back to community
      </Link>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 mb-4">
        {post.tag && (
          <span className="inline-block px-1.5 py-0.5 text-[10px] font-medium rounded bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 mb-2">
            {post.tag}
          </span>
        )}
        <h1 className="text-xl font-bold">{post.title}</h1>
        <p className="text-xs text-gray-400 mt-1">
          {post.author?.name ?? "Anonymous"} ·{" "}
          {new Date(post.createdAt).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-3 whitespace-pre-wrap">
          {post.body}
        </p>
      </div>

      <div className="space-y-2 mb-4">
        {post.replies.map((r) => (
          <div
            key={r.id}
            className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4"
          >
            <p className="text-xs text-gray-400 mb-1">
              {r.author?.name ?? "Anonymous"} ·{" "}
              {new Date(r.createdAt).toLocaleString()}
            </p>
            <p className="text-sm whitespace-pre-wrap">{r.body}</p>
          </div>
        ))}
        {post.replies.length === 0 && (
          <p className="text-center py-6 text-sm text-gray-500">
            No replies yet — be the first to help!
          </p>
        )}
      </div>

      {session ? (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            rows={3}
            placeholder="Write a reply…"
            className="w-full rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1.5 text-sm"
          />
          <div className="mt-2 flex justify-end">
            <button
              onClick={submitReply}
              disabled={busy}
              className="inline-flex items-center gap-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 text-sm font-medium disabled:opacity-60"
            >
              {busy ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
              Post reply
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 text-center text-sm">
          <Link href="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>{" "}
          to reply.
        </div>
      )}
    </div>
  );
}
