@echo off
echo Starting Panda Blog Platform...
echo.

echo Starting User Service...
start "User Service" cmd /k "cd services\user-service && npm run dev"

timeout /t 2 /nobreak >nul

echo Starting Post Service...
start "Post Service" cmd /k "cd services\post-service && npm run dev"

timeout /t 2 /nobreak >nul

echo Starting Comment Service...
start "Comment Service" cmd /k "cd services\comment-service && npm run dev"

timeout /t 2 /nobreak >nul

echo Starting API Gateway...
start "API Gateway" cmd /k "cd services\gateway && npm run dev"

timeout /t 2 /nobreak >nul

echo Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo All services are starting in separate windows!
echo.
echo Frontend will be available at: http://localhost:3000
echo API Gateway will be available at: http://localhost:5000
echo.
echo Press any key to exit this window (services will continue running)...
pause >nul

