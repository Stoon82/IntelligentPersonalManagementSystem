@echo off
echo Stopping existing servers...

:: Kill existing Node.js processes (Frontend)
taskkill /F /IM node.exe /T >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Stopped existing Node.js processes
) else (
    echo No existing Node.js processes found
)

:: Kill existing Python processes (Backend)
taskkill /F /IM python.exe /T >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Stopped existing Python processes
) else (
    echo No existing Python processes found
)

echo Starting IPMS Servers...

:: Start Backend Server
echo Starting Backend Server...
cd backend
start cmd /k "call venv\Scripts\activate && uvicorn main:app --reload --port 8000"

:: Wait a moment for backend to initialize
timeout /t 5

:: Start Frontend Server
echo Starting Frontend Server...
cd ../frontend
start cmd /k "npm start"

echo Servers are starting...
echo Backend will be available at: http://localhost:8000
echo Frontend will be available at: http://localhost:3000
echo API documentation will be available at: http://localhost:8000/docs

:: Keep the window open
pause
