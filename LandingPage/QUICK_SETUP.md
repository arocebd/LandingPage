# Quick Setup Guide - Contact Form System

## 🚀 Quick Start (5 minutes)

### 1. Install Wrangler
```bash
npm install -g wrangler
wrangler login
```

### 2. Create & Setup Database
```bash
cd LandingPage
wrangler d1 create pos-contact-db
```
Copy the `database_id` from output and update `wrangler.toml`

### 3. Initialize Database
```bash
wrangler d1 execute pos-contact-db --file=schema.sql
```

### 4. Update Admin Token
Edit `worker.js` line 17:
```javascript
const ADMIN_TOKEN = 'YourSecurePasswordHere123!';
```

### 5. Deploy Worker
```bash
wrangler deploy
```
Copy the worker URL from output

### 6. Update JavaScript Files
- In `assets/js/script.js` line ~472: Add your worker URL + `/api/contact`
- In `assets/js/admin.js` line ~6: Add your worker URL (without `/api/contact`)

### 7. Push to GitHub & Enable Pages
```bash
git init
git add .
git commit -m "Add contact form system"
git remote add origin YOUR_REPO_URL
git push -u origin main
```
Enable GitHub Pages in repository settings

## 📁 Files Created

| File | Purpose |
|------|---------|
| `worker.js` | Cloudflare Worker - Backend API |
| `wrangler.toml` | Worker configuration |
| `schema.sql` | Database schema |
| `admin-messages.html` | Admin panel UI |
| `assets/js/admin.js` | Admin panel JavaScript |
| `assets/css/admin-style.css` | Admin panel styles |
| `DEPLOYMENT.md` | Full deployment guide |

## 🔐 Admin Panel Access

URL: `https://yourusername.github.io/your-repo/admin-messages.html`

Login with the admin token you set in Step 4

## 🛠️ Common Commands

```bash
# Deploy changes
wrangler deploy

# View logs
wrangler tail

# View database
wrangler d1 execute pos-contact-db --command="SELECT * FROM messages"

# Backup database
wrangler d1 export pos-contact-db --output=backup.sql
```

## ⚙️ API Endpoints

Your worker provides these endpoints:

- `POST /api/contact` - Submit contact form
- `GET /api/messages` - Get all messages (requires auth)
- `GET /api/messages/:id` - Get single message (requires auth)
- `PUT /api/messages/:id` - Update message status (requires auth)
- `DELETE /api/messages/:id` - Delete message (requires auth)

## 🎯 Features

✅ **Contact Form** - Collects visitor messages  
✅ **SQLite Database** - Stores messages in Cloudflare D1  
✅ **Admin Panel** - View and manage messages  
✅ **Status Management** - Mark as read/archived  
✅ **Search & Filter** - Find messages easily  
✅ **Secure Authentication** - Token-based admin access  
✅ **Real-time Stats** - Dashboard with message counts  
✅ **Responsive Design** - Works on all devices  
✅ **No Backend Server** - 100% serverless solution  

## 💰 Cost

**FREE** for most use cases (Cloudflare Free Tier):
- 100,000 requests/day
- 5 GB D1 storage
- 5M reads/day
- 100K writes/day

## 📞 Support

For detailed instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

## ⚠️ Important Notes

1. **Must change the admin token** in `worker.js` before deployment
2. **Must update worker URLs** in both JavaScript files
3. **GitHub Pages must be enabled** for the admin panel to work
4. **CORS settings** may need adjustment for custom domains

## 🔄 Update Workflow

1. Make changes to `worker.js`
2. Run `wrangler deploy`
3. Commit and push to GitHub
4. Changes to HTML/CSS/JS are automatically live on GitHub Pages

---

**Ready to deploy?** Follow the steps above and you'll be live in minutes! 🚀
