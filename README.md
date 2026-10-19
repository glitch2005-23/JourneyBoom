# Journey Boom — Travel Website 

A production-ready, file-driven travel website for **Journey Boom** (“Travel more, create memories”).

**JSON files + folders are the CMS. Next.js is the rendering engine.** The site builds to plain static files that you can host on S3 + CloudFront, with no server, database or CMS subscription.

---

## 1. Project overview

- **Pages:** home, category (`/domestic/`), destination (`/domestic/srinagar/`), package (`/domestic/srinagar/kashmir-delight/`), plus About, Contact, Terms and Privacy.
- **Content source:** every page is generated from JSON in `content/`. Adding a folder or file adds a page, with no code changes.
- **Validation:** content is checked against strict Zod schemas. Invalid content fails the build with the exact file and field.
- **Enquiries:** sent through a pluggable `EnquiryProvider`. It uses the Mailchimp public embed today and can be swapped for an API or CRM later.
- **Output:** `next build` writes a fully static site to `out/`.

## 2. Architecture

```
content/*.json ──► ContentProvider ──► domain types ──► React components ──► routes ──► static HTML (out/)
                   (FileSystem today,
                    API/CMS tomorrow)
```

| Layer | Where | Responsibility |
|---|---|---|
| Content | `content/` | JSON files; the folder structure defines the hierarchy |
| Schemas | `src/content/schemas/` | Zod schemas (strict, so unknown fields are reported) |
| Loading & validation | `src/lib/content/load.ts` | Discovers files, validates and cross-checks them, and reports every issue with its file and field |
| Visibility | `src/lib/content/visibility.ts` | Hides disabled items (with cascade), sorts by `displayOrder`, computes "from ₹" prices |
| Provider | `src/content/provider.ts`, `src/lib/content/filesystem.ts` | The **only** API the UI uses to get content |
| UI | `src/components/` | Reusable, presentation-only components (no JSON reads, no business copy) |
| Routes | `src/app/` | `generateStaticParams` built from content, plus metadata, sitemap and robots |

Server Components are the default. Only five small pieces ship JavaScript to the browser: the header (scroll state and menus), the mobile menu, the gallery lightbox, scroll reveals and the enquiry form.

## 3. Why Next.js

- **Static export:** HTML for every page, ready for S3/CloudFront.
- **SEO:** dynamic routes with `generateStaticParams`, the Metadata API (titles, canonical, OpenGraph, Twitter), and generated `sitemap.xml` and `robots.txt`.
- **Performance:** Server Components keep JavaScript minimal; `next/font` self-hosts fonts; `next/image` handles responsive images.
- **Future-proof:** the same code can move to SSR/ISR or an API-backed CMS without a rewrite.

## 4. Folder structure

```
content/                     ← THE CMS (see docs/CONTENT_GUIDE.md)
  settings/site.json         brand, contact, colours, CTA labels, enquiry settings
  navigation/header.json     header links + CTA
  navigation/footer.json     footer columns, legal links, copyright
  homepage/home.json         ordered homepage sections
  categories/<slug>/category.json
  destinations/<category>/<destination>/destination.json
  destinations/<category>/<destination>/packages/<package>.json
  reviews/  banners/  galleries/  pages/
public/images/               photos (+ CREDITS.md) and brand assets
public/_img/                 generated WebP variants (git-ignored)
assets/brand/                original logo artwork
scripts/                     validate-content, optimize-images, prepare-brand, fix-export-segments
src/app/                     routes
src/components/              layout/ home/ category/ destination/ package/ common/ enquiry/
src/content/                 provider interface, provider factory, Zod schemas
src/lib/                     content loading, enquiry providers, SEO, image loader, utils
src/types/content.ts         domain types
tests/                       Vitest suite
docs/CONTENT_GUIDE.md        guide for content editors
```

## 5. Content model

- **Category → Destination → Package.** The URL is the folder path: `content/destinations/domestic/goa/packages/beach-escape.json` → `/domestic/goa/beach-escape/`.
- **Slugs** come from folder and file names: lowercase letters, numbers and hyphens. An optional `"slug"` field must match the name.
- **Visibility fields** on categories, destinations, packages and reviews:
  - `enabled` (default `true`): hidden items get no page at all, and disabling a category or destination hides everything under it.
  - `featured`: used by "featured" sections.
  - `showOnHome`: used by homepage sections.
  - `displayOrder` (default `100`): lower values come first. Order applies within the parent, so homepage lists follow category → destination → package order.
- **Packages** support:
  - price (with an optional struck-through `originalAmount`), duration, route, badges and images
  - highlights, itinerary, inclusions, exclusions and "know before you go"
  - SEO fields and CTAs
- **Payment-ready CTAs:** `cta.primary` / `cta.secondary` take `type: "enquire" | "book" | "pay"`. `book` and `pay` need an `https://` URL, such as a Razorpay or Stripe payment page. No secrets ever go in content.
- **Static pages** use structured blocks (`heading`, `paragraph`, `list`), not HTML, so nothing needs sanitising.

The full field reference with examples is in [docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md).

## 6. Adding destinations

