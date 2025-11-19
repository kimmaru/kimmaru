import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import './App.css';

import Navigation from './components/Navigation';
import LoginScreen from './components/LoginScreen';
import ListPage from './pages/ListPage';
import MemorizePage from './pages/MemorizePage';
import QuizPage from './pages/QuizPage';
import ExamPage from './pages/ExamPage';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const ContentContainer = styled.div`
  padding-bottom: 50px;
`;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  useEffect(() => {
    // 로컬 스토리지에서 인증 상태 확인
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);
  
  const handleLogin = () => {
    setIsAuthenticated(true);
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };
  
  if (!isAuthenticated) {
    return (
      <>
        <LoginScreen onLogin={handleLogin} />
      </>
    );
  }
  
  return (
    <Router>
      <AppContainer>
        <Navigation onLogout={handleLogout} />
        
        <ContentContainer>
          <Routes>
            <Route path="/" element={<ListPage />} />
            <Route path="/memorize" element={<MemorizePage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/exam" element={<ExamPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </ContentContainer>
        
      </AppContainer>
    </Router>
  );
}

export default App;
