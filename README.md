# sparshith.com blog

This folder is a standalone static site for GitHub Pages.

## Local structure

- `index.html`: homepage
- `posts/`: blog posts
- `styles.css`: shared site styles
- `CNAME`: custom domain for GitHub Pages

## Deploy on GitHub Pages

1. Create a dedicated GitHub repository for this folder.
2. Push these files to the repository root.
3. In GitHub, open **Settings** -> **Pages**.
4. Set **Build and deployment** -> **Source** to `Deploy from a branch`.
5. Publish from your default branch and the `/ (root)` folder.
6. In the same screen, set the custom domain to `www.sparshith.com`.
7. After the certificate is ready, enable **Enforce HTTPS**.

## DNS records

At your DNS provider:

- `CNAME` for `www` -> `sparshith.github.io`
- `A` records for `sparshith.com`:
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`

Optional IPv6 records:

- `2606:50c0:8000::153`
- `2606:50c0:8001::153`
- `2606:50c0:8002::153`
- `2606:50c0:8003::153`

## Publishing a new post

1. Copy one of the HTML files in `posts/`.
2. Update the title, metadata, and content.
3. Add a card for it in `index.html`.
4. Push the change.
