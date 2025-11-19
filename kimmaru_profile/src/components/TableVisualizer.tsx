import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { TableVisualizerProps } from '../types';

const TableVisualizer: React.FC<TableVisualizerProps> = ({
  tables,
  selectedTable,
  onTableSelect,
}) => {
  const safeTables = Array.isArray(tables) ? tables : [];

  if (safeTables.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="textSecondary">
          Upload an HWP file to view tables
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <List sx={{ width: '100%', bgcolor: 'background.paper', mb: 2 }}>
        {safeTables.map((table) => (
          <ListItem key={table.id} disablePadding>
            <ListItemButton
              selected={selectedTable?.id === table.id}
              onClick={() => onTableSelect(table)}
            >
              <ListItemText
                primary={table.name}
                secondary={`${table.rows} rows × ${table.columns} columns`}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {selectedTable && (
        <TableContainer component={Paper} sx={{ flex: 1, overflow: 'auto' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {selectedTable.headers.map((header, index) => (
                  <TableCell key={index}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedTable.data.slice(1).map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex}>{cell === undefined || cell === null || cell === '' ? 'None' : cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default TableVisualizer; 