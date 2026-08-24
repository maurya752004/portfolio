# Maurya Pankaj Portfolio

This is a static GitHub Pages portfolio for Maurya Pankaj.

Live portfolio: https://mauryapankaj.in
Source repository: https://github.com/maurya752004/portfolio

## Structure

- `index.html` - main single-page portfolio
- `style.css` - all site styling
- `script.js` - mobile navigation and project rendering
- `data/projects.json` - editable project data
- `data/certificates.json` - editable certificate data
- `assets/` - resume, icons, and project images
- `Certificate/` - original certificate files
- `projects/` - optional per-project documentation folders
- `robots.txt` - search engine rules
- `sitemap.xml` - sitemap for the static site

## Add a new project

1. Create a new folder under `projects/your-project-name/`.
2. Add a `README.md` and any images you need in `images/`.
3. Add one new object to `data/projects.json`.
4. If needed, add a new image to `assets/projects/` and reference it from the JSON file.

## Update the resume

- Replace `assets/MAURYA PANKAJ.pdf` with the latest resume PDF.
- The Resume section links to that file directly, so no HTML change is needed.

## Add or replace a certificate

1. Put the original PDF or image in `Certificate/`.
2. Add one object to `data/certificates.json`.
3. Use the `preview` field for image previews. PDFs use the built-in PDF marker.
4. The Certificates section will render a `View Certificate` link automatically.

## Update contact information

- Edit the contact details in `index.html`.
- Update the mailto link, GitHub URL, and LinkedIn placeholder when you have the final profile URL.

## Update skills

- Edit the skills cards in `index.html`.
- Keep the list limited to technologies you actually want to present.

## Run locally

Use a static server so the JSON fetch works.

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Commit and push

```bash
git add .
git commit -m "Redesign portfolio"
git push origin main
```
