export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 space-y-3">
      <div className="h-8 w-40 rounded bg-gray-200 dark:bg-gray-800 animate-pulse mb-6" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="rounded-none border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111111] p-4 space-y-2"
        >
          <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="h-4 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
          <div className="h-4 w-2/3 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
        </div>
      ))}
    </div>
  );
}
