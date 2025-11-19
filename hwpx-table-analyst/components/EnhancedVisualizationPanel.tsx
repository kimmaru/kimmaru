import React, { useState, useEffect } from 'react';
import { TableData, ChartType, VisualizationConfig, AnalysisType, StatisticalSummary } from '@/types';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Treemap } from 'recharts';
import { FiSettings, FiDownload, FiInfo, FiBarChart2, FiFilter } from 'react-icons/fi';
import { analyzeGroupedData, calculateFieldStatistics, detectDataFields } from '@/utils/statistics';

interface EnhancedVisualizationPanelProps {
  tables: TableData[];
  selectedTables: string[];
}

// 차트 테마 색상
const THEMES = {
  default: [
    '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', 
    '#00C49F', '#FFBB28', '#FF8042', '#a4de6c', '#d0ed57'
  ],
  dark: [
    '#5D4AB3', '#36648B', '#8B2252', '#556B2F', '#9932CC',
    '#8B4513', '#008B8B', '#54278F', '#1E3163', '#2F4F4F'
  ],
  pastel: [
    '#B5D8EB', '#E7BDE1', '#ACDBC9', '#FCDDB0', '#F9B3C2',
    '#D3C0F2', '#F6F7C1', '#C9CBFF', '#C8E4B2', '#BBD8EC'
  ],
  neon: [
    '#FF00FF', '#00FFFF', '#FF0000', '#00FF00', '#FFFF00',
    '#FFA500', '#FD3A4A', '#39FF14', '#1F51FF', '#FF3131'
  ]
};

