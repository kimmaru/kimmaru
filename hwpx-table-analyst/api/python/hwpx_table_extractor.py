import os
import zipfile
import shutil
import re
import json
import logging
import tempfile
from bs4 import BeautifulSoup
import pandas as pd
from pathlib import Path

# 로깅 설정
logger = logging.getLogger(__name__)

def should_keep_row(text):
    """
    Check if row should be kept (has numeric first column or starts with 'NO')
    
    Args:
        text (str): The text of the first cell in a row
        
    Returns:
        bool: True if the row should be kept, False otherwise
    """
    if not text:
        return False
        
    # Check if it's numeric
    cleaned = re.sub(r'[,.\s]', '', text)
    if cleaned.isdigit():
        return True
    
    # Check if starts with 'NO' (case insensitive)
    return text.strip().upper().startswith('NO')

def safe_extract_hwpx(hwpx_path, extract_dir):
    """
    Safely extract HWPX file with validation
    
    Args:
        hwpx_path (str): Path to the HWPX file
        extract_dir (str): Directory to extract files to
        
    Returns:
        bool: True if extraction was successful, False otherwise
    """
    try:
        # 유효한 HWPX 파일인지 검증
        if not zipfile.is_zipfile(hwpx_path):
            logger.error(f"File is not a valid ZIP/HWPX file: {hwpx_path}")
            return False
            
        with zipfile.ZipFile(hwpx_path, 'r') as hwpx_zip:
            # 압축 해제 전 위험한 파일 경로 체크 (경로 탈출 공격 방지)
            for file_info in hwpx_zip.infolist():
                file_path = Path(file_info.filename)
                if file_path.is_absolute() or "../" in file_info.filename:
                    logger.error(f"Potentially malicious file path detected: {file_info.filename}")
                    return False
                    
            # 전체 압축 파일 크기 제한 (50MB)
            total_size = sum(file_info.file_size for file_info in hwpx_zip.infolist())
            if total_size > 50 * 1024 * 1024:  # 50MB
                logger.error(f"Extracted content too large: {total_size} bytes")
                return False
                
            # 압축 파일 내 실행 파일 차단
            executable_extensions = ['.exe', '.dll', '.bat', '.cmd', '.sh', '.js']
            for file_info in hwpx_zip.infolist():
                file_ext = Path(file_info.filename).suffix.lower()
                if file_ext in executable_extensions:
                    logger.error(f"Executable file detected: {file_info.filename}")
                    return False
            
            # 안전하게 압축 해제
            hwpx_zip.extractall(extract_dir)
            return True
            
    except zipfile.BadZipFile as e:
        logger.error(f"Bad zip file: {str(e)}")
        return False
    except Exception as e:
        logger.error(f"Error extracting HWPX: {str(e)}")
        return False

