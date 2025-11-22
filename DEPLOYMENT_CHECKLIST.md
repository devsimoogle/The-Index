# 🚀 Quick Deployment Checklist

Use this checklist to deploy your LIS Journal step-by-step!

## ☑️ Pre-Deployment

- [ ] All code is working locally
- [ ] Both frontend and backend servers run without errors
- [ ] Database is seeded with content
- [ ] Admin panel works (login, create, delete posts)
- [ ] AI features work (librarian, audio player)
- [ ] `.gitignore` file is in place
- [ ] No `.env` files in git (check with `git status`)

## ☑️ GitHub Setup

- [ ] Create GitHub repository
  ```bash
  git init
  git add .
  git commit -m "Initial commit"
  git branch -M main
  git remote add origin https://github.com/yourusername/lis-journal.git
  git push -u origin main
  ```

## ☑️ Backend Deployment (Railway)

- [ ] Sign up at [railway.app](https://railway.app)
- [ ] Create new project
- [ ] Add PostgreSQL database
- [ ] Deploy backend from GitHub
- [ ] Configure environment variables:
  - [ ] `DATABASE_URL` (copy from Railway PostgreSQL)
  - [ ] `GEMINI_API_KEY` (your API key)
  - [ ] `PORT=3001`
  - [ ] `NODE_ENV=production`
  - [ ] `FRONTEND_URL` (will add after Vercel deployment)
- [ ] Wait for deployment to complete
- [ ] Copy backend URL (e.g., `https://xxx.up.railway.app`)
- [ ] Test backend: Visit `https://your-backend.railway.app/api/health`

## ☑️ Seed Production Database

- [ ] Install Railway CLI: `npm i -g @railway/cli`
- [ ] Login: `railway login`
- [ ] Link project: `railway link`
- [ ] Run seed: `railway run npm run seed`
- [ ] Verify: Check Railway dashboard → PostgreSQL → Data

## ☑️ Frontend Deployment (Vercel)

- [ ] Sign up at [vercel.com](https://vercel.com)
- [ ] Import GitHub repository
- [ ] Configure project:
  - Framework: Vite
  - Root Directory: `./`
  - Build Command: `npm run build`
  - Output Directory: `dist`
- [ ] Add environment variable:
  - [ ] `VITE_API_URL=https://your-backend.railway.app/api`
- [ ] Deploy
- [ ] Copy frontend URL (e.g., `https://xxx.vercel.app`)

## ☑️ Update Backend CORS

- [ ] Go back to Railway
- [ ] Add environment variable:
  - [ ] `FRONTEND_URL=https://your-frontend.vercel.app`
- [ ] Redeploy backend (Railway auto-redeploys)

## ☑️ Testing

- [ ] Visit your Vercel URL
- [ ] Check if posts load ✅
- [ ] Test admin login ✅
- [ ] Create a test post ✅
- [ ] Delete a test post ✅
- [ ] Test comments ✅
- [ ] Test reactions ✅
- [ ] Test librarian AI ✅
- [ ] Test audio player ✅

## ☑️ Post-Deployment

- [ ] Share your live URL! 🎉
- [ ] Update README with live demo link
- [ ] Set up custom domain (optional)
- [ ] Monitor Railway credits usage
- [ ] Celebrate! 🎊

---

## 📝 Important URLs to Save

```
Frontend URL: https://________________.vercel.app
Backend URL:  https://________________.up.railway.app
GitHub Repo:  https://github.com/____________/lis-journal
```

---

## 🆘 Troubleshooting

### Posts not loading?
- Check browser console for errors
- Verify `VITE_API_URL` in Vercel environment variables
- Test backend health endpoint

### CORS errors?
- Update `FRONTEND_URL` in Railway
- Check CORS configuration in `server/src/index.ts`

### Database connection failed?
- Verify `DATABASE_URL` in Railway
- Check if PostgreSQL is running
- Review Railway logs

### Build failed?
- Check Node.js version (should be 18 or 20)
- Review build logs in Railway/Vercel
- Ensure all dependencies are in `package.json`

---

## 💰 Cost Tracking

Railway free tier: $5/month credit
- [ ] Monitor usage in Railway dashboard
- [ ] Set up billing alerts
- [ ] Estimated usage: ~$2-3/month for small projects

Vercel free tier: Unlimited
- [ ] 100GB bandwidth/month
- [ ] Unlimited deployments

**Total monthly cost: $0** (within free tiers)

---

## 🎯 Next Steps After Deployment

1. **Share your project**
   - Add to your portfolio
   - Share on social media
   - Show to your professor/classmates

2. **Monitor performance**
   - Check Railway dashboard for uptime
   - Monitor Vercel analytics
   - Review error logs

3. **Keep improving**
   - Add more features
   - Improve performance
   - Gather user feedback

---

**Good luck with your deployment! 🚀**

If you get stuck, check the full **DEPLOYMENT_GUIDE.md** for detailed instructions.
