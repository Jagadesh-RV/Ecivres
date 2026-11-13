# EcivreS Platform — Local Full-Stack Runtime & Socket Inspection Utility
# Checks Docker daemon status, active listening sockets, and HTTP API probes.

param(
    [string]$ApiHost = "http://localhost:5001",
    [string]$WebHost = "http://localhost:3000",
    [int]$DbPort = 5433,
    [int]$RedisPort = 6379
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " EcivreS Platform — Local Runtime Health & Socket Audit    " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Inspect Sockets
Write-Host "`n[1/3] Inspecting Network Sockets..." -ForegroundColor Yellow
$ports = @($DbPort, $RedisPort, 5001, 3000)
$connections = Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue | Where-Object { $_.LocalPort -in $ports }

foreach ($p in $ports) {
    $conn = $connections | Where-Object { $_.LocalPort -eq $p } | Select-Object -First 1
    if ($conn) {
        Write-Host "  [OK] Port $p is LISTENING (PID: $($conn.OwningProcess))" -ForegroundColor Green
    } else {
        Write-Host "  [--] Port $p is NOT LISTENING" -ForegroundColor Gray
    }
}

# 2. Inspect Docker Engine
Write-Host "`n[2/3] Checking Docker Engine Status..." -ForegroundColor Yellow
try {
    $dockerInfo = docker info 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  [OK] Docker Engine daemon is ACTIVE" -ForegroundColor Green
    } else {
        Write-Host "  [WARN] Docker Engine daemon is STOPPED or UNREACHABLE" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  [WARN] Docker CLI execution encountered an exception: $_" -ForegroundColor Yellow
}

# 3. Probe HTTP Endpoints if API is active
Write-Host "`n[3/3] Probing HTTP Endpoints..." -ForegroundColor Yellow
try {
    $liveRes = Invoke-RestMethod -Uri "$ApiHost/api/v1/health/live" -TimeoutSec 3 -ErrorAction Stop
    Write-Host "  [OK] API Liveness: Status=$($liveRes.status), Uptime=$($liveRes.uptimeSeconds)s" -ForegroundColor Green
} catch {
    Write-Host "  [--] API Liveness probe at $ApiHost/api/v1/health/live did not respond" -ForegroundColor Gray
}

try {
    $connRes = Invoke-RestMethod -Uri "$ApiHost/api/v1/health/connectivity" -TimeoutSec 3 -ErrorAction Stop
    Write-Host "  [OK] Infrastructure Connectivity: DB=$($connRes.database.status), Redis=$($connRes.redis.status)" -ForegroundColor Green
} catch {
    Write-Host "  [--] Connectivity probe at $ApiHost/api/v1/health/connectivity did not respond" -ForegroundColor Gray
}

try {
    $webRes = Invoke-WebRequest -Uri "$WebHost/" -TimeoutSec 3 -ErrorAction Stop
    Write-Host "  [OK] Web Frontend: HTTP Status=$($webRes.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "  [--] Web Frontend probe at $WebHost/ did not respond" -ForegroundColor Gray
}

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host " Runtime Inspection Complete                             " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
