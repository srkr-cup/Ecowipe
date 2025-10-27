@echo off
echo Starting EcoWipe Development Environment...

echo Checking MongoDB...
mongod --version > nul 2>&1
if errorlevel 1 (
    echo MongoDB is not installed or not in PATH
    exit /b 1
)

echo Starting application...
cd /d "%~dp0"
npm run dev