def extract_tables_from_hwpx(hwpx_path, required_columns=None):
    """
    Extract all tables from an HWPX file and return as JSON
    
    Args:
        hwpx_path (str): Path to the HWPX file
        required_columns (int): Only extract tables with this many columns (None to extract all)
    
    Returns:
        dict: JSON object with extracted tables and metadata
    """
    # Create a secure temporary folder using Python's tempfile
    temp_folder = tempfile.mkdtemp(prefix="hwpx_extract_")
    
    try:
        logger.info(f"Processing HWPX file: {hwpx_path}")
        
        # Safely extract HWPX file
        if not safe_extract_hwpx(hwpx_path, temp_folder):
            return {"error": "HWPX 파일 처리 중 오류가 발생했습니다. 파일이 올바른 형식인지 확인해주세요."}
        
        # Find all section XML files
        section_files = []
        contents_dir = os.path.join(temp_folder, "Contents")
        
        if os.path.exists(contents_dir):
            for file in os.listdir(contents_dir):
                if file.startswith("section") and file.endswith(".xml"):
                    section_files.append(os.path.join(contents_dir, file))
        
        if not section_files:
            return {"error": "HWPX 파일에서 섹션을 찾을 수 없습니다."}
        
        # List to store extracted tables
        extracted_tables = []
        tables_by_columns = {}
        total_tables = 0
        
        # Process each section file
        for section_file in section_files:
            section_name = os.path.basename(section_file).split('.')[0]
            
            # Read the XML content
            try:
                with open(section_file, 'r', encoding='utf-8') as f:
                    content = f.read()
            except UnicodeDecodeError:
                try:
                    # Try a different encoding if utf-8 fails
                    with open(section_file, 'r', encoding='euc-kr') as f:
                        content = f.read()
                except Exception as e:
                    logger.warning(f"Failed to read section file {section_file}: {str(e)}")
                    continue
                    
            # Parse with BeautifulSoup
            soup = BeautifulSoup(content, 'xml')
            
            # Find all tables
            tables = soup.find_all('hp:tbl')
            logger.info(f"Found {len(tables)} tables in {section_name}")
            
            # Extract data from each table
            for table_idx, table in enumerate(tables):
                table_id = f"{section_name}_table_{table_idx+1}"
                rows = table.find_all('hp:tr')
                data = []
                
                # Track the maximum number of columns
                max_cols = 0
                
                for row in rows:
                    cells = row.find_all('hp:tc')
                    row_data = []
                    
                    for cell in cells:
                        # Extract text from cell
                        text_elements = cell.find_all('hp:t')
                        cell_text = ' '.join([elem.text for elem in text_elements if elem]) if text_elements else ''
                        row_data.append(cell_text)
                    
                    # Update max columns
                    if len(row_data) > max_cols:
                        max_cols = len(row_data)
                    
                    data.append(row_data)
                
                # Skip tables that don't have the required number of columns
                if required_columns is not None and max_cols != required_columns:
                    logger.info(f"Skipping {table_id} - columns ({max_cols}) != required ({required_columns})")
                    continue
                
                # Ensure all rows have the same number of columns
                for row in data:
                    while len(row) < max_cols:
                        row.append("")
                
                # Special handling for table_6: use row 3 as header
                is_table_6 = (table_idx+1 == 6 and section_name == "section0")
                
                # Filter rows: only keep rows where the first column has a numeric value or starts with 'NO'
                filtered_rows = []
                for row in data:
                    if row and should_keep_row(row[0]):
                        filtered_rows.append(row)
                
                # Skip empty dataframes (no rows after filtering)
                if not filtered_rows:
                    logger.info(f"Skipping {table_id} - no valid rows after filtering")
                    continue
                
                # Get headers if available
                headers = None
                if is_table_6 and len(data) > 2:
                    # Use row 3 (index 2) as header for table_6
                    headers = data[2]
                    # Remove header row from filtered data if it's there
                    filtered_rows = [row for row in filtered_rows if row != headers]
                
                # Create table object
                table_data = {
                    "id": table_id,
                    "headers": headers if headers else None,
                    "data": filtered_rows,
                    "column_count": max_cols,
                    "row_count": len(filtered_rows)
                }
                
                # Store by column count for grouping
                if max_cols not in tables_by_columns:
                    tables_by_columns[max_cols] = []
                tables_by_columns[max_cols].append(table_data)
                
                # Also keep a flat list of all tables
                extracted_tables.append(table_data)
                total_tables += 1
        
        logger.info(f"Successfully extracted {total_tables} tables")
        
        # No tables found
        if total_tables == 0:
            return {
                "success": True,
                "total_tables": 0,
                "message": "테이블이 발견되지 않았습니다. 문서에 테이블이 포함되어 있는지 확인해주세요.",
                "tables": []
            }
        
        return {
            "success": True,
            "total_tables": total_tables,
            "tables": extracted_tables,
            "tables_by_columns": tables_by_columns
        }
    
    except Exception as e:
        logger.error(f"Unexpected error in extract_tables_from_hwpx: {str(e)}")
        return {"error": f"테이블 추출 중 오류가 발생했습니다: {str(e)}"}
    finally:
        # Clean up temporary directory
        if os.path.exists(temp_folder):
            try:
                shutil.rmtree(temp_folder)
                logger.info(f"Cleaned up temporary directory: {temp_folder}")
            except Exception as e:
                logger.error(f"Error cleaning up temporary directory: {str(e)}")

# API function to be called from FastAPI
def extract_tables(file_path, required_columns=None):
    """
    Extract tables from HWPX file (API wrapper)
    
    Args:
        file_path (str): Path to the HWPX file
        required_columns (int, optional): Only extract tables with this many columns
        
    Returns:
        dict: JSON response with extracted tables
    """
    return extract_tables_from_hwpx(file_path, required_columns) 