import os
import tempfile
import logging
from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from python.hwpx_table_extractor import extract_tables

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="HWPX Table Extractor API",
    description="한글 문서 파일(.hwpx)에서 테이블을 추출하는 API",
    version="1.0.0"
)

# CORS 설정
origins = ["*"]  # 모든 도메인에서 요청 허용

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,  # credentials 사용 안함
    allow_methods=["*"],  # 모든 HTTP 메서드 허용
    allow_headers=["*"],  # 모든 헤더 허용
)

# 글로벌 예외 처리
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unexpected error: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"error": "서버 내부 오류가 발생했습니다. 관리자에게 문의하세요."},
    )

@app.get("/")
def read_root():
    return {"message": "HWPX Table Extractor API", "status": "active"}

@app.post("/extract-tables/")
async def extract_tables_endpoint(file: UploadFile = File(...), required_columns: int = None):
    """
    Upload a HWPX file and extract tables from it
    
    Args:
        file: HWPX 파일 (.hwpx 확장자)
        required_columns: 추출할 테이블의 최소 열 수 (선택 사항)
        
    Returns:
        Extracted tables data
    """
    # 파일 확장자 검증
    if not file.filename.lower().endswith('.hwpx'):
        raise HTTPException(status_code=400, detail="HWPX 파일만 업로드 가능합니다.")
    
    # 파일 크기 검증 (10MB 제한)
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:  # 10MB
        raise HTTPException(status_code=400, detail="파일 크기는 10MB를 초과할 수 없습니다.")
    
    # 임시 파일 생성 및 저장
    with tempfile.NamedTemporaryFile(delete=False, suffix=".hwpx") as temp_file:
        temp_file.write(contents)
        temp_file_path = temp_file.name
    
    try:
        # 테이블 추출 처리
        logger.info(f"Processing file: {file.filename}")
        result = extract_tables(temp_file_path, required_columns=required_columns)
        return result
    except Exception as e:
        logger.error(f"Error processing file {file.filename}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"파일 처리 중 오류가 발생했습니다: {str(e)}")
    finally:
        # 임시 파일 정리
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
            logger.info(f"Temporary file removed: {temp_file_path}")

if __name__ == "__main__":
    # 환경 변수에서 포트 가져오기 (클라우드 배포용)
    port = int(os.environ.get("PORT", 8000))
    # FastAPI 서버 직접 실행 (개발용)
    uvicorn.run(app, host="0.0.0.0", port=port) 