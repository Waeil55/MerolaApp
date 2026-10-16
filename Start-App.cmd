@echo off
cd /d "%~dp0"
where node >nul 2>nul
if %errorlevel%==0 (
  start "" http://localhost:8077
  node serve.js
) else (
  echo Node.js was not found. Opening the app directly from the file instead.
  start "" "%~dp0index.html"
)
