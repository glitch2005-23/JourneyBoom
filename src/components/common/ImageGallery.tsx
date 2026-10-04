"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import type { ContentImage } from "@/types/content";
import { cn } from "@/lib/utils/cn";

const UNIFORM_COLUMNS: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
};

interface ImageGalleryProps {
  images: ContentImage[];
  /** How many tiles to show before collapsing the rest into a "+N" tile. */
  maxVisible?: number;
  className?: string;
}

/**
 * Editorial bento grid with an accessible lightbox. Uses the native <dialog> element,
 * which provides focus containment, Esc-to-close and focus return for free.
 */
export function ImageGallery({ images, maxVisible = 5, className }: ImageGalleryProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  // The bento is a 2×2 lead tile plus rows of four, so 5, 9, 13… tiles fill complete rows.
  // Fewer than five images use a simple uniform grid instead.
  const bento = images.length >= 5;
  const shown = bento ? 5 + Math.floor((Math.min(maxVisible, images.length) - 5) / 4) * 4 : images.length;
  const visible = images.slice(0, shown);
  const hiddenCount = images.length - visible.length;
  const current = images[index];

  const open = (i: number) => {
    setIndex(i);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();
  const step = useCallback(
    (delta: number) => setIndex((i) => (i + delta + images.length) % images.length),
    [images.length],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    dialog.addEventListener("keydown", onKey);
    return () => dialog.removeEventListener("keydown", onKey);
  }, [step]);

  if (!images.length) return null;

  return (
    <>
      <div
        className={cn(
          "grid auto-rows-[10rem] grid-cols-2 gap-3 sm:auto-rows-[12rem] md:gap-4 lg:auto-rows-[14rem]",
          bento ? "md:grid-cols-4" : UNIFORM_COLUMNS[visible.length],
          className,
        )}
      >
        {visible.map((image, i) => {
          const isLead = bento && i === 0;
          const isLast = i === visible.length - 1 && hiddenCount > 0;
          return (
            <button
              key={`${image.src}-${i}`}
              type="button"
              onClick={() => open(i)}
              className={cn(
                "group relative overflow-hidden rounded-2xl bg-line/40 text-left",
                isLead && "col-span-2 row-span-2",
                // Odd tile out on the two-column mobile grid spans the full width.
                !bento && visible.length % 2 === 1 && i === visible.length - 1 && "col-span-2 md:col-span-1",
              )}
              aria-label={`Open photo: ${image.alt}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes={isLead ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
                className="zoom-img object-cover"
                style={image.focal ? { objectPosition: image.focal } : undefined}
              />
              <span className="absolute inset-0 bg-navy-deep/0 transition-colors duration-300 group-hover:bg-navy-deep/20" />
              {isLast ? (
                <span className="absolute inset-0 grid place-items-center bg-navy-deep/55 font-display text-lg font-semibold text-white">
                  +{hiddenCount} {hiddenCount === 1 ? "photo" : "photos"}
                </span>
              ) : (
                <span className="absolute right-3 bottom-3 grid size-9 place-items-center rounded-full bg-white/90 text-navy opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <Expand className="size-4" aria-hidden="true" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <dialog
        ref={dialogRef}
        aria-label="Photo viewer"
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-navy-deep/95"
        onClick={(e) => e.target === e.currentTarget && close()}
      >
        {current && (
          <div className="flex h-full flex-col text-white" onClick={(e) => e.target === e.currentTarget && close()}>
            <div className="flex items-center justify-between px-4 py-3 sm:px-6">
              <p className="text-sm text-white/70" aria-live="polite">
                {index + 1} / {images.length}
              </p>
              <button
                type="button"
                onClick={close}
                className="grid size-11 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
                aria-label="Close photo viewer"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <div className="relative flex-1" onClick={(e) => e.target === e.currentTarget && close()}>
              <Image
                key={current.src}
                src={current.src}
                alt={current.alt}
                fill
                sizes="100vw"
                className="object-contain px-2 sm:px-20"
              />
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    className="absolute top-1/2 left-2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 backdrop-blur transition hover:bg-white/25 sm:left-6"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="size-6" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    className="absolute top-1/2 right-2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 backdrop-blur transition hover:bg-white/25 sm:right-6"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="size-6" aria-hidden="true" />
                  </button>
                </>
              )}
            </div>
            <p className="px-4 py-4 text-center text-sm text-white/80 sm:px-6">{current.alt}</p>
          </div>
        )}
      </dialog>
    </>
  );
}
