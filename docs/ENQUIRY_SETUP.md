# Enquiry form setup — Web3Forms (free)

The website's enquiry form sends each enquiry to **Web3Forms**, which emails it to you.
Visitors stay on the page and see the thank-you message — no redirect, no server, no SMTP.

- **Free plan:** 250 enquiries per month.
- **Reply directly:** each email's *Reply-To* is the customer, so just hit *Reply*.
- Until a key is added, the form falls back to opening the visitor's own email app.

## 1. Get your free access key (2 minutes)

1. Go to **[web3forms.com](https://web3forms.com)**.
2. In *Create your Access Key*, enter the email that should receive enquiries — e.g. **support@journeyboom.com** — and click **Create Access Key**.
3. Open the email from Web3Forms and copy the **Access Key** (it looks like `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`).

## 2. Add it to the website

In `content/settings/site.json`, inside `"enquiry"`:

```json
"enquiry": {
  "provider": "web3forms",
  "web3formsAccessKey": "paste-your-access-key-here",
  ...
}
```

Commit and push — the site redeploys automatically. (Or send the key to your developer.)

The access key is **safe to publish**: Web3Forms only ever sends to the email it was created for.

## 3. Test

Submit the form on the live site. The email arrives within a minute — check *Spam* the first time and mark it *Not spam*.

## Optional

- **Dashboard & history:** log in at [app.web3forms.com](https://app.web3forms.com) with the same email to manage the form.
- **Marketing list:** each email shows *Marketing emails: Yes/No* — only send offers to people who said *Yes* (India's DPDP Act requires consent).
- **Change the receiving email:** create a new key for the new address and replace it in `site.json`.
