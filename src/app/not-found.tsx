import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[80vh] max-w-3xl flex-col items-center justify-center px-6 py-16">
      <div className="glass w-full rounded-2xl p-8 text-center">
        <p className="text-sm text-pulse-muted">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-pulse-text">
          Lost in the feed.
        </h1>
        <p className="mt-3 text-pulse-muted">
          The page you requested doesn’t exist. Return to the landing page and re-route.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="glass rounded-xl border border-white/10 px-4 py-2 text-sm text-pulse-text transition hover:border-white/20 hover:bg-white/10"
          >
            Back to Home
          </Link>
          <Link
            href="/dashboard"
            className="glass rounded-xl border border-pulse-primary/30 bg-pulse-primary/20 px-4 py-2 text-sm text-pulse-text transition hover:bg-pulse-primary/35"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}

