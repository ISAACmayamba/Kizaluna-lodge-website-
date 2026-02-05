@echo off
echo ========================================
echo  Kizaluna Lodge - Quick Start Script
echo ========================================
echo.

echo Step 1: Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo.

echo Step 2: Setting up database...
call npm run setup-db
if %errorlevel% neq 0 (
    echo ERROR: Failed to setup database
    echo.
    echo Make sure:
    echo 1. MySQL is installed and running
    echo 2. .env file has correct credentials
    pause
    exit /b 1
)
echo.

echo ========================================
echo  Setup Complete!
echo ========================================
echo.
echo Starting server...
echo Press Ctrl+C to stop the server
echo.
call npm start
