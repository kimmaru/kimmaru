<div align="center">

<img width="100%" height="120px" src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=120&section=header&fontSize=30&fontAlignY=35&animation=twinkling&fontColor=ffffff" alt="Header Wave Animation"/>

<br>

<h1 align="center">
<img src="https://readme-typing-svg.herokuapp.com?font=Press+Start+2P&size=24&duration=3000&pause=500&color=FF6A88&center=true&vCenter=true&width=820&height=90&lines=Software+Engineer&repeat=false&backSpeed=0&t=2" alt="Software Engineer Title" /><!--
--><img src="https://readme-typing-svg.herokuapp.com?font=Press+Start+2P&size=24&duration=700&pause=350&color=FF6A88&center=true&vCenter=true&width=44&height=90&lines=%3E;%20;%3E;%20&repeat=true&t=2" alt="Blinking Cursor" />
</h1>

<h3 align="center">Passionate about Computer Vision & Machine Learning Applications</h3>

<br>

<p align="center">
  <a href="#portfolio">
    <img src="https://img.shields.io/badge/Portfolio-FF6B6B?style=for-the-badge&logoColor=white&labelColor=FF6B6B" alt="Portfolio Badge"/>
  </a>
  <a href="mailto:contact@example.com">
    <img src="https://img.shields.io/badge/Email-4ECDC4?style=for-the-badge&logoColor=white&labelColor=4ECDC4" alt="Email Badge"/>
  </a>
  <a href="#linkedin">
    <img src="https://img.shields.io/badge/LinkedIn-45B7D1?style=for-the-badge&logoColor=white&labelColor=45B7D1" alt="LinkedIn Badge"/>
  </a>
</p>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" alt="Divider Animation">

</div>

<br>

## About Me

Software engineer with a focus on developing practical solutions using machine learning and computer vision technologies. Experienced in building end-to-end pipelines from data preprocessing to model deployment, with particular expertise in image processing and deep learning architectures.

---

## Tech Stack & Tools

<div align="center">

### Programming Languages
<p>
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/C%2B%2B-00599C?style=for-the-badge&logo=c%2B%2B&logoColor=white" alt="C++"/>
</p>

### Machine Learning & Data Science
<p>
  <img src="https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white" alt="TensorFlow"/>
  <img src="https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white" alt="PyTorch"/>
  <img src="https://img.shields.io/badge/OpenCV-27338e?style=for-the-badge&logo=OpenCV&logoColor=white" alt="OpenCV"/>
  <img src="https://img.shields.io/badge/scikit--learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white" alt="Scikit-learn"/>
  <img src="https://img.shields.io/badge/Pandas-2C2D72?style=for-the-badge&logo=pandas&logoColor=white" alt="Pandas"/>
  <img src="https://img.shields.io/badge/Numpy-777BB4?style=for-the-badge&logo=numpy&logoColor=white" alt="NumPy"/>
</p>

### Cloud & DevOps
<p>
  <img src="https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white" alt="AWS"/>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/>
  <img src="https://img.shields.io/badge/Kubernetes-326ce5?style=for-the-badge&logo=kubernetes&logoColor=white" alt="Kubernetes"/>
  <img src="https://img.shields.io/badge/MLflow-0194E2?style=for-the-badge&logo=mlflow&logoColor=white" alt="MLflow"/>
</p>

### Development Tools
<p>
  <img src="https://img.shields.io/badge/VS_Code-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white" alt="VS Code"/>
  <img src="https://img.shields.io/badge/Jupyter-F37626.svg?&style=for-the-badge&logo=Jupyter&logoColor=white" alt="Jupyter"/>
  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" alt="Git"/>
  <img src="https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black" alt="Linux"/>
</p>

</div>

---

## Projects

<details>
<summary><strong>Vision Transformer Optimization for Sketch Classification</strong></summary>

<br>

