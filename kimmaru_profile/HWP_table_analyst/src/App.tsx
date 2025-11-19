import React, { useState } from 'react';
import { Box, Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import FileUploader from './components/FileUploader';
import TableVisualizer from './components/TableVisualizer';
import DataVisualizer from './components/DataVisualizer';
import { HwpTable } from './types';
import packageJson from '../package.json';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const MainContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  height: '100vh',
}));

const ContentBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  height: 'calc(100vh - 100px)',
}));

const VisualizerBox = styled(Box)(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  boxShadow: theme.shadows[1],
  overflow: 'auto',
}));

const VersionBox = styled(Box)(({ theme }) => ({
  position: 'fixed',
  right: theme.spacing(2),
  bottom: theme.spacing(2),
  background: 'rgba(255,255,255,0.8)',
  color: theme.palette.text.secondary,
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  fontSize: 12,
  zIndex: 9999,
}));

function App() {
  const [tables, setTables] = useState<HwpTable[]>([]);
  const [selectedTable, setSelectedTable] = useState<HwpTable | null>(null);

  const handleFileUpload = (uploadedTables: HwpTable[]) => {
    setTables(uploadedTables);
    if (uploadedTables.length > 0) {
      setSelectedTable(uploadedTables[0]);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MainContainer maxWidth="xl">
        <FileUploader onFileUpload={handleFileUpload} />
        <ContentBox>
          <VisualizerBox>
            <TableVisualizer
              tables={tables}
              selectedTable={selectedTable}
              onTableSelect={setSelectedTable}
            />
          </VisualizerBox>
          <VisualizerBox>
            <DataVisualizer selectedTable={selectedTable} />
          </VisualizerBox>
        </ContentBox>
        <VersionBox>
          v{packageJson.version}
        </VersionBox>
      </MainContainer>
    </ThemeProvider>
  );
}

export default App; 