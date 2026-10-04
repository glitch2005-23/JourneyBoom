import type { Gallery as GalleryContent } from "@/types/content";
import { ImageGallery } from "@/components/common/ImageGallery";
import { Reveal } from "@/components/common/Reveal";
import { SectionHeading } from "@/components/common/SectionHeading";

export function Gallery({
  id,
  eyebrow,
  title,
  subtitle,
  gallery,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  gallery: GalleryContent;
}) {
  return (
    <section id={id} className="section">
      <div className="container-site">
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} align="center" />
        <Reveal>
          <ImageGallery images={gallery.images} maxVisible={9} />
        </Reveal>
      </div>
    </section>
  );
}
