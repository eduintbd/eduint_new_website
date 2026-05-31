export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 space-y-2">
        <div className="h-8 w-48 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
        <div className="h-4 w-96 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
      </div>
      <div className="flex gap-8">
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="rounded-none border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 rounded bg-gray-100 dark:bg-gray-900 animate-pulse" />
            ))}
          </div>
        </aside>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-none border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 space-y-3"
            >
              <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="h-20 rounded bg-gray-100 dark:bg-gray-900 animate-pulse" />
              <div className="flex gap-2">
                <div className="h-6 w-16 rounded-full bg-gray-100 dark:bg-gray-900 animate-pulse" />
                <div className="h-6 w-20 rounded-full bg-gray-100 dark:bg-gray-900 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
