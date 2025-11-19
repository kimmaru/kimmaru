#!/usr/bin/env python3
"""
RTA (Real-Time Analyzer) 프로그램 - Professional Edition
macOS 12 (Monterey) Intel Mac용 고성능 실시간 오디오 주파수 분석기

- 샘플링 레이트: 48kHz
- 업데이트 레이트: 60Hz (16.67ms)
- 가청 주파수 범위: 20Hz ~ 20kHz
- A-weighting 라우드니스 곡선 적용
- 고해상도 주파수 분석
"""

import sys
import queue
import numpy as np
from PyQt5 import QtCore, QtWidgets, QtGui
from PyQt5.QtCore import QThread
import pyqtgraph as pg
import sounddevice as sd
from scipy import signal


class AudioProcessor(QThread):
    """
    오디오 캡처 전담 스레드 클래스
    
    sounddevice를 사용하여 BlackHole에서 비동기 오디오 입력을 받고,
    스레드-안전한 queue.Queue를 통해 메인 스레드로 데이터를 전달합니다.
    """
    
    def __init__(self, sample_rate=48000, chunk_size=8192, device=None):
        """
        초기화
        
        Args:
            sample_rate: 샘플링 레이트 (기본: 48000 Hz)
            chunk_size: 청크 크기 (기본: 8192 샘플)
            device: 오디오 디바이스 ID (None이면 기본 디바이스 사용)
        """
        super().__init__()
        self.sample_rate = sample_rate
        self.chunk_size = chunk_size
        self.device = device
        self.data_queue = queue.Queue(maxsize=10)  # 최신 데이터만 유지
        self.is_running = False
        self.stream = None
        
    def find_blackhole_device(self):
        """BlackHole 디바이스를 찾아 반환"""
        devices = sd.query_devices()
        for i, device in enumerate(devices):
            if device['max_input_channels'] > 0:
                device_name = device['name'].lower()
                if 'blackhole' in device_name:
                    print(f"BlackHole 디바이스 발견: [{i}] {device['name']}")
                    return i
        return None
    
    def audio_callback(self, indata, frames, time_info, status):
        """
        sounddevice 콜백 함수
        
        이 함수는 별도의 스레드에서 자동으로 호출됩니다.
        """
        if status:
            print(f"오디오 스트림 상태: {status}")
        
        # 스테레오를 모노로 변환
        if indata.shape[1] > 1:
            mono_data = np.mean(indata, axis=1)
        else:
            mono_data = indata[:, 0]
        
        # 큐에 데이터 추가 (큐가 가득 차면 가장 오래된 데이터 제거)
        try:
            self.data_queue.put_nowait(mono_data.copy())
        except queue.Full:
            # 큐가 가득 차면 가장 오래된 데이터를 제거하고 새 데이터 추가
            try:
                self.data_queue.get_nowait()
                self.data_queue.put_nowait(mono_data.copy())
            except queue.Empty:
                pass
    
    def run(self):
        """스레드 실행 함수"""
        self.is_running = True
        
        # BlackHole 디바이스 찾기
        if self.device is None:
            self.device = self.find_blackhole_device()
            if self.device is None:
                print("경고: BlackHole 디바이스를 찾을 수 없습니다. 기본 입력 디바이스를 사용합니다.")
                self.device = None
        
        try:
            # 오디오 스트림 시작
            self.stream = sd.InputStream(
                device=self.device,
                channels=2,  # 스테레오 입력
                samplerate=self.sample_rate,
                blocksize=self.chunk_size,
                callback=self.audio_callback,
                dtype=np.float32
            )
            
            self.stream.start()
            print(f"오디오 스트림 시작: 샘플링 레이트={self.sample_rate}Hz, 청크 크기={self.chunk_size}")
            
            # 스레드가 종료될 때까지 대기
            while self.is_running:
                self.msleep(100)  # 100ms마다 상태 확인
                
        except Exception as e:
            print(f"오디오 스트림 오류: {e}")
            self.is_running = False
        finally:
            if self.stream:
                self.stream.stop()
                self.stream.close()
    
    def stop(self):
        """오디오 캡처 중지"""
        self.is_running = False
        self.wait()  # 스레드 종료 대기


