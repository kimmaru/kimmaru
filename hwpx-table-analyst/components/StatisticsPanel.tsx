import React, { useState, useEffect, useMemo } from 'react';
import { TableData, ChartData } from '../types';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface StatisticsPanelProps {
  table: TableData;
}

// Colors for the pie chart
const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', 
  '#00C49F', '#FFBB28', '#FF8042', '#a4de6c', '#d0ed57',
  '#E73E2C', '#6B8E23', '#4682B4', '#9932CC', '#FF4500'
];

// Custom tooltip for the pie chart
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-md shadow-md">
        <p className="font-semibold">{`${payload[0].name}`}</p>
        <p className="text-sm">{`빈도: ${payload[0].value}`}</p>
        <p className="text-sm">{`비율: ${payload[0].payload.percentage.toFixed(2)}%`}</p>
      </div>
    );
  }
  return null;
};

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ table }) => {
  // List of columns to analyze
  const [selectedColumns, setSelectedColumns] = useState<number[]>([]);
  // Current column for pie chart
  const [currentColumn, setCurrentColumn] = useState<number>(0);
  // List of excluded column names (typically metadata identifiers)
  const [excludedColumnNames, setExcludedColumnNames] = useState<string[]>(['NO', '이름', 'ID', '번호']);
  // Maximum number of slices in pie chart (others will be grouped)
  const [maxSlices, setMaxSlices] = useState<number>(8);
  // Whether to exclude the first row (headers) in analysis
  const [excludeFirstRow, setExcludeFirstRow] = useState<boolean>(true);
  
  // Process the table data to identify numeric and categorical columns
  useEffect(() => {
    if (table && table.data.length > 0) {
      const newSelectedColumns: number[] = [];
      
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
          newSelectedColumns.push(colIndex);
        }
      }
      
      setSelectedColumns(newSelectedColumns);
      if (newSelectedColumns.length > 0) {
        setCurrentColumn(newSelectedColumns[0]);
      }
    }
  }, [table, excludeFirstRow, excludedColumnNames]);

  // Generate frequency data for the current column
  const frequencyData = useMemo(() => {
    if (!table || !table.data.length || currentColumn === undefined) {
      return [];
    }

    const startRow = excludeFirstRow ? 1 : 0;
    const frequencies: Record<string, number> = {};
    
    // Count occurrences of each value
    for (let rowIndex = startRow; rowIndex < table.data.length; rowIndex++) {
      const value = table.data[rowIndex][currentColumn] || '(빈 값)';
      frequencies[value] = (frequencies[value] || 0) + 1;
    }
    
    // Convert to array and sort by frequency (descending)
    let result = Object.entries(frequencies)
      .map(([name, value]) => ({ 
        name, 
        value,
        percentage: (value / (table.data.length - startRow)) * 100
      }))
      .sort((a, b) => b.value - a.value);
    
    // If there are too many slices, group the smaller ones into "Others"
    if (result.length > maxSlices) {
      const mainCategories = result.slice(0, maxSlices - 1);
      const otherCategories = result.slice(maxSlices - 1);
      
      const otherCount = otherCategories.reduce((sum, item) => sum + item.value, 0);
      const otherPercentage = otherCategories.reduce((sum, item) => sum + item.percentage, 0);
      
      mainCategories.push({
        name: '기타',
        value: otherCount,
        percentage: otherPercentage
      });
      
      result = mainCategories;
    }
    
    return result;
  }, [table, currentColumn, excludeFirstRow, maxSlices]);

  // If no table data is provided, show a message
  if (!table || !table.data.length) {
    return <div className="p-4">테이블 데이터가 없습니다.</div>;
  }

  // If no columns are available for analysis, show a message
  if (selectedColumns.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-3">통계 분석</h2>
        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
          <p>분석 가능한 열이 없습니다. 데이터에 카테고리 열이 있는지 확인하세요.</p>
        </div>
      </div>
    );
  }

  // Get the current column header name
  const columnHeader = table.headers 
    ? table.headers[currentColumn] 
    : `Column ${currentColumn + 1}`;

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-3">통계 분석</h2>
      
      <div className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              분석할 열 선택
            </label>
            <select
              value={currentColumn}
              onChange={(e) => setCurrentColumn(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {selectedColumns.map((colIndex) => (
                <option key={colIndex} value={colIndex}>
                  {table.headers ? table.headers[colIndex] : `Column ${colIndex + 1}`}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              최대 파이 차트 조각 수
            </label>
            <select
              value={maxSlices}
              onChange={(e) => setMaxSlices(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5</option>
              <option value={8}>8</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={excludeFirstRow}
              onChange={(e) => setExcludeFirstRow(e.target.checked)}
              className="rounded text-blue-500 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">첫 번째 행 제외 (메타데이터)</span>
          </label>
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
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">{columnHeader} - 빈도 분석</h3>
        
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex flex-col md:flex-row">
            {/* Pie Chart */}
            <div className="w-full md:w-1/2">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={frequencyData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                  >
                    {frequencyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Frequency Table */}
            <div className="w-full md:w-1/2 mt-4 md:mt-0 md:pl-4 overflow-auto" style={{ maxHeight: '300px' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">값</th>
                    <th className="px-4 py-2 text-right">빈도</th>
                    <th className="px-4 py-2 text-right">비율</th>
                  </tr>
                </thead>
                <tbody>
                  {frequencyData.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-2 font-medium">
                        <div className="flex items-center">
                          <span 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          ></span>
                          {item.name}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-right">{item.value}</td>
                      <td className="px-4 py-2 text-right">{item.percentage.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Summary Statistics */}
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">요약 통계</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">총 카테고리 수</p>
              <p className="text-xl font-semibold">
                {Object.keys(frequencyData.reduce((acc, item) => {
                  acc[item.name] = true;
                  return acc;
                }, {} as Record<string, boolean>)).length}
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">총 데이터 수</p>
              <p className="text-xl font-semibold">
                {frequencyData.reduce((sum, item) => sum + item.value, 0)}
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">최대 빈도 카테고리</p>
              <p className="text-xl font-semibold">
                {frequencyData.length > 0 ? frequencyData[0].name : '-'}
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">최대 빈도 비율</p>
              <p className="text-xl font-semibold">
                {frequencyData.length > 0 ? `${frequencyData[0].percentage.toFixed(2)}%` : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPanel; 