export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <div className="h-9 w-72 rounded bg-gray-200 dark:bg-gray-800 animate-pulse mx-auto" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="rounded-none border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 h-56 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
