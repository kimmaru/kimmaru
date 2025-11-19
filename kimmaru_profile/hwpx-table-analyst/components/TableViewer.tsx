import React from 'react';
import { TableData } from '../types';

interface TableViewerProps {
  table: TableData;
}

const TableViewer: React.FC<TableViewerProps> = ({ table }) => {
  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-3">테이블 뷰어</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {table.headers ? (
                table.headers.map((header: string, index: number) => (
                  <th 
                    key={index} 
                    className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700"
                  >
                    {header}
                  </th>
                ))
              ) : (
                Array.from({ length: table.column_count }).map((_, index: number) => (
                  <th 
                    key={index} 
                    className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700"
                  >
                    열 {index + 1}
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {table.data.map((row: string[], rowIndex: number) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {row.map((cell: string, cellIndex: number) => (
                  <td 
                    key={cellIndex} 
                    className="border border-gray-300 px-4 py-2 text-sm text-gray-900"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-sm text-gray-600">
        총 {table.row_count}행 × {table.column_count}열
      </div>
    </div>
  );
};

export default TableViewer; 