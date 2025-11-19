# 필수 파일 체크리스트

이 문서는 RTA 프로그램 실행에 필요한 모든 파일과 설정을 확인하는 체크리스트입니다.

## 필수 파일 목록

### 핵심 프로그램 파일

- [ ] `rta_monterey_intel.py` - 메인 애플리케이션 파일
- [ ] `requirements.txt` - Python 의존성 목록
- [ ] `install.sh` - 자동 설치 스크립트 (실행 권한 필요)
- [ ] `test_setup.py` - 환경 검증 스크립트

### 문서 파일

- [ ] `MONTEREY_INTEL_SETUP.md` - 설정 가이드
- [ ] `PROJECT_STRUCTURE.md` - 프로젝트 구조 문서
- [ ] `FILES_CHECKLIST.md` - 이 파일

### 생성되는 파일/디렉토리

- [ ] `venv/` - Python 가상 환경 디렉토리 (install.sh 실행 후 생성)

## 설치 전 확인 사항

### 시스템 요구사항

- [ ] macOS 12 (Monterey) 이상
- [ ] Intel Mac (x86_64 아키텍처)
- [ ] 관리자 권한 (일부 설치에 필요)

### 필수 소프트웨어 설치 확인

- [ ] Homebrew 설치됨
  ```bash
  brew --version
  ```

- [ ] Python 3.10 이상 설치됨
  ```bash
  python3 --version
  ```

- [ ] PortAudio 설치됨
  ```bash
  brew list | grep portaudio
  ```

- [ ] BlackHole 2ch 설치됨
  ```bash
  systemextensionsctl list | grep -i blackhole
  ```

### 시스템 권한 확인

- [ ] 마이크 권한 허용됨
  - 시스템 환경설정 > 보안 및 개인정보보호 > 개인정보보호 > 마이크
  - Terminal (또는 사용 중인 터미널 앱) 체크

- [ ] 오디오 권한 허용됨
  - 시스템 환경설정 > 보안 및 개인정보보호 > 개인정보보호 > 오디오
  - Terminal (또는 사용 중인 터미널 앱) 체크

- [ ] 시스템 확장 프로그램 로드 허용됨
  - 시스템 환경설정 > 보안 및 개인정보보호 > 일반
  - "시스템 확장 프로그램 로드 허용" 체크

## 설치 단계별 확인

### 1단계: 파일 다운로드 확인

프로젝트 디렉토리에 모든 파일이 있는지 확인:

```bash
cd ~/Github_kimmaru/Audio_Frequency_Analysis_for_MacOS
ls -la
```

필수 파일 확인:

```bash
ls -1 rta_monterey_intel.py install.sh test_setup.py requirements.txt
```

### 2단계: 설치 스크립트 실행 권한 확인

```bash
chmod +x install.sh
ls -l install.sh
```

실행 권한이 있어야 합니다 (`-rwxr-xr-x`).

### 3단계: 가상 환경 생성 확인

```bash
python3 -m venv venv
ls -d venv
```

`venv` 디렉토리가 생성되어야 합니다.

### 4단계: 가상 환경 활성화 확인

```bash
source venv/bin/activate
which python3
```

경로에 `venv`가 포함되어야 합니다.

프롬프트에 `(venv)`가 표시되어야 합니다.

### 5단계: 라이브러리 설치 확인

```bash
pip list | grep -E "numpy|scipy|PyQt5|pyqtgraph|sounddevice|soundfile"
```

다음 패키지가 설치되어 있어야 합니다:

- numpy (>=1.21.0)
- scipy (>=1.7.0)
- PyQt5 (==5.15.7)
- pyqtgraph (>=0.13.0)
- sounddevice (>=0.4.5)
- soundfile (>=0.11.0)

### 6단계: 환경 검증 실행

```bash
python3 test_setup.py
```

모든 테스트가 통과해야 합니다:

