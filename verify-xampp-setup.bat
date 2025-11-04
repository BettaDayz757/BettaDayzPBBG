@echo off
REM ============================================================================
REM BettaDayz PBBG - XAMPP Setup Verification Script
REM ============================================================================
REM This script checks if your XAMPP environment is properly configured
REM ============================================================================

setlocal enabledelayedexpansion

REM Color codes
set "GREEN=[92m"
set "YELLOW=[93m"
set "RED=[91m"
set "BLUE=[94m"
set "RESET=[0m"

echo %BLUE%
echo ============================================================================
echo  BettaDayz PBBG - XAMPP Setup Verification
echo ============================================================================
echo %RESET%
echo.

REM Configuration
set "XAMPP_DIR=d:\bettadayzweb\xampp"
set "PROJECT_DIR=d:\bettadayzweb\BettaDayzPBBG"
set "HOSTS_FILE=C:\Windows\System32\drivers\etc\hosts"

REM Counters
set /a PASS=0
set /a FAIL=0
set /a WARN=0

REM ============================================================================
REM Check 1: XAMPP Installation
REM ============================================================================
echo [1/12] Checking XAMPP installation...
if exist "%XAMPP_DIR%" (
    echo %GREEN%✓ XAMPP directory found%RESET%
    set /a PASS+=1
) else (
    echo %RED%✗ XAMPP directory not found at %XAMPP_DIR%%RESET%
    set /a FAIL+=1
)
echo.

REM ============================================================================
REM Check 2: Apache Installation
REM ============================================================================
echo [2/12] Checking Apache...
if exist "%XAMPP_DIR%\apache\bin\httpd.exe" (
    echo %GREEN%✓ Apache installed%RESET%
    set /a PASS+=1
) else (
    echo %RED%✗ Apache not found%RESET%
    set /a FAIL+=1
)
echo.

REM ============================================================================
REM Check 3: PHP Installation
REM ============================================================================
echo [3/12] Checking PHP...
if exist "%XAMPP_DIR%\php\php.exe" (
    echo %GREEN%✓ PHP installed%RESET%
    set /a PASS+=1
) else (
    echo %YELLOW%⚠ PHP not found (optional)%RESET%
    set /a WARN+=1
)
echo.

REM ============================================================================
REM Check 4: MySQL Installation
REM ============================================================================
echo [4/12] Checking MySQL...
if exist "%XAMPP_DIR%\mysql\bin\mysqld.exe" (
    echo %GREEN%✓ MySQL installed%RESET%
    set /a PASS+=1
) else (
    echo %YELLOW%⚠ MySQL not found (optional)%RESET%
    set /a WARN+=1
)
echo.

REM ============================================================================
REM Check 5: Node.js Installation
REM ============================================================================
echo [5/12] Checking Node.js...
where node >nul 2>&1
if %errorlevel% equ 0 (
    echo %GREEN%✓ Node.js installed%RESET%
    node --version
    set /a PASS+=1
) else (
    echo %RED%✗ Node.js not found%RESET%
    echo   Please install Node.js from https://nodejs.org/
    set /a FAIL+=1
)
echo.

REM ============================================================================
REM Check 6: npm Installation
REM ============================================================================
echo [6/12] Checking npm...
where npm >nul 2>&1
if %errorlevel% equ 0 (
    echo %GREEN%✓ npm installed%RESET%
    npm --version
    set /a PASS+=1
) else (
    echo %RED%✗ npm not found%RESET%
    set /a FAIL+=1
)
echo.

REM ============================================================================
REM Check 7: Project Directory
REM ============================================================================
echo [7/12] Checking project directory...
if exist "%PROJECT_DIR%" (
    echo %GREEN%✓ Project directory found%RESET%
    set /a PASS+=1
) else (
    echo %RED%✗ Project directory not found at %PROJECT_DIR%%RESET%
    echo   Please clone the repository or update PROJECT_DIR
    set /a FAIL+=1
)
echo.

REM ============================================================================
REM Check 8: Virtual Hosts Configuration
REM ============================================================================
echo [8/12] Checking virtual hosts configuration...
if exist "%XAMPP_DIR%\apache\conf\extra\httpd-vhosts.conf" (
    findstr /C:"bettadayz.shop" "%XAMPP_DIR%\apache\conf\extra\httpd-vhosts.conf" >nul 2>&1
    if %errorlevel% equ 0 (
        echo %GREEN%✓ Virtual hosts configured%RESET%
        set /a PASS+=1
    ) else (
        echo %YELLOW%⚠ Virtual hosts file exists but not configured%RESET%
        echo   Copy xampp-httpd-vhosts.conf to this location
        set /a WARN+=1
    )
) else (
    echo %RED%✗ Virtual hosts configuration not found%RESET%
    set /a FAIL+=1
)
echo.

REM ============================================================================
REM Check 9: Hosts File
REM ============================================================================
echo [9/12] Checking Windows hosts file...
if exist "%HOSTS_FILE%" (
    findstr /C:"bettadayz.shop" "%HOSTS_FILE%" >nul 2>&1
    if %errorlevel% equ 0 (
        echo %GREEN%✓ Hosts file configured%RESET%
        set /a PASS+=1
    ) else (
        echo %YELLOW%⚠ Hosts file not configured%RESET%
        echo   Add domain entries to %HOSTS_FILE%
        set /a WARN+=1
    )
) else (
    echo %RED%✗ Hosts file not found%RESET%
    set /a FAIL+=1
)
echo.

