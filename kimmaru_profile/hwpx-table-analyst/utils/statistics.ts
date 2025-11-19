import { TableData, StatisticalSummary, AnalysisType } from '../types';

/**
 * 데이터 검증 및 숫자 변환
 */
export const parseNumeric = (value: string): number | null => {
  if (value === undefined || value === null || value === '') return null;
  
  // 숫자가 아닌 문자 제거 (콤마, 공백 등)
  const cleanValue = value.replace(/[^-0-9.]/g, '');
  const num = parseFloat(cleanValue);
  
  return isNaN(num) ? null : num;
};

/**
 * 테이블 데이터 필드에 대한 통계 요약 계산
 */
export const calculateFieldStatistics = (
  table: TableData, 
  fieldIndex: number
): StatisticalSummary | null => {
  // 헤더 또는 기본 열 제목 가져오기
  const fieldName = table.headers ? table.headers[fieldIndex] : `열 ${fieldIndex + 1}`;
  
  // 숫자 데이터 추출
  const numericValues: number[] = table.data
    .map(row => parseNumeric(row[fieldIndex]))
    .filter((num): num is number => num !== null);
  
  if (numericValues.length === 0) {
    return null;
  }
  
  // 오름차순 정렬 (중앙값, 사분위수 계산용)
  const sortedValues = [...numericValues].sort((a, b) => a - b);
  
  // 기본 통계 계산
  const sum = numericValues.reduce((acc, val) => acc + val, 0);
  const count = numericValues.length;
  const mean = sum / count;
  const min = Math.min(...numericValues);
  const max = Math.max(...numericValues);
  
  // 중앙값 계산
  const mid = Math.floor(count / 2);
  const median = count % 2 === 0 
    ? (sortedValues[mid - 1] + sortedValues[mid]) / 2 
    : sortedValues[mid];
  
  // 표준편차 계산
  const squaredDiffs = numericValues.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / count;
  const stdev = Math.sqrt(variance);
  
  // 사분위수 계산
  const q1Index = Math.floor(count / 4);
  const q3Index = Math.floor(3 * count / 4);
  const quartiles: [number, number, number] = [
    sortedValues[q1Index],
    median,
    sortedValues[q3Index]
  ];
  
  return {
    field: fieldName,
    min,
    max,
    mean,
    median,
    sum,
    count,
    stdev,
    quartiles
  };
};

/**
 * 그룹화된 데이터 분석
 */
export const analyzeGroupedData = (
  table: TableData,
  groupByField: number,
  valueField: number,
  analysisType: AnalysisType
) => {
  // 그룹별 데이터 수집
  const groups: Record<string, number[]> = {};
  
  table.data.forEach(row => {
    const groupKey = row[groupByField];
    const value = parseNumeric(row[valueField]);
    
    if (value !== null) {
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(value);
    }
  });
  
  // 분석 타입에 따른 값 계산
  const result = Object.entries(groups).map(([name, values]) => {
    let analyzedValue: number;
    
    switch (analysisType) {
      case 'sum':
        analyzedValue = values.reduce((sum, val) => sum + val, 0);
        break;
      case 'average':
        analyzedValue = values.reduce((sum, val) => sum + val, 0) / values.length;
        break;
      case 'min':
        analyzedValue = Math.min(...values);
        break;
      case 'max':
        analyzedValue = Math.max(...values);
        break;
      case 'count':
        analyzedValue = values.length;
        break;
      case 'median': {
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        analyzedValue = sorted.length % 2 === 0
          ? (sorted[mid - 1] + sorted[mid]) / 2
          : sorted[mid];
        break;
      }
      case 'stdev': {
        const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
        const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
        const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
        analyzedValue = Math.sqrt(variance);
        break;
      }
      default:
        analyzedValue = values.reduce((sum, val) => sum + val, 0);
    }
    
    return {
      name,
      value: analyzedValue
    };
  });
  
  return result;
};