- ✓ 라이브러리 임포트 테스트
- ✓ 오디오 디바이스 확인
- ✓ PyQt5 GUI 테스트
- ✓ PyQtGraph 성능 테스트
- ✓ SciPy FFT 테스트

## 실행 전 최종 확인

### Audio MIDI Setup 확인

- [ ] 멀티 출력 디바이스 생성됨
  - Applications > Utilities > Audio MIDI Setup 실행
  - 멀티 출력 디바이스가 표시되어야 함

- [ ] 시스템 출력이 멀티 출력 디바이스로 설정됨
  - 시스템 환경설정 > 사운드 > 출력
  - 멀티 출력 디바이스 선택됨

### BlackHole 확인

- [ ] BlackHole이 오디오 입력 디바이스로 표시됨
  ```bash
  python3 -c "import sounddevice as sd; print(sd.query_devices())"
  ```
  출력에 "BlackHole"이 포함되어야 함

## 프로그램 실행 확인

### 실행 테스트

```bash
source venv/bin/activate
python3 rta_monterey_intel.py
```

다음이 확인되어야 합니다:

- [ ] 프로그램이 정상적으로 시작됨
- [ ] GUI 윈도우가 표시됨
- [ ] "시작" 버튼 클릭 시 분석 시작됨
- [ ] 오디오 입력이 감지됨
- [ ] 그래프가 업데이트됨

## 문제 해결 체크리스트

### 문제: 파일을 찾을 수 없음

- [ ] 프로젝트 디렉토리 경로 확인
- [ ] 파일 이름 철자 확인
- [ ] 파일이 실제로 존재하는지 확인 (`ls -la`)

### 문제: 설치 스크립트 실행 실패

- [ ] 실행 권한 확인 (`chmod +x install.sh`)
- [ ] Python 버전 확인 (`python3 --version`)
- [ ] 인터넷 연결 확인
- [ ] Homebrew 설치 확인

### 문제: 라이브러리 임포트 실패

- [ ] 가상 환경 활성화 확인 (`source venv/bin/activate`)
- [ ] 라이브러리 설치 확인 (`pip list`)
- [ ] 설치 순서 확인 (numpy → scipy → PyQt5 → pyqtgraph → sounddevice)

### 문제: BlackHole을 찾을 수 없음

- [ ] BlackHole 설치 확인
- [ ] 시스템 재시작
- [ ] Audio MIDI Setup에서 확인
- [ ] `test_setup.py` 실행하여 확인

### 문제: 권한 오류

- [ ] 시스템 환경설정에서 권한 확인
- [ ] 터미널 재시작
- [ ] 시스템 재시작 (필요한 경우)

### 문제: 프로그램이 시작되지 않음

- [ ] 가상 환경 활성화 확인
- [ ] 모든 라이브러리 설치 확인
- [ ] `test_setup.py` 실행하여 오류 확인
- [ ] 터미널 출력 확인

## 빠른 확인 명령어

모든 확인을 한 번에 수행:

```bash
# 파일 확인
echo "=== 파일 확인 ==="
ls -1 rta_monterey_intel.py install.sh test_setup.py requirements.txt

# 가상 환경 확인
echo "=== 가상 환경 확인 ==="
[ -d "venv" ] && echo "✓ venv 존재" || echo "✗ venv 없음"

# 라이브러리 확인
echo "=== 라이브러리 확인 ==="
source venv/bin/activate 2>/dev/null
pip list | grep -E "numpy|scipy|PyQt5|pyqtgraph|sounddevice|soundfile" || echo "✗ 라이브러리 없음"

# BlackHole 확인
echo "=== BlackHole 확인 ==="
systemextensionsctl list | grep -i blackhole && echo "✓ BlackHole 설치됨" || echo "✗ BlackHole 없음"
```

## 체크리스트 완료 후

모든 항목을 확인한 후:

1. `test_setup.py` 실행하여 최종 검증
2. 프로그램 실행 테스트
3. 오디오 입력 테스트 (음악 재생 등)

---

**모든 체크리스트 항목을 확인한 후 프로그램을 실행하세요!**

