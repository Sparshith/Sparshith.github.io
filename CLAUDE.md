# Blog Maintenance Notes

## Cloudflare Web Analytics

Whenever creating a new blog page, include the Cloudflare Web Analytics loader before the closing `</body>` tag.

Current loader:

```html
<!-- Cloudflare Web Analytics -->
<script>
  (function () {
    const host = window.location.hostname;
    const isLocal =
      window.location.protocol === 'file:' ||
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '[::1]';

    if (isLocal) {
      return;
    }

    const script = document.createElement('script');
    script.defer = true;
    script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    script.setAttribute('data-cf-beacon', '{"token": "67cde0995dfd4323bacc1eee0ab33aa2"}');
    document.body.appendChild(script);
  })();
</script>
<!-- End Cloudflare Web Analytics -->
```

Apply this to:

- `index.html`
- `404.html`
- every file in `posts/`

Do not create a new post without this snippet unless tracking has been intentionally removed.