const EnhancedVisualizationPanel: React.FC<EnhancedVisualizationPanelProps> = ({ tables, selectedTables }) => {
  // 선택된 테이블 필터링
  const filteredTables = tables.filter(table => selectedTables.includes(table.id));
  
  // 통계 정보
  const [statistics, setStatistics] = useState<Record<string, StatisticalSummary[]>>({});
  
  // 기본 차트 설정
  const [config, setConfig] = useState<VisualizationConfig>({
    chartType: 'bar',
    xAxisField: 0,
    yAxisField: 1,
    groupByField: undefined,
    analysisType: 'sum',
    title: '데이터 시각화',
    showLegend: true,
    animation: true,
    theme: 'default'
  });
  
  // 필드 타입 자동 감지 결과
  const [detectedFields, setDetectedFields] = useState<{
    numericFields: number[];
    categoricalFields: number[];
    dateFields: number[];
  }>({
    numericFields: [],
    categoricalFields: [],
    dateFields: []
  });
  
  // 설정 패널 표시 상태
  const [showSettings, setShowSettings] = useState(false);
  
  // 차트 데이터
  const [chartData, setChartData] = useState<any[]>([]);
  
  // 필드 탐지 및 초기 설정
  useEffect(() => {
    if (filteredTables.length === 0) return;
    
    // 모든 테이블의 첫 번째 테이블 기준으로 필드 탐지
    const mainTable = filteredTables[0];
    const detected = detectDataFields(mainTable);
    setDetectedFields(detected);
    
    // 기본 x축과 y축 설정
    const xAxisField = detected.categoricalFields.length > 0 
      ? detected.categoricalFields[0] 
      : 0;
    
    const yAxisField = detected.numericFields.length > 0 
      ? detected.numericFields[0] 
      : (mainTable.column_count > 1 ? 1 : 0);
    
    setConfig(prev => ({
      ...prev,
      xAxisField,
      yAxisField
    }));
    
    // 테이블별 통계 계산
    const tableStats: Record<string, StatisticalSummary[]> = {};
    
    filteredTables.forEach(table => {
      const tableId = table.id;
      tableStats[tableId] = [];
      
      detected.numericFields.forEach(fieldIndex => {
        const stats = calculateFieldStatistics(table, fieldIndex);
        if (stats) {
          tableStats[tableId].push(stats);
        }
      });
    });
    
    setStatistics(tableStats);
    
  }, [filteredTables]);
  
  // 차트 데이터 준비
  useEffect(() => {
    if (filteredTables.length === 0) return;
    
    // 선택된 필드에 대한 모든 테이블의 데이터 통합
    let combinedData: any[] = [];
    
    if (config.groupByField !== undefined) {
      // 그룹화된 데이터 분석
      filteredTables.forEach(table => {
        const analyzedData = analyzeGroupedData(
          table,
          config.groupByField!,
          config.yAxisField,
          config.analysisType
        );
        
        // 테이블 ID 정보 추가
        const tableData = analyzedData.map(item => ({
          ...item,
          tableId: table.id
        }));
        
        combinedData = [...combinedData, ...tableData];
      });
    } else {
      // 일반 차트 데이터
      filteredTables.forEach(table => {
        const tableData = table.data.map((row, index) => {
          const xValue = row[config.xAxisField] || `항목 ${index + 1}`;
          const yValue = parseFloat(row[config.yAxisField]) || 0;
          
          return {
            name: xValue,
            value: yValue,
            tableId: table.id,
            originalData: row
          };
        });
        
        combinedData = [...combinedData, ...tableData];
      });
    }
    
    setChartData(combinedData);
  }, [filteredTables, config.xAxisField, config.yAxisField, config.groupByField, config.analysisType]);
  
  // 차트 설정 변경 처리
  const handleConfigChange = (field: keyof VisualizationConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };
  
  // 차트 이미지 다운로드
  const handleDownloadChart = () => {
    try {
      const chartElement = document.querySelector('.recharts-wrapper');
      if (!chartElement) return;
      
      const svgElement = chartElement.querySelector('svg');
      if (!svgElement) return;
      
      // SVG를 문자열로 변환
      const svgString = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
      
      // 다운로드 링크 생성
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(svgBlob);
      downloadLink.download = `${config.title.replace(/\s+/g, '_')}.svg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error('차트 다운로드 중 오류:', error);
    }
  };
  
  // 차트 렌더링
  const renderChart = () => {
    const colors = THEMES[config.theme];
    
    switch (config.chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              {config.showLegend && <Legend />}
              <Tooltip />
              <Bar 
                dataKey="value" 
                isAnimationActive={config.animation}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              {config.showLegend && <Legend />}
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={colors[0]} 
                activeDot={{ r: 8 }} 
                isAnimationActive={config.animation}
              />
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                isAnimationActive={config.animation}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              {config.showLegend && <Legend />}
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
        
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              {config.showLegend && <Legend />}
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={colors[0]} 
                fill={colors[0]} 
                isAnimationActive={config.animation}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
        
      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid />
              <XAxis dataKey="name" type="category" />
              <YAxis dataKey="value" type="number" />
              {config.showLegend && <Legend />}
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter 
                name="데이터" 
                data={chartData} 
                fill={colors[0]} 
                isAnimationActive={config.animation}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        );
      
      case 'radar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis />
              <Radar 
                name="값" 
                dataKey="value" 
                stroke={colors[0]} 
                fill={colors[0]} 
                fillOpacity={0.6} 
                isAnimationActive={config.animation}
              />
              {config.showLegend && <Legend />}
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        );
        
      case 'treemap':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <Treemap
              data={chartData}
              dataKey="value"
              nameKey="name"
              isAnimationActive={config.animation}
              content={<CustomTreemapContent colors={colors} />}
            >
              {config.showLegend && <Legend />}
              <Tooltip />
            </Treemap>
          </ResponsiveContainer>
        );
        
      default:
        return <div>차트 유형을 선택해주세요</div>;
    }
  };
  
  // 통계 요약 표시
  const renderStatistics = () => {
    if (Object.keys(statistics).length === 0) return null;
    
    return (
      <div className="mt-6 border-t border-gray-200 pt-4">
        <h3 className="text-lg font-medium mb-2">통계 요약</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">필드</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">테이블</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">최소값</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">최대값</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">평균</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">합계</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">개수</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(statistics).flatMap(([tableId, stats]) => 
                stats.map((stat, index) => (
                  <tr key={`${tableId}-${index}`}>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{stat.field}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{tableId}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{stat.min.toFixed(2)}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{stat.max.toFixed(2)}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{stat.mean.toFixed(2)}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{stat.sum.toFixed(2)}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{stat.count}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  // 설정 패널
  const renderSettingsPanel = () => (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-md mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <option value="radar">레이더 차트</option>
            <option value="treemap">트리맵</option>
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
            {filteredTables.length > 0 && 
              Array.from({ length: filteredTables[0].column_count }).map((_, index) => (
                <option key={index} value={index}>
                  {filteredTables[0].headers ? filteredTables[0].headers[index] : `열 ${index + 1}`}
                  {detectedFields.categoricalFields.includes(index) ? ' (범주형)' : ''}
                  {detectedFields.numericFields.includes(index) ? ' (숫자)' : ''}
                  {detectedFields.dateFields.includes(index) ? ' (날짜)' : ''}
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
            {filteredTables.length > 0 && 
              Array.from({ length: filteredTables[0].column_count }).map((_, index) => (
                <option key={index} value={index}>
                  {filteredTables[0].headers ? filteredTables[0].headers[index] : `열 ${index + 1}`}
                  {detectedFields.categoricalFields.includes(index) ? ' (범주형)' : ''}
                  {detectedFields.numericFields.includes(index) ? ' (숫자)' : ''}
                  {detectedFields.dateFields.includes(index) ? ' (날짜)' : ''}
                </option>
              ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            그룹화 필드 (선택 사항)
          </label>
          <select
            value={config.groupByField === undefined ? "" : config.groupByField}
            onChange={(e) => {
              const value = e.target.value === "" ? undefined : Number(e.target.value);
              handleConfigChange('groupByField', value);
            }}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">그룹화 안 함</option>
            {filteredTables.length > 0 && 
              Array.from({ length: filteredTables[0].column_count }).map((_, index) => (
                <option key={index} value={index}>
                  {filteredTables[0].headers ? filteredTables[0].headers[index] : `열 ${index + 1}`}
                  {detectedFields.categoricalFields.includes(index) ? ' (범주형)' : ''}
                  {detectedFields.numericFields.includes(index) ? ' (숫자)' : ''}
                  {detectedFields.dateFields.includes(index) ? ' (날짜)' : ''}
                </option>
              ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            분석 타입
          </label>
          <select
            value={config.analysisType}
            onChange={(e) => handleConfigChange('analysisType', e.target.value as AnalysisType)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="sum">합계 (Sum)</option>
            <option value="average">평균 (Average)</option>
            <option value="min">최소값 (Min)</option>
            <option value="max">최대값 (Max)</option>
            <option value="count">개수 (Count)</option>
            <option value="median">중앙값 (Median)</option>
            <option value="stdev">표준편차 (Standard Deviation)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            차트 테마
          </label>
          <select
            value={config.theme}
            onChange={(e) => handleConfigChange('theme', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="default">기본</option>
            <option value="dark">다크</option>
            <option value="pastel">파스텔</option>
            <option value="neon">네온</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-4 pt-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.showLegend}
              onChange={(e) => handleConfigChange('showLegend', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">범례 표시</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.animation}
              onChange={(e) => handleConfigChange('animation', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">애니메이션</span>
          </label>
        </div>
      </div>
    </div>
  );
  
  // 선택된 테이블이 없을 때 안내 메시지
  if (filteredTables.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-full">
        <div className="text-center py-8">
          <FiBarChart2 className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">시각화할 테이블이 없습니다</h3>
          <p className="text-gray-500">
            테이블을 선택하거나 새 파일을 업로드하세요.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">데이터 시각화</h2>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
            title="설정"
          >
            <FiSettings size={18} />
          </button>
          
          <button
            onClick={handleDownloadChart}
            className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
            title="차트 다운로드"
          >
            <FiDownload size={18} />
          </button>
        </div>
      </div>
      
      {showSettings && renderSettingsPanel()}
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">{config.title}</h3>
        <div className="bg-gray-50 p-2 rounded-md">
          {renderChart()}
        </div>
      </div>
      
      {renderStatistics()}
    </div>
  );
};

// 트리맵용 사용자 정의 콘텐츠 렌더러
const CustomTreemapContent = ({ colors, ...props }: any) => {
  const { root, depth, x, y, width, height, index, payload, colors: itemColors, rank, name } = props;
  
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: colors[index % colors.length],
          stroke: '#fff',
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10),
        }}
      />
      {(width > 50 && height > 30) ? (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fontSize: 14,
            fontWeight: 'bold',
            fill: '#fff',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
          }}
        >
          {payload.name}
        </text>
      ) : null}
    </g>
  );
};

export default EnhancedVisualizationPanel; 