[![GitHub](https://img.shields.io/badge/GitHub-181717.svg?style=for-the-badge&logo=GitHub&logoColor=white)](https://github.com/kimmaru/level1-imageclassification-cv-21)

**Overview**: Developed an advanced classification system targeting 500-class sketch images where color and texture information is minimal. The project focused on understanding fundamental data characteristics and optimizing Vision Transformer architectures for maximum generalization performance on abstract visual representations.

**Role & Responsibilities**: Data characteristic analysis, evaluation accuracy enhancement, data augmentation implementation, hyperparameter optimization

**Key Technical Contributions**: 
- Addressed high variance in sketch data through Label Smoothing and Test Time Augmentation (TTA) implementation, leading model generalization improvements
- Applied Attention-Only Freeze and Automatic Mixed Precision (AMP) techniques to maximize training efficiency within resource constraints
- Conducted systematic model architecture search across Vision Transformer variants

**Performance Achievements**:
- **Final Accuracy**: 90.3% (40 percentage point improvement from baseline)
- **Training Speed**: 4-6x acceleration through AMP implementation  
- **Memory Efficiency**: 20% reduction via Attention-Only freezing strategy

**Technical Stack**: DeiT3, ViT, PyTorch, Mixup, Cutmix, Label Smoothing, Test Time Augmentation, Automatic Mixed Precision, AdamW Optimizer

</details>

<details>
<summary><strong>Object Detection for Waste Classification</strong></summary>

<br>

[![GitHub](https://img.shields.io/badge/GitHub-181717.svg?style=for-the-badge&logo=GitHub&logoColor=white)](https://github.com/kimmaru/level2-objectdetection-cv-21)

**Overview**: Engineered a comprehensive object detection pipeline for identifying and categorizing 10 distinct types of recyclable waste materials. The project addressed real-world challenges including severe class imbalance and highly variable object scales within COCO format annotations.

**Role & Responsibilities**: Data characteristic analysis, evaluation accuracy improvement, advanced data augmentation technique implementation

**Key Technical Contributions**:
- Led experimental implementation of Controllable Diffusion Models for synthetic data augmentation to address class imbalance issues
- Integrated Test Time Augmentation with Weighted Boxes Fusion (WBF) ensemble methodology for robust performance gains
- Conducted comprehensive exploratory data analysis revealing critical dataset distribution patterns

**Performance Achievements**:
- **TTA Performance Gain**: +5% improvement on Swin Transformer models
- **Data Analysis**: Identified and quantified significant class imbalance through systematic EDA
- **Ensemble Strategy**: Successfully implemented WBF for consistent performance enhancement

**Technical Stack**: MMDetection, YOLO, Swin Transformer, Diffusion Models, Multi-Crop Augmentation, Pseudo Labeling, Weighted Boxes Fusion

</details>

<details>
<summary><strong>Data-Centric OCR Implementation</strong></summary>

<br>

[![GitHub](https://img.shields.io/badge/GitHub-181717.svg?style=for-the-badge&logo=GitHub&logoColor=white)](https://github.com/kimmaru/level2-cv-datacentric-cv-21)

**Overview**: Implemented a pure Data-Centric AI approach for receipt text detection, maintaining fixed model architecture (EAST) while maximizing F1-score performance solely through data quality improvements. This project demonstrated advanced understanding of data-driven machine learning methodologies.

**Role & Responsibilities**: Data feature analysis, enhanced evaluation accuracy, implementation of sophisticated data augmentation techniques

**Key Technical Contributions**:
- Conducted systematic augmentation technique experimentation to address EDA-identified issues (shadows, rotation, perspective distortion)
- Implemented Pickle format conversion to resolve data I/O bottlenecks, achieving 50% training time reduction (8h → 4h)
- Established comprehensive data annotation guidelines and validation procedures

**Performance Achievements**:
- **F1 Score**: 0.8321 (massive improvement from initial 0.2 baseline)
- **Training Efficiency**: 50% reduction in training time through optimized data pipeline
- **Methodology**: Successfully demonstrated Data-Centric AI principles with fixed model architecture

**Technical Stack**: EAST Text Detection, Albumentations, CVAT Annotation Tool, Pickle Serialization, PyTorch

</details>

<details>
<summary><strong>Medical Image Segmentation Optimization</strong></summary>

<br>

[![GitHub](https://img.shields.io/badge/GitHub-181717.svg?style=for-the-badge&logo=GitHub&logoColor=white)](https://github.com/kimmaru/level2-cv-semanticsegmentation-cv-20-lv3)

**Overview**: Developed pixel-level semantic segmentation solution for 29 distinct bone structures in hand X-ray images. The project tackled challenges of limited medical imaging data, ambiguous class boundaries, and high-resolution processing requirements for clinical-grade accuracy.

**Role & Responsibilities**: Experimental and collaborative environment setup, training acceleration, preprocessing and augmentation pipeline, optimizer exploration, ensemble methodology

**Key Technical Contributions**:
- Implemented Automatic Mixed Precision (AMP) to accelerate high-resolution medical image training cycles for entire team
- Conducted comprehensive optimizer exploration and systematic training process analysis
- Performed critical code debugging before final experiments, preventing potential system failures
- Developed sophisticated class-wise ensemble strategies for precision improvement

**Performance Achievements**:
- **Private Dice Score**: 97.64% (top-tier performance level)
- **Core Technology**: AMP implementation enabling faster experimentation cycles
- **Ensemble Strategy**: Class-wise ensemble methodology for refined performance gains

**Technical Stack**: U-Net++, SegFormer, UPerNet, Swin Transformer, Albumentations, Automatic Mixed Precision, Test Time Augmentation, Class-wise Ensemble

</details>

<details>
<summary><strong>Multimodal Language Model Optimization</strong></summary>

<br>

[![GitHub](https://img.shields.io/badge/GitHub-181717.svg?style=for-the-badge&logo=GitHub&logoColor=white)](https://github.com/kimmaru/level4-cv-finalproject-hackathon-cv-20-lv3)

**Overview**: Led optimization of SALMONN-based multimodal large language model, achieving optimal balance between core performance metrics and computational efficiency. This hackathon project required comprehensive system analysis and application of multiple model compression techniques.

**Role & Responsibilities**: Team leadership, exploratory data analysis, data preprocessing pipeline, model efficiency optimization

**Key Technical Contributions**:
- Provided strategic project coordination and comprehensive decision-making for complex performance-efficiency trade-offs
- Resolved critical data pipeline issues through systematic EDA and preprocessing optimization
- Implemented and evaluated multiple compression techniques: 4-bit Quantization, Flash Attention 2, Parameter-Efficient Fine-Tuning (VB-LoRA)
- Established systematic benchmarking methodology for multimodal model evaluation

**Performance Achievements**:
- **Memory Efficiency**: 35% reduction (9.18GB → 5.96GB)
- **Audio Captioning (SPIDEr)**: 58.8% performance improvement (0.20 → 0.32)
- **Speech Recognition (WER)**: 7.7% error reduction

**Technical Stack**: SALMONN, Llama-3, Whisper-v3, 4-bit Quantization, Parameter-Efficient Fine-Tuning (VB-LoRA), Flash Attention 2, Model Pruning, JIT/AOT Compilation

</details>

---

## GitHub Analytics

<div align="center">

<table>
<tr>
<td align="center" width="50%">

![GitHub Stats](https://github.com/kimmaru/kimmaru/blob/main/metrics.base.svg)

</td>
<td align="center" width="50%">

![Top Languages](https://github.com/kimmaru/kimmaru/blob/main/metrics.plugin.languages.details.svg)

</td>
</tr>
<tr>
<td align="center" width="50%">

![Contribution Calendar](https://github.com/kimmaru/kimmaru/blob/main/metrics.plugin.isocalendar.fullyear.svg)

</td>
<td align="center" width="50%">

![GitHub Stars](https://github.com/kimmaru/kimmaru/blob/main/metrics.plugin.stars.svg)

</td>
</tr>
</table>

</div>

---

## Current Focus

<div align="center">

| **Research Areas** | **Development Focus** | **Learning Path** |
|:---|:---|:---|
| • Deep Learning Architecture | • MLOps Pipeline Development | • Advanced Transformer Research |
| • Computer Vision Applications | • Model Optimization | • Large Language Model Fine-tuning |
| • Neural Network Optimization | • Production Deployment | • Multi-modal System Design |

</div>

---

<div align="center">

<img width="100%" height="120px" src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=120&section=footer&fontSize=30&fontAlignY=85&animation=twinkling&fontColor=ffffff" alt="Footer Wave Animation"/>

</div>
