# Khotiyan-খতিয়ান Landing Page with Contact Form

A modern, responsive landing page for POS Khotiyan with a fully functional serverless contact form system.

## 🌟 Features

- **Modern Landing Page** - Responsive design with smooth animations
- **Serverless Contact Form** - No backend server needed
- **SQLite Database** - Cloudflare D1 for message storage
- **Admin Panel** - Beautiful dashboard to manage messages
- **Real-time Updates** - Instant message notifications
- **Search & Filter** - Easy message management
- **Secure Authentication** - Token-based admin access
- **100% Free Hosting** - GitHub Pages + Cloudflare Free Tier

## 📋 Prerequisites

- Node.js (v16 or higher)
- GitHub account
- Cloudflare account (free)
- Git installed

## 🚀 Quick Setup

See [QUICK_SETUP.md](QUICK_SETUP.md) for the fastest way to get started.

For detailed instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

### Basic Steps:

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Login to Cloudflare**
   ```bash
   npx wrangler login
   ```

3. **Create database**
   ```bash
   npm run db:create
   npm run db:init
   ```

4. **Update configuration**
   - Edit `worker.js` - Change admin token
   - Edit `wrangler.toml` - Add database ID
   - Edit `assets/js/script.js` - Add worker URL
   - Edit `assets/js/admin.js` - Add worker URL

5. **Deploy**
   ```bash
   npm run deploy
   ```

6. **Push to GitHub and enable Pages**

## 📁 Project Structure

```
LandingPage/
├── index.html              # Main landing page
├── admin-messages.html     # Admin panel
├── worker.js              # Cloudflare Worker (API)
├── wrangler.toml          # Worker configuration
├── schema.sql             # Database schema
├── package.json           # NPM scripts
├── assets/
│   ├── css/
│   │   ├── style.css      # Landing page styles
│   │   └── admin-style.css # Admin panel styles
│   ├── js/
│   │   ├── script.js      # Landing page scripts
│   │   └── admin.js       # Admin panel scripts
│   └── images/
│       └── logo.png       # Logo
├── DEPLOYMENT.md          # Full deployment guide
├── QUICK_SETUP.md         # Quick setup guide
└── README.md              # This file
```

## 🛠️ NPM Scripts

```bash
npm run dev          # Start local development server
npm run deploy       # Deploy worker to Cloudflare
npm run tail         # View worker logs in real-time
npm run db:init      # Initialize database with schema
npm run db:backup    # Backup database to SQL file
```

## 🎯 How It Works

### Contact Form Flow:
1. User fills form on landing page
2. JavaScript sends data to Cloudflare Worker
3. Worker validates and stores in D1 database
4. User sees success message

### Admin Panel Flow:
1. Admin visits admin-messages.html
2. Enters authentication token
3. Worker fetches messages from D1
4. Admin can view, filter, and manage messages

## 🔐 Security

- Token-based authentication for admin panel
- CORS protection for API endpoints
- Input validation on both client and server
- SQL injection prevention with prepared statements
- HTTPS-only connections

## 🌐 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/contact` | Submit contact form | No |
| GET | `/api/messages` | List all messages | Yes |
| GET | `/api/messages/:id` | Get single message | Yes |
| PUT | `/api/messages/:id` | Update message status | Yes |
| DELETE | `/api/messages/:id` | Delete message | Yes |

## 📱 Admin Panel Features

- **Dashboard Statistics** - Unread, read, and total message counts
- **Status Filters** - Filter by unread, read, archived
- **Search** - Search by name or email
- **Message Details** - View full message in modal
- **Status Management** - Mark as read or archive
- **Delete Messages** - Remove unwanted messages
- **Responsive Design** - Works on mobile and desktop

## 🎨 Customization

### Change Colors
Edit CSS variables in `assets/css/admin-style.css`:
```css
:root {
    --primary-color: #4f46e5;
    --success-color: #10b981;
    --danger-color: #ef4444;
}
```

### Change Admin Token
Edit `worker.js`:
```javascript
const ADMIN_TOKEN = 'your-secure-token-here';
```

### Add Email Notifications
Modify `worker.js` in the `handleContactSubmission` function to send emails using a service like SendGrid or Mailgun.

## 🔄 Updating

### Update Worker Code:
1. Make changes to `worker.js`
2. Run `npm run deploy`

### Update Frontend:
1. Make changes to HTML/CSS/JS
2. Commit and push to GitHub
3. GitHub Pages will auto-update

## 📊 Database Schema

```sql
CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread',
    created_at TEXT NOT NULL,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

## 💾 Backup & Restore

### Backup:
```bash
npm run db:backup
```

### Restore:
```bash
npx wrangler d1 execute pos-contact-db --file=backup-file.sql
```

## 🐛 Troubleshooting

### Form Not Submitting
- Check worker URL in `assets/js/script.js`
- Verify worker is deployed: `npx wrangler deployments list`
- Check browser console for errors

### Admin Panel Shows "Unauthorized"
- Verify token matches between `worker.js` and admin panel
- Clear browser localStorage
- Check worker logs: `npm run tail`

### Database Errors
- Re-run: `npm run db:init`
- Check database exists: `npx wrangler d1 list`

## 📈 Performance

- **Cloudflare Workers** - Global edge network, <50ms response time
- **D1 Database** - Low-latency SQLite at the edge
- **GitHub Pages** - CDN-backed static hosting
- **Free Tier Limits**:
  - 100,000 requests/day
  - 5 GB database storage
  - 5M database reads/day
  - 100K database writes/day

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👨‍💻 Author

**AlzabeerWeb**
- Email: poskhotiyan@gmail.com
- Phone: +880 1685-253524

## 🙏 Acknowledgments

- Cloudflare Workers & D1 for serverless infrastructure
- GitHub Pages for free hosting
- Font Awesome for icons
- Google Fonts for typography

## 📞 Support

Need help? 
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for detailed setup
- Check [QUICK_SETUP.md](QUICK_SETUP.md) for quick reference
- Open an issue on GitHub
- Contact us via email

---

**Made with ❤️ for POS Khotiyan**
