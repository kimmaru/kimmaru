import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import util from 'util';
import { exec } from 'child_process';
import { createRequire } from 'module';

// CommonJS require 사용
const require = createRequire(import.meta.url);

// 비동기 exec
const execPromise = util.promisify(exec);

// ES Module에서 __dirname 구현
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 콘솔 출력
console.log('API 서버 시작 - hwp.js 의존성 제거된 버전');

const app = express();

// JSON 파싱 미들웨어 추가
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    const safeFilename = `${timestamp}-${randomString}-${encodeURIComponent(file.originalname)}`;
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

// 페이지 범위 기준으로 추출된 테이블 필터링
const filterTablesByPageRange = (tables, startPage, endPage) => {
  // 페이지 범위가 지정되지 않았으면 모든 테이블 반환
  if (!startPage || !endPage) {
    return tables;
  }

  // 페이지 정보가 포함된 테이블만 필터링
  return tables.filter(table => {
    // 테이블에 페이지 정보가 있으면 해당 정보 사용
    if (table.page) {
      return table.page >= startPage && table.page <= endPage;
    }
    
    // 위치 기반 페이지 추정
    if (table.position) {
      // 파일 크기를 전체 페이지 수로 나누어 대략적인 페이지 위치 추정
      // 예: 전체 파일 크기가 100000바이트이고, 총 5페이지라면 
      // 위치 0-20000: 1페이지, 20001-40000: 2페이지, ...
      const estimatedPage = Math.floor(table.position / 20000) + 1;
      return estimatedPage >= startPage && estimatedPage <= endPage;
    }
    
    // 정보가 없으면 기본적으로 포함 (안전하게)
    return true;
  });
};

