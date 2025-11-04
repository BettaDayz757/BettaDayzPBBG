@echo off
REM ============================================================================
REM BettaDayz PBBG - XAMPP Deployment Script
REM ============================================================================
REM This script automates the deployment of BettaDayz PBBG to XAMPP
REM 
REM Requirements:
REM   - XAMPP installed at d:\bettadayzweb\xampp\
REM   - Node.js and npm installed
REM   - Git installed (optional)
REM
REM Usage:
REM   deploy-xampp.bat [mode]
REM   
REM Modes:
REM   dev     - Start development server (default)
REM   build   - Build and copy to XAMPP htdocs
REM   full    - Full rebuild and deployment
REM   clean   - Clean build artifacts
REM ============================================================================

setlocal enabledelayedexpansion

REM Configuration
set "PROJECT_DIR=d:\bettadayzweb\BettaDayzPBBG"
set "XAMPP_DIR=d:\bettadayzweb\xampp"
set "HTDOCS_DIR=%XAMPP_DIR%\htdocs\bettadayz"
set "NODE_PORT=3000"

REM Color codes (for Windows 10+)
set "GREEN=[92m"
set "YELLOW=[93m"
set "RED=[91m"
set "BLUE=[94m"
set "RESET=[0m"

echo %BLUE%
echo ============================================================================
echo  BettaDayz PBBG - XAMPP Deployment Script
echo ============================================================================
echo %RESET%

REM Check if project directory exists
if not exist "%PROJECT_DIR%" (
    echo %RED%ERROR: Project directory not found: %PROJECT_DIR%%RESET%
    echo Please clone the repository first or update PROJECT_DIR in this script.
    pause
    exit /b 1
)

REM Parse command line argument
set "MODE=%~1"
if "%MODE%"=="" set "MODE=dev"

echo %YELLOW%Mode: %MODE%%RESET%
echo.

REM Navigate to project directory
cd /d "%PROJECT_DIR%"

REM Execute based on mode
if /i "%MODE%"=="dev" goto :dev_mode
if /i "%MODE%"=="build" goto :build_mode
if /i "%MODE%"=="full" goto :full_mode
if /i "%MODE%"=="clean" goto :clean_mode

echo %RED%ERROR: Unknown mode '%MODE%'%RESET%
echo.
echo Valid modes: dev, build, full, clean
pause
exit /b 1

REM ============================================================================
REM Development Mode - Start Dev Server
REM ============================================================================
:dev_mode
echo %GREEN%[DEV MODE] Starting development server...%RESET%
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo %YELLOW%Installing dependencies...%RESET%
    call npm install
    if errorlevel 1 (
        echo %RED%ERROR: Failed to install dependencies%RESET%
        pause
        exit /b 1
    )
)

echo.
echo %GREEN%Starting Next.js development server on port %NODE_PORT%...%RESET%
echo.
echo %BLUE%Access your application at:%RESET%
echo   - http://localhost:%NODE_PORT%
echo   - http://bettadayz.shop (via Apache proxy)
echo   - http://bettadayz.store (via Apache proxy)
echo.
echo %YELLOW%Press Ctrl+C to stop the server%RESET%
echo.

REM Start the development server
npm run dev

goto :end

REM ============================================================================
REM Build Mode - Build and Deploy to XAMPP
REM ============================================================================
:build_mode
echo %GREEN%[BUILD MODE] Building and deploying to XAMPP...%RESET%
echo.

REM Step 1: Install dependencies
echo %YELLOW%[1/5] Checking dependencies...%RESET%
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo %RED%ERROR: Failed to install dependencies%RESET%
        pause
        exit /b 1
    )
) else (
    echo Dependencies already installed.
)

REM Step 2: Build the application
echo.
echo %YELLOW%[2/5] Building application...%RESET%
call npm run build
if errorlevel 1 (
    echo %RED%ERROR: Build failed%RESET%
    pause
    exit /b 1
)

REM Step 3: Create htdocs directory if it doesn't exist
echo.
echo %YELLOW%[3/5] Preparing XAMPP directory...%RESET%
if not exist "%HTDOCS_DIR%" (
    echo Creating directory: %HTDOCS_DIR%
    mkdir "%HTDOCS_DIR%"
)

