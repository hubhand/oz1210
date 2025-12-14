#!/bin/bash
# 빌드 테스트 스크립트 (Unix/Linux/macOS)
# 
# 이 스크립트는 프로덕션 빌드를 테스트하고 결과를 요약합니다.
# 배포 전에 로컬에서 빌드가 성공하는지 확인하는 데 사용됩니다.

set -e  # 에러 발생 시 스크립트 중단

echo "========================================"
echo "  My Trip - 빌드 테스트 시작"
echo "========================================"
echo ""

# 1. .next 폴더 삭제
echo "[1/4] .next 폴더 삭제 중..."
if [ -d ".next" ]; then
    rm -rf .next
    echo "  ✓ .next 폴더 삭제 완료"
else
    echo "  ✓ .next 폴더가 없습니다 (건너뜀)"
fi
echo ""

# 2. 의존성 설치
echo "[2/4] 의존성 설치 중 (pnpm install)..."
if ! pnpm install; then
    echo "  ✗ 의존성 설치 실패"
    exit 1
fi
echo "  ✓ 의존성 설치 완료"
echo ""

# 3. 빌드 실행
echo "[3/4] 프로덕션 빌드 실행 중 (pnpm build)..."
echo "  이 작업은 몇 분이 걸릴 수 있습니다..."
echo ""

BUILD_START=$(date +%s)
if ! pnpm build; then
    BUILD_END=$(date +%s)
    BUILD_DURATION=$((BUILD_END - BUILD_START))
    echo ""
    echo "  ✗ 빌드 실패 (소요 시간: ${BUILD_DURATION}초)"
    exit 1
fi
BUILD_END=$(date +%s)
BUILD_DURATION=$((BUILD_END - BUILD_START))

echo ""
echo "  ✓ 빌드 성공 (소요 시간: ${BUILD_DURATION}초)"
echo ""

# 4. 빌드 결과 요약
echo "[4/4] 빌드 결과 요약 중..."

# .next 폴더 크기 확인
if [ -d ".next" ]; then
    if command -v du &> /dev/null; then
        NEXT_SIZE=$(du -sm .next | cut -f1)
        echo "  ✓ .next 폴더 크기: ${NEXT_SIZE} MB"
    fi
else
    echo "  ✗ .next 폴더를 찾을 수 없습니다"
fi

# .next/server 폴더 확인
if [ -d ".next/server" ]; then
    SERVER_PAGES=$(find .next/server/app -name "*.js" 2>/dev/null | wc -l)
    echo "  ✓ 서버 페이지 수: ${SERVER_PAGES}"
fi

# .next/static 폴더 확인
if [ -d ".next/static" ]; then
    if command -v du &> /dev/null; then
        STATIC_SIZE=$(du -sm .next/static | cut -f1)
        echo "  ✓ 정적 자산 크기: ${STATIC_SIZE} MB"
    fi
fi

echo ""
echo "========================================"
echo "  빌드 테스트 완료!"
echo "========================================"
echo ""
echo "다음 단계:"
echo "  1. 빌드 에러가 없다면 배포를 진행할 수 있습니다"
echo "  2. Vercel Dashboard에서 환경변수를 설정하세요"
echo "  3. docs/DEPLOYMENT_GUIDE.md를 참고하여 배포하세요"
echo ""

