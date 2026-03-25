# 🚀 PassionPages.ai - HuggingFace Deployment Guide

## ✅ UPDATED: Now Using HuggingFace API

---

## 📋 Step 1: Get HuggingFace API Key

1. Go to: https://huggingface.co/settings/tokens
2. Click **"Create new token"**
3. Name: `PassionPages API`
4. Type: **Read** (default is fine)
5. **Important:** Enable **"Inference Providers"** permission
   - This is CRITICAL! Without this, API won't work
6. Click **Create token**
7. Copy the token (starts with `hf_`)

---

## 🔧 Step 2: Add Environment Variable in Netlify

### Required Variable:
```
HUGGINGFACE_API_KEY=your_huggingface_token_here
```
(Use your actual token from Step 1)

### Optional Variables (Firebase - already has fallbacks):
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### How to Add in Netlify:
1. Netlify Dashboard → Your Site
2. **Site configuration** → **Environment variables**
3. Click **"Add a variable"** → **"Add a single variable"**
4. Key: `HUGGINGFACE_API_KEY`
5. Value: Your HuggingFace token
6. Scopes: **All scopes**
7. Deploy contexts: **Same value for all deploy contexts**
8. Click **"Create variable"**

---

## 🚀 Step 3: Deploy

### Option A: Auto-Deploy (Recommended)
```bash
git add .
git commit -m "Revert to HuggingFace API"
git push origin main
```
Netlify will auto-deploy!

### Option B: Manual Deploy
1. Netlify Dashboard → **Deploys**
2. **Trigger deploy** → **Clear cache and deploy site**
3. Wait 2-3 minutes

---

## ⚠️ IMPORTANT: HuggingFace Token Permissions

If you get this error:
```
HUGGINGFACE_PERMISSION_MISSING: Enable Inference Providers permission
```

**Fix:**
1. Go to: https://huggingface.co/settings/tokens
2. Click on your token
3. Scroll to **Permissions**
4. Enable ✅ **"Inference Providers"**
5. Click **Update token**
6. Redeploy in Netlify

---

## 🧪 Step 4: Test Your Site

1. Open your Netlify site URL
2. Go to **Dashboard** or **Chat**
3. Try AI chat or upload a file
4. Check if AI responds

---

## 🐛 Troubleshooting

### Error: "HUGGINGFACE_API_KEY_MISSING"
**Solution:** You forgot to add the environment variable
- Go to Netlify → Site configuration → Environment variables
- Add `HUGGINGFACE_API_KEY` with your token

### Error: "HUGGINGFACE_PERMISSION_MISSING"
**Solution:** Token doesn't have "Inference Providers" permission
- Edit your token at: https://huggingface.co/settings/tokens
- Enable "Inference Providers" permission
- Redeploy

### Error: "Unsupported model"
**Solution:** Model ID format is wrong
- Should be: `hf:meta-llama/Llama-3.3-70B-Instruct`
- Format: `hf:` prefix + model name

### AI Not Responding
1. Check Netlify Function Logs:
   - Functions tab → Select function → View logs
2. Check browser console (F12)
3. Verify API key is correct
4. Make sure token has Inference Providers permission

---

## 📱 Which Models Work?

You can use any model from HuggingFace that supports chat completions:

**Popular Models:**
- `hf:meta-llama/Llama-3.3-70B-Instruct` (Best)
- `hf:meta-llama/Llama-3.2-11B-Vision-Instruct`
- `hf:Qwen/Qwen2.5-72B-Instruct`
- `hf:microsoft/Phi-4`
- `hf:mistralai/Mistral-7B-Instruct-v0.3`

Check available models at: https://huggingface.co/models?pipeline_tag=text-generation

---

## ✨ What Changed?

- ✅ Reverted from Gemini to HuggingFace
- ✅ Updated `/app/netlify/functions/chat.ts`
- ✅ Updated `/app/netlify/functions/upload.ts`
- ✅ Now uses OpenAI-compatible API via HuggingFace router
- ✅ Supports all HuggingFace inference models

---

## 🎯 Quick Checklist

- [ ] Created HuggingFace token with "Inference Providers" permission
- [ ] Added `HUGGINGFACE_API_KEY` to Netlify environment variables
- [ ] Pushed code to GitHub
- [ ] Deployed to Netlify (auto or manual)
- [ ] Tested AI chat functionality

---

## 💡 Pro Tips

1. **Free Tier:** HuggingFace has generous free tier for inference
2. **Best Models:** Llama 3.3 70B gives best results
3. **Rate Limits:** If you hit rate limits, wait a few minutes
4. **Token Security:** Never commit API tokens to Git!

---

**Your PassionPages.ai is now using HuggingFace! 🎉**

Push to GitHub and test it out! 🚀
