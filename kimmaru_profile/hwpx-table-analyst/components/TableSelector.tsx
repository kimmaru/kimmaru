import React from 'react';
import { TableData } from '@/types';
import { FiEye, FiEyeOff, FiPlus, FiTrash2, FiCheck } from 'react-icons/fi';

interface TableSelectorProps {
  tables: TableData[];
  selectedTables: string[];
  activeTable: string | null;
  onSelectTable: (tableId: string) => void;
  onToggleTableSelection: (tableId: string) => void;
  onRemoveTable: (tableId: string) => void;
}

const TableSelector: React.FC<TableSelectorProps> = ({
  tables,
  selectedTables,
  activeTable,
  onSelectTable,
  onToggleTableSelection,
  onRemoveTable
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">추출된 테이블</h2>
        <div className="text-sm text-gray-500">
          {selectedTables.length}/{tables.length} 선택됨
        </div>
      </div>
      
      <div className="space-y-2">
        {tables.map((table) => {
          const isSelected = selectedTables.includes(table.id);
          const isActive = activeTable === table.id;
          
          return (
            <div
              key={table.id}
              className={`p-3 rounded-md border transition-colors ${
                isActive
                  ? "bg-blue-100 border-blue-300"
                  : isSelected
                  ? "bg-gray-100 border-gray-300"
                  : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => onSelectTable(table.id)}
                >
                  <p className="font-medium">{table.id}</p>
                  <p className="text-sm text-gray-600">
                    {table.row_count}행 × {table.column_count}열
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => onToggleTableSelection(table.id)}
                    className={`p-2 rounded-full ${
                      isSelected 
                        ? "bg-green-100 text-green-600" 
                        : "bg-gray-100 text-gray-600"
                    }`}
                    title={isSelected ? "분석에서 제외" : "분석에 포함"}
                  >
                    {isSelected ? <FiCheck size={16} /> : <FiPlus size={16} />}
                  </button>
                  
                  <button
                    onClick={() => onRemoveTable(table.id)}
                    className="p-2 rounded-full bg-red-100 text-red-600"
                    title="테이블 삭제"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {tables.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          테이블이 없습니다. 파일을 업로드하세요.
        </div>
      )}
    </div>
  );
};

export default TableSelector; 