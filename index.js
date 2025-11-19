import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';
import util from 'util';
import { exec } from 'child_process';

// 비동기 exec
const execPromise = util.promisify(exec);

// ES Module에서 __dirname 구현
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// uploads 디렉토리 생성 (서버 실행 디렉토리 기준)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// multer 설정 - 서버 실행 디렉토리 내의 uploads 폴더 사용
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // 파일명에서 한글 인코딩 문제 방지
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const safeFilename = `${timestamp}-${randomString}-${file.originalname}`;
    cb(null, safeFilename);
  }
});

const upload = multer({ storage: storage });

// CORS 설정 개선 - 모든 도메인에서의 요청 허용 및 필요한 헤더 추가
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 기본 라우트
app.get('/', (req, res) => {
  res.send('HWP API 서버가 실행 중입니다!');
});

// 간단한 텍스트 파싱을 통한 테이블 추출 (hwp.js 의존성 없이)
const extractTablesFromHWPBinary = (buffer) => {
  try {
    // 여기서는 직접 HWP 바이너리 분석
    // HWP 파일이 가지고 있는 일반적인 표 구조의 마커를 찾는다
    
    // buffer를 문자열로 변환 - 이진 데이터를 텍스트로 처리할 때 발생할 수 있는 문제 고려
    const text = buffer.toString('utf8', 0, buffer.length);
    
    // 특정 패턴이나 마커를 찾아 테이블 식별 시도
    // 이 방식은 완벽하지 않지만, hwp.js 없이 간단한 대체 방법임
    const tableRows = [];
    const tablePattern = /표\s*\d+|[가-힣]+\s*표|[A-Za-z]+\s*table/gi;
    let match;
    
    while ((match = tablePattern.exec(text)) !== null) {
      // 표 제목으로 추정되는 텍스트 주변 100자 추출
      const start = Math.max(0, match.index - 50);
      const end = Math.min(text.length, match.index + 150);
      const context = text.substring(start, end);
      
      tableRows.push({
        title: match[0],
        context: context,
        position: match.index
      });
    }
    
    // 추출된 데이터를 테이블 형태로 변환
    const tables = tableRows.map((row, index) => {
      return {
        headers: [`표 ${index + 1} 제목`],
        records: [[row.title]],
        context: row.context
      };
    });
    
    return tables;
  } catch (error) {
    console.error('HWP 바이너리 분석 오류:', error);
    return [];
  }
};

// HWP 파일을 대체 방식으로 처리
const processHWPWithAlternative = async (filePath) => {
  try {
    // 시스템에 설치된 HWP 유틸리티가 있는지 확인하고 사용 시도
    // 예: hwp2txt, hwp2html 등의 명령줄 도구
    try {
      // 먼저 외부 도구로 시도
      const { stdout } = await execPromise(`hwp2txt ${filePath} 2>/dev/null || echo "Tool not available"`);
      
      if (stdout && !stdout.includes("Tool not available")) {
        console.log('외부 HWP 도구로 텍스트 변환 성공');
        
        // 변환된 텍스트에서 테이블 추출 시도
        // 여기서는 간단한 예시로, 실제로는 더 정교한 파싱이 필요
        const tables = [
          {
            headers: ['외부 도구로 추출된 데이터'],
            records: [[stdout.substring(0, 1000)]] // 처음 1000자만 표시
          }
        ];
        
        return tables;
      }
    } catch (execError) {
      console.log('외부 HWP 도구 사용 실패, 내부 방식으로 시도');
    }
    
    // 외부 도구 실패 시 직접 바이너리 처리
    const buffer = fs.readFileSync(filePath);
    return extractTablesFromHWPBinary(buffer);
    
  } catch (error) {
    console.error('대체 HWP 처리 방식 오류:', error);
    return [];
  }
};

// HWP 파일 파싱 엔드포인트
app.post('/parse-hwp', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '파일이 업로드되지 않았습니다.' });
    }

    const filePath = req.file.path;
    console.log('업로드된 파일 경로:', filePath);
    
    // 파일 크기 확인
    const stats = fs.statSync(filePath);
    console.log('파일 크기:', stats.size);
    
    // 대체 방식으로 HWP 파일 처리
    console.log('대체 방식으로 HWP 파일 처리 시도...');
    const tables = await processHWPWithAlternative(filePath);
    
    console.log(`추출된 테이블 수: ${tables.length}`);
    
    // 간단한 결과 분석
    if (tables.length > 0) {
      console.log('첫 번째 테이블 샘플:', JSON.stringify(tables[0]).substring(0, 300) + '...');
    } else {
      console.log('테이블이 발견되지 않았습니다');
    }
    
    // 응답 반환
    res.json({ tables });
    
    // 사용 후 임시 파일 삭제
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error('HWP 파일 처리 최종 오류:', error);
    
    // 클라이언트에게 자세한 에러 정보 제공
    res.status(500).json({ 
      error: '파일 처리 중 오류가 발생했습니다.',
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
    });
  }
});

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
}); 