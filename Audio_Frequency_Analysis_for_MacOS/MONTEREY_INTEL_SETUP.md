# macOS 12 (Monterey) Intel Mac RTA 프로그램 설정 가이드

이 가이드는 macOS 12 (Monterey) 환경에서 Intel Mac용 RTA 프로그램을 설정하는 방법을 설명합니다.

## 목차

1. [사전 준비](#1-사전-준비)
2. [Homebrew 설치](#2-homebrew-설치)
3. [Python 3.10 설치](#3-python-310-설치)
4. [PortAudio 설치](#4-portaudio-설치)
5. [BlackHole 설치 및 설정](#5-blackhole-설치-및-설정)
6. [BlackHole 권한 설정](#6-blackhole-권한-설정)
7. [Audio MIDI Setup 구성](#7-audio-midi-setup-구성)
8. [Python 가상 환경 설정](#8-python-가상-환경-설정)
9. [라이브러리 설치](#9-라이브러리-설치)
10. [환경 검증](#10-환경-검증)
11. [트러블슈팅](#11-트러블슈팅)
12. [성능 최적화](#12-성능-최적화)
13. [자동 시작 스크립트](#13-자동-시작-스크립트)

---

## 1. 사전 준비

### 시스템 요구사항

- macOS 12 (Monterey) 이상
- Intel Mac (x86_64 아키텍처)
- 최소 4GB RAM (8GB 권장)
- 관리자 권한 (일부 설치에 필요)

### 필요한 소프트웨어

- Homebrew (패키지 관리자)
- Python 3.10 이상
- PortAudio (오디오 라이브러리)
- BlackHole 2ch (가상 오디오 드라이버)

---

## 2. Homebrew 설치

Homebrew가 설치되어 있지 않은 경우:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

설치 확인:

```bash
brew --version
```

---

## 3. Python 3.10 설치

Python 3.10 이상이 필요합니다. 현재 버전 확인:

```bash
python3 --version
```

Python 3.10이 설치되어 있지 않은 경우:

```bash
brew install python@3.10
```

또는 최신 버전:

```bash
brew install python@3.11
```

설치 후 PATH 설정 (필요한 경우):

```bash
echo 'export PATH="/usr/local/opt/python@3.10/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

---

## 4. PortAudio 설치

PortAudio는 sounddevice 라이브러리가 필요로 하는 오디오 라이브러리입니다.

```bash
brew install portaudio
```

설치 확인:

```bash
brew list | grep portaudio
```

---

## 5. BlackHole 설치 및 설정

### 5.1 BlackHole 다운로드

BlackHole은 macOS용 가상 오디오 드라이버입니다. 시스템 오디오를 캡처하기 위해 필요합니다.

**BlackHole 2ch 다운로드** (권장):

```bash
# GitHub 릴리스 페이지에서 다운로드
# https://github.com/ExistentialAudio/BlackHole/releases
# 또는 Homebrew Cask 사용:
brew install --cask blackhole-2ch
```

### 5.2 BlackHole 설치

1. 다운로드한 `.pkg` 파일을 실행
2. 설치 마법사를 따라 설치 완료
3. 설치 후 시스템 재시작 권장

### 5.3 BlackHole 버전 확인

설치된 BlackHole 버전 확인:

```bash
# 시스템 확장 확인
systemextensionsctl list | grep -i blackhole

# 또는 Audio MIDI Setup에서 확인
# Applications > Utilities > Audio MIDI Setup 실행
```

또는 Python 스크립트로 확인:

```bash
python3 test_setup.py
```

---

## 6. BlackHole 권한 설정

macOS Monterey는 커널 확장에 대한 보안 제한이 있습니다.

### 6.1 시스템 환경설정에서 권한 허용

1. **시스템 환경설정** 열기
2. **보안 및 개인정보보호** 선택
3. **일반** 탭에서 "시스템 확장 프로그램 로드 허용" 확인
4. 필요시 **개인정보보호** 탭에서:
   - **마이크**: Terminal 또는 사용 중인 터미널 앱 허용
   - **오디오**: Terminal 또는 사용 중인 터미널 앱 허용

### 6.2 커널 확장 로드 확인

터미널에서 확인:

```bash
systemextensionsctl list
```

BlackHole이 표시되어야 합니다. 표시되지 않으면 시스템 재시작이 필요할 수 있습니다.

---

## 7. Audio MIDI Setup 구성

시스템 오디오를 BlackHole으로 라우팅하기 위해 멀티 출력 디바이스를 생성해야 합니다.

### 7.1 멀티 출력 디바이스 생성

1. **Applications > Utilities > Audio MIDI Setup** 실행
2. 왼쪽 하단의 **+** 버튼 클릭
3. **멀티 출력 디바이스 생성** 선택
4. 다음 디바이스들을 체크:
   - **Built-in Output** (또는 스피커/헤드폰)
   - **BlackHole 2ch**
5. **BlackHole 2ch**를 **마스터**로 설정 (시계 아이콘 클릭)
6. 디바이스 이름 변경 (예: "Multi-Output + BlackHole")

### 7.2 시스템 출력 설정

1. **시스템 환경설정 > 사운드 > 출력** 열기
2. 생성한 멀티 출력 디바이스 선택
3. 이제 시스템 오디오가 스피커와 BlackHole 모두로 출력됩니다

---

## 8. Python 가상 환경 설정

프로젝트 디렉토리로 이동:

```bash
cd ~/Github_kimmaru/Audio_Frequency_Analysis_for_MacOS
```

가상 환경 생성:

```bash
python3 -m venv venv
```

가상 환경 활성화:

```bash
source venv/bin/activate
```

활성화되면 프롬프트에 `(venv)`가 표시됩니다.

---

## 9. 라이브러리 설치

### 9.1 pip 업그레이드

```bash
pip install --upgrade pip setuptools wheel
```

### 9.2 설치 순서 (중요!)

Monterey Intel Mac에서 호환성을 위해 다음 순서로 설치합니다:

```bash
# 1. numpy 먼저 설치
pip install numpy>=1.21.0

# 2. scipy 설치
pip install scipy>=1.7.0

# 3. PyQt5 설치 (정확한 버전 중요!)
pip install PyQt5==5.15.7

# 4. pyqtgraph 설치
pip install pyqtgraph>=0.13.0

# 5. sounddevice 설치
pip install python-sounddevice>=0.4.5

# 6. soundfile 설치
pip install soundfile>=0.11.0
```

또는 `requirements.txt` 사용:

```bash
pip install -r requirements.txt
```

### 9.3 자동 설치 스크립트 사용

```bash
bash install.sh
```

이 스크립트는 위의 모든 단계를 자동으로 수행합니다.

---

## 10. 환경 검증

설치가 완료되었는지 확인:

```bash
python3 test_setup.py
```

모든 테스트가 통과해야 합니다:

- ✓ 라이브러리 임포트 테스트
- ✓ 오디오 디바이스 확인 (BlackHole 감지)
- ✓ PyQt5 GUI 테스트
- ✓ PyQtGraph 성능 테스트
- ✓ SciPy FFT 테스트

---

## 11. 트러블슈팅

### 11.1 PyQt5 설치 오류

**문제**: PyQt5 설치 실패 또는 임포트 오류

**해결책**:

```bash
# 가상 환경 재생성
deactivate
rm -rf venv
python3 -m venv venv
source venv/bin/activate

# 설치 순서 준수
pip install --upgrade pip
pip install numpy
pip install PyQt5==5.15.7
```

### 11.2 BlackHole을 찾을 수 없음

**문제**: 프로그램이 BlackHole 디바이스를 찾지 못함

**해결책**:

1. BlackHole이 설치되어 있는지 확인:
   ```bash
   systemextensionsctl list | grep -i blackhole
   ```

2. Audio MIDI Setup에서 BlackHole이 표시되는지 확인

3. 시스템 재시작

4. 프로그램에서 기본 입력 디바이스 사용 (자동 감지)

### 11.3 마이크 권한 오류

**문제**: "마이크 권한이 필요합니다" 오류

**해결책**:

1. 시스템 환경설정 > 보안 및 개인정보보호 > 개인정보보호 > 마이크
2. Terminal (또는 사용 중인 터미널 앱) 체크
3. 터미널 재시작

### 11.4 높은 지연시간

**문제**: 오디오 분석이 지연되거나 끊김

**해결책**:

1. 청크 크기 조정 (`rta_monterey_intel.py`에서):
   ```python
   chunk_size=4096  # 더 낮은 지연 (기본: 8192)
   ```

2. 업데이트 간격 조정:
   ```python
   self.update_timer.setInterval(100)  # 10Hz (기본: 50ms = 20Hz)
   ```

3. 다른 오디오 앱 종료

### 11.5 Rosetta 필요 (Intel Mac에서)

일부 경우 Rosetta를 통해 실행해야 할 수 있습니다:

```bash
arch -x86_64 python3 rta_monterey_intel.py
```

---

## 12. 성능 최적화

### 12.1 성능 매개변수 조정

`rta_monterey_intel.py`에서 다음 매개변수를 조정할 수 있습니다:

| 매개변수 | 기본값 | 설명 |
|---------|-------|------|
| `sample_rate` | 44100 | 샘플링 레이트 (48000도 가능) |
| `chunk_size` | 8192 | 청크 크기 (낮을수록 반응성 향상) |
| `update_interval` | 50ms | 업데이트 간격 (20Hz) |
| `peak_decay` | 0.95 | 피크 감쇠율 (0.98 = 오래 유지) |

### 12.2 CPU 사용률 최적화

- 업데이트 간격을 100ms (10Hz)로 증가
- 청크 크기를 16384로 증가 (저주파 해상도 향상)

### 12.3 메모리 사용량 최적화

- 큐 크기 조정 (`maxsize=5`로 감소)
- 불필요한 데이터 버퍼 제거

---

## 13. 자동 시작 스크립트

프로그램을 쉽게 시작하기 위한 스크립트 생성:

**start_rta.sh**:

```bash
#!/bin/bash
cd ~/Github_kimmaru/Audio_Frequency_Analysis_for_MacOS
source venv/bin/activate
python3 rta_monterey_intel.py
```

실행 권한 부여:

```bash
chmod +x start_rta.sh
```

실행:

```bash
./start_rta.sh
```

---

## 추가 리소스

- [BlackHole GitHub](https://github.com/ExistentialAudio/BlackHole)
- [PyQt5 문서](https://www.riverbankcomputing.com/static/Docs/PyQt5/)
- [PyQtGraph 문서](https://www.pyqtgraph.org/)
- [sounddevice 문서](https://python-sounddevice.readthedocs.io/)

---

## 문제 해결이 안 될 때

1. `test_setup.py` 실행하여 구체적인 오류 확인
2. 모든 단계를 다시 확인
3. 가상 환경 재생성
4. 시스템 재시작
5. BlackHole 재설치

---

**설정 완료!** 이제 `python3 rta_monterey_intel.py`를 실행하여 RTA 프로그램을 시작할 수 있습니다.

