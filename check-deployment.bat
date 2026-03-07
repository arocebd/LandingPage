@echo off
echo ========================================
echo   Cloudflare Deployment Guide
echo ========================================
echo.
echo Your changes have been pushed to GitHub!
echo.
echo To check deployment status:
echo.
echo 1. Go to: https://dash.cloudflare.com/
echo 2. Click "Workers & Pages"
echo 3. Select "landingpage" project
echo 4. View latest deployment status
echo.
echo Your site should be live at:
echo https://khotiyan.com
echo.
echo ========================================
echo   Verify Your Changes
echo ========================================
echo.
echo 1. Sitemap: https://khotiyan.com/sitemap.xml
echo 2. Robots:  https://khotiyan.com/robots.txt
echo.
echo If deployment is complete (usually 1-3 minutes):
echo - Both URLs should work
echo - Sitemap should show XML (not HTML)
echo.
echo ========================================
echo   Next: Submit to Google
echo ========================================
echo.
echo 1. Go to: https://search.google.com/search-console
echo 2. Remove old HTML sitemap
echo 3. Add: https://khotiyan.com/sitemap.xml
echo 4. Request indexing for homepage
echo.
pause
