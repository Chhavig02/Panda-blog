@echo off
echo Starting ngrok tunnel for API Gateway (port 5000)...
echo.
echo Make sure your backend is running first!
echo.
ngrok http 5000
pause

