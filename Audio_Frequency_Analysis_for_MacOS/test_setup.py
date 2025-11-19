#!/usr/bin/env python3
"""
환경 검증 스크립트
macOS 12 (Monterey) Intel Mac RTA 프로그램 실행 전 환경을 검증합니다.
"""

import sys
import platform

def test_imports():
    """라이브러리 임포트 테스트"""
    print("=" * 50)
    print("1. 라이브러리 임포트 테스트")
    print("=" * 50)
    
    try:
        import numpy
        print(f"✓ numpy {numpy.__version__}")
    except ImportError as e:
        print(f"✗ numpy 임포트 실패: {e}")
        return False
    
    try:
        import scipy
        print(f"✓ scipy {scipy.__version__}")
    except ImportError as e:
        print(f"✗ scipy 임포트 실패: {e}")
        return False
    
    try:
        from PyQt5 import QtCore, QtWidgets
        print(f"✓ PyQt5 {QtCore.QT_VERSION_STR}")
    except ImportError as e:
        print(f"✗ PyQt5 임포트 실패: {e}")
        return False
    
    try:
        import pyqtgraph as pg
        print(f"✓ pyqtgraph {pg.__version__}")
    except ImportError as e:
        print(f"✗ pyqtgraph 임포트 실패: {e}")
        return False
    
    try:
        import sounddevice as sd
        print(f"✓ sounddevice {sd.__version__}")
    except ImportError as e:
        print(f"✗ sounddevice 임포트 실패: {e}")
        return False
    
    try:
        import soundfile
        print(f"✓ soundfile {soundfile.__version__}")
    except ImportError as e:
        print(f"✗ soundfile 임포트 실패: {e}")
        return False
    
    print()
    return True


def test_audio_devices():
    """오디오 디바이스 확인 및 BlackHole 감지"""
    print("=" * 50)
    print("2. 오디오 디바이스 확인")
    print("=" * 50)
    
    try:
        import sounddevice as sd
        
        # 사용 가능한 오디오 디바이스 목록
        devices = sd.query_devices()
        print(f"\n총 {len(devices)}개의 오디오 디바이스를 찾았습니다.\n")
        
        # BlackHole 감지
        blackhole_found = False
        blackhole_2ch_found = False
        
        print("입력 디바이스:")
        for i, device in enumerate(devices):
            if device['max_input_channels'] > 0:
                device_name = device['name']
                print(f"  [{i}] {device_name} ({device['max_input_channels']}ch)")
                
                if 'blackhole' in device_name.lower():
                    blackhole_found = True
                    print(f"      ⭐ BlackHole 감지됨!")
                    if '2ch' in device_name.lower() or device['max_input_channels'] == 2:
                        blackhole_2ch_found = True
                        print(f"      ✓ BlackHole 2ch 확인됨")
        
        print()
        print("기본 입력 디바이스:")
        try:
            default_input = sd.query_devices(kind='input')
            print(f"  {default_input['name']}")
        except Exception as e:
            print(f"  기본 입력 디바이스를 찾을 수 없습니다: {e}")
        
        print()
        if blackhole_found:
            if blackhole_2ch_found:
                print("✓ BlackHole 2ch가 설치되어 있습니다.")
            else:
                print("⚠ BlackHole이 설치되어 있지만 2ch 버전인지 확인이 필요합니다.")
                print("  Audio MIDI Setup에서 BlackHole 2ch를 확인하세요.")
        else:
            print("✗ BlackHole을 찾을 수 없습니다.")
            print("  BlackHole 2ch를 설치해야 합니다:")
            print("  https://github.com/ExistentialAudio/BlackHole/releases")
            return False
        
        print()
        return True
        
    except Exception as e:
        print(f"✗ 오디오 디바이스 확인 실패: {e}")
        return False


def test_pyqt5_gui():
    """PyQt5 GUI 테스트"""
    print("=" * 50)
    print("3. PyQt5 GUI 테스트")
    print("=" * 50)
    
    try:
        from PyQt5 import QtWidgets, QtCore
        
        app = QtWidgets.QApplication([])
        print("✓ QApplication 생성 성공")
        
        window = QtWidgets.QWidget()
        window.setWindowTitle("테스트 윈도우")
        window.resize(200, 100)
        print("✓ QWidget 생성 성공")
        
        # 이벤트 루프를 실행하지 않고 바로 종료
        app.quit()
        print("✓ PyQt5 GUI 테스트 완료")
        print()
        return True
        
    except Exception as e:
        print(f"✗ PyQt5 GUI 테스트 실패: {e}")
        return False