class LoudnessWeighting:
    """
    라우드니스 가중치 클래스
    A-weighting 필터를 구현하여 인간의 청각 특성을 반영합니다.
    """
    
    @staticmethod
    def a_weighting(frequencies):
        """
        A-weighting 필터 응답 계산
        
        Args:
            frequencies: 주파수 배열 (Hz)
        
        Returns:
            A-weighting 가중치 (dB)
        """
        f = frequencies
        f2 = f * f
        f4 = f2 * f2
        
        # A-weighting 공식 (IEC 61672:2003)
        numerator = 12194**2 * f4
        denominator = (f2 + 20.6**2) * np.sqrt((f2 + 107.7**2) * (f2 + 737.9**2)) * (f2 + 12194**2)
        
        # dB 변환
        a_weight = 1.2588966 * 148840000 * f4 / denominator
        a_weight_db = 20 * np.log10(a_weight) + 2.0
        
        return a_weight_db


class OctaveBandAnalyzer:
    """
    고해상도 옥타브 밴드 분석 엔진
    
    라우드니스 곡선을 적용한 세밀한 주파수 분석을 수행합니다.
    가청 주파수 범위(20Hz ~ 20kHz) 내에서만 분석합니다.
    """
    
    def __init__(self, sample_rate=48000, chunk_size=8192):
        """
        초기화
        
        Args:
            sample_rate: 샘플링 레이트 (48000 Hz)
            chunk_size: FFT 청크 크기
        """
        self.sample_rate = sample_rate
        self.chunk_size = chunk_size
        
        # 고해상도 1/3 옥타브 밴드 중심 주파수 (20Hz ~ 20kHz)
        # 라우드니스 곡선에 따라 더 세밀하게 분할
        self.center_frequencies = np.array([
            20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200,
            250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000,
            2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000, 20000
        ])
        
        # 가청 주파수 범위 필터링 (20Hz ~ 20kHz)
        self.center_frequencies = self.center_frequencies[
            (self.center_frequencies >= 20) & (self.center_frequencies <= 20000)
        ]
        
        self.num_bands = len(self.center_frequencies)
        
        # 옥타브 밴드 계산을 위한 상수
        # 1/3 옥타브: G = 10^(3/10), factor = G^(1/6)
        G = 10 ** (3 / 10)
        self.factor = G ** (1 / 6)
        
        # FFT 주파수 빈 계산
        self.fft_freq = np.fft.fftfreq(self.chunk_size, 1 / self.sample_rate)
        self.fft_freq = self.fft_freq[:self.chunk_size // 2]  # 양의 주파수만
        
        # 가청 주파수 범위 필터링 (20Hz ~ 20kHz)
        audible_mask = (self.fft_freq >= 20) & (self.fft_freq <= 20000)
        self.fft_freq = self.fft_freq[audible_mask]
        self.fft_freq_indices = np.where(audible_mask)[0]
        
        # A-weighting 가중치 계산
        self.a_weighting_db = LoudnessWeighting.a_weighting(self.fft_freq)
        
        # 피크 홀드 값 (각 밴드별)
        self.peak_hold = np.zeros(self.num_bands)
        self.peak_decay = 0.95  # 피크 감쇠율
        
        # 참조 레벨 (정규화용)
        self.reference_level = 1.0
    
    def calculate_band_limits(self, center_freq):
        """
        옥타브 밴드의 하한 및 상한 주파수 계산
        
        Args:
            center_freq: 중심 주파수 (Hz)
        
        Returns:
            (lower_freq, upper_freq): 하한 및 상한 주파수
        """
        lower_freq = center_freq / self.factor
        upper_freq = center_freq * self.factor
        return lower_freq, upper_freq
    
    def analyze(self, audio_data):
        """
        오디오 데이터를 분석하여 각 옥타브 밴드의 레벨을 계산
        A-weighting을 적용하여 인간의 청각 특성을 반영합니다.
        
        Args:
            audio_data: 오디오 샘플 배열
        
        Returns:
            (band_levels, peak_levels): 현재 레벨과 피크 홀드 레벨 (dB)
        """
        # 데이터 길이 확인 및 조정
        if len(audio_data) != self.chunk_size:
            # 데이터가 부족하면 제로 패딩
            if len(audio_data) < self.chunk_size:
                audio_data = np.pad(audio_data, (0, self.chunk_size - len(audio_data)))
            else:
                # 데이터가 많으면 잘라냄
                audio_data = audio_data[:self.chunk_size]
        
        # Hanning 윈도우 적용
        windowed_data = audio_data * np.hanning(len(audio_data))
        
        # FFT 수행
        fft_result = np.fft.fft(windowed_data)
        magnitude = np.abs(fft_result[:self.chunk_size // 2])
        
        # 가청 주파수 범위만 추출
        magnitude_audible = magnitude[self.fft_freq_indices]
        
        # A-weighting 적용
        a_weight_linear = 10 ** (self.a_weighting_db / 20)
        magnitude_weighted = magnitude_audible * a_weight_linear
        
        # 각 옥타브 밴드의 에너지 계산
        band_levels = np.zeros(self.num_bands)
        
        for i, center_freq in enumerate(self.center_frequencies):
            lower_freq, upper_freq = self.calculate_band_limits(center_freq)
            
            # 가청 주파수 범위 내에서만 계산
            lower_freq = max(lower_freq, 20)
            upper_freq = min(upper_freq, 20000)
            
            # 해당 주파수 대역의 FFT 빈 찾기
            mask = (self.fft_freq >= lower_freq) & (self.fft_freq <= upper_freq)
            
            if np.any(mask):
                # RMS 에너지 계산 (A-weighting 적용)
                band_energy = np.sqrt(np.mean(magnitude_weighted[mask] ** 2))
                
                # dB 변환 (정규화)
                if band_energy > 0:
                    level_db = 20 * np.log10(band_energy / self.reference_level)
                else:
                    level_db = -np.inf
                
                band_levels[i] = level_db
            else:
                band_levels[i] = -np.inf
        
        # 피크 홀드 업데이트
        for i in range(self.num_bands):
            if band_levels[i] > self.peak_hold[i]:
                self.peak_hold[i] = band_levels[i]
            else:
                # 피크 감쇠
                self.peak_hold[i] = self.peak_hold[i] * self.peak_decay + band_levels[i] * (1 - self.peak_decay)
        
        return band_levels, self.peak_hold.copy()


class RTAMainWindow(QtWidgets.QMainWindow):
    """
    RTA 메인 윈도우 클래스 - Professional Edition
    
    전문적인 RTA Analyzer UI를 구현합니다.
    """
    
    def __init__(self):
        """초기화"""
        super().__init__()
        
        self.setWindowTitle("RTA Real-Time Analyzer - Professional Edition")
        self.setGeometry(100, 100, 1400, 700)
        
        # 다크 테마 색상
        self.bg_color = QtGui.QColor(30, 30, 30)
        self.grid_color = QtGui.QColor(60, 60, 60)
        self.text_color = QtGui.QColor(220, 220, 220)
        self.bar_color = QtGui.QColor(0, 150, 255)  # 파란색 바
        self.peak_color = QtGui.QColor(255, 50, 50)  # 빨간색 피크
        
        # PyQtGraph 최적화 설정
        pg.setConfigOptions(
            useOpenGL=True,      # GPU 렌더링
            antialias=True,      # 부드러운 라인
            enableExperimental=False,
            background=self.bg_color,
            foreground=self.text_color
        )
        
        # 중앙 위젯 생성
        central_widget = QtWidgets.QWidget()
        self.setCentralWidget(central_widget)
        central_widget.setStyleSheet(f"background-color: {self.bg_color.name()};")
        
        # 메인 레이아웃
        main_layout = QtWidgets.QVBoxLayout()
        central_widget.setLayout(main_layout)
        
        # 상단 정보 패널
        info_panel = QtWidgets.QHBoxLayout()
        self.status_label = QtWidgets.QLabel("● 준비됨")
        self.status_label.setStyleSheet(f"color: {self.text_color.name()}; font-size: 14px; font-weight: bold;")
        info_panel.addWidget(self.status_label)
        
        self.sample_rate_label = QtWidgets.QLabel("48 kHz")
        self.sample_rate_label.setStyleSheet(f"color: {self.text_color.name()}; font-size: 12px;")
        info_panel.addWidget(self.sample_rate_label)
        
        self.update_rate_label = QtWidgets.QLabel("60 Hz")
        self.update_rate_label.setStyleSheet(f"color: {self.text_color.name()}; font-size: 12px;")
        info_panel.addWidget(self.update_rate_label)
        
        info_panel.addStretch()
        main_layout.addLayout(info_panel)
        
        # 그래프 위젯 생성
        self.graph_widget = pg.GraphicsLayoutWidget()
        self.graph_widget.setBackground(self.bg_color)
        main_layout.addWidget(self.graph_widget)
        
        # 플롯 생성
        self.plot = self.graph_widget.addPlot(title="Real-Time Frequency Analysis (A-Weighted)")
        self.plot.setLabel('left', 'Level', units='dB', color=self.text_color.name())
        self.plot.setLabel('bottom', 'Frequency', units='Hz', color=self.text_color.name())
        self.plot.setLogMode(x=True, y=False)  # X축 로그 스케일
        self.plot.setYRange(-80, 10)  # dB 범위 확장
        self.plot.setXRange(20, 20000)  # 가청 주파수 범위
        
        # 스타일 설정
        self.plot.getAxis('left').setPen(pg.mkPen(self.text_color))
        self.plot.getAxis('bottom').setPen(pg.mkPen(self.text_color))
        self.plot.getAxis('left').setTextPen(pg.mkPen(self.text_color))
        self.plot.getAxis('bottom').setTextPen(pg.mkPen(self.text_color))
        
        # 그리드 추가 (더 세밀하게)
        self.plot.showGrid(x=True, y=True, alpha=0.2)
        self.plot.getAxis('left').setGrid(255)
        self.plot.getAxis('bottom').setGrid(255)
        
        # 옥타브 밴드 분석기 초기화 (48kHz, 고해상도)
        self.analyzer = OctaveBandAnalyzer(sample_rate=48000, chunk_size=8192)
        
        # 바 그래프 아이템 생성 (전문적인 스타일)
        self.bar_graph = pg.BarGraphItem(
            x=self.analyzer.center_frequencies,
            height=np.zeros(self.analyzer.num_bands),
            width=0.7,
            brush=pg.mkBrush(self.bar_color),
            pen=pg.mkPen(None)
        )
        self.plot.addItem(self.bar_graph)
        
        # 피크 홀드 라인 생성
        self.peak_line = pg.PlotCurveItem(
            self.analyzer.center_frequencies,
            np.zeros(self.analyzer.num_bands),
            pen=pg.mkPen(self.peak_color, width=2, style=QtCore.Qt.DashLine),
            skipFiniteCheck=True
        )
        self.plot.addItem(self.peak_line)
        
        # 주파수 라벨 추가 (주요 주파수)
        major_freqs = [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000]
        for freq in major_freqs:
            if 20 <= freq <= 20000:
                # 수직선 추가
                line = pg.InfiniteLine(pos=freq, angle=90, pen=pg.mkPen(self.grid_color, width=1, style=QtCore.Qt.DashLine))
                self.plot.addItem(line)
        
        # 오디오 프로세서 초기화 (48kHz)
        self.audio_processor = AudioProcessor(sample_rate=48000, chunk_size=8192)
        
        # 업데이트 타이머 (16.67ms = 60Hz)
        self.update_timer = QtCore.QTimer()
        self.update_timer.timeout.connect(self.update_analysis)
        self.update_timer.setInterval(16)  # 16.67ms ≈ 60Hz
        
        # 하단 컨트롤 패널
        control_panel = QtWidgets.QHBoxLayout()
        control_panel.setSpacing(10)
        
        # 시작/중지 버튼 (전문적인 스타일)
        self.start_button = QtWidgets.QPushButton("▶ 시작")
        self.start_button.setStyleSheet("""
            QPushButton {
                background-color: #00aa00;
                color: white;
                font-size: 14px;
                font-weight: bold;
                padding: 8px 20px;
                border-radius: 4px;
            }
            QPushButton:hover {
                background-color: #00cc00;
            }
            QPushButton:disabled {
                background-color: #555555;
            }
        """)
        self.start_button.clicked.connect(self.start_analysis)
        control_panel.addWidget(self.start_button)
        
        self.stop_button = QtWidgets.QPushButton("■ 중지")
        self.stop_button.setStyleSheet("""
            QPushButton {
                background-color: #aa0000;
                color: white;
                font-size: 14px;
                font-weight: bold;
                padding: 8px 20px;
                border-radius: 4px;
            }
            QPushButton:hover {
                background-color: #cc0000;
            }
            QPushButton:disabled {
                background-color: #555555;
            }
        """)
        self.stop_button.clicked.connect(self.stop_analysis)
        self.stop_button.setEnabled(False)
        control_panel.addWidget(self.stop_button)
        
        control_panel.addStretch()
        
        # 레벨 표시
        self.level_label = QtWidgets.QLabel("Peak: -- dB")
        self.level_label.setStyleSheet(f"color: {self.text_color.name()}; font-size: 12px; font-weight: bold;")
        control_panel.addWidget(self.level_label)
        
        main_layout.addLayout(control_panel)
        
    def start_analysis(self):
        """분석 시작"""
        self.audio_processor.start()
        self.update_timer.start()
        self.start_button.setEnabled(False)
        self.stop_button.setEnabled(True)
        self.status_label.setText("● 분석 중...")
        self.status_label.setStyleSheet(f"color: #00ff00; font-size: 14px; font-weight: bold;")
        print("RTA 분석 시작 (48kHz, 60Hz 업데이트)")
    
    def stop_analysis(self):
        """분석 중지"""
        self.update_timer.stop()
        self.audio_processor.stop()
        self.start_button.setEnabled(True)
        self.stop_button.setEnabled(False)
        self.status_label.setText("● 중지됨")
        self.status_label.setStyleSheet(f"color: {self.text_color.name()}; font-size: 14px; font-weight: bold;")
        print("RTA 분석 중지")
    
    def update_analysis(self):
        """분석 업데이트 (타이머 콜백) - 60Hz"""
        # 오디오 프로세서의 큐에서 최신 데이터 가져오기
        audio_data = None
        while not self.audio_processor.data_queue.empty():
            try:
                audio_data = self.audio_processor.data_queue.get_nowait()
            except queue.Empty:
                break
        
        if audio_data is None:
            # 큐가 비어있으면 업데이트하지 않음
            return
        
        # 옥타브 밴드 분석 수행
        band_levels, peak_levels = self.analyzer.analyze(audio_data)
        
        # 바 그래프 업데이트
        self.bar_graph.setOpts(height=band_levels)
        
        # 피크 홀드 라인 업데이트
        self.peak_line.setData(self.analyzer.center_frequencies, peak_levels)
        
        # 피크 레벨 표시
        max_level = np.max(band_levels[np.isfinite(band_levels)])
        if np.isfinite(max_level):
            self.level_label.setText(f"Peak: {max_level:.1f} dB")
        else:
            self.level_label.setText("Peak: -- dB")
    
    def closeEvent(self, event):
        """윈도우 종료 이벤트"""
        self.stop_analysis()
        event.accept()


def main():
    """메인 함수"""
    app = QtWidgets.QApplication(sys.argv)
    
    # 다크 테마 적용
    app.setStyle('Fusion')
    palette = QtGui.QPalette()
    palette.setColor(QtGui.QPalette.Window, QtGui.QColor(30, 30, 30))
    palette.setColor(QtGui.QPalette.WindowText, QtGui.QColor(220, 220, 220))
    palette.setColor(QtGui.QPalette.Base, QtGui.QColor(40, 40, 40))
    palette.setColor(QtGui.QPalette.AlternateBase, QtGui.QColor(50, 50, 50))
    palette.setColor(QtGui.QPalette.ToolTipBase, QtGui.QColor(220, 220, 220))
    palette.setColor(QtGui.QPalette.ToolTipText, QtGui.QColor(220, 220, 220))
    palette.setColor(QtGui.QPalette.Text, QtGui.QColor(220, 220, 220))
    palette.setColor(QtGui.QPalette.Button, QtGui.QColor(50, 50, 50))
    palette.setColor(QtGui.QPalette.ButtonText, QtGui.QColor(220, 220, 220))
    palette.setColor(QtGui.QPalette.BrightText, QtGui.QColor(255, 0, 0))
    palette.setColor(QtGui.QPalette.Link, QtGui.QColor(0, 150, 255))
    palette.setColor(QtGui.QPalette.Highlight, QtGui.QColor(0, 150, 255))
    palette.setColor(QtGui.QPalette.HighlightedText, QtGui.QColor(0, 0, 0))
    app.setPalette(palette)
    
    # 메인 윈도우 생성 및 표시
    window = RTAMainWindow()
    window.show()
    
    # 이벤트 루프 시작
    sys.exit(app.exec_())


if __name__ == "__main__":
    main()