1. Create `content/destinations/<category>/<new-slug>/destination.json`. The easiest start is copying an existing one.
2. Add images under `public/images/destinations/<new-slug>/`.
3. Run `npm run validate-content`.

The destination page, menu entries, footer links and sitemap entry all appear automatically.

## 7. Adding packages

Add `content/destinations/<category>/<destination>/packages/<package-slug>.json`. The page appears at `/<category>/<destination>/<package-slug>/`, and the package shows up in its destination's list, related packages and the sitemap. Set `showOnHome` or `featured` to promote it.

## 8. Adding images

- Put photos in `public/images/...` (JPG/PNG/WebP) and reference them from JSON as `"/images/..."`, always with `alt` text.
- `npm run images` runs automatically before `dev` and `build`. It pre-renders WebP variants at 320–2560 px into `public/_img/`. A custom `next/image` loader then serves responsive `srcset`s from those files, which gives real image optimisation on a static host.
- Keep originals around 2560 px on the long edge. Use `"focal": "50% 30%"` to control cropping.
- Missing images fail validation. In development they fall back to `public/images/fallback.jpg`.
- Photo credits are in `public/images/CREDITS.md`. They are Unsplash photos, free for commercial use.
- Brand files are generated from `assets/brand/logo-source.jpg` by `npm run brand`.

## 9. SEO

- Every category, destination, package and page has `seo.title`, `seo.description` and an optional `seo.ogImage` in its JSON.
- Generated for each page: `<title>`, meta description, canonical URL, OpenGraph and Twitter cards, `BreadcrumbList`, `TouristTrip`/`Offer` and `TravelAgency` JSON-LD.
- `sitemap.xml` and `robots.txt` are generated from content. Set the production domain in `content/settings/site.json → siteUrl`.

## 10. Mailchimp configuration

The enquiry form talks to an `EnquiryProvider` (`src/lib/enquiry/`):

| Provider | When it's used |
|---|---|
| `mailchimp` | `settings.enquiry.provider` is `"mailchimp"` **and** `NEXT_PUBLIC_MAILCHIMP_FORM_URL` holds a valid embed URL |
| `mailto` (fallback) | Otherwise. It opens the visitor's email app with the enquiry pre-filled, addressed to `contact.email` |

Setup:

1. In Mailchimp: **Audience → Settings → Audience fields and merge tags**. Add text fields with these tags (or change the mapping in `site.json → enquiry.mailchimpFields`): `PHONE`, `DEST`, `TDATE`, `PAX`, `MESSAGE`. `FNAME` already exists.
2. **Audience → Signup forms → Embedded forms**: copy the `<form action="…">` URL. It looks like `https://xxx.us21.list-manage.com/subscribe/post?u=…&id=…`.
3. Copy `.env.example` to `.env.local`, set `NEXT_PUBLIC_MAILCHIMP_FORM_URL=<that URL>`, then rebuild.

**No API key is used or needed.** The embed URL is public by design, and submissions go through Mailchimp's own JSONP endpoint, so no secret ever reaches the browser.

Mailchimp is a mailing-list tool, so an email that's already subscribed will be rejected. In that case the form offers "Email us instead" and a call link. For high enquiry volumes, add a provider for a form service, CRM or API: implement `EnquiryProvider` and register it in `createEnquiryProvider`. The form UI doesn't change.

## 11. Local development

Requirements: Node.js ≥ 20.9.

```bash
npm install
npm run dev          # http://localhost:3000 (generates image variants first)
```

In development, content errors are logged in the terminal and invalid files are skipped, so pages keep rendering while you fix them.

| Script | Purpose |
|---|---|
| `npm run validate-content` | Validate all content |
| `npm run images` | Generate WebP variants |
| `npm run build` | Validate, optimise images, then build the static site into `out/` |
| `npm start` | Serve `out/` locally |
| `npm test` | Vitest suite (validation, routes, provider, visibility, enquiry) |
| `npm run typecheck` / `npm run lint` | TypeScript / ESLint |
| `npm run brand` | Regenerate logo, favicon and fallback from the source artwork |

## 12. Content validation

`npm run validate-content` checks every JSON file for:

- invalid JSON
- missing required fields
- wrong types
- unknown or misspelt fields
- invalid slugs, or slugs that don't match their file name
- duplicate URLs, including collisions with built-in pages like `/about/`
- missing images
- links to pages that don't exist or are disabled
- broken banner, gallery and review references
- files in the wrong place

Each problem is reported with its file and field, and the script exits non-zero:

```
content/destinations/domestic/srinagar/packages/kashmir-delight.json
  ✖ error   price.amount: Invalid input: expected number, received string
```

`npm run build` runs it first (`prebuild`), and the content loader re-validates during the build, so **invalid content can never be deployed**.

## 13. Production build

```bash
npm run build      # → out/
npm start          # preview the exported site
```

`postbuild` runs `scripts/fix-export-segments.ts`. Next.js 16 on Windows writes client-navigation data files into nested folders, but the browser requests them dot-joined. The script flattens them so client-side navigation works. On Linux/macOS it's a no-op.

## 14. Static deployment

