#!/bin/bash

# 현재 시간 가져오기
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

# git에 변경사항 추가하기
git add .

# 변경사항 커밋하기
git commit -m "자동 업데이트: $TIMESTAMP"

# 원격 저장소에 푸시하기
git push origin main

echo "변경사항이 성공적으로 푸시되었습니다. Vercel 배포가 자동으로 시작됩니다." 