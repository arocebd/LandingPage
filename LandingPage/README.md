# AlzabeerWeb POS Landing Page

A modern, responsive landing page for AlzabeerWeb POS system with bilingual support (English/Bangla).

## 🌟 Features

- **Modern Design**: Clean, professional UI with orange brand colors and gradient effects
- **Bilingual Support**: Switch between English and Bangla languages
- **Fully Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **Animated Elements**: Smooth animations and transitions using AOS library
- **Hero Section**: Eye-catching hero with animated dashboard mockup
- **Features Showcase**: 9 comprehensive feature cards highlighting POS capabilities
- **Pricing Section**: 3 pricing tiers (Free Trial, Monthly, Yearly)
- **Tutorial Section**: Video tutorial placeholder (add YouTube link later)
- **Contact Form**: Functional contact form with validation
- **Registration Integration**: Links to main registration page at `http://localhost:5173/registration`

## 📁 Project Structure

```
LandingPage/
├── index.html              # Main HTML file
├── assets/
│   ├── css/
│   │   └── style.css      # All styles with responsive design
│   ├── js/
│   │   └── script.js      # JavaScript functionality
│   └── images/            # Placeholder for images
│       └── (Add your logo and images here)
└── README.md              # This file
```

## 🚀 Quick Start

### Method 1: Python HTTP Server (Recommended)

1. Open PowerShell or Command Prompt
2. Navigate to the LandingPage folder:
   ```bash
   cd c:\Users\User\Desktop\AlzabeerWeb\pos\LandingPage
   ```
3. Run Python HTTP server on port 3000:
   ```bash
   python -m http.server 3000
   ```
4. Open your browser and visit: `http://localhost:3000`

### Method 2: Node.js Serve

1. Install `serve` globally (if not already installed):
   ```bash
   npm install -g serve
   ```
2. Navigate to the LandingPage folder:
   ```bash
   cd c:\Users\User\Desktop\AlzabeerWeb\pos\LandingPage
   ```
3. Run serve on port 3000:
   ```bash
   serve -l 3000
   ```
4. Open your browser and visit: `http://localhost:3000`

### Method 3: Live Server (VS Code Extension)

1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"
4. Page will open automatically in your default browser

## 🎨 Customization

### Adding Your Logo

1. Place your logo image in `assets/images/` folder
2. Open `index.html`
3. Find the logo section (line ~28):
   ```html
   <!-- <img src="assets/images/logo.png" alt="AlzabeerWeb POS Logo"> -->
   ```
4. Uncomment and update the path to your logo:
   ```html
   <img src="assets/images/your-logo.png" alt="AlzabeerWeb POS Logo">
   ```
5. You can hide the emoji icon placeholder after adding your logo

### Adding Tutorial Video

1. Upload your tutorial video to YouTube
2. Open `index.html`
3. Find the video placeholder section (line ~486):
   ```html
   <!-- <iframe width="100%" height="500" src="YOUR_YOUTUBE_VIDEO_LINK" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> -->
   ```
4. Replace `YOUR_YOUTUBE_VIDEO_LINK` with your actual YouTube embed link
5. Uncomment the iframe and comment/remove the placeholder div

### Changing Colors

Open `assets/css/style.css` and modify CSS variables in the `:root` section:

```css
:root {
    --primary-color: #FF6B35;        /* Main orange color */
    --primary-dark: #E85A2B;         /* Darker shade */
    --primary-light: #FF8557;        /* Lighter shade */
    /* Add more customizations */
}
```

### Updating Contact Information

Edit the contact section in `index.html` (around line ~535):
- Phone: `+880 1791-927084`
- Email: `support@alzabeerweb.com`
- Location: Update as needed

## 🌐 Language Support

The landing page supports two languages:
- **English** (Default)
- **বাংলা (Bangla)**

Users can switch languages using the language switcher in the navigation bar.

### Adding More Translations

Edit `assets/js/script.js` and add new translations to the `translations` object:

```javascript
const translations = {
    en: {
        "New Text": "New Text in English"
    },
    bn: {
        "New Text": "বাংলায় নতুন টেক্সট"
    }
};
```

## 📱 Responsive Breakpoints

- **Desktop**: > 1024px
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px
- **Small Mobile**: < 480px

## 🔗 Integration with Main Application

The landing page is integrated with your main POS application:

- **Registration**: Links to `http://localhost:5173/registration`
- **Login**: Links to `http://localhost:5173/login`
- Make sure your main application is running on port 5173 (Vue.js frontend)

### Update Registration URL

If your frontend runs on a different port, update all registration links in `index.html`:

```html
<!-- Find and replace all instances -->
<a href="http://localhost:5173/registration" ...>
```

## 📦 Dependencies

All dependencies are loaded via CDN:
- **Google Fonts**: Poppins font family
- **AOS (Animate On Scroll)**: For scroll animations

No npm installation required!

## 🎯 Key Sections

1. **Hero Section**: Main call-to-action with animated dashboard mockup
2. **Features Section**: 9 feature cards showcasing POS capabilities
3. **Pricing Section**: 3 pricing plans + enterprise CTA
4. **Tutorial Section**: Video placeholder for tutorials
5. **Contact Section**: Contact information + functional form
6. **Footer**: Links, social media, copyright

## 🔧 Browser Support

- Chrome (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📈 Performance Tips

- Images: Optimize all images before uploading (use WebP format when possible)
- Logo: Keep logo file size under 100KB
- Videos: Use YouTube embed instead of hosting locally

## 🐛 Troubleshooting

### Port Already in Use

If port 3000 is already in use, try a different port:
```bash
python -m http.server 3001
# or
serve -l 3001
```

### Links Not Working

Make sure your main Vue.js application is running on port 5173:
```bash
cd frontend
npm run dev
```

### Animations Not Working

Check browser console for errors. Make sure AOS library is loaded from CDN.

## 📞 Support

For support, contact:
- **Phone**: +880 1791-927084
- **Email**: support@alzabeerweb.com

## 📝 License

© 2024 AlzabeerWeb POS. All rights reserved.

---

## 🎨 Color Palette

- Primary Orange: `#FF6B35`
- Dark Orange: `#E85A2B`
- Light Orange: `#FF8557`
- Secondary Dark: `#2C3E50`
- Accent Blue: `#3498DB`
- Accent Green: `#27AE60`
- Accent Purple: `#9B59B6`

## 🚀 Next Steps

1. ✅ Add your company logo to `assets/images/`
2. ✅ Update contact information in HTML
3. ✅ Add YouTube tutorial video link
4. ✅ Test on different devices and browsers
5. ✅ Deploy to production server

---

**Enjoy your new landing page! 🎉**
