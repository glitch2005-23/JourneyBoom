# Journey Boom — Content Guide

This guide is for anyone updating the website's content: destinations, packages, prices, reviews and so on. **You don't need to write code.** Everything on the site comes from text files in the `content/` folder.

> **The golden rule:** after any change, run `npm run validate-content`. If something is wrong, it tells you exactly which file and which line to fix. The website will not publish while there are errors, so you can't accidentally break the live site.

---

## Contents

1. [How the content is organised](#1-how-the-content-is-organised)
2. [JSON in 2 minutes](#2-json-in-2-minutes)
3. [Add a category](#3-add-a-category)
4. [Add a destination](#4-add-a-destination)
5. [Add a package](#5-add-a-package)
6. [Add images](#6-add-images)
7. [Feature a package](#7-feature-a-package)
8. [Hide a package (or anything else)](#8-hide-a-package-or-anything-else)
9. [Change the display order](#9-change-the-display-order)
10. [Change homepage sections](#10-change-homepage-sections)
11. [Edit the navigation and footer](#11-edit-the-navigation-and-footer)
12. [Edit reviews](#12-edit-reviews)
13. [Edit banners](#13-edit-banners)
14. [Update SEO (Google) text](#14-update-seo-google-text)
15. [Booking and payment buttons](#15-booking-and-payment-buttons)
16. [Site settings: phone, email, colours](#16-site-settings-phone-email-colours)
17. [Checking your work](#17-checking-your-work)

---

## 1. How the content is organised

The **folders are the website.** This file…

```
content/destinations/domestic/srinagar/packages/kashmir-delight.json
                     ────────  ────────          ───────────────
                     category  destination       package
```

…becomes this page:

```
https://www.journeyboom.com/domestic/srinagar/kashmir-delight/
```

| Folder / file | What it controls |
|---|---|
| `content/categories/<name>/category.json` | A category page, e.g. `/domestic/` |
| `content/destinations/<category>/<name>/destination.json` | A destination page, e.g. `/domestic/goa/` |
| `content/destinations/<category>/<destination>/packages/<name>.json` | A package page |
| `content/homepage/home.json` | The homepage sections and their order |
| `content/navigation/header.json` | Top menu links and button |
| `content/navigation/footer.json` | Footer text, links and copyright |
| `content/reviews/<name>.json` | One traveller review per file |
| `content/banners/<name>.json` | Promotional banners |
| `content/galleries/<name>.json` | Photo galleries (e.g. the homepage gallery) |
| `content/pages/about.json` (and `contact`, `terms`, `privacy`) | The static pages |
| `content/settings/site.json` | Company name, phone, email, address, colours, button labels, enquiry form text |

**Naming rules for folders and files:** lowercase letters, numbers and hyphens only, with no spaces. The name becomes part of the web address.

- ✅ `kashmir-delight`, `goa-beach-escape-2027`
- ❌ `Kashmir Delight`, `goa_beach`, `Goa!`

---

## 2. JSON in 2 minutes

Content files use a simple format called JSON:

```json
{
  "title": "Goa Beach Escape",
  "featured": true,
  "displayOrder": 1,
  "highlights": ["3 nights at a beach resort", "Sunset river cruise"],
  "price": { "amount": 15999 }
}
```

- Text goes in **"double quotes"**. Numbers (`15999`) and `true`/`false` don't.
- Put commas **between** items, but **not after the last one**.
- `[ … ]` is a list and `{ … }` is a group of fields.
- Prices are plain numbers in rupees: `15999`, not `"₹15,999"`.

**Tip:** use VS Code (free). It colours JSON and underlines mistakes in red.

---

## 3. Add a category

Example: add a **"Honeymoon"** category at `/honeymoon/`.

1. Create the folder `content/categories/honeymoon/`.
2. Inside it, create `category.json`:

```json
{
  "title": "Honeymoon",
  "tagline": "Romantic escapes",
  "description": "Hand-picked romantic getaways with private experiences, beautiful stays and special touches for newlyweds.",
  "heroImage": {
    "src": "/images/categories/honeymoon-hero.jpg",
    "alt": "A couple watching the sunset over the mountains"
  },
  "cardImage": {
    "src": "/images/categories/honeymoon-card.jpg",
    "alt": "Candlelit dinner by the lake"
  },
  "seo": {
    "title": "Honeymoon Packages from India",
    "description": "Romantic honeymoon packages in India and abroad with private experiences and handpicked stays."
  },
  "displayOrder": 3
}
```

3. Create the matching folder for its destinations: `content/destinations/honeymoon/`.
4. Add images ([section 6](#6-add-images)) and validate.

The category automatically appears in the top menu, the footer and the sitemap.

> A category can't use the names `about`, `contact`, `terms`, `privacy` or `images`. Those addresses are already taken.

---

## 4. Add a destination

Example: add **Kerala** under Domestic at `/domestic/kerala/`.

1. Create `content/destinations/domestic/kerala/destination.json`:

```json
{
  "title": "Kerala",
  "region": "God's Own Country · India",
  "tagline": "Backwaters, tea hills and slow sunsets",
  "description": [
    "First paragraph about the destination…",
    "Second paragraph…"
  ],
  "heroImage": { "src": "/images/destinations/kerala/hero.jpg", "alt": "A houseboat on the Alleppey backwaters" },
  "cardImage": { "src": "/images/destinations/kerala/card.jpg", "alt": "Tea plantations in Munnar" },
  "gallery": [
    { "src": "/images/destinations/kerala/munnar.jpg", "alt": "Rolling tea gardens in Munnar" }
  ],
  "highlights": [
    { "icon": "ship", "title": "Backwater houseboats", "text": "Overnight on a traditional kettuvallam." }
  ],
  "quickFacts": {
    "bestTime": "September – March",
    "idealDuration": "5 – 7 days",
    "language": "Malayalam, English",
    "currency": "Indian Rupee (₹)"
  },
  "seo": {
    "title": "Kerala Tour Packages",
    "description": "Kerala holiday packages with backwater houseboats, Munnar tea hills and beaches."
  },
  "featured": false,
  "showOnHome": false,
  "displayOrder": 3
}
```

2. Create an empty `packages/` folder next to it, then add packages ([section 5](#5-add-a-package)).

**Optional fields:** `gallery`, `highlights` and `quickFacts`. Leave them out if you don't need them.

**Highlight icons:** `shield`, `headset`, `wallet`, `map`, `hotel`, `car`, `plane`, `camera`, `mountain`, `waves`, `sun`, `snowflake`, `utensils`, `heart`, `star`, `users`, `compass`, `landmark`, `ship`, `sparkles`, `tree`, `shopping`, `calendar`, `badge`.

The page's "Packages from ₹…" price and package count are **calculated automatically** from its packages.

---

## 5. Add a package

The easiest way is to **copy an existing package file, rename it and edit it.**

Example: `content/destinations/domestic/kerala/packages/kerala-backwaters-escape.json` becomes `/domestic/kerala/kerala-backwaters-escape/`.

```json
{
  "title": "Kerala Backwaters Escape",
  "shortDescription": "One or two sentences shown on cards and at the top of the page (max 220 characters).",
  "description": [
    "Overview paragraph 1…",
    "Overview paragraph 2…"
  ],
  "price": {
    "amount": 22999,
    "originalAmount": 25999,
    "basis": "per person, twin sharing",
    "note": "Flights not included."
  },
  "duration": { "nights": 4, "days": 5 },
  "route": [
    { "city": "Munnar", "nights": 2 },
    { "city": "Alleppey", "nights": 2 }
  ],
  "departureCity": "Kochi",
  "badges": ["New"],
  "images": {
    "hero": { "src": "/images/destinations/kerala/houseboat.jpg", "alt": "Houseboat on the backwaters" },
    "card": { "src": "/images/destinations/kerala/card.jpg", "alt": "Tea gardens" },
    "gallery": [
      { "src": "/images/destinations/kerala/munnar.jpg", "alt": "Munnar tea estates" }
    ]
  },
  "highlights": ["Overnight houseboat cruise", "Tea museum in Munnar"],
  "itinerary": [
    {
      "day": 1,
      "title": "Arrive in Kochi, drive to Munnar",
      "description": "What happens on this day…",
      "meals": ["Dinner"],
      "overnight": "Hotel in Munnar"
    },
    {
      "day": 2,
      "title": "Munnar sightseeing",
      "description": "…",
      "meals": ["Breakfast", "Dinner"]
    }
  ],
  "inclusions": ["4 nights' accommodation", "Daily breakfast"],
  "exclusions": ["Flights", "Lunches"],
  "knowBeforeYouGo": ["Carry light cottons and a rain jacket"],
  "cta": { "primary": { "type": "enquire" } },
  "seo": {
    "title": "Kerala Backwaters Escape — 4N/5D",
    "description": "5-day Kerala holiday with Munnar tea hills and an Alleppey houseboat. From ₹22,999."
  },
  "featured": false,
  "showOnHome": true,
  "displayOrder": 1
}
```

**Good to know:**

- `originalAmount` (optional) shows as a struck-through "was" price. It must be higher than `amount`.
- `duration.days` is normally `nights + 1`.
- Itinerary days must be numbered **1, 2, 3…** in order.
- `meals` can only contain `"Breakfast"`, `"Lunch"` and `"Dinner"`.
- `badges` holds at most 2 short labels, such as `"Bestseller"` or `"Visa included"`.
- **Optional fields:** `originalAmount`, `note`, `route`, `departureCity`, `badges`, `images.card`, `images.gallery`, `exclusions`, `knowBeforeYouGo` and `cta`.

The package automatically appears on its destination page, in "Similar packages" on related pages, in the sitemap, and on the homepage if `showOnHome` is `true`.

---

## 6. Add images

1. Put the photo in `public/images/`, in a sensibly named folder, e.g. `public/images/destinations/kerala/houseboat.jpg`.
2. Reference it from content **starting with `/images/`**, and always add a description (`alt`) for visually impaired visitors and Google:

```json
{ "src": "/images/destinations/kerala/houseboat.jpg", "alt": "A houseboat gliding through palm-lined backwaters" }
```

**Tips:**

- Use JPG photos about **2,500 px wide**. The site automatically makes smaller, faster versions for phones.
- Landscape photos work best for heroes. Any shape works for cards and galleries, because they're cropped neatly.
- If the important part of a photo gets cropped, add `"focal": "50% 30%"` (horizontal % then vertical %; `"50% 30%"` keeps the upper-middle in view).
- File names: lowercase with hyphens, e.g. `dal-lake-sunrise.jpg`.
- If a referenced image doesn't exist, validation reports `Image not found: public/images/…`.
- Only use photos you own or have the rights to. Record stock photo credits in `public/images/CREDITS.md`.

---

## 7. Feature a package

Two switches control where a package is promoted:

| Field | Effect |
|---|---|
| `"showOnHome": true` | Appears in the homepage **"Popular packages"** section |
| `"featured": true` | Appears in **"Popular … packages"** on its category page |

Destinations work the same way. `"featured": true` puts a destination in the homepage **"Destinations our travellers love"** section.

```json
"featured": true,
"showOnHome": true
```

---

## 8. Hide a package (or anything else)

Set `enabled` to `false`:

```json
"enabled": false
```

The page disappears from the site, menus and sitemap, and its address shows the "page not found" screen. Set it back to `true` to restore it. Nothing is lost.

- Hiding a **destination** hides all its packages.
- Hiding a **category** hides all its destinations and packages.
- If another page links to hidden content (a banner or homepage link, for example), validation tells you, so you can update that link too.

`enabled` also works on reviews and banners.

---

## 9. Change the display order

Use `displayOrder`: **lower numbers appear first** (1, 2, 3…). Items without one default to 100, and ties are sorted alphabetically.

Order works **within the parent**:

- Categories are ordered among categories.
- Destinations are ordered within their category.
- Packages are ordered within their destination.

Mixed lists, like the homepage, follow category → destination → package order.

---

## 10. Change homepage sections

`content/homepage/home.json` has a list of `sections`. They appear **in the order listed**.

- **Reorder:** move a whole `{ … }` block up or down (watch the commas).
- **Hide temporarily:** add `"enabled": false` to the section.
- **Remove:** delete the block.

Available section types:

| `type` | What it shows | Key fields |
|---|---|---|
| `hero` | Big opening image with headline | `title`, `subtitle`, `image`, `ctas` (up to 2 buttons), `stats` (up to 4) |
| `quickLinks` | Row of shortcut chips | `title`, `links` (`label`, `href`, optional `icon`) |
| `featuredDestinations` | Destination showcase | `source` (`"featured"` or `"showOnHome"`), `limit` |
| `featuredPackages` | Package cards | `source` (`"showOnHome"` or `"featured"`), `limit` |
| `featuredCategories` | Large category cards | `title` |
| `whyUs` | Reasons to book | `items` (`icon`, `title`, `text`), up to 6 |
| `promoBanner` | Promotional banner | `bannerId` (file name in `content/banners/`) |
| `gallery` | Photo grid with viewer | `galleryId` (file name in `content/galleries/`) |
| `reviews` | Traveller reviews | `limit` |
| `enquiry` | Enquiry form | `title`, `image`, `points` |

Every section needs a unique `id`, which also works as a link anchor: `"id": "packages"` means `/#packages` scrolls to it.

**Button styles** (`variant`): `"accent"` (orange), `"primary"` (navy), `"outline"`, or `"light"` (for use on photos).

---

## 11. Edit the navigation and footer

**Top menu:** `content/navigation/header.json`

```json
{
  "showCategoryMenus": true,
  "links": [
    { "label": "About Us", "href": "/about/" },
    { "label": "Contact", "href": "/contact/" }
  ],
  "cta": { "label": "Plan My Trip", "href": "/contact/", "variant": "accent" }
}
```

- With `showCategoryMenus` on, every category automatically gets a dropdown listing its destinations. There's nothing else to edit when you add destinations.
- **Links** can be:
  - site pages, starting with `/` (e.g. `/domestic/goa/`)
  - page sections, starting with `/#` or `#`
  - external sites, starting with `https://`
  - `tel:+91…` or `mailto:…`
- Links to pages that don't exist are reported by validation.

**Footer:** `content/navigation/footer.json`

- A column with `"source": "categories"` lists categories and destinations automatically.
- A column with `"source": "links"` uses the `links` you provide.
- `{year}` in `copyright` is replaced with the current year.

---

## 12. Edit reviews

One file per review in `content/reviews/`, for example `content/reviews/asha-rao.json`:

```json
{
  "name": "Asha Rao",
  "location": "Pune",
  "rating": 5,
  "text": "What the traveller said (max 600 characters).",
  "trip": "Kashmir Delight",
  "date": "2026-06",
  "package": "domestic/srinagar/kashmir-delight",
  "displayOrder": 1
}
```

- `rating` is a whole number from 1 to 5. `date` is `YYYY-MM` or `YYYY-MM-DD`.
- Link a review to a package (`"package": "category/destination/package"`) or a destination (`"destination": "category/destination"`), and it also appears on that destination's page.
- **Only publish genuine reviews from real customers**, with their permission. The included reviews are samples to replace before launch.

---

## 13. Edit banners

Banners live in `content/banners/`. Here is `honeymoon-season.json`:

```json
{
  "eyebrow": "Honeymoon season",
  "title": "Begin forever somewhere unforgettable",
  "text": "Supporting text…",
  "image": { "src": "/images/home/promo-honeymoon.jpg", "alt": "Couple watching the sunset" },
  "cta": { "label": "See the honeymoon package", "href": "/domestic/srinagar/kashmir-honeymoon-retreat/", "variant": "accent" }
}
```

To show a different banner on the homepage, create a new banner file and change `bannerId` in the homepage's `promoBanner` section to its file name (without `.json`).

---

## 14. Update SEO (Google) text

Every category, destination, package and page has an `seo` block:

```json
"seo": {
  "title": "Goa Tour Packages — Beaches, Heritage & Resorts",
  "description": "Goa holiday packages with beach resorts, heritage tours and sunset cruises.",
  "ogImage": "/images/destinations/goa/hero.jpg"
}
```

- **title:** shown in Google results and browser tabs. Keep it **under 70 characters**; " | Journey Boom" is added automatically.
- **description:** the summary under the title in Google. Keep it **under 170 characters**.
- **ogImage** (optional): the picture shown when the page is shared on WhatsApp, Facebook and similar. Without it, the page's main photo is used.

Homepage SEO is in `content/homepage/home.json → seo`. The sitemap updates itself.

---

## 15. Booking and payment buttons

By default a package shows **"Enquire Now"**, which scrolls to the enquiry form. To add a booking or payment button, link to a page from your payment provider (e.g. a Razorpay Payment Page):

```json
"cta": {
  "primary": { "type": "enquire" },
  "secondary": {
    "type": "pay",
    "label": "Pay booking deposit",
    "url": "https://pages.razorpay.com/your-page"
  }
}
```

- `type` is `"enquire"`, `"book"` or `"pay"`. `book` and `pay` need an `https://` `url`.
- `label` is optional. The defaults ("Enquire Now", "Book Now", "Pay Now") are set in `site.json → labels`.
- **Never put passwords, API keys or secret codes in content files.** Only public links.

---

## 16. Site settings: phone, email, colours

`content/settings/site.json` controls:

- **Company details:** `siteName`, `tagline`, `contact.phone` (international format, no spaces, e.g. `+919876543210`), `contact.phoneDisplay` (how it's shown), `contact.email`, `contact.whatsapp` (digits only, with country code), `contact.address` and `contact.hours`.
- **Social links:** `social` (instagram, facebook, youtube, x, linkedin).
- **Website address:** `siteUrl`. Set it to the real domain before launch.
- **Colours:** `theme.colors`, as 6-digit hex values taken from the logo. Change them carefully, keeping text readable.
- **Button labels:** `labels`.
- **Enquiry form text:** `enquiry`, which holds the titles, success and error messages, and the points shown beside the form.
- **Booking card trust points:** `bookingAssurances`.

---

## 17. Checking your work

1. **Validate:**

   ```bash
   npm run validate-content
   ```

   ✔ means you're good. Otherwise you'll see the file and field to fix:

   ```
   content/destinations/domestic/goa/packages/beach-escape.json
     ✖ error   price.amount: Invalid input: expected number, received string
     ✖ error   highlights: Required field is missing
     ✖ error   Unknown field "feautred" — check the spelling
   ```

   | Message | What to do |
   |---|---|
   | `Required field is missing` | Add the named field |
   | `expected number, received string` | Remove the quotes around the number |
   | `Unknown field "…"` | Usually a typo in a field name |
   | `Invalid JSON` | A missing or extra comma, quote or bracket |
   | `Image not found` | Check the image path and file name (they're case-sensitive) |
   | `does not match any page` | The link points to an address that doesn't exist |
   | `is not a valid slug` | Rename the folder/file: lowercase, numbers, hyphens |
   | `Unexpected file` | The file is in the wrong folder or has a typo in its name |

2. **Preview:** run `npm run dev` and open http://localhost:3000.
3. **Publish:** run `npm run build` and deploy the `out/` folder (see the README). The build refuses to finish if any content is invalid.
