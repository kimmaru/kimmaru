import React, { useState, useEffect } from 'react';
import { TableData, ChartType, VisualizationConfig } from '../types';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface VisualizationPanelProps {
  table: TableData;
}

interface ChartDataItem {
  name: string;
  value: number;
  originalData: string[];
}

const CHART_COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', 
  '#00C49F', '#FFBB28', '#FF8042', '#a4de6c', '#d0ed57'
];

const VisualizationPanel: React.FC<VisualizationPanelProps> = ({ table }) => {
  const [config, setConfig] = useState<VisualizationConfig>({
    chartType: 'bar',
    xAxisField: 0,
    yAxisField: 1,
    title: '데이터 시각화',
    analysisType: 'sum',
    showLegend: true,
    animation: true,
    theme: 'default'
  });
  
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [numericColumns, setNumericColumns] = useState<number[]>([]);
  
  // Identify numeric columns
  useEffect(() => {
    const numeric: number[] = [];
    
    if (table.data.length > 0) {
      for (let colIndex = 0; colIndex < table.column_count; colIndex++) {
        // Check if most values in this column are numeric
        const numericCount = table.data.reduce((count: number, row: string[]) => {
          const value = row[colIndex];
          return !isNaN(parseFloat(value)) && isFinite(Number(value)) ? count + 1 : count;
        }, 0);
        
        if (numericCount / table.data.length > 0.5) {
          numeric.push(colIndex);
        }
      }
    }
    
    setNumericColumns(numeric);
    
    // Set default yAxisField to first numeric column if available
    if (numeric.length > 0 && config.yAxisField === 1) {
      setConfig((prev: VisualizationConfig) => ({ ...prev, yAxisField: numeric[0] }));
    }
  }, [table]);
  
  // Prepare chart data
  useEffect(() => {
    if (table.data.length === 0) return;
    
    const data = table.data.map((row: string[], index: number) => {
      const xValue = row[config.xAxisField] || `항목 ${index + 1}`;
      const yValue = parseFloat(row[config.yAxisField]) || 0;
      
      return {
        name: xValue,
        value: yValue,
        // Include original row data for tooltip
        originalData: row
      };
    });
    
    setChartData(data);
  }, [table, config.xAxisField, config.yAxisField]);
  
  const handleConfigChange = (field: keyof VisualizationConfig, value: any) => {
    setConfig((prev: VisualizationConfig) => ({ ...prev, [field]: value }));
  };
  
  const renderChart = () => {
    switch (config.chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }: { name: string, percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index: number) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid />
              <XAxis type="number" dataKey="name" name="x" />
              <YAxis type="number" dataKey="value" name="y" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="데이터" data={chartData} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        );
      default:
        return <div>차트 유형을 선택해주세요</div>;
    }
  };
  
  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-3">데이터 시각화</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            차트 유형
          </label>
          <select
            value={config.chartType}
            onChange={(e) => handleConfigChange('chartType', e.target.value as ChartType)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="bar">막대 차트</option>
            <option value="line">선 차트</option>
            <option value="pie">파이 차트</option>
            <option value="area">영역 차트</option>
            <option value="scatter">산점도</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            차트 제목
          </label>
          <input
            type="text"
            value={config.title}
            onChange={(e) => handleConfigChange('title', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="차트 제목 입력"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            X축 필드
          </label>
          <select
            value={config.xAxisField}
            onChange={(e) => handleConfigChange('xAxisField', Number(e.target.value))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Array.from({ length: table.column_count }).map((_, index: number) => (
              <option key={index} value={index}>
                {table.headers ? table.headers[index] : `열 ${index + 1}`}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Y축 필드 (숫자 데이터)
          </label>
          <select
            value={config.yAxisField}
            onChange={(e) => handleConfigChange('yAxisField', Number(e.target.value))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {numericColumns.length > 0 ? (
              numericColumns.map((colIndex: number) => (
                <option key={colIndex} value={colIndex}>
                  {table.headers ? table.headers[colIndex] : `열 ${colIndex + 1}`}
                </option>
              ))
            ) : (
              Array.from({ length: table.column_count }).map((_, index: number) => (
                <option key={index} value={index}>
                  {table.headers ? table.headers[index] : `열 ${index + 1}`}
                </option>
              ))
            )}
          </select>
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2">{config.title}</h3>
        {renderChart()}
      </div>
    </div>
  );
};

export default VisualizationPanel; 