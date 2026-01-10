# 📋 Deployment Checklist

Use this checklist to ensure you complete all steps correctly.

## ✅ Prerequisites Setup

- [ ] Node.js installed (v16 or higher)
  ```bash
  node --version
  ```

- [ ] Git installed
  ```bash
  git --version
  ```

- [ ] GitHub account created
  - Visit: https://github.com/join

- [ ] Cloudflare account created
  - Visit: https://dash.cloudflare.com/sign-up

---

## ✅ Step 1: Install Wrangler CLI

- [ ] Install Wrangler globally
  ```bash
  npm install -g wrangler
  ```

- [ ] Verify installation
  ```bash
  wrangler --version
  ```

- [ ] Login to Cloudflare
  ```bash
  wrangler login
  ```
  ➡️ Browser will open for authentication

---

## ✅ Step 2: Create D1 Database

- [ ] Navigate to LandingPage folder
  ```bash
  cd LandingPage
  ```

- [ ] Create database
  ```bash
  wrangler d1 create pos-contact-db
  ```

- [ ] **IMPORTANT:** Copy the database ID from output
  ```
  database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
  ```
  
  My Database ID: _______________________________________

---

## ✅ Step 3: Configure Files

### File 1: wrangler.toml
- [ ] Open `wrangler.toml`
- [ ] Find line with `database_id = "your-database-id-here"`
- [ ] Replace with your actual database ID from Step 2
- [ ] Save file

### File 2: worker.js
- [ ] Open `worker.js`
- [ ] Find line 17: `const ADMIN_TOKEN = 'your-secure-admin-token-change-this';`
- [ ] Change to a strong password (e.g., `'MySecureToken2024!@#'`)
- [ ] **WRITE DOWN YOUR TOKEN:** _______________________________________
- [ ] Save file

---

## ✅ Step 4: Initialize Database

- [ ] Run schema SQL file
  ```bash
  wrangler d1 execute pos-contact-db --file=schema.sql
  ```

- [ ] Verify success message appears
  ```
  ✅ Successfully executed SQL
  ```

---

## ✅ Step 5: Deploy Worker

- [ ] Deploy to Cloudflare
  ```bash
  wrangler deploy
  ```

- [ ] **COPY YOUR WORKER URL** from output
  ```
  https://pos-khotiyan-contact-api.YOUR-SUBDOMAIN.workers.dev
  ```
  
  My Worker URL: _______________________________________

---

## ✅ Step 6: Update JavaScript Files

### File 1: assets/js/script.js
- [ ] Open `assets/js/script.js`
- [ ] Find line ~472: `const WORKER_URL = 'https://your-worker-name...'`
- [ ] Replace with your worker URL + `/api/contact`
  ```javascript
  const WORKER_URL = 'https://YOUR-WORKER-URL/api/contact';
  ```
- [ ] Save file

### File 2: assets/js/admin.js
- [ ] Open `assets/js/admin.js`
- [ ] Find line ~6: `const WORKER_URL = 'https://your-worker-name...'`
- [ ] Replace with your worker URL (WITHOUT `/api/contact`)
  ```javascript
  const WORKER_URL = 'https://YOUR-WORKER-URL';
  ```
- [ ] Save file

---

## ✅ Step 7: Test Locally (Optional)

- [ ] Start local development server
  ```bash
  wrangler dev
  ```

- [ ] Open `index.html` in browser
- [ ] Test form submission
- [ ] Check browser console for errors

---

## ✅ Step 8: Create GitHub Repository

### Option A: Using GitHub Web
- [ ] Go to https://github.com/new
- [ ] Create repository name (e.g., `pos-landing-page`)
- [ ] Make it Public
- [ ] Don't initialize with README
- [ ] Click "Create repository"

### Option B: Using Git Command Line
- [ ] Initialize git in LandingPage folder
  ```bash
  git init
  ```

- [ ] Add all files
  ```bash
  git add .
  ```

- [ ] Create initial commit
  ```bash
  git commit -m "Initial commit - Contact form system"
  ```

- [ ] Add remote repository
  ```bash
  git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
  ```

- [ ] Push to GitHub
  ```bash
  git push -u origin main
  ```

---

## ✅ Step 9: Enable GitHub Pages

- [ ] Go to your repository on GitHub
- [ ] Click "Settings" tab
- [ ] Scroll to "Pages" section (in left sidebar)
- [ ] Under "Source", select `main` branch
- [ ] Select `/ (root)` folder
- [ ] Click "Save"
- [ ] **COPY YOUR PAGES URL**
  ```
  https://YOUR-USERNAME.github.io/YOUR-REPO/
  ```
  
  My Pages URL: _______________________________________

