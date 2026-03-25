<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/ddc0eff6-2ff8-4ced-b628-5dd52229423d

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `HUGGINGFACE_API_KEY`:
   - Local dev: add it to [.env.local](.env.local)
   - Netlify deploys: add it in Site configuration -> Environment variables, then trigger a new deploy
3. Run the app:
   `npm run dev`
