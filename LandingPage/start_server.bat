@echo off
echo ============================================
echo   AlzabeerWeb POS Landing Page Server
echo ============================================
echo.
echo Starting server on http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.
echo ============================================
echo.

cd /d "%~dp0"
python -m http.server 3000
