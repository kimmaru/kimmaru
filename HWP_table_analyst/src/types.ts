export interface HwpTable {
  id: string;
  name: string;
  data: string[][];
  headers: string[];
  rows: number;
  columns: number;
}

export interface FileUploaderProps {
  onFileUpload: (tables: HwpTable[]) => void;
}

export interface TableVisualizerProps {
  tables: HwpTable[];
  selectedTable: HwpTable | null;
  onTableSelect: (table: HwpTable) => void;
}

export interface DataVisualizerProps {
  selectedTable: HwpTable | null;
} 