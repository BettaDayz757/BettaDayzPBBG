@echo off
REM ============================================================================
REM BettaDayz PBBG - Quick Domain Connection Setup
REM ============================================================================
REM This script helps you quickly connect both domains for editing
REM ============================================================================

setlocal enabledelayedexpansion

set "GREEN=[92m"
set "YELLOW=[93m"
set "RED=[91m"
set "BLUE=[94m"
set "RESET=[0m"

echo %BLUE%
echo ============================================================================
echo  BettaDayz PBBG - Domain Connection Setup
echo ============================================================================
echo %RESET%
echo.

REM Configuration
set "XAMPP_DIR=d:\bettadayzweb\xampp"
set "HOSTS_FILE=C:\Windows\System32\drivers\etc\hosts"

echo %YELLOW%Checking if running as Administrator...%RESET%
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo %RED%ERROR: This script requires Administrator privileges%RESET%
    echo.
    echo %YELLOW%Right-click this file and select "Run as Administrator"%RESET%
    echo.
    pause
    exit /b 1
)

echo %GREEN%✓ Running as Administrator%RESET%
echo.

REM ============================================================================
REM Step 1: Check XAMPP Installation
REM ============================================================================
echo %YELLOW%[1/5] Checking XAMPP installation...%RESET%
if exist "%XAMPP_DIR%" (
    echo %GREEN%✓ XAMPP found at %XAMPP_DIR%%RESET%
) else (
    echo %RED%✗ XAMPP not found at %XAMPP_DIR%%RESET%
    echo Please install XAMPP or update XAMPP_DIR in this script
    pause
    exit /b 1
)
echo.

REM ============================================================================
REM Step 2: Update Hosts File
REM ============================================================================
echo %YELLOW%[2/5] Updating Windows hosts file...%RESET%

REM Check if entries already exist
findstr /C:"bettadayz.shop" "%HOSTS_FILE%" >nul 2>&1
if %errorlevel% equ 0 (
    echo %GREEN%✓ Domains already configured in hosts file%RESET%
) else (
    echo Adding domain entries to hosts file...
    echo. >> "%HOSTS_FILE%"
    echo # BettaDayz PBBG Local Development >> "%HOSTS_FILE%"
    echo 127.0.0.1       bettadayz.shop >> "%HOSTS_FILE%"
    echo 127.0.0.1       www.bettadayz.shop >> "%HOSTS_FILE%"
    echo 127.0.0.1       bettadayz.store >> "%HOSTS_FILE%"
    echo 127.0.0.1       www.bettadayz.store >> "%HOSTS_FILE%"
    echo %GREEN%✓ Domain entries added%RESET%
)
echo.

REM ============================================================================
REM Step 3: Flush DNS Cache
REM ============================================================================
echo %YELLOW%[3/5] Flushing DNS cache...%RESET%
ipconfig /flushdns >nul 2>&1
echo %GREEN%✓ DNS cache flushed%RESET%
echo.

REM ============================================================================
REM Step 4: Open Domain Folders in Explorer
REM ============================================================================
echo %YELLOW%[4/5] Opening domain folders...%RESET%

set "STORE_DIR=%XAMPP_DIR%\htdocs\bettadayz-store"
set "SHOP_DIR=%XAMPP_DIR%\htdocs\bettadayz-shop"

if not exist "%STORE_DIR%" (
    echo Creating bettadayz-store directory...
    mkdir "%STORE_DIR%"
)

if not exist "%SHOP_DIR%" (
    echo Creating bettadayz-shop directory...
    mkdir "%SHOP_DIR%"
)

REM Open both directories in Explorer
start "" explorer "%STORE_DIR%"
start "" explorer "%SHOP_DIR%"

echo %GREEN%✓ Domain folders opened in Explorer%RESET%
echo.

REM ============================================================================
REM Step 5: Open Domains in Browser
REM ============================================================================
echo %YELLOW%[5/5] Opening domains in browser...%RESET%

REM Wait a moment for Apache to be ready
timeout /t 2 /nobreak >nul

REM Open both domains in default browser
start "" "http://bettadayz.shop"
start "" "http://bettadayz.store"

echo %GREEN%✓ Domains opened in browser%RESET%
echo.

REM ============================================================================
REM Summary
REM ============================================================================
echo %BLUE%
echo ============================================================================
echo  Setup Complete!
echo ============================================================================
echo %RESET%
echo.
echo %GREEN%Your domains are now connected and ready for editing:%RESET%
echo.
echo %YELLOW%Domain Locations:%RESET%
echo   • bettadayz.shop  → %SHOP_DIR%
echo   • bettadayz.store → %STORE_DIR%
echo.
echo %YELLOW%Access URLs:%RESET%
echo   • http://bettadayz.shop
echo   • http://bettadayz.store
echo   • http://localhost/phpmyadmin
echo.
echo %YELLOW%Edit Files:%RESET%
echo   • Game files: %STORE_DIR%
echo   • Branding files: %SHOP_DIR%
echo.
echo %YELLOW%Quick Actions:%RESET%
echo   • Press [1] to open VS Code in game directory
echo   • Press [2] to open VS Code in shop directory
echo   • Press [3] to restart Apache
echo   • Press [4] to open phpMyAdmin
echo   • Press [Q] to quit
echo.

:menu
set /p choice="Select option: "

if /i "%choice%"=="1" (
    echo Opening VS Code for game domain...
    start "" code "%STORE_DIR%"
    goto menu
)

if /i "%choice%"=="2" (
    echo Opening VS Code for shop domain...
    start "" code "%SHOP_DIR%"
    goto menu
)

if /i "%choice%"=="3" (
    echo Restarting Apache...
    "%XAMPP_DIR%\apache_stop.bat" >nul 2>&1
    timeout /t 2 /nobreak >nul
    "%XAMPP_DIR%\apache_start.bat" >nul 2>&1
    echo %GREEN%✓ Apache restarted%RESET%
    goto menu
)

if /i "%choice%"=="4" (
    echo Opening phpMyAdmin...
    start "" "http://localhost/phpmyadmin"
    goto menu
)

if /i "%choice%"=="q" (
    goto end
)

if /i "%choice%"=="Q" (
    goto end
)

echo %RED%Invalid option%RESET%
goto menu

:end
echo.
echo %GREEN%Happy editing! 🚀%RESET%
echo.
pause
exit /b 0
