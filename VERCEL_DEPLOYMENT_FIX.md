# Vercel Deployment Fix for Gemini AI API

## 🚨 CRITICAL: Security Issue
**Your API key was exposed!** Take immediate action:

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. **Delete/regenerate this key**: `AIzaSyCFFuBMTSfkbRh-K87_vqOKjGaY7kpoNzw`
3. Create a new API key
4. Never commit API keys to git or share them publicly

---

## ✅ Step-by-Step Fix for Vercel Deployment

### Step 1: Generate New API Key
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Copy the key (you'll need it in the next step)

### Step 2: Configure Environment Variable in Vercel
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **Environment Variables**
4. Add a new environment variable:
   - **Key**: `GOOGLE_GENERATIVE_AI_API_KEY`
   - **Value**: Your new API key from Step 1
   - **Environments**: Check all three:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
5. Click **Save**

### Step 3: Update Local .env.local File
Update your local `.env.local` file with the new API key:
```bash
GOOGLE_GENERATIVE_AI_API_KEY=your_new_api_key_here
```

### Step 4: Redeploy Your Application
**Important**: Environment variables are only applied to NEW deployments.

Option A - Redeploy via Git:
```bash
git add .
git commit -m "Update API configuration for Vercel"
git push origin main
```

Option B - Redeploy from Vercel Dashboard:
1. Go to your project's **Deployments** tab
2. Click the **...** menu on the latest deployment
3. Click **Redeploy**

### Step 5: Verify the Deployment
1. Wait for the deployment to complete
2. Test the AI feature on your live site
3. Check Vercel logs if there are issues:
   - Go to **Deployments** → Select deployment → **Functions** tab
   - Look for logs from `/api/analyze-resume`

---

## 🔍 Common Issues & Solutions

### Issue 1: "API key not configured" Error
**Solution**: 
- Verify the environment variable name is exactly: `GOOGLE_GENERATIVE_AI_API_KEY`
- Redeploy after adding the env variable (old deployments won't have it)

### Issue 2: API calls timeout
**Solution**:
- Check if you're on the correct Gemini pricing plan
- Verify API key has the correct permissions
- Check Google AI Studio quota limits

### Issue 3: CORS errors
**Solution**: 
- API routes in Next.js should automatically handle CORS
- Ensure you're calling `/api/analyze-resume` from the same domain

### Issue 4: Edge Runtime Issues
**Solution**:
- The code already uses `export const runtime = 'edge'`
- If issues persist, try removing this line to use Node.js runtime

---

## 📝 Testing Checklist

After deployment, test the following:

- [ ] Can access the website
- [ ] Resume upload works
- [ ] AI analysis button is clickable
- [ ] AI analysis completes successfully
- [ ] Results display properly
- [ ] Check Vercel function logs (no errors)

---

## 🔧 Debugging Tips

### View Logs in Vercel:
1. Go to your project dashboard
2. Click **Deployments**
3. Select the latest deployment
4. Click **Functions** tab
5. Find `/api/analyze-resume`
6. View real-time logs

### Local Testing:
```bash
# Test locally first
npm run dev

# Check if env variable is loaded
# Add this temporarily to your API route:
console.log('ENV Check:', !!process.env.GOOGLE_GENERATIVE_AI_API_KEY)
```

### API Call Test:
```bash
# Test the API endpoint directly
curl -X POST https://your-domain.vercel.app/api/analyze-resume \
  -H "Content-Type: application/json" \
  -d '{"resume": {...}}'
```

---

## 📚 Additional Resources

- [Vercel Environment Variables Docs](https://vercel.com/docs/environment-variables)
- [Google AI Studio](https://aistudio.google.com/app/apikey)
- [Vercel AI SDK Docs](https://sdk.vercel.ai/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

## 🎯 Quick Command Reference

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Build for production
npm run build

# Test build locally
npm run start
```

---

## ⚠️ Security Best Practices

1. **Never commit** `.env.local` to git (it's in `.gitignore`)
2. **Rotate API keys** if exposed
3. **Use different keys** for development and production
4. **Monitor API usage** in Google AI Studio
5. **Set rate limits** to prevent abuse

---

## 🆘 Still Not Working?

If you've followed all steps and it's still not working:

1. Check Vercel function logs for specific errors
2. Verify the API key is valid in Google AI Studio
3. Test the API endpoint directly with curl/Postman
4. Check if there are any billing/quota issues in Google AI Studio
5. Try changing from edge runtime to Node.js runtime

**Need more help?** Check:
- Vercel support: https://vercel.com/support
- Google AI Studio status: https://status.cloud.google.com/
