#!/bin/bash

# macOS 12 (Monterey) Intel Mac RTA 프로그램 자동 설치 스크립트
# 이 스크립트는 Python 가상 환경을 생성하고 필요한 라이브러리를 설치합니다.

set -e  # 오류 발생 시 스크립트 중단

echo "=========================================="
echo "RTA 프로그램 설치 시작"
echo "=========================================="
echo ""

# 1단계: Python 3.10 이상 버전 찾기 또는 설치
echo "[1/6] Python 버전 확인 및 설치 중..."

# Python 3.10 이상 버전 찾기 함수
find_python310() {
    # python3.11, python3.10 순서로 찾기
    for version in "3.11" "3.10" "3.12" "3.13"; do
        if command -v "python${version}" &> /dev/null; then
            PYTHON_CMD="python${version}"
            PYTHON_VERSION=$("$PYTHON_CMD" --version 2>&1 | cut -d' ' -f2 | cut -d'.' -f1,2)
            echo "✓ Python ${PYTHON_VERSION} 발견: $PYTHON_CMD"
            return 0
        fi
    done
    
    # python3 명령어로 버전 확인
    if command -v python3 &> /dev/null; then
        PYTHON_VERSION=$(python3 --version 2>&1 | cut -d' ' -f2 | cut -d'.' -f1,2)
        REQUIRED_VERSION="3.10"
        
        # 버전 비교 (3.10 이상인지 확인)
        if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$PYTHON_VERSION" | sort -V | head -n1)" = "$REQUIRED_VERSION" ]; then
            PYTHON_CMD="python3"
            echo "✓ Python ${PYTHON_VERSION} 사용 가능: $PYTHON_CMD"
            return 0
        fi
    fi
    
    return 1
}

# Python 3.10 이상 찾기
if ! find_python310; then
    echo "Python 3.10 이상을 찾을 수 없습니다."
    
    # Homebrew 확인 및 Python 3.10 설치 시도
    if command -v brew &> /dev/null; then
        echo ""
        echo "Homebrew를 사용하여 Python 3.10을 설치합니다..."
        echo "이 작업은 시간이 걸릴 수 있습니다."
        read -p "계속하시겠습니까? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            # Python 3.10 설치
            brew install python@3.10
            
            # 설치 후 다시 찾기
            if command -v python3.10 &> /dev/null; then
                PYTHON_CMD="python3.10"
                PYTHON_VERSION=$("$PYTHON_CMD" --version 2>&1 | cut -d' ' -f2 | cut -d'.' -f1,2)
                echo "✓ Python ${PYTHON_VERSION} 설치 완료: $PYTHON_CMD"
            else
                # Homebrew 설치 경로 확인
                if [ -f "/usr/local/opt/python@3.10/bin/python3.10" ]; then
                    PYTHON_CMD="/usr/local/opt/python@3.10/bin/python3.10"
                    PYTHON_VERSION=$("$PYTHON_CMD" --version 2>&1 | cut -d' ' -f2 | cut -d'.' -f1,2)
                    echo "✓ Python ${PYTHON_VERSION} 설치 완료: $PYTHON_CMD"
                elif [ -f "/opt/homebrew/opt/python@3.10/bin/python3.10" ]; then
                    PYTHON_CMD="/opt/homebrew/opt/python@3.10/bin/python3.10"
                    PYTHON_VERSION=$("$PYTHON_CMD" --version 2>&1 | cut -d' ' -f2 | cut -d'.' -f1,2)
                    echo "✓ Python ${PYTHON_VERSION} 설치 완료: $PYTHON_CMD"
                else
                    echo "오류: Python 3.10 설치 후에도 찾을 수 없습니다."
                    echo "수동으로 설치하세요: brew install python@3.10"
                    exit 1
                fi
            fi
        else
            echo "설치를 취소했습니다."
            exit 1
        fi
    else
        echo ""
        echo "오류: Python 3.10 이상이 필요합니다."
        echo "다음 중 하나를 수행하세요:"
        echo "1. Homebrew 설치: /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
        echo "2. Python 3.10 수동 설치: brew install python@3.10"
        echo "3. 또는 python3.10, python3.11 등을 PATH에 추가하세요"
        exit 1
    fi
fi

echo "사용할 Python: $PYTHON_CMD (버전: $PYTHON_VERSION)"

# 2단계: 가상 환경 생성
echo ""
echo "[2/6] 가상 환경 생성 중..."
if [ -d "venv" ]; then
    echo "기존 가상 환경이 발견되었습니다."
    read -p "삭제하고 새로 만들까요? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf venv
        "$PYTHON_CMD" -m venv venv
        echo "✓ 가상 환경 생성 완료 (Python ${PYTHON_VERSION})"
    else
        echo "기존 가상 환경을 유지합니다."
    fi
else
    "$PYTHON_CMD" -m venv venv
    echo "✓ 가상 환경 생성 완료 (Python ${PYTHON_VERSION})"
fi

# 3단계: 가상 환경 활성화
echo ""
echo "[3/6] 가상 환경 활성화 중..."
source venv/bin/activate

# 4단계: pip 업그레이드
echo ""
echo "[4/6] pip 업그레이드 중..."
pip install --upgrade pip setuptools wheel

# 5단계: requirements.txt 설치
echo ""
echo "[5/6] 라이브러리 설치 중..."
if [ ! -f "requirements.txt" ]; then
    echo "오류: requirements.txt 파일을 찾을 수 없습니다."
    exit 1
fi

# 설치 순서 중요: numpy 먼저, 그 다음 PyQt5
pip install numpy>=1.21.0
pip install scipy>=1.7.0
pip install PyQt5==5.15.7
pip install pyqtgraph>=0.13.0
pip install sounddevice>=0.4.5
pip install soundfile>=0.11.0

# 6단계: 설치 확인
echo ""
echo "[6/6] 설치 확인 중..."
# 가상 환경의 python 사용
venv/bin/python -c "import numpy; import scipy; import PyQt5; import pyqtgraph; import sounddevice; import soundfile; print('✓ 모든 라이브러리가 성공적으로 설치되었습니다.')"

echo ""
echo "=========================================="
echo "설치 완료!"
echo "=========================================="
echo ""
echo "사용된 Python 버전: ${PYTHON_VERSION} ($PYTHON_CMD)"
echo ""
echo "다음 단계:"
echo "1. 가상 환경 활성화: source venv/bin/activate"
echo "2. 환경 테스트: python3 test_setup.py"
echo "3. 프로그램 실행: python3 rta_monterey_intel.py"
echo ""