REM Step 4: Copy build output to XAMPP
echo.
echo %YELLOW%[4/5] Copying files to XAMPP...%RESET%
if exist "out" (
    echo Copying from 'out' directory...
    xcopy /E /I /Y /Q "out\*" "%HTDOCS_DIR%\"
) else if exist ".next" (
    echo Copying from '.next' directory...
    xcopy /E /I /Y /Q ".next\*" "%HTDOCS_DIR%\.next\"
    if exist "public" (
        echo Copying public assets...
        xcopy /E /I /Y /Q "public\*" "%HTDOCS_DIR%\public\"
    )
) else (
    echo %RED%ERROR: No build output found%RESET%
    pause
    exit /b 1
)

REM Step 5: Copy configuration files
echo.
echo %YELLOW%[5/5] Copying configuration files...%RESET%
if exist "_redirects" (
    copy /Y "_redirects" "%HTDOCS_DIR%\_redirects"
)
if exist "_headers" (
    copy /Y "_headers" "%HTDOCS_DIR%\_headers"
)
if exist ".htaccess" (
    copy /Y ".htaccess" "%HTDOCS_DIR%\.htaccess"
)

echo.
echo %GREEN%Deployment to XAMPP completed successfully!%RESET%
echo.
echo %BLUE%Access your application at:%RESET%
echo   - http://bettadayz.shop
echo   - http://bettadayz.store
echo.

goto :end

REM ============================================================================
REM Full Mode - Clean, Install, Build, Deploy
REM ============================================================================
:full_mode
echo %GREEN%[FULL MODE] Full rebuild and deployment...%RESET%
echo.

REM Step 1: Clean
echo %YELLOW%[1/6] Cleaning previous builds...%RESET%
if exist "node_modules" (
    echo Removing node_modules...
    rmdir /S /Q "node_modules"
)
if exist "out" (
    echo Removing out directory...
    rmdir /S /Q "out"
)
if exist ".next" (
    echo Removing .next directory...
    rmdir /S /Q ".next"
)

REM Step 2: Install dependencies
echo.
echo %YELLOW%[2/6] Installing dependencies...%RESET%
call npm install
if errorlevel 1 (
    echo %RED%ERROR: Failed to install dependencies%RESET%
    pause
    exit /b 1
)

REM Step 3: Update dependencies
echo.
echo %YELLOW%[3/6] Updating dependencies...%RESET%
call npm update

REM Step 4: Build
echo.
echo %YELLOW%[4/6] Building application...%RESET%
call npm run build
if errorlevel 1 (
    echo %RED%ERROR: Build failed%RESET%
    pause
    exit /b 1
)

REM Step 5: Clean XAMPP directory
echo.
echo %YELLOW%[5/6] Cleaning XAMPP directory...%RESET%
if exist "%HTDOCS_DIR%" (
    echo Removing old deployment...
    rmdir /S /Q "%HTDOCS_DIR%"
)
mkdir "%HTDOCS_DIR%"

REM Step 6: Deploy to XAMPP
echo.
echo %YELLOW%[6/6] Deploying to XAMPP...%RESET%
if exist "out" (
    xcopy /E /I /Y /Q "out\*" "%HTDOCS_DIR%\"
) else if exist ".next" (
    xcopy /E /I /Y /Q ".next\*" "%HTDOCS_DIR%\.next\"
    if exist "public" (
        xcopy /E /I /Y /Q "public\*" "%HTDOCS_DIR%\public\"
    )
)

echo.
echo %GREEN%Full deployment completed successfully!%RESET%
echo.

goto :end

REM ============================================================================
REM Clean Mode - Remove Build Artifacts
REM ============================================================================
:clean_mode
echo %GREEN%[CLEAN MODE] Cleaning build artifacts...%RESET%
echo.

set /p CONFIRM="Are you sure you want to clean all build artifacts? (Y/N): "
if /i not "%CONFIRM%"=="Y" (
    echo Cancelled.
    goto :end
)

echo %YELLOW%Removing build directories...%RESET%
if exist "node_modules" (
    echo Removing node_modules...
    rmdir /S /Q "node_modules"
)
if exist "out" (
    echo Removing out...
    rmdir /S /Q "out"
)
if exist ".next" (
    echo Removing .next...
    rmdir /S /Q ".next"
)
if exist "package-lock.json" (
    echo Removing package-lock.json...
    del /Q "package-lock.json"
)

echo.
echo %GREEN%Clean completed!%RESET%
echo Run 'deploy-xampp.bat full' to rebuild.
echo.

goto :end

REM ============================================================================
REM End
REM ============================================================================
:end
echo.
echo %BLUE%============================================================================%RESET%
echo.
pause
exit /b 0
