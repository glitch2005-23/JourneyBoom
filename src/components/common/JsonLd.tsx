/**
 * Structured data for search engines. The payload is built from validated content and
 * serialised with "<" escaped, so it cannot break out of the script element.
 */
export function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
