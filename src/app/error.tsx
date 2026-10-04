"use client";

import Link from "next/link";
import { RotateCcw } from "lucide-react";

/** Friendly fallback for unexpected client-side errors; never exposes technical details. */
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="section">
      <div className="container-site mx-auto max-w-xl text-center">
        <h1 className="heading-1">Something went wrong</h1>
        <p className="lead mt-4">Sorry — this page hit a bump in the road. Please try again, or head back to the homepage.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 xs:flex-row">
          <button type="button" onClick={reset} className="btn btn-primary">
            <RotateCcw className="size-4" aria-hidden="true" /> Try again
          </button>
          <Link href="/" className="btn btn-outline">
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
