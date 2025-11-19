"use client";

import { useState, useEffect } from "react";
import FileUpload from "@/components/FileUpload";
import TableViewer from "@/components/TableViewer";
import VisualizationPanel from "@/components/VisualizationPanel";
import TableSelector from "@/components/TableSelector";
import EnhancedVisualizationPanel from "@/components/EnhancedVisualizationPanel";
import StatisticsPanel from "@/components/StatisticsPanel";
import RelationshipAnalysisPanel from "@/components/RelationshipAnalysisPanel";
import { APIResponse, TableData } from "@/types";
import { FiUpload, FiBarChart2, FiGrid, FiMaximize, FiMinimize, FiSettings, FiChevronLeft, FiChevronRight, FiRefreshCw, FiDownload, FiFilePlus, FiPieChart, FiTrendingUp } from "react-icons/fi";

// API 기본 URL 가져오기 (환경변수에서)
const getApiUrl = () => {
  // API URL에 프로토콜이 포함되어 있는지 확인하고 없으면 추가
  const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `https://${url}`;
};

const API_URL = getApiUrl();

export default function Home() {
  const [apiResponse, setApiResponse] = useState<APIResponse | null>(null);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [activeTable, setActiveTable] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // UI 상태
  const [showTableViewer, setShowTableViewer] = useState<boolean>(true);
  const [showVisualization, setShowVisualization] = useState<boolean>(true);
  const [showStatistics, setShowStatistics] = useState<boolean>(true);
  const [showRelationshipAnalysis, setShowRelationshipAnalysis] = useState<boolean>(true);
  const [expandedPanel, setExpandedPanel] = useState<"none" | "table" | "visualization" | "statistics" | "relationships">("none");
  
  // 개발용 로그 - 배포 후 환경 변수가 올바르게 설정되었는지 확인
  useEffect(() => {
    console.log("API URL:", API_URL);
  }, []);

  // 파일 업로드 처리
  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      console.log("요청 URL:", `${API_URL}/extract-tables/`);
      
      const response = await fetch(`${API_URL}/extract-tables/`, {
        method: "POST",
        body: formData,
        // CORS 문제를 방지하기 위한 설정 추가
        credentials: 'omit',
        mode: 'cors',  // CORS 모드 명시
        headers: {
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'  // CORS 헤더 추가
        },
      });
      
      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        setApiResponse(null);
        setSelectedTables([]);
        setActiveTable(null);
      } else {
        setApiResponse(data);
        
        // 모든 테이블 기본 선택
        if (data.tables && data.tables.length > 0) {
          const tableIds = data.tables.map((table: TableData) => table.id);
          setSelectedTables(tableIds);
          setActiveTable(tableIds[0]);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "파일 처리 중 오류가 발생했습니다. API 서버가 실행 중인지 확인해주세요.";
      setError(errorMessage);
      console.error("API 호출 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  // 테이블 패널 선택 처리
  const handleSelectTable = (tableId: string) => {
    setActiveTable(tableId);
  };
  
  // 테이블 선택/해제 처리
  const handleToggleTableSelection = (tableId: string) => {
    setSelectedTables(prev => {
      if (prev.includes(tableId)) {
        return prev.filter(id => id !== tableId);
      } else {
        return [...prev, tableId];
      }
    });
  };
  
  // 테이블 제거 처리
  const handleRemoveTable = (tableId: string) => {
    if (!apiResponse || !apiResponse.tables) return;
    
    // 선택된 테이블에서 제거
    setSelectedTables(prev => prev.filter(id => id !== tableId));
    
    // 현재 활성 테이블인 경우 첫 번째 테이블을 활성화
    if (activeTable === tableId) {
      const remainingTables = apiResponse.tables.filter(table => table.id !== tableId);
      if (remainingTables.length > 0) {
        setActiveTable(remainingTables[0].id);
      } else {
        setActiveTable(null);
      }
    }
    
    // API 응답에서 테이블 제거
    setApiResponse(prev => {
      if (!prev || !prev.tables) return prev;
      
      return {
        ...prev,
        tables: prev.tables.filter(table => table.id !== tableId),
        total_tables: (prev.total_tables || prev.tables.length) - 1
      };
    });
  };
  
  // 패널 확장/축소 처리
  const toggleExpand = (panel: "table" | "visualization" | "statistics" | "relationships") => {
    if (expandedPanel === panel) {
      setExpandedPanel("none");
    } else {
      setExpandedPanel(panel);
    }
  };
  
  // 현재 활성 테이블 데이터 가져오기
  const getActiveTableData = (): TableData | null => {
    if (!apiResponse || !apiResponse.tables || !activeTable) return null;
    
    return apiResponse.tables.find(table => table.id === activeTable) || null;
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">HWPX 테이블 분석기</h1>
            
            {apiResponse && (
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowTableViewer(!showTableViewer)}
                  className={`p-2 rounded-md ${
                    showTableViewer ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}
                  title={showTableViewer ? "테이블 뷰어 숨기기" : "테이블 뷰어 표시"}
                >
                  <FiGrid size={20} />
                </button>
                
                <button
                  onClick={() => setShowVisualization(!showVisualization)}
                  className={`p-2 rounded-md ${
                    showVisualization ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}
                  title={showVisualization ? "시각화 패널 숨기기" : "시각화 패널 표시"}
                >
                  <FiBarChart2 size={20} />
                </button>
                
                <button
                  onClick={() => setShowStatistics(!showStatistics)}
                  className={`p-2 rounded-md ${
                    showStatistics ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}
                  title={showStatistics ? "통계 분석 패널 숨기기" : "통계 분석 패널 표시"}
                >
                  <FiPieChart size={20} />
                </button>
                
                <button
                  onClick={() => setShowRelationshipAnalysis(!showRelationshipAnalysis)}
                  className={`p-2 rounded-md ${
                    showRelationshipAnalysis ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}
                  title={showRelationshipAnalysis ? "관계 분석 패널 숨기기" : "관계 분석 패널 표시"}
                >
                  <FiTrendingUp size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {!apiResponse && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="max-w-xl mx-auto">
              <FileUpload onFileUpload={handleFileUpload} loading={loading} />
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
                  {error}
                </div>
              )}
            </div>
          </div>
        )}
        
        {apiResponse && apiResponse.tables && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* 테이블 목록 패널 */}
            <div className="lg:col-span-1">
              <TableSelector 
                tables={apiResponse.tables}
                selectedTables={selectedTables}
                activeTable={activeTable}
                onSelectTable={handleSelectTable}
                onToggleTableSelection={handleToggleTableSelection}
                onRemoveTable={handleRemoveTable}
              />
            </div>
            
            {/* 메인 콘텐츠 영역 */}
            <div className="lg:col-span-3 space-y-6">
              {/* 테이블 뷰어 패널 */}
              {showTableViewer && getActiveTableData() && (
                <div className="bg-white rounded-lg shadow-md">
                  <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">테이블 뷰어</h2>
                    <button
                      onClick={() => toggleExpand("table")}
                      className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                      title={expandedPanel === "table" ? "축소" : "확장"}
                    >
                      {expandedPanel === "table" ? <FiMinimize size={18} /> : <FiMaximize size={18} />}
                    </button>
                  </div>
                  <div className="p-4">
                    <TableViewer table={getActiveTableData()!} />
                  </div>
                </div>
              )}
              
              {/* 시각화 패널 */}
              {showVisualization && (
                <div className="bg-white rounded-lg shadow-md">
                  <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">데이터 시각화</h2>
                    <button
                      onClick={() => toggleExpand("visualization")}
                      className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                      title={expandedPanel === "visualization" ? "축소" : "확장"}
                    >
                      {expandedPanel === "visualization" ? <FiMinimize size={18} /> : <FiMaximize size={18} />}
                    </button>
                  </div>
                  <div className="p-4">
                    <EnhancedVisualizationPanel 
                      tables={apiResponse.tables}
                      selectedTables={selectedTables}
                    />
                  </div>
                </div>
              )}
              
              {/* 통계 분석 패널 */}
              {showStatistics && getActiveTableData() && (
                <div className="bg-white rounded-lg shadow-md">
                  <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">통계 분석</h2>
                    <button
                      onClick={() => toggleExpand("statistics")}
                      className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                      title={expandedPanel === "statistics" ? "축소" : "확장"}
                    >
                      {expandedPanel === "statistics" ? <FiMinimize size={18} /> : <FiMaximize size={18} />}
                    </button>
                  </div>
                  <div className="p-4">
                    <StatisticsPanel table={getActiveTableData()!} />
                  </div>
                </div>
              )}
              
              {/* 관계 분석 패널 */}
              {showRelationshipAnalysis && getActiveTableData() && (
                <div className="bg-white rounded-lg shadow-md">
                  <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">관계 분석</h2>
                    <button
                      onClick={() => toggleExpand("relationships")}
                      className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                      title={expandedPanel === "relationships" ? "축소" : "확장"}
                    >
                      {expandedPanel === "relationships" ? <FiMinimize size={18} /> : <FiMaximize size={18} />}
                    </button>
                  </div>
                  <div className="p-4">
                    <RelationshipAnalysisPanel table={getActiveTableData()!} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* 새 파일 업로드 버튼 (고정) */}
      {apiResponse && (
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => {
              setApiResponse(null);
              setSelectedTables([]);
              setActiveTable(null);
              setError(null);
            }}
            className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
            title="새 파일 업로드"
          >
            <FiUpload size={24} />
          </button>
        </div>
      )}
    </main>
  );
} 