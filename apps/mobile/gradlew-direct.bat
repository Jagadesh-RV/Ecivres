@echo off
REM Direct Gradle wrapper that bypasses the network-dependent gradlew.bat
REM Uses cached Gradle 9.4.1 to avoid java.net.ConnectException issues

setlocal enabledelayedexpansion

REM Set GRADLE_HOME to cached Gradle 9.4.1
set "GRADLE_HOME=%USERPROFILE%\.gradle\wrapper\dists\gradle-9.4.1-bin\gradle-9.4.1"

REM Run Gradle with all arguments passed through
"%GRADLE_HOME%\bin\gradle.bat" %*

endlocal
