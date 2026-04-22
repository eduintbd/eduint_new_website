import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Tag, Share2 } from "lucide-react";
import { BLOG_POSTS } from "@/data/blog-posts";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.metaDescription,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
  };
}

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

const CATEGORY_COLORS: Record<string, string> = {
  "Visa Guide": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "Scholarships": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "Destinations": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "Test Prep": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  "Application Tips": "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  "Student Life": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

function renderMarkdown(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inTable = false;
  let tableRows: string[] = [];
  let inList = false;
  let listItems: string[] = [];
  let inChecklist = false;
  let checklistItems: string[] = [];

  const processInline = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
      // Bold
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      if (boldMatch && boldMatch.index !== undefined) {
        if (boldMatch.index > 0) {
          parts.push(remaining.slice(0, boldMatch.index));
        }
        parts.push(<strong key={key++} className="font-semibold text-gray-900 dark:text-white">{boldMatch[1]}</strong>);
        remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
        continue;
      }

      // Links
      const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch && linkMatch.index !== undefined) {
        if (linkMatch.index > 0) {
          parts.push(remaining.slice(0, linkMatch.index));
        }
        parts.push(
          <Link key={key++} href={linkMatch[2]} className="text-blue-600 hover:text-blue-700 underline">
            {linkMatch[1]}
          </Link>
        );
        remaining = remaining.slice(linkMatch.index + linkMatch[0].length);
        continue;
      }

      // Inline code
      const codeMatch = remaining.match(/`([^`]+)`/);
      if (codeMatch && codeMatch.index !== undefined) {
        if (codeMatch.index > 0) {
          parts.push(remaining.slice(0, codeMatch.index));
        }
        parts.push(
          <code key={key++} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono">
            {codeMatch[1]}
          </code>
        );
        remaining = remaining.slice(codeMatch.index + codeMatch[0].length);
        continue;
      }

      parts.push(remaining);
      break;
    }

    return parts.length === 1 ? parts[0] : <>{parts}</>;
  };

  const flushTable = () => {
    if (tableRows.length < 2) return;
    const headerRow = tableRows[0];
    const dataRows = tableRows.slice(2); // skip separator row
    const headers = headerRow.split("|").map((h) => h.trim()).filter(Boolean);

    elements.push(
      <div key={elements.length} className="overflow-x-auto my-6">
        <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              {headers.map((h, i) => (
                <th key={i} className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
                  {processInline(h)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row, ri) => {
              const cells = row.split("|").map((c) => c.trim()).filter(Boolean);
              return (
                <tr key={ri} className={ri % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800/50"}>
                  {cells.map((cell, ci) => (
                    <td key={ci} className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                      {processInline(cell)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
    inTable = false;
  };

  const flushList = () => {
    elements.push(
      <ul key={elements.length} className="my-4 space-y-2 pl-6">
        {listItems.map((item, i) => (
          <li key={i} className="text-gray-600 dark:text-gray-400 list-disc">
            {processInline(item)}
          </li>
        ))}
      </ul>
    );
    listItems = [];
    inList = false;
  };

  const flushChecklist = () => {
    elements.push(
      <ul key={elements.length} className="my-4 space-y-2 pl-2">
        {checklistItems.map((item, i) => {
          const checked = item.startsWith("[x]");
          const text = item.replace(/^\[[ x]\]\s*/, "");
          return (
            <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
              <span className={`mt-1 h-4 w-4 rounded border flex-shrink-0 flex items-center justify-center text-xs ${checked ? "bg-green-100 border-green-500 text-green-600" : "border-gray-300 dark:border-gray-600"}`}>
                {checked && "✓"}
              </span>
              {processInline(text)}
            </li>
          );
        })}
      </ul>
    );
    checklistItems = [];
    inChecklist = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Table detection
    if (line.includes("|") && line.trim().startsWith("|")) {
      if (!inTable) {
        if (inList) flushList();
        if (inChecklist) flushChecklist();
        inTable = true;
      }
      tableRows.push(line);
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Checklist items
    if (line.match(/^- \[[ x]\]/)) {
      if (inList) flushList();
      if (!inChecklist) inChecklist = true;
      checklistItems.push(line.replace(/^- /, ""));
      continue;
    } else if (inChecklist) {
      flushChecklist();
    }

    // Numbered list items
    if (line.match(/^\d+\.\s/)) {
      if (inList) flushList();
      if (inChecklist) flushChecklist();
      const text = line.replace(/^\d+\.\s/, "");
      elements.push(
        <div key={elements.length} className="flex gap-3 my-1.5 pl-2">
          <span className="flex-shrink-0 text-blue-600 font-semibold text-sm mt-0.5">{line.match(/^\d+/)?.[0]}.</span>
          <span className="text-gray-600 dark:text-gray-400">{processInline(text)}</span>
        </div>
      );
      continue;
    }

    // Unordered list items
    if (line.match(/^- /)) {
      if (!inList) inList = true;
      listItems.push(line.replace(/^- /, ""));
      continue;
    } else if (inList) {
      flushList();
    }

    // Headings
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={elements.length} className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">
          {processInline(line.replace("## ", ""))}
        </h2>
      );
      continue;
    }
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={elements.length} className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">
          {processInline(line.replace("### ", ""))}
        </h3>
      );
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={elements.length} className="text-gray-600 dark:text-gray-400 my-3 leading-relaxed">
        {processInline(line)}
      </p>
    );
  }

  // Flush any remaining
  if (inTable) flushTable();
  if (inList) flushList();
  if (inChecklist) flushChecklist();

  return elements;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) notFound();

  const relatedPosts = BLOG_POSTS.filter(
    (p) => p.slug !== post.slug && (p.category === post.category || p.tags.some((t) => post.tags.includes(t)))
  ).slice(0, 3);

  return (
    <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Back link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Blog
      </Link>

      {/* Header */}
      <header className="mb-10">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${CATEGORY_COLORS[post.category] || "bg-gray-100 text-gray-600"}`}>
          {post.category}
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
          {post.title}
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-6">{post.excerpt}</p>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {post.readTime}
          </span>
          <span>By {post.author}</span>
        </div>
      </header>

      {/* Divider */}
      <hr className="border-gray-200 dark:border-gray-700 mb-10" />

      {/* Content */}
      <div className="prose-custom">
        {renderMarkdown(post.content)}
      </div>

      {/* Tags */}
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap items-center gap-2">
          <Tag className="h-4 w-4 text-gray-400" />
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center">
        <h2 className="text-2xl font-bold mb-3">Ready to Start Your Journey?</h2>
        <p className="text-blue-100 mb-6">Get personalized program recommendations from our AI — completely free.</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/register" className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors">
            Get AI Recommendations
          </Link>
          <Link href="/contact" className="px-6 py-3 border border-white/30 text-white font-medium rounded-lg hover:bg-white/10 transition-colors">
            Book Free Consultation
          </Link>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((related) => (
              <Link
                key={related.slug}
                href={`/blog/${related.slug}`}
                className="group p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all"
              >
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2 ${CATEGORY_COLORS[related.category] || "bg-gray-100 text-gray-600"}`}>
                  {related.category}
                </span>
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 text-sm">
                  {related.title}
                </h3>
                <p className="text-xs text-gray-400 mt-2">{related.readTime}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
