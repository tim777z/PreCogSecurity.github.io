# PreCog Security website

The public PreCog Security website is a small, dependency-free static site. It
contains the landing page, service information, free-scan request form, and a
security-focused blog article.

## Requirements

- Node.js 20.19.4 (the exact supported version is in `.nvmrc`)
- npm 10 or newer
- Python 3 (optional, for a local static preview server)

The site has no backend, database, authentication flow, or runtime secrets.

## Install and verify

Use the checked-in lockfile so a fresh clone uses the same reproducible tool
setup:

```sh
nvm use
npm ci
npm run check
```

`npm run check` runs the site linter, formatting check, test suite, and static
build validation. The project currently has no third-party runtime or
development dependencies; `package-lock.json` is still committed so the
installation remains explicit and reproducible.

## Local preview

Serve the repository root over loopback only:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

On Windows, `py -m http.server 8000 --bind 127.0.0.1` is equivalent. Open
<http://127.0.0.1:8000/> in a browser. Do not expose a development server to an
untrusted network.

## Architecture

- `index.html`, `services.html`, and `try.html` are the public entry points.
- `blog/` contains published article pages.
- `assets/` contains page stylesheets, keeping presentation out of the HTML and
  allowing a strict `style-src 'self'` policy.
- `scripts/site-validator.mjs` is a dependency-free HTML/link/security-policy
  validator shared by the lint, build, and test commands.
- `scripts/format.mjs` enforces the repository's LF, final-newline, and
  trailing-whitespace policy.
- `test/site.test.mjs` contains smoke and negative security tests.
- `.github/workflows/ci.yml` runs the same checks on pushes and pull requests.

The pages are hosted as-is; `npm run build` validates that every HTML document
is ready for static hosting and does not generate a second source tree.

## Security and privacy notes

- Every page declares a restrictive Content-Security-Policy that disables
  scripts, plugins, and base-URL injection. The free-scan form is the only
  outbound form submission and is restricted to `https://formsubmit.co`.
- The form enables FormSubmit's CAPTCHA and requests only a name, email address,
  and optional GitHub username. It must never be used to collect passwords,
  access tokens, API keys, or other credentials.
- HTML validation rejects `http:` links, JavaScript URLs, event-handler
  attributes, inline styles, broken local links, unsafe form actions,
  credential-like form fields, and CAPTCHA bypasses.
- Client-side `maxlength`, `pattern`, and `type` constraints are usability
  controls, not an authorization boundary; validate any future server input
  again on the receiving service.
- Static GitHub Pages hosting cannot provide all HTTP security headers. Use a
  trusted CDN or hosting layer for production headers such as HSTS, strict
  transport security, and frame protections when the deployment model changes.
- Keep secrets out of source control. The site has no environment variables;
  `.env.example` documents that contract and must not be populated with real
  credentials.

## Release checklist

1. Run `npm run check` from a clean checkout.
2. Review all changed HTML and the FormSubmit privacy notice.
3. Confirm the `.github/workflows/ci.yml` run is green before publishing.
4. Do not commit `node_modules`, build output, or environment files.
