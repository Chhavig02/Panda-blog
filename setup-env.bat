@echo off
echo Setting up environment variables for Panda Blog Platform...
echo.

echo Creating .env files for each service...
echo.

echo Creating User Service .env...
echo PORT=5001 > services\user-service\.env
echo MONGODB_URI=mongodb+srv://chhavi02:(Chhavi19)@cluster0.s7w0e2d.mongodb.net/panda-blog-users?retryWrites=true^&w=majority >> services\user-service\.env
echo JWT_SECRET=your-super-secret-jwt-key-change-in-production >> services\user-service\.env
echo JWT_EXPIRES_IN=24h >> services\user-service\.env
echo NODE_ENV=development >> services\user-service\.env

echo Creating Post Service .env...
echo PORT=5002 > services\post-service\.env
echo MONGODB_URI=mongodb+srv://chhavi02:(Chhavi19)@cluster0.s7w0e2d.mongodb.net/panda-blog-posts?retryWrites=true^&w=majority >> services\post-service\.env
echo USER_SERVICE_URL=http://localhost:5001 >> services\post-service\.env
echo JWT_SECRET=your-super-secret-jwt-key-change-in-production >> services\post-service\.env
echo NODE_ENV=development >> services\post-service\.env

echo Creating Comment Service .env...
echo PORT=5003 > services\comment-service\.env
echo MONGODB_URI=mongodb+srv://chhavi02:(Chhavi19)@cluster0.s7w0e2d.mongodb.net/panda-blog-comments?retryWrites=true^&w=majority >> services\comment-service\.env
echo USER_SERVICE_URL=http://localhost:5001 >> services\comment-service\.env
echo POST_SERVICE_URL=http://localhost:5002 >> services\comment-service\.env
echo JWT_SECRET=your-super-secret-jwt-key-change-in-production >> services\comment-service\.env
echo NODE_ENV=development >> services\comment-service\.env

echo Creating Gateway .env...
echo PORT=5000 > services\gateway\.env
echo USER_SERVICE_URL=http://localhost:5001 >> services\gateway\.env
echo POST_SERVICE_URL=http://localhost:5002 >> services\gateway\.env
echo COMMENT_SERVICE_URL=http://localhost:5003 >> services\gateway\.env
echo JWT_SECRET=your-super-secret-jwt-key-change-in-production >> services\gateway\.env
echo NODE_ENV=development >> services\gateway\.env
echo CORS_ORIGIN=http://localhost:3000 >> services\gateway\.env

echo Creating Frontend .env.local...
echo NEXT_PUBLIC_API_URL=http://localhost:5000 > frontend\.env.local

echo.
echo ✅ All .env files created successfully!
echo.
echo You can now start the services using:
echo   start-all.bat
echo.
pause

