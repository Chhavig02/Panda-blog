@echo off
echo Killing all processes on ports 3000, 5000, 5001, 5002, 5003...
echo.

echo Killing port 3000 (Frontend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul

echo Killing port 5000 (API Gateway)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000 ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul

echo Killing port 5001 (User Service)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5001 ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul

echo Killing port 5002 (Post Service)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5002 ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul

echo Killing port 5003 (Comment Service)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5003 ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul

echo.
echo ✅ All ports cleared!
echo.
echo Waiting 2 seconds before starting services...
timeout /t 2 /nobreak >nul
echo.

