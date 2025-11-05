@echo off
echo ========================================
echo 🐼 Panda Blog Platform - Restart All
echo ========================================
echo.

echo Step 1: Killing existing processes...
call kill-ports.bat

echo.
echo Step 2: Starting all services...
echo.

echo Starting User Service...
start "User Service" cmd /k "cd services\user-service && npm run dev"

timeout /t 3 /nobreak >nul

echo Starting Post Service...
start "Post Service" cmd /k "cd services\post-service && npm run dev"

timeout /t 3 /nobreak >nul

echo Starting Comment Service...
start "Comment Service" cmd /k "cd services\comment-service && npm run dev"

timeout /t 3 /nobreak >nul

echo Starting API Gateway...
start "API Gateway" cmd /k "cd services\gateway && npm run dev"

timeout /t 3 /nobreak >nul

echo Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ✅ All services are starting in separate windows!
echo.
echo Please wait 10-15 seconds for all services to connect to MongoDB...
echo.
echo Service URLs:
echo   Frontend: http://localhost:3000
echo   API Gateway: http://localhost:5000
echo.
echo Press any key to exit this window (services will continue running)...
pause >nul