/**
 * 다차원 데이터 분석
 */
export const analyzeMultiDimensionalData = (
  table: TableData,
  xField: number,
  yField: number,
  valueField: number,
  analysisType: AnalysisType
) => {
  // x, y 좌표별 데이터 수집
  const matrix: Record<string, Record<string, number[]>> = {};
  
  table.data.forEach(row => {
    const xKey = row[xField];
    const yKey = row[yField];
    const value = parseNumeric(row[valueField]);
    
    if (value !== null) {
      if (!matrix[xKey]) {
        matrix[xKey] = {};
      }
      if (!matrix[xKey][yKey]) {
        matrix[xKey][yKey] = [];
      }
      matrix[xKey][yKey].push(value);
    }
  });
  
  // 분석 타입에 따른 값 계산
  const result: { x: string; y: string; value: number }[] = [];
  
  Object.entries(matrix).forEach(([x, yValues]) => {
    Object.entries(yValues).forEach(([y, values]) => {
      let analyzedValue: number;
      
      switch (analysisType) {
        case 'sum':
          analyzedValue = values.reduce((sum, val) => sum + val, 0);
          break;
        case 'average':
          analyzedValue = values.reduce((sum, val) => sum + val, 0) / values.length;
          break;
        case 'min':
          analyzedValue = Math.min(...values);
          break;
        case 'max':
          analyzedValue = Math.max(...values);
          break;
        case 'count':
          analyzedValue = values.length;
          break;
        case 'median': {
          const sorted = [...values].sort((a, b) => a - b);
          const mid = Math.floor(sorted.length / 2);
          analyzedValue = sorted.length % 2 === 0
            ? (sorted[mid - 1] + sorted[mid]) / 2
            : sorted[mid];
          break;
        }
        case 'stdev': {
          const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
          const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
          const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
          analyzedValue = Math.sqrt(variance);
          break;
        }
        default:
          analyzedValue = values.reduce((sum, val) => sum + val, 0);
      }
      
      result.push({
        x,
        y,
        value: analyzedValue
      });
    });
  });
  
  return result;
};

/**
 * 데이터 필드의 자동 감지 (숫자 필드, 그룹화 필드 등)
 */
export const detectDataFields = (table: TableData) => {
  const numericFields: number[] = [];
  const categoricalFields: number[] = [];
  const dateFields: number[] = [];
  
  if (!table.data || table.data.length === 0) {
    return { numericFields, categoricalFields, dateFields };
  }
  
  // 각 열의 유형 감지
  for (let colIndex = 0; colIndex < table.column_count; colIndex++) {
    let numericCount = 0;
    let dateCount = 0;
    const uniqueValues = new Set<string>();
    
    // 샘플 데이터로 최대 100개 행 사용
    const sampleSize = Math.min(table.data.length, 100);
    
    for (let rowIndex = 0; rowIndex < sampleSize; rowIndex++) {
      const value = table.data[rowIndex][colIndex];
      uniqueValues.add(value);
      
      // 숫자 필드 감지
      if (!isNaN(parseFloat(value)) && isFinite(Number(value))) {
        numericCount++;
      }
      
      // 날짜 필드 감지 (간단한 휴리스틱)
      const datePattern = /^\d{4}[/-]\d{1,2}[/-]\d{1,2}$|^\d{1,2}[/-]\d{1,2}[/-]\d{4}$/;
      if (datePattern.test(value)) {
        dateCount++;
      }
    }
    
    // 필드 분류
    if (numericCount / sampleSize > 0.7) {
      numericFields.push(colIndex);
    } else if (dateCount / sampleSize > 0.7) {
      dateFields.push(colIndex);
    } else if (uniqueValues.size <= Math.sqrt(sampleSize) || uniqueValues.size < 20) {
      // 고유값이 적으면 범주형으로 판단
      categoricalFields.push(colIndex);
    }
  }
  
  return { numericFields, categoricalFields, dateFields };
}; 