# 프로젝트 구조 문서

이 문서는 RTA 프로그램의 프로젝트 구조와 파일 배치를 설명합니다.

## 프로젝트 디렉토리 구조

```
Audio_Frequency_Analysis_for_MacOS/
├── rta_monterey_intel.py          # 메인 애플리케이션 (541줄)
├── install.sh                      # 자동 설치 스크립트
├── test_setup.py                   # 환경 검증 스크립트
├── requirements.txt                # Python 의존성 목록
├── MONTEREY_INTEL_SETUP.md         # 상세 설정 가이드
├── PROJECT_STRUCTURE.md            # 이 파일
├── FILES_CHECKLIST.md              # 필수 파일 체크리스트
└── venv/                          # Python 가상 환경 (생성됨)
    ├── bin/
    ├── lib/
    └── ...
```

## 파일 설명

### 핵심 파일

#### `rta_monterey_intel.py`
메인 애플리케이션 파일입니다. 다음 클래스들을 포함합니다:

- **AudioProcessor**: 오디오 캡처 전담 스레드 클래스
- **OctaveBandAnalyzer**: 1/3 옥타브 밴드 분석 엔진
- **RTAMainWindow**: PyQt5 메인 윈도우 클래스
- **main()**: 프로그램 진입점

**주요 기능**:
- BlackHole을 통한 시스템 오디오 캡처
- 실시간 1/3 옥타브 밴드 분석
- PyQtGraph를 사용한 시각화
- 피크 홀드 기능

#### `install.sh`
자동 설치 스크립트입니다. 다음 작업을 수행합니다:

1. Python 버전 확인
2. 가상 환경 생성
3. 가상 환경 활성화
4. pip 업그레이드
5. requirements.txt 라이브러리 설치
6. 설치 확인

**사용법**:
```bash
bash install.sh
```

#### `test_setup.py`
환경 검증 스크립트입니다. 다음 테스트를 수행합니다:

1. 라이브러리 임포트 테스트
2. 오디오 디바이스 확인 (BlackHole 감지)
3. PyQt5 GUI 테스트
4. PyQtGraph 성능 테스트
5. SciPy FFT 테스트

**사용법**:
```bash
python3 test_setup.py
```

#### `requirements.txt`
Python 패키지 의존성 목록입니다.

**주요 패키지**:
- numpy>=1.21.0
- scipy>=1.7.0
- PyQt5==5.15.7 (Monterey Intel 호환)
- pyqtgraph>=0.13.0
- python-sounddevice>=0.4.5
- soundfile>=0.11.0

### 문서 파일

#### `MONTEREY_INTEL_SETUP.md`
상세한 설정 가이드입니다. 다음 내용을 포함합니다:

- 사전 준비 사항
- Homebrew, Python, PortAudio 설치
- BlackHole 설치 및 설정
- Python 환경 설정
- 트러블슈팅 가이드
- 성능 최적화 팁

#### `PROJECT_STRUCTURE.md` (이 파일)
프로젝트 구조와 파일 배치를 설명합니다.

#### `FILES_CHECKLIST.md`
필수 파일 목록과 설치 확인 체크리스트입니다.

### 생성되는 파일

#### `venv/`
Python 가상 환경 디렉토리입니다. `install.sh` 실행 시 자동 생성됩니다.

**주의**: 이 디렉토리는 `.gitignore`에 추가하는 것을 권장합니다.

## 사용자 정의 방법

### 샘플링 레이트 변경

`rta_monterey_intel.py`에서:

```python
# AudioProcessor 초기화 시
self.audio_processor = AudioProcessor(
    sample_rate=48000,  # 기본: 44100
    chunk_size=8192
)

# OctaveBandAnalyzer 초기화 시
self.analyzer = OctaveBandAnalyzer(
    sample_rate=48000,  # AudioProcessor와 동일하게
    chunk_size=8192
)
```

### 청크 크기 조정

낮은 지연시간을 원하는 경우:

```python
chunk_size=4096  # 기본: 8192
```

저주파 해상도를 높이려면:

```python
chunk_size=16384  # 기본: 8192
```

### 업데이트 레이트 조정

더 부드러운 업데이트:

