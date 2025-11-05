Write-Host "Setting up environment variables for Panda Blog Platform..." -ForegroundColor Green
Write-Host ""

# User Service
Write-Host "Creating User Service .env..." -ForegroundColor Yellow
$userServiceEnv = @"
PORT=5001
MONGODB_URI=mongodb+srv://chhavi02:(Chhavi19)@cluster0.s7w0e2d.mongodb.net/panda-blog-users?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
NODE_ENV=development
"@
$userServiceEnv | Out-File -FilePath "services\user-service\.env" -Encoding utf8 -NoNewline

# Post Service
Write-Host "Creating Post Service .env..." -ForegroundColor Yellow
$postServiceEnv = @"
PORT=5002
MONGODB_URI=mongodb+srv://chhavi02:(Chhavi19)@cluster0.s7w0e2d.mongodb.net/panda-blog-posts?retryWrites=true&w=majority
USER_SERVICE_URL=http://localhost:5001
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
"@
$postServiceEnv | Out-File -FilePath "services\post-service\.env" -Encoding utf8 -NoNewline

# Comment Service
Write-Host "Creating Comment Service .env..." -ForegroundColor Yellow
$commentServiceEnv = @"
PORT=5003
MONGODB_URI=mongodb+srv://chhavi02:(Chhavi19)@cluster0.s7w0e2d.mongodb.net/panda-blog-comments?retryWrites=true&w=majority
USER_SERVICE_URL=http://localhost:5001
POST_SERVICE_URL=http://localhost:5002
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
"@
$commentServiceEnv | Out-File -FilePath "services\comment-service\.env" -Encoding utf8 -NoNewline

# Gateway
Write-Host "Creating Gateway .env..." -ForegroundColor Yellow
$gatewayEnv = @"
PORT=5000
USER_SERVICE_URL=http://localhost:5001
POST_SERVICE_URL=http://localhost:5002
COMMENT_SERVICE_URL=http://localhost:5003
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
"@
$gatewayEnv | Out-File -FilePath "services\gateway\.env" -Encoding utf8 -NoNewline

# Frontend
Write-Host "Creating Frontend .env.local..." -ForegroundColor Yellow
$frontendEnv = @"
NEXT_PUBLIC_API_URL=http://localhost:5000
"@
$frontendEnv | Out-File -FilePath "frontend\.env.local" -Encoding utf8 -NoNewline

Write-Host ""
Write-Host "✅ All .env files created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "You can now start the services using:" -ForegroundColor Cyan
Write-Host "  .\start-all.bat" -ForegroundColor White
Write-Host ""

