import React, { useState, useEffect, useMemo } from 'react';
import { TableData } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface RelationshipAnalysisPanelProps {
  table: TableData;
}

// Colors for the chart
const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', 
  '#00C49F', '#FFBB28', '#FF8042', '#a4de6c', '#d0ed57',
  '#E73E2C', '#6B8E23', '#4682B4', '#9932CC', '#FF4500'
];

const RelationshipAnalysisPanel: React.FC<RelationshipAnalysisPanelProps> = ({ table }) => {
  // List of columns to analyze
  const [availableColumns, setAvailableColumns] = useState<number[]>([]);
  
  // Selected columns for x and y axis
  const [xColumn, setXColumn] = useState<number | null>(null);
  const [yColumn, setYColumn] = useState<number | null>(null);
  
  // List of excluded column names (typically metadata identifiers)
  const [excludedColumnNames, setExcludedColumnNames] = useState<string[]>(['NO', '이름', 'ID', '번호']);
  
  // Maximum number of categories to display
  const [maxCategories, setMaxCategories] = useState<number>(8);
  
  // Whether to exclude the first row (headers) in analysis
  const [excludeFirstRow, setExcludeFirstRow] = useState<boolean>(true);
  
  // Find columns suitable for categorical analysis
  useEffect(() => {
    if (table && table.data.length > 0) {
      const newAvailableColumns: number[] = [];
      
      // Skip first row which contains metadata
      const startRow = excludeFirstRow ? 1 : 0;
      
      for (let colIndex = 0; colIndex < table.column_count; colIndex++) {
        const columnHeader = table.headers ? table.headers[colIndex] : `Column ${colIndex + 1}`;
        
        // Skip excluded columns based on name
        if (excludedColumnNames.some(name => 
            columnHeader.includes(name) || 
            columnHeader.toLowerCase().includes(name.toLowerCase()))) {
          continue;
        }
        
        // Calculate how many unique values in this column
        const uniqueValues = new Set();
        for (let rowIndex = startRow; rowIndex < table.data.length; rowIndex++) {
          const cellValue = table.data[rowIndex][colIndex];
          if (cellValue && cellValue.trim() !== '') {
            uniqueValues.add(cellValue);
          }
        }
        
        // If this column has reasonable number of categories (not too many or too few), include it
        const uniqueCount = uniqueValues.size;
        if (uniqueCount > 1 && uniqueCount <= 50) {
          newAvailableColumns.push(colIndex);
        }
      }
      
      setAvailableColumns(newAvailableColumns);
      
      // Set default values if columns are available
      if (newAvailableColumns.length >= 2) {
        setXColumn(newAvailableColumns[0]);
        setYColumn(newAvailableColumns[1]);
      } else if (newAvailableColumns.length === 1) {
        setXColumn(newAvailableColumns[0]);
        setYColumn(null);
      } else {
        setXColumn(null);
        setYColumn(null);
      }
    }
  }, [table, excludeFirstRow, excludedColumnNames]);

  // Generate cross-tabulation data for the selected columns
  const crossTabData = useMemo(() => {
    if (!table || !table.data.length || xColumn === null || yColumn === null) {
      return { data: [], xCategories: [], yCategories: [] };
    }

    const startRow = excludeFirstRow ? 1 : 0;
    
    // Get unique values for each column
    const xValueSet = new Set<string>();
    const yValueSet = new Set<string>();
    
    for (let rowIndex = startRow; rowIndex < table.data.length; rowIndex++) {
      const xValue = table.data[rowIndex][xColumn] || '(빈 값)';
      const yValue = table.data[rowIndex][yColumn] || '(빈 값)';
      
      xValueSet.add(xValue);
      yValueSet.add(yValue);
    }
    
    // Convert to arrays and sort, limiting to max categories
    let xCategories = Array.from(xValueSet);
    let yCategories = Array.from(yValueSet);
    
    // Count frequency of each combination
    const combinationCounts: Record<string, Record<string, number>> = {};
    
    for (let rowIndex = startRow; rowIndex < table.data.length; rowIndex++) {
      const xValue = table.data[rowIndex][xColumn] || '(빈 값)';
      const yValue = table.data[rowIndex][yColumn] || '(빈 값)';
      
      if (!combinationCounts[xValue]) {
        combinationCounts[xValue] = {};
      }
      
      combinationCounts[xValue][yValue] = (combinationCounts[xValue][yValue] || 0) + 1;
    }
    
    // Group less frequent categories if needed
    if (xCategories.length > maxCategories) {
      // Count occurrences of each x value
      const xCounts: Record<string, number> = {};
      for (let rowIndex = startRow; rowIndex < table.data.length; rowIndex++) {
        const xValue = table.data[rowIndex][xColumn] || '(빈 값)';
        xCounts[xValue] = (xCounts[xValue] || 0) + 1;
      }
      
      // Sort by frequency and take top categories
      const sortedX = Object.entries(xCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([value]) => value);
      
      const mainXCategories = sortedX.slice(0, maxCategories - 1);
      const otherXCategories = sortedX.slice(maxCategories - 1);
      
      // Combine other categories
      if (otherXCategories.length > 0) {
        const otherCounts: Record<string, number> = {};
        
        for (const otherX of otherXCategories) {
          for (const y in combinationCounts[otherX]) {
            otherCounts[y] = (otherCounts[y] || 0) + combinationCounts[otherX][y];
          }
          delete combinationCounts[otherX];
        }
        
        combinationCounts['기타'] = otherCounts;
        xCategories = [...mainXCategories, '기타'];
      } else {
        xCategories = mainXCategories;
      }
    }
    
    if (yCategories.length > maxCategories) {
      // Count occurrences of each y value
      const yCounts: Record<string, number> = {};
      for (let rowIndex = startRow; rowIndex < table.data.length; rowIndex++) {
        const yValue = table.data[rowIndex][yColumn] || '(빈 값)';
        yCounts[yValue] = (yCounts[yValue] || 0) + 1;
      }
      
      // Sort by frequency and take top categories
      const sortedY = Object.entries(yCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([value]) => value);
      
      const mainYCategories = sortedY.slice(0, maxCategories - 1);
      const otherYCategories = sortedY.slice(maxCategories - 1);
      
      yCategories = mainYCategories;
      
      // Combine other categories counts
      if (otherYCategories.length > 0) {
        for (const x in combinationCounts) {
          let otherCount = 0;
          for (const otherY of otherYCategories) {
            if (combinationCounts[x][otherY]) {
              otherCount += combinationCounts[x][otherY];
              delete combinationCounts[x][otherY];
            }
          }
          if (otherCount > 0) {
            combinationCounts[x]['기타'] = otherCount;
          }
        }
        
        yCategories.push('기타');
      }
    }
    
    // Convert to data format for chart
    const data = xCategories.map(xValue => {
      const item: any = { name: xValue };
      
      yCategories.forEach(yValue => {
        item[yValue] = combinationCounts[xValue]?.[yValue] || 0;
      });
      
      return item;
    });
    
    return { data, xCategories, yCategories };
  }, [table, xColumn, yColumn, excludeFirstRow, maxCategories]);

  // Calculate total counts for each cell in the crosstab
  const { totalRows, colTotals, rowTotals, totalCount } = useMemo(() => {
    if (!crossTabData.data.length) {
      return { totalRows: [], colTotals: {}, rowTotals: [], totalCount: 0 };
    }
    
    const colTotals: Record<string, number> = {};
    let totalCount = 0;
    
    const rowTotals = crossTabData.data.map(row => {
      let rowTotal = 0;
      
      crossTabData.yCategories.forEach(cat => {
        const count = row[cat] || 0;
        rowTotal += count;
        colTotals[cat] = (colTotals[cat] || 0) + count;
        totalCount += count;
      });
      
      return {
        name: row.name,
        total: rowTotal
      };
    });
    
    const totalRows = crossTabData.data.map(row => {
      const newRow: any = { name: row.name };
      
      crossTabData.yCategories.forEach(cat => {
        newRow[cat] = row[cat] || 0;
      });
      
      return newRow;
    });
    
    return { totalRows, colTotals, rowTotals, totalCount };
  }, [crossTabData]);

  // If no table data is provided, show a message
  if (!table || !table.data.length) {
    return <div className="p-4">테이블 데이터가 없습니다.</div>;
  }

  // If no columns are available for analysis, show a message
  if (availableColumns.length < 2) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-3">관계 분석</h2>
        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
          <p>관계 분석을 위해서는 최소 두 개의 카테고리형 열이 필요합니다. 데이터를 확인하세요.</p>
        </div>
      </div>
    );
  }

  // Get column names for display
  const xColumnName = xColumn !== null && table.headers 
    ? table.headers[xColumn] 
    : '선택되지 않음';
    
  const yColumnName = yColumn !== null && table.headers
    ? table.headers[yColumn]
    : '선택되지 않음';

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-3">관계 분석</h2>
      
      <div className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              X축 열 선택 (가로)
            </label>
            <select
              value={xColumn !== null ? xColumn : ''}
              onChange={(e) => setXColumn(e.target.value ? Number(e.target.value) : null)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">선택하세요</option>
              {availableColumns.map((colIndex) => (
                <option key={colIndex} value={colIndex}>
                  {table.headers ? table.headers[colIndex] : `Column ${colIndex + 1}`}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Y축 열 선택 (범주)
            </label>
            <select
              value={yColumn !== null ? yColumn : ''}
              onChange={(e) => setYColumn(e.target.value ? Number(e.target.value) : null)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">선택하세요</option>
              {availableColumns.map((colIndex) => (
                <option key={colIndex} value={colIndex}>
                  {table.headers ? table.headers[colIndex] : `Column ${colIndex + 1}`}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              최대 표시 카테고리 수
            </label>
            <select
              value={maxCategories}
              onChange={(e) => setMaxCategories(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5</option>
              <option value={8}>8</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>
          
          <div>
            <label className="flex items-center space-x-2 mt-6">
              <input
                type="checkbox"
                checked={excludeFirstRow}
                onChange={(e) => setExcludeFirstRow(e.target.checked)}
                className="rounded text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">첫 번째 행 제외 (메타데이터)</span>
            </label>
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            제외할 열 이름 (쉼표로 구분)
          </label>
          <input
            type="text"
            value={excludedColumnNames.join(', ')}
            onChange={(e) => setExcludedColumnNames(e.target.value.split(',').map(s => s.trim()))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="NO, 이름, ID, 번호"
          />
          <p className="text-xs text-gray-500 mt-1">
            이 키워드를 포함하는 열은 분석에서 제외됩니다. 식별자나 고유 값은 통계적으로 의미가 없습니다.
          </p>
        </div>
      </div>
      
      {xColumn !== null && yColumn !== null && crossTabData.data.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">
            {xColumnName} & {yColumnName} 빈도 분석 
          </h3>
          
          {/* Bar Chart */}
          <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
            <h4 className="text-md font-medium mb-4">막대 차트 시각화</h4>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={crossTabData.data} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={70} 
                  tick={{ fontSize: 12 }} 
                />
                <YAxis />
                <Tooltip />
                <Legend />
                {crossTabData.yCategories.map((category, index) => (
                  <Bar 
                    key={category} 
                    dataKey={category} 
                    stackId="a" 
                    fill={COLORS[index % COLORS.length]} 
                    name={category}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Cross-tabulation Table */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="text-md font-medium mb-4">교차표 (Cross-tabulation)</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {xColumnName} \ {yColumnName}
                    </th>
                    {crossTabData.yCategories.map(category => (
                      <th 
                        key={category} 
                        className="px-4 py-2 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {category}
                      </th>
                    ))}
                    <th className="px-4 py-2 bg-gray-100 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      총합
                    </th>
                    <th className="px-4 py-2 bg-gray-100 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      비율 (%)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {totalRows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        {row.name}
                      </td>
                      {crossTabData.yCategories.map(category => (
                        <td 
                          key={`${row.name}-${category}`} 
                          className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-500"
                        >
                          {row[category]} ({((row[category] / totalCount) * 100).toFixed(1)}%)
                        </td>
                      ))}
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-right text-gray-900 bg-gray-50">
                        {rowTotals[rowIndex].total}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-right text-gray-900 bg-gray-50">
                        {((rowTotals[rowIndex].total / totalCount) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-100">
                      총합
                    </td>
                    {crossTabData.yCategories.map(category => (
                      <td 
                        key={`total-${category}`} 
                        className="px-4 py-2 whitespace-nowrap text-sm font-medium text-right text-gray-900 bg-gray-100"
                      >
                        {colTotals[category]}
                      </td>
                    ))}
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-right text-gray-900 bg-gray-200">
                      {totalCount}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-right text-gray-900 bg-gray-200">
                      100%
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-100">
                      비율 (%)
                    </td>
                    {crossTabData.yCategories.map(category => (
                      <td 
                        key={`percent-${category}`} 
                        className="px-4 py-2 whitespace-nowrap text-sm font-medium text-right text-gray-900 bg-gray-100"
                      >
                        {((colTotals[category] / totalCount) * 100).toFixed(1)}%
                      </td>
                    ))}
                    <td colSpan={2} className="px-4 py-2 whitespace-nowrap text-sm font-medium text-right text-gray-900 bg-gray-200">
                      100%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default RelationshipAnalysisPanel; 