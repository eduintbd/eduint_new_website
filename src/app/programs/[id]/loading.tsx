export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-800 animate-pulse mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="h-6 w-24 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
            </div>
            <div className="h-9 w-3/4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="h-5 w-1/2 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 h-24 animate-pulse" />
            ))}
          </div>
          <div className="space-y-2">
            <div className="h-6 w-40 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="h-4 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
            <div className="h-4 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
            <div className="h-4 w-2/3 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 h-64 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