- [ ] Wait 1-2 minutes for deployment

---

## ✅ Step 10: Update CORS (Optional but Recommended)

- [ ] Open `worker.js`
- [ ] Find line 10: `'Access-Control-Allow-Origin': '*'`
- [ ] Replace `*` with your GitHub Pages URL
  ```javascript
  'Access-Control-Allow-Origin': 'https://YOUR-USERNAME.github.io'
  ```
- [ ] Save and redeploy
  ```bash
  wrangler deploy
  ```

---

## ✅ Step 11: Test Everything

### Test Contact Form
- [ ] Visit your GitHub Pages URL
- [ ] Scroll to contact section
- [ ] Fill in form with test data:
  - Name: Test User
  - Email: test@example.com
  - Phone: 01712345678
  - Message: This is a test message
- [ ] Click "Send Message"
- [ ] Verify success message appears

### Test Admin Panel
- [ ] Visit: `YOUR-PAGES-URL/admin-messages.html`
- [ ] Enter your admin token from Step 3
- [ ] Click "Login"
- [ ] Verify you see the dashboard
- [ ] Check that your test message appears
- [ ] Click "View" button on test message
- [ ] Verify message details show correctly
- [ ] Try marking as read
- [ ] Try filtering messages
- [ ] Try searching

---

## ✅ Step 12: Verify Database

- [ ] Check database contents
  ```bash
  wrangler d1 execute pos-contact-db --command="SELECT * FROM messages"
  ```

- [ ] Verify your test message is stored

---

## ✅ Step 13: Final Cleanup

- [ ] Delete test message from admin panel
- [ ] Clear browser localStorage (if needed)
- [ ] Test form submission again
- [ ] Verify everything works

---

## ✅ Step 14: Documentation & Backup

- [ ] **SAVE YOUR CREDENTIALS:**
  - Admin Token: _______________________________________
  - Worker URL: _______________________________________
  - Database ID: _______________________________________
  - Pages URL: _______________________________________

- [ ] Create database backup
  ```bash
  wrangler d1 export pos-contact-db --output=backup.sql
  ```

- [ ] Save backup file to safe location

---

## ✅ Optional: Connect Custom Domain (via Cloudflare)

- [ ] Go to Cloudflare Dashboard
- [ ] Add your domain
- [ ] Update DNS settings
- [ ] Point domain to GitHub Pages
- [ ] Enable "Proxied" status
- [ ] Update CORS in `worker.js` with custom domain
- [ ] Redeploy worker

---

## 🎉 Deployment Complete!

### Your URLs:
- **Landing Page:** https://YOUR-USERNAME.github.io/YOUR-REPO/
- **Admin Panel:** https://YOUR-USERNAME.github.io/YOUR-REPO/admin-messages.html
- **Worker API:** https://YOUR-WORKER.workers.dev/

### Quick Commands Reference:
```bash
# View logs
wrangler tail

# Redeploy worker
wrangler deploy

# Check database
wrangler d1 execute pos-contact-db --command="SELECT COUNT(*) FROM messages"

# Backup database
wrangler d1 export pos-contact-db --output=backup.sql
```

---

## 🔧 Troubleshooting

### Issue: Form submission fails
- [ ] Check worker URL in `assets/js/script.js`
- [ ] Check browser console for errors
- [ ] Verify worker is deployed: `wrangler deployments list`
- [ ] Check CORS settings in `worker.js`

### Issue: Admin panel shows "Unauthorized"
- [ ] Verify admin token matches in `worker.js` and login
- [ ] Clear browser localStorage
- [ ] Check worker URL in `assets/js/admin.js`

### Issue: Database errors
- [ ] Re-run: `wrangler d1 execute pos-contact-db --file=schema.sql`
- [ ] Check database exists: `wrangler d1 list`
- [ ] Verify database ID in `wrangler.toml`

### Issue: GitHub Pages not updating
- [ ] Wait 2-3 minutes after push
- [ ] Check Actions tab for build status
- [ ] Force refresh browser (Ctrl+Shift+R)
- [ ] Clear browser cache

---

## 📞 Need Help?

- Review: `DEPLOYMENT.md` for detailed guide
- Review: `QUICK_SETUP.md` for quick reference
- Review: `ARCHITECTURE.md` for system understanding
- Contact: poskhotiyan@gmail.com

---

**Congratulations! Your serverless contact form system is now live! 🎊**