REM ============================================================================
REM Check 10: Environment Configuration
REM ============================================================================
echo [10/12] Checking environment configuration...
if exist "%PROJECT_DIR%\.env.local" (
    echo %GREEN%✓ .env.local found%RESET%
    set /a PASS+=1
) else if exist "%PROJECT_DIR%\.env.xampp" (
    echo %YELLOW%⚠ .env.xampp exists but .env.local not found%RESET%
    echo   Copy .env.xampp to .env.local
    set /a WARN+=1
) else (
    echo %YELLOW%⚠ No environment configuration found%RESET%
    echo   Copy .env.xampp to .env.local
    set /a WARN+=1
)
echo.

REM ============================================================================
REM Check 11: Project Dependencies
REM ============================================================================
echo [11/12] Checking project dependencies...
if exist "%PROJECT_DIR%\node_modules" (
    echo %GREEN%✓ Dependencies installed%RESET%
    set /a PASS+=1
) else (
    echo %YELLOW%⚠ Dependencies not installed%RESET%
    echo   Run: npm install
    set /a WARN+=1
)
echo.

REM ============================================================================
REM Check 12: Port Availability
REM ============================================================================
echo [12/12] Checking port availability...
netstat -ano | findstr ":80 " >nul 2>&1
if %errorlevel% equ 0 (
    echo %YELLOW%⚠ Port 80 is in use%RESET%
    echo   Stop other web servers or change Apache port
    set /a WARN+=1
) else (
    echo %GREEN%✓ Port 80 available%RESET%
    set /a PASS+=1
)

netstat -ano | findstr ":3000 " >nul 2>&1
if %errorlevel% equ 0 (
    echo %YELLOW%⚠ Port 3000 is in use%RESET%
    echo   Stop other Node.js processes or change port
    set /a WARN+=1
) else (
    echo %GREEN%✓ Port 3000 available%RESET%
    set /a PASS+=1
)
echo.

REM ============================================================================
REM Summary
REM ============================================================================
echo %BLUE%
echo ============================================================================
echo  Verification Summary
echo ============================================================================
echo %RESET%
echo.
echo %GREEN%Passed: %PASS%%RESET%
echo %YELLOW%Warnings: %WARN%%RESET%
echo %RED%Failed: %FAIL%%RESET%
echo.

if %FAIL% gtr 0 (
    echo %RED%❌ Setup has critical issues that need to be fixed%RESET%
    echo.
    echo %YELLOW%Please fix the failed checks above before proceeding.%RESET%
    echo.
) else if %WARN% gtr 0 (
    echo %YELLOW%⚠️  Setup is mostly complete but has some warnings%RESET%
    echo.
    echo You can proceed but some features may not work correctly.
    echo.
) else (
    echo %GREEN%✅ Setup is complete! You're ready to start development.%RESET%
    echo.
    echo %BLUE%Next steps:%RESET%
    echo 1. Start Apache in XAMPP Control Panel
    echo 2. Run: cd %PROJECT_DIR%
    echo 3. Run: npm run dev
    echo 4. Visit: http://bettadayz.shop
    echo.
)

REM ============================================================================
REM Quick Fix Suggestions
REM ============================================================================
if %FAIL% gtr 0 (
    echo %BLUE%
    echo ============================================================================
    echo  Quick Fix Suggestions
    echo ============================================================================
    echo %RESET%
    echo.
    
    if not exist "%XAMPP_DIR%" (
        echo • Install XAMPP from https://www.apachefriends.org/
        echo   or update XAMPP_DIR in this script
        echo.
    )
    
    where node >nul 2>&1
    if %errorlevel% neq 0 (
        echo • Install Node.js from https://nodejs.org/
        echo.
    )
    
    if not exist "%PROJECT_DIR%" (
        echo • Clone the repository:
        echo   git clone https://github.com/BettaDayz757/BettaDayzPBBG.git %PROJECT_DIR%
        echo.
    )
    
    if not exist "%XAMPP_DIR%\apache\conf\extra\httpd-vhosts.conf" (
        echo • Copy xampp-httpd-vhosts.conf:
        echo   copy xampp-httpd-vhosts.conf "%XAMPP_DIR%\apache\conf\extra\httpd-vhosts.conf"
        echo.
    )
)

if %WARN% gtr 0 (
    echo %BLUE%
    echo ============================================================================
    echo  Recommended Actions
    echo ============================================================================
    echo %RESET%
    echo.
    
    if not exist "%PROJECT_DIR%\.env.local" (
        echo • Create environment file:
        echo   copy .env.xampp .env.local
        echo.
    )
    
    if not exist "%PROJECT_DIR%\node_modules" (
        echo • Install dependencies:
        echo   cd %PROJECT_DIR%
        echo   npm install
        echo.
    )
    
    findstr /C:"bettadayz.shop" "%HOSTS_FILE%" >nul 2>&1
    if %errorlevel% neq 0 (
        echo • Edit hosts file as Administrator:
        echo   notepad %HOSTS_FILE%
        echo   Add: 127.0.0.1  bettadayz.shop
        echo   Add: 127.0.0.1  bettadayz.store
        echo.
    )
)

echo %BLUE%
echo ============================================================================
echo  Documentation
echo ============================================================================
echo %RESET%
echo.
echo • Quick Start: XAMPP-QUICKSTART.md
echo • Full Guide: XAMPP-DEPLOYMENT-GUIDE.md
echo • Apache Config: xampp-httpd-vhosts.conf
echo • Deployment Script: deploy-xampp.bat
echo.

pause
exit /b %FAIL%
