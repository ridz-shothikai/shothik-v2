export default function Try_Now() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      {/* Header Link */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 transform">
        <a
          href="#"
          className="flex items-center gap-1 text-sm font-medium text-orange-500 transition-colors hover:text-orange-600"
        >
          See what's new in Shothik AI
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </a>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl space-y-8 text-center">
        <h1 className="text-6xl font-light tracking-tight text-gray-900 md:text-7xl lg:text-8xl">
          Try <span> Shothik AI </span> now.
        </h1>

        <div className="flex justify-center">
          <button className="group flex cursor-pointer items-center gap-2 rounded-full bg-gray-900 px-8 py-4 text-lg font-medium text-white shadow-lg transition-all duration-200 hover:bg-gray-800 hover:shadow-xl">
            Download in your Life
            <svg
              className="h-5 w-5 transition-transform group-hover:translate-y-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center text-sm text-gray-500">
        <p>Available for Everyone</p>
      </div>
    </div>
  );
}

