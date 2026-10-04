import type { ContentImage } from "@/types/content";
import { ImageGallery } from "@/components/common/ImageGallery";

export function PackageGallery({ images }: { images: ContentImage[] }) {
  if (!images.length) return null;
  return (
    <section id="gallery" className="scroll-mt-36">
      <p className="eyebrow">Gallery</p>
      <h2 className="heading-2 mt-3">Glimpses of the trip</h2>
      <ImageGallery images={images} maxVisible={5} className="mt-8" />
    </section>
  );
}