```python
self.update_timer.setInterval(33)  # 30Hz (기본: 50ms = 20Hz)
```

CPU 부하를 줄이려면:

```python
self.update_timer.setInterval(100)  # 10Hz
```

### 피크 홀드 감쇠율 조정

피크를 더 오래 유지:

```python
self.peak_decay = 0.98  # 기본: 0.95
```

피크를 빨리 감소:

```python
self.peak_decay = 0.90  # 기본: 0.95
```

### dB 범위 조정

`RTAMainWindow` 클래스에서:

```python
self.plot.setYRange(-80, 10)  # 기본: -60 ~ 10 dB
```

### 주파수 범위 조정

```python
self.plot.setXRange(20, 20000)  # 기본: 20Hz ~ 20kHz
```

## 커스터마이제이션 예제

### 색상 변경

바 그래프 색상:

```python
self.bar_graph = pg.BarGraphItem(
    x=self.analyzer.center_frequencies,
    height=np.zeros(self.analyzer.num_bands),
    width=0.8,
    brush='g'  # 녹색 (기본: 'b' 파란색)
)
```

피크 홀드 라인 색상:

```python
self.peak_line = pg.PlotCurveItem(
    self.analyzer.center_frequencies,
    np.zeros(self.analyzer.num_bands),
    pen=pg.mkPen('y', width=2, style=QtCore.Qt.DashLine),  # 노란색
    skipFiniteCheck=True
)
```

### 윈도우 크기 조정

```python
self.setGeometry(100, 100, 1600, 800)  # 기본: 1200x600
```

### 그래프 제목 변경

```python
self.plot.setTitle("커스텀 제목")
```

## 파일 수정 시 주의사항

1. **가상 환경 활성화**: 파일 수정 후 테스트할 때는 반드시 가상 환경을 활성화하세요.
   ```bash
   source venv/bin/activate
   ```

2. **의존성 버전**: `requirements.txt`의 버전을 변경할 때는 호환성을 확인하세요.

3. **PyQt5 버전**: Monterey Intel Mac에서는 PyQt5==5.15.7을 유지하는 것을 권장합니다.

4. **백업**: 중요한 변경 전에는 파일을 백업하세요.

## 추가 기능 구현 가이드

### 새로운 분석 기능 추가

`OctaveBandAnalyzer` 클래스를 확장하여 새로운 분석 기능을 추가할 수 있습니다.

예: 스펙트럼 분석 추가

```python
def get_spectrum(self, audio_data):
    """스펙트럼 반환"""
    # FFT 수행
    fft_result = np.fft.fft(audio_data)
    magnitude = np.abs(fft_result[:len(fft_result)//2])
    return magnitude
```

### GUI 요소 추가

`RTAMainWindow` 클래스에 새로운 위젯을 추가할 수 있습니다.

예: 레벨 미터 추가

```python
# 레이아웃에 추가
self.level_meter = QtWidgets.QLabel("레벨: 0 dB")
layout.addWidget(self.level_meter)

# 업데이트 함수에서
def update_analysis(self):
    # ... 기존 코드 ...
    max_level = np.max(band_levels)
    self.level_meter.setText(f"레벨: {max_level:.1f} dB")
```

## 프로젝트 확장

### 다른 플랫폼 지원

현재는 macOS 12 Intel Mac에 최적화되어 있지만, 다른 플랫폼 지원을 위해:

1. 오디오 디바이스 선택 로직 수정
2. 플랫폼별 설정 파일 분리
3. 조건부 임포트 사용

### 추가 분석 모드

- 전체 옥타브 밴드 분석
- 1/6 옥타브 밴드 분석
- 워터폴 스펙트럼 표시
- 히스토리 기록 기능

## 참고 자료

- [PyQt5 공식 문서](https://www.riverbankcomputing.com/static/Docs/PyQt5/)
- [PyQtGraph 문서](https://www.pyqtgraph.org/)
- [sounddevice 문서](https://python-sounddevice.readthedocs.io/)
- [NumPy 문서](https://numpy.org/doc/)
- [SciPy 문서](https://docs.scipy.org/)

---

이 문서는 프로젝트 구조를 이해하고 커스터마이제이션하는 데 도움이 됩니다.