`next.config.ts` sets `output: "export"` and `trailingSlash: true`, so every page is a folder with an `index.html` (`/domestic/goa/index.html`). Deploy the contents of `out/`.

### GitHub Pages

The repo includes `.github/workflows/deploy.yml`, which builds and publishes the site on every push to `main`. The live site is **https://journeyboom.com** (custom domain on GitHub Pages).

1. Push the code to GitHub (`main` branch).
2. In the repo, go to **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions**.
3. Under **Custom domain**, enter `journeyboom.com`, then tick **Enforce HTTPS** once the certificate is ready.
4. Watch the **Actions** tab. When the run turns green, the new version is live.

How it works:

- The site is built for the **root of the domain**: no base path, and canonical URLs, the sitemap and OpenGraph use `content/settings/site.json → siteUrl` (`https://journeyboom.com`).
- **Serving from `https://<user>.github.io/<repo>/` instead** (no custom domain): add `NEXT_PUBLIC_BASE_PATH: /<repo>` and `SITE_URL: https://<user>.github.io/<repo>` to the build step's `env` in the workflow. Links and images then get the `/<repo>` prefix.
- **Mailchimp:** add a repository variable `MAILCHIMP_FORM_URL` under Settings → Secrets and variables → Actions → **Variables**.

## 15. S3

```bash
BUCKET=journeyboom-site

# Long-lived cache for fingerprinted assets and generated images
aws s3 sync out/ s3://$BUCKET/ --delete \
  --exclude "*" --include "_next/static/*" --include "_img/*" \
  --cache-control "public, max-age=31536000, immutable"

# Everything else (HTML, data, images, sitemap) revalidates
aws s3 sync out/ s3://$BUCKET/ --delete \
  --exclude "_next/static/*" --exclude "_img/*" \
  --cache-control "public, max-age=0, must-revalidate"
```

Keep the bucket **private** (Block Public Access on). CloudFront reads it through Origin Access Control.

## 16. CloudFront

1. **Create a distribution:**
   - Origin: the S3 bucket's REST endpoint, with **Origin Access Control**. Apply the bucket policy CloudFront suggests.
   - Viewer protocol: redirect HTTP → HTTPS.
   - Compression on.
   - Cache policy `CachingOptimized`.
   - Default root object: `index.html`.
2. **Rewrite folder URLs to `index.html`.** S3's REST origin doesn't do this. Create a CloudFront Function (viewer request) and associate it with the default behaviour:

   ```js
   function handler(event) {
     var request = event.request;
     var uri = request.uri;
     if (uri.endsWith("/")) {
       request.uri += "index.html";
     } else if (!uri.includes(".")) {
       // /domestic/goa → /domestic/goa/ (canonical trailing slash)
       return { statusCode: 301, statusDescription: "Moved Permanently", headers: { location: { value: uri + "/" } } };
     }
     return request;
   }
   ```

3. **Error pages:** add custom error responses for **403** and **404**, both pointing to `/404.html` with response code **404**.
4. **Optional:** add a response headers policy with security headers (HSTS, `X-Content-Type-Options`, `Referrer-Policy`).

### Cache invalidation

HTML is served with `max-age=0`, but CloudFront still caches it at the edge. After each deploy:

```bash
aws cloudfront create-invalidation --distribution-id <DIST_ID> --paths "/*"
```

## 17. Custom domain

1. Request an **ACM certificate in `us-east-1`** for `journeyboom.com` and `www.journeyboom.com`, validated by DNS.
2. In the distribution, add both names as **Alternate domain names (CNAMEs)** and select the certificate.
3. In Route 53 (or your DNS provider), create **A/AAAA alias** records for both names pointing to the distribution. Other DNS providers use a CNAME for `www`.
4. Set `siteUrl` in `content/settings/site.json` to the final canonical origin (e.g. `https://journeyboom.com`) and rebuild. Canonical URLs, the sitemap and OpenGraph all use it.

## 18. Future JSON → API/CMS migration

The UI depends only on the `ContentProvider` interface (`src/content/provider.ts`). To move to a headless CMS or your own API:

1. Implement `ContentProvider` in, say, `src/lib/content/api.ts`, mapping CMS responses into the same domain types. Run them through the same Zod schemas so the guarantees stay.
2. Return it from `getContentProvider()` in `src/content/index.ts`, for example based on an environment variable.
3. Stay fully static, rebuilding on CMS webhooks. Or, if you need on-demand updates, drop `output: "export"` and deploy to a Node/edge host using ISR. Routes and components stay as they are.

The same pattern applies to enquiries (`EnquiryProvider`) and payments (package `cta` URLs today, or a provider later).

---

### Before launch (replace sample content)

- Contact details, address and social links in `content/settings/site.json`.
- Hero stats ("12,000+ travellers", "4.9/5", "since 2014") in `content/homepage/home.json`.
- **Sample reviews** in `content/reviews/`. Replace them with genuine customer reviews.
- The placeholder payment URL on `dubai-deluxe.json` (`cta.secondary`).
- Prices, itineraries, terms and privacy text, checked against your actual offers and policies.
- `siteUrl`, and `NEXT_PUBLIC_MAILCHIMP_FORM_URL`.
