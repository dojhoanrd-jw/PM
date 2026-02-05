'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: '#f5f5f0', color: '#171717' }}
      >
        <div className="text-center">
          <h1 className="text-xl font-semibold">Critical error</h1>
          <p className="mt-2 text-sm" style={{ color: '#717171' }}>
            The application encountered an error. Please reload the page.
          </p>
          <button
            onClick={reset}
            className="mt-6 rounded-lg px-4 py-2.5 text-sm font-medium text-white cursor-pointer"
            style={{ backgroundColor: '#e8773a' }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
