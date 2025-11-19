export interface TableData {
  id: string;
  headers: string[] | null;
  data: string[][];
  column_count: number;
  row_count: number;
  selected?: boolean;
}

export interface APIResponse {
  success?: boolean;
  error?: string;
  total_tables?: number;
  tables?: TableData[];
  tables_by_columns?: Record<number, TableData[]>;
}

export interface ChartData {
  name: string;
  value: number;
}

export type ChartType = 'bar' | 'line' | 'pie' | 'area' | 'scatter' | 'radar' | 'heatmap' | 'treemap';
export type AnalysisType = 'sum' | 'average' | 'min' | 'max' | 'count' | 'median' | 'stdev';

export interface VisualizationConfig {
  chartType: ChartType;
  xAxisField: number;
  yAxisField: number;
  groupByField?: number;
  colorField?: number;
  sizeField?: number;
  analysisType: AnalysisType;
  title: string;
  showLegend: boolean;
  animation: boolean;
  theme: 'default' | 'dark' | 'pastel' | 'neon';
}

export interface StatisticalSummary {
  field: string;
  min: number;
  max: number;
  mean: number;
  median: number;
  sum: number;
  count: number;
  stdev?: number;
  quartiles?: [number, number, number];
} 