import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Paper, TextField, Button, Grid } from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { FileUploaderProps } from '../types';

const UploadBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  cursor: 'pointer',
  backgroundColor: theme.palette.background.default,
  border: `2px dashed ${theme.palette.primary.main}`,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
  const [error, setError] = useState<string | null>(null);
  const [startPage, setStartPage] = useState<number | ''>('');
  const [endPage, setEndPage] = useState<number | ''>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // API URL 설정 - 로컬 개발 환경에서는 로컬 URL, 프로덕션에서는 Railway URL 사용
  const apiUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : process.env.REACT_APP_API_URL || 'https://hwp-api-server-production.up.railway.app';

  console.log('API URL:', apiUrl);

  const processFile = async (file: File) => {
    if (!file.name.endsWith('.hwp')) {
      setError('HWP 파일만 업로드할 수 있습니다.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    
    // 페이지 범위 추가
    if (typeof startPage === 'number') {
      formData.append('startPage', startPage.toString());
    }
    if (typeof endPage === 'number') {
      formData.append('endPage', endPage.toString());
    }
    
    try {
      console.log(`Sending request to: ${apiUrl}/parse-hwp`);
      console.log(`페이지 범위: ${startPage || '처음'}-${endPage || '끝'}`);
      
      const res = await fetch(`${apiUrl}/parse-hwp`, {
        method: 'POST',
        body: formData,
      });
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError((err.error || '파일 파싱 실패') + (err.detail ? `\n상세: ${err.detail}` : ''));
        return;
      }
      
      const data = await res.json();
      console.log('API response:', data);
      onFileUpload(data.tables || []);
    } catch (error: any) {
      console.error('API 요청 오류:', error);
      setError(`서버와 통신 중 오류가 발생했습니다: ${error.message || String(error)}`);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    if (acceptedFiles && acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const handleStartPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStartPage(value === '' ? '' : parseInt(value, 10));
  };

  const handleEndPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEndPage(value === '' ? '' : parseInt(value, 10));
  };

  const handleSubmit = async () => {
    if (selectedFile) {
      await processFile(selectedFile);
    } else {
      setError('파일을 먼저 선택해주세요.');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/x-hwp': ['.hwp']
    },
    multiple: false
  });

  return (
    <>
      <Box mb={3}>
        <UploadBox {...getRootProps()}>
          <input {...getInputProps()} />
          <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {isDragActive
              ? 'Drop the HWP file here'
              : 'Drag and drop an HWP file here, or click to select'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Only .hwp files are supported
          </Typography>
        </UploadBox>
        
        {selectedFile && (
          <>
            <Typography variant="body1" mt={2}>
              선택된 파일: {selectedFile.name}
            </Typography>
            
            <Box mt={3}>
              <Typography variant="h6" gutterBottom>
                페이지 범위 지정 (선택사항)
              </Typography>
              <Typography variant="body2" color="textSecondary" mb={2}>
                1,2 페이지의 표를 제외하려면 시작 페이지를 3으로 설정하세요.
              </Typography>
              
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={5}>
                  <TextField
                    label="시작 페이지"
                    type="number"
                    fullWidth
                    value={startPage}
                    onChange={handleStartPageChange}
                    inputProps={{ min: 1 }}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={2} textAlign="center">
                  <Typography>~</Typography>
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    label="종료 페이지"
                    type="number"
                    fullWidth
                    value={endPage}
                    onChange={handleEndPageChange}
                    inputProps={{ min: 1 }}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
              </Grid>
              
              <Box mt={3} textAlign="center">
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleSubmit}
                >
                  분석 시작
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Box>
      
      {error && (
        <Box sx={{ color: 'red', mt: 2, textAlign: 'center' }}>{error}</Box>
      )}
    </>
  );
};

export default FileUploader; 