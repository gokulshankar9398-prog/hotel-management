@echo off
title Grand Royale – Smart Hotel Booking System - Server
echo ===============================================================
echo   Grand Royale – Launching Smart Hotel Booking System...
echo ===============================================================
echo.
echo Opening http://localhost:3000/#rooms in your browser...
cd /d "%~dp0"
start "" "http://localhost:3000/#rooms"
node server.js
pause
