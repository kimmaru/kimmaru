<div align="center">

# 김성주 (Sungjoo Kim)

**AI & Computer Vision Engineer**

[![GitHub](https://img.shields.io/badge/GitHub-kimmaru-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/kimmaru)
[![Email](https://img.shields.io/badge/Email-comaoz1@naver.com-03C75A?style=flat-square&logo=naver&logoColor=white)](mailto:comaoz1@naver.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Sungjoo_Kim-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/%EC%84%B1%EC%83%BC-%EA%B9%80-60b02928b)
[![Paper](https://img.shields.io/badge/KIEE_Paper-10.5370%2FKIEE.2023.72.7.843-blue?style=flat-square&logo=doi&logoColor=white)](https://doi.org/10.5370/KIEE.2023.72.7.843)
[![Patent](https://img.shields.io/badge/Patent-10--2023--0139485-orange?style=flat-square)](https://github.com/kimmaru)

</div>

---

## 🛠 Tech Stack

<div align="center">

| Category | Skills & Tools |
|:---|:---|
| **Languages** | ![Python](https://img.shields.io/badge/Python_3.10+-3776AB?style=flat-square&logo=python&logoColor=white) ![C++](https://img.shields.io/badge/C++-00599C?style=flat-square&logo=cplusplus&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) ![SQL](https://img.shields.io/badge/SQL-4479A1?style=flat-square&logo=postgresql&logoColor=white) |
| **Frameworks** | ![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=flat-square&logo=pytorch&logoColor=white) ![HuggingFace](https://img.shields.io/badge/Transformers-FFD21E?style=flat-square&logo=huggingface&logoColor=black) ![OpenCV](https://img.shields.io/badge/OpenCV-5C3EE8?style=flat-square&logo=opencv&logoColor=white) ![MMDetection](https://img.shields.io/badge/MMDetection-181717?style=flat-square) ![YOLO](https://img.shields.io/badge/Ultralytics_YOLO-00FFFF?style=flat-square&logoColor=black) |
| **DevOps & Tools** | ![Linux](https://img.shields.io/badge/Linux-FCC624?style=flat-square&logo=linux&logoColor=black) ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white) ![Git](https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white) ![WandB](https://img.shields.io/badge/WandB-FFBE00?style=flat-square&logo=weightsandbiases&logoColor=black) ![Streamlit](https://img.shields.io/badge/Streamlit-FF4B4B?style=flat-square&logo=streamlit&logoColor=white) ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white) |

</div>

---

## 🚀 Projects

| 프로젝트 | 핵심 성과 | Repository |
|:---|:---|:---:|
| **오디오 언어모델 경량화 및 추론 최적화** | • VRAM **35.0% 절감** (9.18GB → 5.96GB, 단일 8GB GPU 서빙)<br>• SPIDEr **+58.8%** (0.2027 → 0.3218) \| WER **-7.7%** (0.0634 → 0.0585) | [GitHub](https://github.com/kimmaru/level4-cv-finalproject-hackathon-cv-20-lv3) |
| **Hand Bone Image Semantic Segmentation** | • PyTorch AMP 도입으로 학습 시간 **14.0% 단축** (41m → 36m40s)<br>• Lion 도입 **Dice 0.94559** (vs Adam 0.88489) \| 최종 앙상블 **Dice ~0.97** | [GitHub](https://github.com/kimmaru/level2-cv-semanticsegmentation-cv-20-lv3) |
| **Data-Centric OCR Text Detection** | • Pickle 직렬화 전처리로 I/O 병목 해소, 학습 시간 **50% 단축** (8h → 4h)<br>• 3단계 시각화로 중복 증강 버그 규명 및 정상 복구 (**F1-Score 0.78166**) | [GitHub](https://github.com/kimmaru/level2-cv-datacentric-cv-21) |
| **Recycle Object Detection** | • 소형 객체 특화 멀티스케일 증강 전략 도출<br>• Swin 백본 TTA 적용으로 성능 **+5%p 향상** \| 1/2-stage WBF 앙상블 | [GitHub](https://github.com/kimmaru/level2-objectdetection-cv-21) |
| **Sketch Image Classification** | • 선화 특화 증강(Mixup/CutMix/Label Smoothing)으로 정확도 **+1.5%p 향상**<br>• DeiT3-Large + Soft-Voting 앙상블 최종 **Accuracy 90.3%** 달성 | [GitHub](https://github.com/kimmaru/level1-imageclassification-cv-21) |

<br>

<details>
<summary><b>🔍 프로젝트별 상세 내역 (Click to expand)</b></summary>

<br>

### 1. 오디오 언어모델 경량화 및 추론 최적화 (팀 리더)
- **Repository**: [level4-cv-finalproject-hackathon-cv-20-lv3](https://github.com/kimmaru/level4-cv-finalproject-hackathon-cv-20-lv3)
- **Stack**: `SALMONN`, `LLaMA-3.2 3B`, `Whisper-large-v3`, `BitsAndBytes 4-bit NF4`, `VB-LoRA`, `Flash Attention 2`, `noisereduce`
- **Impact**:
  - VRAM 35.0% 절감 (9.18GB → 5.96GB, 8GB GPU OOM 해결)
  - 오디오 캡셔닝 SPIDEr 점수 +58.8% 향상 (0.2027 → 0.3218)
  - 음성 인식 WER 7.7% 오류 감소 (0.0634 → 0.0585)
  - Flash Attention 2 적용으로 지연 시간 26.6% 개선 (0.56s → 0.44s)

---

### 2. Hand Bone Image Semantic Segmentation (손 X-Ray 29개 뼈 분할)
- **Repository**: [level2-cv-semanticsegmentation-cv-20-lv3](https://github.com/kimmaru/level2-cv-semanticsegmentation-cv-20-lv3)
- **Stack**: `PyTorch AMP`, `UPerNet`, `SegFormer`, `Swin-Transformer`, `Lion Optimizer`, `Streamlit`
- **Impact**:
  - `torch.cuda.amp` 도입으로 20에폭 기준 학습 시간 14.0% 단축 (41m → 36m40s)
  - 부호 모멘텀 기반 Lion 옵티마이저 도입으로 Dice Score 0.94559 달성 (Adam 0.88489 대비 개선)
  - UPerNet Swin 백본 및 Soft-Voting 앙상블로 최종 Dice Score ~0.97 수준 달성
  - Streamlit 기반 오분할 세그먼트 인터랙티브 검증 대시보드 구축

---

### 3. Data-Centric OCR Text Detection (데이터 중심 글자 검출)
- **Repository**: [level2-cv-datacentric-cv-21](https://github.com/kimmaru/level2-cv-datacentric-cv-21)
- **Stack**: `EAST`, `Pickle Serialization`, `UFO Format`, `Albumentations`, `CVAT`
- **Impact**:
  - 고해상도 영수증 이미지 전처리 직렬화(`to_pickle.py`)로 학습 소요 시간 50% 단축 (8h → 4h)
  - `[원본 - 캐시 - 텐서]` 3단계 시각화 도구로 중복 증강 버그 규명 및 정상 복구
  - Test 데이터 통계량 기반 정규화 및 이진화 전처리로 F1-Score 0.78166 달성

---

### 4. Recycle Object Detection (재활용 쓰레기 10종 다중 객체 탐지)
- **Repository**: [level2-objectdetection-cv-21](https://github.com/kimmaru/level2-objectdetection-cv-21)
- **Stack**: `YOLOv11`, `RT-DETR`, `Cascade R-CNN`, `Swin-Transformer`, `WBF Ensemble`
- **Impact**:
  - 바운딩 박스 크기 분석을 바탕으로 너비/높이 0.2 이하 소형 객체 특화 멀티스케일 증강 전략 수립
  - Swin 백본 모델에 Test-Time Augmentation(TTA) 적용해 탐지 성능 약 5%p 개선
  - 1-stage & 2-stage 모델 결합 Weighted Boxes Fusion(WBF) 앙상블 구축
  - Controllable Diffusion 합성 증강 실험을 통한 도메인 갭 분석 및 데이터 품질 원칙 정립

---

### 5. Sketch Image Classification (대규모 스케치 500종 분류)
- **Repository**: [level1-imageclassification-cv-21](https://github.com/kimmaru/level1-imageclassification-cv-21)
- **Stack**: `DeiT3-Large`, `ViT`, `timm`, `Mixup`, `CutMix`, `Label Smoothing`, `TTA`
- **Impact**:
  - 흑백 선화 특성에 맞춘 Mixup/CutMix 및 과신 방지 Label Smoothing 적용으로 정확도 약 1.5%p 향상
  - DeiT Large 백본에 FiveCrop 기반 TTA와 Soft-Voting 앙상블을 결합해 최종 Accuracy 90.3% 달성

</details>

---

## 📜 Research & Patent

- **[Paper] New U-Net for Image Deblurring Using Deep Learning**  
  *The Transactions of the KIEE (대한전기학회 논문지), Vol. 72, No. 7, pp. 843–848 (2023.07)*  
  [![DOI](https://img.shields.io/badge/DOI-10.5370%2FKIEE.2023.72.7.843-blue?style=flat-square&logo=doi&logoColor=white)](https://doi.org/10.5370/KIEE.2023.72.7.843)  
  인코더-디코더 병렬 Short-cut(ResN1) 구조로 기존 U-Net 대비 PSNR 약 1dB 및 고주파 디테일 복원 성능 향상 입증.

- **[Patent] 딥러닝에 기반한 영상 디블러링 방법**  
  *출원번호: 10-2023-0139485 (발명자 참여, 2023.10)*

---

## 💡 Other Projects

<details>
<summary><b>임베디드 엣지 실시간 안면인식 출입 보안 시스템</b> (캡스톤 팀장)</summary>

- **Stack**: `Raspberry Pi`, `OpenCV`, `C++`, `Python`
- Raspberry Pi 환경 경량 얼굴 검출 모델 포팅 및 초음파 센서/서보모터 연동
- 근접 감지 → 얼굴 인증 → 도어 제어 → 방문자 감사 로그 기록의 전 주기 제어 시스템 구현

</details>

<details>
<summary><b>Slack Export Viewer</b> (개인 프로젝트)</summary>

- **Stack**: `Python (re)`, `Node.js`, `Playwright`
- 대용량 텍스트 토큰화/정규화 파이프라인 및 카드형 탐색 UI 구축, Playwright E2E 자동 테스트 구현

</details>

---

<div align="center">

### Contact

[![Email](https://img.shields.io/badge/Email-comaoz1@naver.com-03C75A?style=for-the-badge&logo=naver&logoColor=white)](mailto:comaoz1@naver.com)
[![GitHub](https://img.shields.io/badge/GitHub-kimmaru-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/kimmaru)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/%EC%84%B1%EC%83%BC-%EA%B9%80-60b02928b)

</div>
