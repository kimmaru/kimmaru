import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { DataVisualizerProps } from '../types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const DataVisualizer: React.FC<DataVisualizerProps> = ({ selectedTable }) => {
  const [chartType, setChartType] = React.useState<'bar' | 'pie'>('bar');
  const [selectedColumn, setSelectedColumn] = React.useState<number>(0);

  const chartData = useMemo(() => {
    if (!selectedTable) return [];

    const columnData = selectedTable.data.slice(1).map(row => row[selectedColumn]);
    const valueCounts = columnData.reduce((acc: { [key: string]: number }, value) => {
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(valueCounts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [selectedTable, selectedColumn]);

  if (!selectedTable) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="textSecondary">
          Select a table to view data visualization
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Chart Type</InputLabel>
          <Select
            value={chartType}
            label="Chart Type"
            onChange={(e) => setChartType(e.target.value as 'bar' | 'pie')}
          >
            <MenuItem value="bar">Bar Chart</MenuItem>
            <MenuItem value="pie">Pie Chart</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Column</InputLabel>
          <Select
            value={selectedColumn}
            label="Column"
            onChange={(e) => setSelectedColumn(Number(e.target.value))}
          >
            {selectedTable.headers.map((header, index) => (
              <MenuItem key={index} value={index}>
                {header}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Paper sx={{ flex: 1, p: 2 }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          )}
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
};

export default DataVisualizer; 