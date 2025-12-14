# 빌드 테스트 스크립트 (Windows PowerShell)
# 
# 이 스크립트는 프로덕션 빌드를 테스트하고 결과를 요약합니다.
# 배포 전에 로컬에서 빌드가 성공하는지 확인하는 데 사용됩니다.

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  My Trip - 빌드 테스트 시작" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. .next 폴더 삭제
Write-Host "[1/4] .next 폴더 삭제 중..." -ForegroundColor Yellow
if (Test-Path .next) {
    Remove-Item -Recurse -Force .next
    Write-Host "  ✓ .next 폴더 삭제 완료" -ForegroundColor Green
} else {
    Write-Host "  ✓ .next 폴더가 없습니다 (건너뜀)" -ForegroundColor Green
}
Write-Host ""

# 2. 의존성 설치
Write-Host "[2/4] 의존성 설치 중 (pnpm install)..." -ForegroundColor Yellow
$installResult = pnpm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ✗ 의존성 설치 실패" -ForegroundColor Red
    exit 1
}
Write-Host "  ✓ 의존성 설치 완료" -ForegroundColor Green
Write-Host ""

# 3. 빌드 실행
Write-Host "[3/4] 프로덕션 빌드 실행 중 (pnpm build)..." -ForegroundColor Yellow
Write-Host "  이 작업은 몇 분이 걸릴 수 있습니다..." -ForegroundColor Gray
Write-Host ""

$buildStartTime = Get-Date
$buildResult = pnpm build 2>&1
$buildEndTime = Get-Date
$buildDuration = ($buildEndTime - $buildStartTime).TotalSeconds

Write-Host ""
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ✗ 빌드 실패" -ForegroundColor Red
    Write-Host ""
    Write-Host "빌드 에러 출력:" -ForegroundColor Red
    Write-Host $buildResult -ForegroundColor Red
    exit 1
}

Write-Host "  ✓ 빌드 성공 (소요 시간: $([math]::Round($buildDuration, 2))초)" -ForegroundColor Green
Write-Host ""

# 4. 빌드 결과 요약
Write-Host "[4/4] 빌드 결과 요약 중..." -ForegroundColor Yellow

# .next 폴더 크기 확인
if (Test-Path .next) {
    $nextSize = (Get-ChildItem -Path .next -Recurse -ErrorAction SilentlyContinue | 
                 Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "  ✓ .next 폴더 크기: $([math]::Round($nextSize, 2)) MB" -ForegroundColor Green
} else {
    Write-Host "  ✗ .next 폴더를 찾을 수 없습니다" -ForegroundColor Red
}

# .next/server 폴더 확인
if (Test-Path .next/server) {
    $serverPages = (Get-ChildItem -Path .next/server/app -Recurse -Filter "*.js" -ErrorAction SilentlyContinue).Count
    Write-Host "  ✓ 서버 페이지 수: $serverPages" -ForegroundColor Green
}

# .next/static 폴더 확인
if (Test-Path .next/static) {
    $staticSize = (Get-ChildItem -Path .next/static -Recurse -ErrorAction SilentlyContinue | 
                   Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "  ✓ 정적 자산 크기: $([math]::Round($staticSize, 2)) MB" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  빌드 테스트 완료!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "다음 단계:" -ForegroundColor Yellow
Write-Host "  1. 빌드 에러가 없다면 배포를 진행할 수 있습니다" -ForegroundColor White
Write-Host "  2. Vercel Dashboard에서 환경변수를 설정하세요" -ForegroundColor White
Write-Host "  3. docs/DEPLOYMENT_GUIDE.md를 참고하여 배포하세요" -ForegroundColor White
Write-Host ""