// 간단한 텍스트 파싱을 통한 테이블 추출
const extractTablesFromHWPBinary = (buffer) => {
  try {
    // 여기서는 직접 HWP 바이너리 분석
    // HWP 파일 구조 분석 (참고: https://github.com/hahnlee/hwp.js/blob/master/docs/hwp/5.0/FileFormat.md)
    
    // 특수 구조를 식별하려는 시도
    let tables = [];
    
    // 바이너리 데이터에서 "표" 키워드와 관련된 패턴 확인
    // HWP 문서에서 표의 시작 마커에 대한 정보는 제한적이지만, 특정 패턴을 시도해볼 수 있음
    const tableMarkers = [
      Buffer.from([0x43, 0x00, 0x44, 0x00]), // 'CD' 패턴 (표 관련 마커일 수 있음)
      Buffer.from([0x4C, 0x00, 0x52, 0x00]), // 'LR' 패턴 (행/열 관련 마커일 수 있음)
    ];
    
    // 페이지 마커 추정 (완벽한 방법은 아님)
    const pageMarkers = [
      Buffer.from([0x0D, 0x0A, 0x0D, 0x0A]), // CR LF CR LF 패턴 (페이지 구분일 수 있음)
      Buffer.from([0x53, 0x00, 0x45, 0x00, 0x43, 0x00]), // 'SEC' 패턴 (Section 관련)
    ];
    
    // 페이지 위치 배열
    const pagePositions = [0]; // 첫 페이지 시작 위치
    
    // 페이지 마커 검색
    for (const marker of pageMarkers) {
      let pos = 0;
      while ((pos = buffer.indexOf(marker, pos)) !== -1) {
        pagePositions.push(pos);
        pos += marker.length;
      }
    }
    
    // 정렬 및 중복 제거
    const uniquePagePositions = [...new Set(pagePositions)].sort((a, b) => a - b);
    
    console.log(`추정된 페이지 경계 위치: ${uniquePagePositions.length}개`);
    
    // 마커 기반으로 테이블 위치 찾기 시도
    for (const marker of tableMarkers) {
      let pos = 0;
      while ((pos = buffer.indexOf(marker, pos)) !== -1) {
        // 마커 주변 데이터 추출
        const start = Math.max(0, pos - 200);
        const end = Math.min(buffer.length, pos + 200);
        const section = buffer.slice(start, end);
        
        // 페이지 번호 추정
        let pageNumber = 1;
        for (let i = 0; i < uniquePagePositions.length; i++) {
          if (pos >= uniquePagePositions[i]) {
            pageNumber = i + 1;
          } else {
            break;
          }
        }
        
        // 8비트 단위로 테이블 구조를 유추해볼 수 있음
        const rows = [];
        let row = [];
        let cellCount = 0;
        
        // 단순 휴리스틱: 0x00 시퀀스가 여러 번 나타나면 셀 구분자로 간주
        for (let i = 0; i < section.length; i++) {
          if (section[i] !== 0 && section[i+1] === 0 && section[i+2] !== 0) {
            cellCount++;
            if (cellCount > 3) { // 3개 이상의 셀이 있다면 행으로 간주
              row.push(section[i].toString(16));
              
              if (row.length > 0) {
                rows.push(row);
                row = [];
              }
              
              cellCount = 0;
            }
          }
        }
        
        if (rows.length > 1) { // 최소 2개 이상의 행이 있어야 테이블로 간주
          tables.push({
            headers: rows[0],
            records: rows.slice(1),
            position: pos,
            page: pageNumber // 추정된 페이지 번호 저장
          });
        }
        
        pos += marker.length; // 다음 검색 시작 위치
      }
    }
    
    // 바이너리를 텍스트로 변환하여 부가적인 분석 시도
    try {
      // UTF-16LE로 디코딩 시도 (HWP는 일반적으로 UTF-16LE 인코딩 사용)
      let text = '';
      for (let i = 0; i < buffer.length - 1; i += 2) {
        const code = buffer[i] + (buffer[i + 1] << 8);
        if (code >= 32 && code <= 126 || code >= 0xAC00 && code <= 0xD7A3) {
          text += String.fromCharCode(code);
        } else {
          text += ' ';
        }
      }
      
      // 텍스트에서 표 관련 패턴 찾기
      const tablePattern = /표\s*\d+|[가-힣]+\s*표|[A-Za-z]+\s*table/gi;
      let match;
      
      while ((match = tablePattern.exec(text)) !== null) {
        // 표 제목으로 추정되는 텍스트 주변 100자 추출
        const start = Math.max(0, match.index - 50);
        const end = Math.min(text.length, match.index + 150);
        const context = text.substring(start, end);
        
        // 페이지 번호 추정
        let pageNumber = 1;
        for (let i = 0; i < uniquePagePositions.length; i++) {
          if (match.index >= uniquePagePositions[i]) {
            pageNumber = i + 1;
          } else {
            break;
          }
        }
        
        tables.push({
          headers: [`표 ${tables.length + 1}`],
          records: [[match[0], context.replace(match[0], '**' + match[0] + '**')]],
          context: context,
          position: match.index,
          page: pageNumber // 추정된 페이지 번호 저장
        });
      }
    } catch (textError) {
      console.log('텍스트 변환 시도 중 오류:', textError);
    }
    
    // 중복 테이블 제거
    const uniqueTables = [];
    const seen = new Set();
    
    for (const table of tables) {
      const key = JSON.stringify(table.headers);
      if (!seen.has(key)) {
        seen.add(key);
        uniqueTables.push(table);
      }
    }
    
    // 테이블이 없는 경우 최소한의 결과 반환
    if (uniqueTables.length === 0) {
      return [{
        headers: ['HWP 내용 미리보기'],
        records: [['HWP 파일 내용을 추출할 수 없습니다. 파일을 직접 열어 확인해 주세요.']],
        page: 1
      }];
    }
    
    return uniqueTables;
  } catch (error) {
    console.error('HWP 바이너리 분석 오류:', error);
    return [{
      headers: ['오류'],
      records: [['HWP 파일 분석 중 오류가 발생했습니다: ' + error.message]],
      page: 1
    }];
  }
};

