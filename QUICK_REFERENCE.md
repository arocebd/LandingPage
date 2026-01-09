# Quick Reference Guide - Landing Page Updates

This guide helps you quickly find and update common elements in the landing page.

## 🔄 Common Updates

### 1. Change Registration URL

**File**: `index.html`

**Find all instances of**:
```html
http://localhost:5173/registration
```

**Replace with your URL**:
```html
http://your-domain.com/registration
```

**Lines to update**:
- Line ~35: Navigation button
- Line ~80: Hero primary button
- Line ~327: Free Trial button
- Line ~352: Monthly Plan button
- Line ~377: Yearly Plan button

---

### 2. Update Phone Number

**Current**: `+880 1791-927084`

**Files to update**:
- `index.html` (line ~545)

---

### 3. Update Email Address

**Current**: `support@alzabeerweb.com`

**Files to update**:
- `index.html` (line ~558)

---

### 4. Add Logo

**Steps**:
1. Save your logo as `logo.png` in `assets/images/` folder
2. Open `index.html`
3. Go to line ~28
4. Uncomment this line:
   ```html
   <img src="assets/images/logo.png" alt="AlzabeerWeb POS Logo">
   ```
5. Optionally hide emoji icon by removing/commenting:
   ```html
   <span class="logo-icon">🏪</span>
   ```

---

### 5. Add Tutorial Video

**Steps**:
1. Upload video to YouTube
2. Get embed code/link
3. Open `index.html`
4. Go to line ~486
5. Uncomment and update iframe:
   ```html
   <iframe width="100%" height="500" 
           src="https://www.youtube.com/embed/YOUR_VIDEO_ID" 
           frameborder="0" 
           allowfullscreen>
   </iframe>
   ```
6. Comment out or remove the placeholder div above it

---

### 6. Change Pricing

**File**: `index.html`

**Free Trial** (line ~307-327):
- Change duration: `7 Days Full Access`

**Monthly Plan** (line ~332-352):
- Current: `৳750`
- Line ~343: Update amount

**Yearly Plan** (line ~357-377):
- Current: `৳7,990`
- Line ~368: Update amount

---

### 7. Update Company Name

**Find all instances of**: `AlzabeerWeb POS`

**Files**: `index.html`

**Replace with your company name**

---

### 8. Change Primary Color

**File**: `assets/css/style.css`

**Line ~18-21**:
```css
:root {
    --primary-color: #FF6B35;        /* Your new color */
    --primary-dark: #E85A2B;         /* Darker shade */
    --primary-light: #FF8557;        /* Lighter shade */
}
```

---

### 9. Add New Feature Card

**File**: `index.html`

**Location**: After line ~286, before `</div>` of features-grid

**Template**:
```html
<div class="feature-card" data-aos="fade-up">
    <div class="feature-icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <!-- Add your icon SVG path here -->
        </svg>
    </div>
    <h3 class="feature-title" data-en="Feature Name" data-bn="ফিচার নাম">
        Feature Name
    </h3>
    <p class="feature-description" data-en="Description" data-bn="বর্ণনা">
        Feature description here
    </p>
</div>
```

---

### 10. Add Social Media Links

**File**: `index.html`

**Location**: Footer social links (line ~653-671)

**Update href attributes**:
```html
<a href="https://facebook.com/your-page" class="social-link">
<a href="https://twitter.com/your-handle" class="social-link">
<a href="https://t.me/your-channel" class="social-link">
<a href="https://instagram.com/your-profile" class="social-link">
```

---

### 11. Add Translation for New Text

**File**: `assets/js/script.js`

**Location**: `translations` object (starts at line ~3)

**Add to both English and Bangla**:
```javascript
const translations = {
    en: {
        "Your New Text": "Your New Text",
        // ... other translations
    },
    bn: {
        "Your New Text": "আপনার নতুন টেক্সট",
        // ... other translations
    }
};
```

**In HTML, add attributes**:
```html
<element data-en="Your New Text" data-bn="আপনার নতুন টেক্সট">
    Your New Text
</element>
```

---

### 12. Change Server Port

**Method 1 - Python**: In `start_server.bat`:
```batch
python -m http.server 3001
```

**Method 2 - Terminal**:
```bash
python -m http.server 3001
```

---

### 13. Update Footer Copyright Year

**File**: `index.html`

**Line ~688**: Year updates automatically via JavaScript
```html
<span id="currentYear"></span>
```

If you want a static year, replace with:
```html
2024-2025
```

---

### 14. Disable Language Switcher

**File**: `index.html`

**Line ~37-41**: Comment out or remove:
```html
<!-- 
<div class="language-switcher">
    ...
</div>
-->
```

---

### 15. Add Google Analytics

**File**: `index.html`

**Add before closing `</head>` tag**:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

### 16. Change Font

**File**: `assets/css/style.css`

**Line ~13**: Update Google Fonts link in HTML head:
```html
<link href="https://fonts.googleapis.com/css2?family=Your+Font:wght@300;400;600;700&display=swap" rel="stylesheet">
```

**Line ~53 in CSS**: Update font family:
```css
--font-family: 'Your Font', sans-serif;
```

---

## 📱 Testing Checklist

After making updates:

- [ ] Test on Chrome
- [ ] Test on Firefox
- [ ] Test on Safari
- [ ] Test on mobile devices
- [ ] Check all links work
- [ ] Verify language switcher
- [ ] Test contact form
- [ ] Check responsive design
- [ ] Verify all images load
- [ ] Test smooth scrolling

---

## 🚨 Important Files

**DO NOT DELETE**:
- `index.html` - Main HTML file
- `assets/css/style.css` - All styling
- `assets/js/script.js` - All functionality

**CAN CUSTOMIZE**:
- `README.md` - Documentation
- `start_server.bat` - Server launcher
- `assets/images/` - Add your images

---

## 🆘 Need Help?

If something breaks:
1. Revert to backup
2. Check browser console for errors (F12)
3. Validate HTML at validator.w3.org
4. Check CSS syntax

---

**Last Updated**: January 2024
