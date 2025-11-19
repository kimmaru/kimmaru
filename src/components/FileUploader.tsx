import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Paper } from '@mui/material';
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
  const [error, setError] = React.useState<string | null>(null);
  const apiUrl = process.env.REACT_APP_API_URL || '';

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError(null);
    for (const file of acceptedFiles) {
      if (file.name.endsWith('.hwp')) {
        const formData = new FormData();
        formData.append('file', file);
        try {
          const res = await fetch(`${apiUrl}/parse-hwp`, {
            method: 'POST',
            body: formData,
          });
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            setError((err.error || '파일 파싱 실패') + (err.detail ? `\n상세: ${err.detail}` : ''));
            continue;
          }
          const result = await res.json();
          onFileUpload(Array.isArray(result.tables) ? result.tables : []);
        } catch (e) {
          setError('서버와 통신 중 오류가 발생했습니다.');
        }
      } else {
        setError('HWP 파일만 업로드할 수 있습니다.');
      }
    }
  }, [onFileUpload, apiUrl]);

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
      </Box>
      {error && (
        <Box sx={{ color: 'red', mt: 2, textAlign: 'center' }}>{error}</Box>
      )}
    </>
  );
};

export default FileUploader; 