// HWP 파일을 대체 방식으로 처리
const processHWPWithAlternative = async (filePath, startPage, endPage) => {
  try {
    console.log(`대체 방식으로 HWP 파일 처리 시도... (페이지 범위: ${startPage || '처음'}-${endPage || '끝'})`);
    
    // 파일 바이너리 읽기
    const buffer = fs.readFileSync(filePath);
    console.log('파일 버퍼 크기:', buffer.length);
    
    // 1. 시스템에 설치된 HWP 유틸리티 시도
    try {
      console.log('외부 HWP 도구 사용 시도...');
      const { stdout } = await execPromise(`hwp2txt ${filePath} 2>/dev/null || echo "Tool not available"`);
      
      if (stdout && !stdout.includes("Tool not available")) {
        console.log('외부 HWP 도구로 텍스트 변환 성공');
        
        // 변환된 텍스트를 테이블 형태로 가공
        const lines = stdout.split('\n').filter(line => line.trim().length > 0);
        
        if (lines.length > 0) {
          // 간단한 표 구조 식별 시도
          const tables = [];
          let currentTable = null;
          let currentPage = 1;
          
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // 페이지 구분 마커 확인 (예: "--- 페이지 1 ---" 같은 패턴)
            if (line.match(/page|페이지|쪽/i) && line.match(/\d+/)) {
              const pageMatch = line.match(/\d+/);
              if (pageMatch) {
                currentPage = parseInt(pageMatch[0], 10);
                continue;
              }
            }
            
            // 표 제목으로 보이는 패턴
            if (line.match(/표\s*\d+|[가-힣]+\s*표|[A-Za-z]+\s*table/i)) {
              // 새 테이블 시작
              if (currentTable) {
                tables.push(currentTable);
              }
              
              currentTable = {
                headers: [line],
                records: [],
                page: currentPage // 현재 페이지 정보 저장
              };
            } 
            // 표 내용으로 보이는 패턴: 탭이나 여러 공백으로 구분된 항목들
            else if (currentTable && (line.includes('\t') || line.match(/\s{2,}/))) {
              const cells = line.split(/\t|\s{2,}/).filter(cell => cell.trim().length > 0);
              
              if (cells.length > 1) {
                currentTable.records.push(cells);
              }
            }
            // 표 끝으로 보이는 패턴: 빈 줄이나 매우 짧은 줄
            else if (currentTable && (line.length < 5 || i === lines.length - 1)) {
              tables.push(currentTable);
              currentTable = null;
            }
          }
          
          // 마지막 테이블 추가
          if (currentTable) {
            tables.push(currentTable);
          }
          
          // 지정된 페이지 범위의 테이블만 필터링
          const filteredTables = filterTablesByPageRange(tables, startPage, endPage);
          
          // 테이블이 발견되었으면 반환
          if (filteredTables.length > 0) {
            return filteredTables;
          }
          
          // 테이블이 없으면 텍스트를 테이블 형태로 변환
          return [{
            headers: ['HWP 파일 내용'],
            records: [
              [stdout.substring(0, Math.min(1000, stdout.length))]
            ],
            page: 1
          }];
        }
      }
    } catch (execError) {
      console.log('외부 HWP 도구 사용 실패:', execError.message);
    }
    
    // 2. 바이너리 분석 방식 시도
    console.log('내부 바이너리 분석 방식 시도...');
    const allTables = extractTablesFromHWPBinary(buffer);
    
    // 지정된 페이지 범위의 테이블만 필터링
    return filterTablesByPageRange(allTables, startPage, endPage);
    
  } catch (error) {
    console.error('대체 HWP 처리 방식 오류:', error);
    return [{
      headers: ['오류'],
      records: [['HWP 파일 처리 중 오류가 발생했습니다: ' + error.message]],
      page: 1
    }];
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
    
    // 페이지 범위 파라미터 확인
    const startPage = req.body.startPage ? parseInt(req.body.startPage, 10) : null;
    const endPage = req.body.endPage ? parseInt(req.body.endPage, 10) : null;
    
    console.log(`요청된 페이지 범위: ${startPage || '처음'}-${endPage || '끝'}`);
    
    // 파일 크기 확인
    const stats = fs.statSync(filePath);
    console.log('파일 크기:', stats.size);
    
    // 대체 방식으로 HWP 파일 처리 (페이지 범위 지정)
    const tables = await processHWPWithAlternative(filePath, startPage, endPage);
    
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
    try {
      fs.unlinkSync(filePath);
    } catch (unlinkError) {
      console.log('임시 파일 삭제 실패:', unlinkError.message);
    }
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