import React, { useState } from 'react';
import styled from 'styled-components';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f8ff, #e6f2ff);
  padding: 20px;
`;

const LoginBox = styled.div`
  background-color: white;
  border-radius: 20px;
  padding: 50px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  width: 100%;
  max-width: 450px;
  text-align: center;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const Title = styled.h1`
  color: #4a90e2;
  margin-bottom: 30px;
  font-size: 32px;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const Subtitle = styled.p`
  color: #666;
  margin-bottom: 35px;
  font-size: 17px;
  line-height: 1.6;
`;

const InputGroup = styled.div`
  margin-bottom: 30px;
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px 20px;
  border: 2px solid #ddd;
  border-radius: 10px;
  font-size: 17px;
  box-sizing: border-box;
  transition: all 0.3s;
  
  &:focus {
    border-color: #4a90e2;
    outline: none;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
  }
  
  &::placeholder {
    color: #aaa;
  }
`;

const LoginButton = styled.button<{ disabled: boolean }>`
  background: ${({ disabled }) => (disabled
    ? '#cccccc' 
    : 'linear-gradient(135deg, #4a90e2, #357abf)')};
  color: white;
  border: none;
  border-radius: 10px;
  padding: 15px 20px;
  width: 100%;
  font-size: 18px;
  font-weight: 600;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.3s ease;
  box-shadow: ${({ disabled }) => 
    disabled ? 'none' : '0 4px 10px rgba(74, 144, 226, 0.3)'};
  
  &:hover {
    background: ${({ disabled }) => (disabled
    ? '#cccccc' 
    : 'linear-gradient(135deg, #3a80d2, #2a6cb8)')};
    transform: ${({ disabled }) => disabled ? 'none' : 'translateY(-2px)'};
    box-shadow: ${({ disabled }) => 
    disabled ? 'none' : '0 6px 12px rgba(74, 144, 226, 0.4)'};
  }
`;

const ErrorMessage = styled.p`
  color: #ff4d4f;
  margin-top: 20px;
  font-size: 15px;
  background-color: #fff1f0;
  padding: 10px 15px;
  border-radius: 8px;
  border-left: 3px solid #ff4d4f;
`;

const Logo = styled.div`
  margin-bottom: 30px;
  font-size: 50px;
  color: #4a90e2;
  
  &::before {
    content: '📚';
  }
`;

// 신일교회 초등부 - 교사용 앱 비밀번호: 19710214 (신일교회 설립일)
const CORRECT_PASSWORD = '19710214';

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === CORRECT_PASSWORD) {
      onLogin();
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      setError('비밀번호가 일치하지 않습니다.');
    }
  };
  
  return (
    <LoginContainer>
      <LoginBox>
        <Logo />
        <Title>신일교회 초등부</Title>
        <Subtitle>교사용 이름 외우기 학습 앱입니다.<br />비밀번호를 입력해주세요.</Subtitle>
        
        <form onSubmit={handleSubmit}>
          <InputGroup>
            <Input
              type="password"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
            />
          </InputGroup>
          
          <LoginButton type="submit" disabled={!password}>
            로그인
          </LoginButton>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </form>
      </LoginBox>
    </LoginContainer>
  );
};

export default LoginScreen; 