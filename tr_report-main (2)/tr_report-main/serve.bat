@echo off
cd /d "%~dp0"
echo =========================================
echo  Local HTTP Server for TR Report
echo  URL: http://localhost:8080
echo  Press Ctrl+C to stop
echo =========================================
python -m http.server 8080
pause
