"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ChatInterface from "@/components/chat/ChatInterface";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import Button from "@/components/ui/Button";

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return null;
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <MessageSquare className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">AI Chat Assistant</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Sign in to chat with our AI education counselor</p>
        <Link href="/login">
          <Button>Sign In to Chat</Button>
        </Link>
      </div>
    );
  }

  return <ChatInterface />;
}
