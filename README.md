# Wayfarer — Travel Recommendation Web Application

A 3-page travel recommendation site (Home, About Us, Contact Us) with a working
search feature backed by `travel_recommendation_api.json`.

## Structure
```
index.html
about.html
contact.html
css/style.css
js/script.js
travel_recommendation_api.json
```

## Run locally
Because `script.js` uses `fetch()` to load the JSON file, opening `index.html`
directly (file://) will fail in some browsers. Serve it locally instead:

```bash
cd travel-recommendation
python3 -m http.server 8000
```
Then open http://localhost:8000

## Deploy to GitHub Pages (for the assignment submission)
1. Create a new **public** GitHub repository, e.g. `travel-recommendation`.
2. Upload all the files in this folder to the repo root (keep the `css/` and
   `js/` folders as they are — do not put everything in a subfolder).
3. Go to the repo's **Settings → Pages**.
4. Under "Build and deployment", set **Source: Deploy from a branch**,
   **Branch: main**, folder **/ (root)**, then Save.
5. Wait a minute, then your live site will be at:
   `https://<your-username>.github.io/travel-recommendation/`
6. Submit these two links in the assignment:
   - GitHub repo URL: `https://github.com/<your-username>/travel-recommendation`
   - Live site URL: `https://<your-username>.github.io/travel-recommendation/`

## Rubric coverage
- Home page intro — hero section in `index.html`
- About Us elements — team, mission, stats in `about.html`
- Contact Us email form — validated form in `contact.html` (`js/script.js`)
- Nav bar — sticky header with Home/About/Contact + search on every page
- Beach recommendation (2 images) — `travel_recommendation_api.json` → `beaches`
- Temple recommendation (2 images) — `travel_recommendation_api.json` → `temples`
- Country recommendation (2 images) — `travel_recommendation_api.json` → `countries`
