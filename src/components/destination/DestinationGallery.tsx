import type { ContentImage } from "@/types/content";
import { ImageGallery } from "@/components/common/ImageGallery";
import { Reveal } from "@/components/common/Reveal";
import { SectionHeading } from "@/components/common/SectionHeading";

export function DestinationGallery({ title, images }: { title: string; images: ContentImage[] }) {
  if (!images.length) return null;
  return (
    <section id="gallery" className="section">
      <div className="container-site">
        <SectionHeading eyebrow="Gallery" title={title} />
        <Reveal>
          <ImageGallery images={images} maxVisible={5} />
        </Reveal>
      </div>
    </section>
  );
}