def test_pyqtgraph():
    """PyQtGraph 성능 테스트"""
    print("=" * 50)
    print("4. PyQtGraph 성능 테스트")
    print("=" * 50)
    
    try:
        import pyqtgraph as pg
        import numpy as np
        
        # PyQtGraph 설정
        pg.setConfigOptions(
            useOpenGL=True,
            antialias=True,
            enableExperimental=False
        )
        print("✓ PyQtGraph 설정 완료")
        
        # 간단한 플롯 테스트
        from PyQt5 import QtWidgets
        app = QtWidgets.QApplication([])
        
        # GraphicsLayoutWidget 사용 (최신 PyQtGraph API)
        win = pg.GraphicsLayoutWidget(title="PyQtGraph 테스트")
        plot = win.addPlot(title="테스트 플롯")
        
        x = np.linspace(0, 10, 1000)
        y = np.sin(x)
        plot.plot(x, y)
        
        print("✓ PyQtGraph 플롯 생성 성공")
        
        app.quit()
        print("✓ PyQtGraph 성능 테스트 완료")
        print()
        return True
        
    except Exception as e:
        print(f"✗ PyQtGraph 테스트 실패: {e}")
        return False


def test_scipy_fft():
    """SciPy FFT 신호 처리 테스트"""
    print("=" * 50)
    print("5. SciPy FFT 신호 처리 테스트")
    print("=" * 50)
    
    try:
        import numpy as np
        from scipy import signal
        
        # 테스트 신호 생성
        sample_rate = 44100
        duration = 1.0
        t = np.linspace(0, duration, int(sample_rate * duration))
        frequency = 440.0  # A4 음
        test_signal = np.sin(2 * np.pi * frequency * t)
        
        # FFT 수행
        fft_result = np.fft.fft(test_signal)
        fft_freq = np.fft.fftfreq(len(test_signal), 1/sample_rate)
        
        # 주파수 피크 찾기
        magnitude = np.abs(fft_result)
        peak_freq_idx = np.argmax(magnitude[:len(magnitude)//2])
        peak_freq = abs(fft_freq[peak_freq_idx])
        
        print(f"✓ 테스트 신호 생성: {frequency} Hz")
        print(f"✓ FFT 수행 완료")
        print(f"✓ 피크 주파수: {peak_freq:.2f} Hz (예상: {frequency} Hz)")
        
        # Butterworth 필터 테스트
        nyquist = sample_rate / 2
        low = 400 / nyquist
        high = 500 / nyquist
        b, a = signal.butter(4, [low, high], btype='band')
        filtered_signal = signal.filtfilt(b, a, test_signal)
        
        print(f"✓ Butterworth 밴드패스 필터 테스트 완료")
        print("✓ SciPy FFT 신호 처리 테스트 완료")
        print()
        return True
        
    except Exception as e:
        print(f"✗ SciPy FFT 테스트 실패: {e}")
        return False


def test_system_info():
    """시스템 정보 출력"""
    print("=" * 50)
    print("시스템 정보")
    print("=" * 50)
    print(f"운영체제: {platform.system()} {platform.release()}")
    print(f"아키텍처: {platform.machine()}")
    print(f"Python 버전: {sys.version}")
    print()


def main():
    """메인 함수"""
    print("\n" + "=" * 50)
    print("RTA 프로그램 환경 검증")
    print("=" * 50)
    print()
    
    test_system_info()
    
    results = []
    
    # 각 테스트 실행
    results.append(("라이브러리 임포트", test_imports()))
    results.append(("오디오 디바이스", test_audio_devices()))
    results.append(("PyQt5 GUI", test_pyqt5_gui()))
    results.append(("PyQtGraph", test_pyqtgraph()))
    results.append(("SciPy FFT", test_scipy_fft()))
    
    # 결과 요약
    print("=" * 50)
    print("테스트 결과 요약")
    print("=" * 50)
    
    passed = 0
    failed = 0
    
    for test_name, result in results:
        status = "✓ 통과" if result else "✗ 실패"
        print(f"{test_name}: {status}")
        if result:
            passed += 1
        else:
            failed += 1
    
    print()
    print(f"통과: {passed}/{len(results)}")
    print(f"실패: {failed}/{len(results)}")
    print()
    
    if failed == 0:
        print("=" * 50)
        print("✓ 모든 테스트를 통과했습니다!")
        print("프로그램을 실행할 준비가 되었습니다.")
        print("=" * 50)
        return 0
    else:
        print("=" * 50)
        print("✗ 일부 테스트가 실패했습니다.")
        print("위의 오류 메시지를 확인하고 문제를 해결하세요.")
        print("=" * 50)
        return 1


if __name__ == "__main__":
    sys.exit(main())

