# Deploy to GitHub Pages

Follow these steps to put your site online and get a link to share.

## 1. Create a GitHub repository

1. Go to [github.com/new](https://github.com/new).
2. Set **Repository name** to: `blind-in-love`
3. Choose **Public**, leave "Add a README" unchecked.
4. Click **Create repository**.

## 2. Push your code

In your project folder, run (replace `YOUR_USERNAME` with your GitHub username):

```bash
git remote add origin https://github.com/YOUR_USERNAME/blind-in-love.git
git branch -M main
git add .
git commit -m "Deploy Valentine site"
git push -u origin main
```

If the repo already has a remote, use:

```bash
git add .
git commit -m "Deploy Valentine site"
git push origin main
```

## 3. Turn on GitHub Pages

1. In the repo, go to **Settings** → **Pages**.
2. Under **Build and deployment** → **Source**, choose **GitHub Actions**.

No need to run the workflow manually. The first push will trigger it.

## 4. Get your link

- After the workflow finishes (Actions tab → "Deploy to GitHub Pages" → green check), your site will be at:
  **`https://YOUR_USERNAME.github.io/blind-in-love/`**
- Send that link to your girlfriend.

---

**If you use a different repo name:** edit `base` in `vite.config.js` to match, e.g. `base: '/your-repo-name/'`.
