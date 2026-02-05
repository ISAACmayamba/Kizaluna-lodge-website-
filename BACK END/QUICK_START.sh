#!/bin/bash

echo "========================================"
echo " Kizaluna Lodge - Quick Start Script"
echo "========================================"
echo ""

echo "Step 1: Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi
echo ""

echo "Step 2: Setting up database..."
npm run setup-db
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to setup database"
    echo ""
    echo "Make sure:"
    echo "1. MySQL is installed and running"
    echo "2. .env file has correct credentials"
    exit 1
fi
echo ""

echo "========================================"
echo " Setup Complete!"
echo "========================================"
echo ""
echo "Starting server..."
echo "Press Ctrl+C to stop the server"
echo ""
npm start
