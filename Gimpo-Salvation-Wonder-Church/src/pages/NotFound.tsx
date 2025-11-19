import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const NotFoundContainer = styled.div`
  min-height: 100vh;
  background: var(--color-bg);
  padding-top: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NotFoundContent = styled(motion.div)`
  max-width: 600px;
  padding: 0 2rem;
  text-align: center;
  
  h1 {
    font-family: var(--font-primary);
    font-size: clamp(4rem, 8vw, 8rem);
    font-weight: 700;
    color: var(--color-accent);
    margin-bottom: 1rem;
    background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-light) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  h2 {
    font-family: var(--font-primary);
    font-size: clamp(1.5rem, 3vw, 2rem);
    font-weight: 500;
    color: var(--color-primary);
    margin-bottom: 2rem;
  }
  
  p {
    font-size: 1.1rem;
    color: var(--color-secondary);
    line-height: 1.6;
    margin-bottom: 3rem;
  }
`;

const HomeButton = styled(Link)`
  display: inline-block;
  padding: 1rem 2rem;
  background: var(--color-accent);
  color: var(--color-white);
  text-decoration: none;
  border-radius: var(--border-radius);
  font-family: var(--font-secondary);
  font-weight: 500;
  transition: var(--transition-fast);
  box-shadow: var(--shadow-soft);
  
  &:hover {
    background: var(--color-accent-light);
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium);
    filter: brightness(1.1);
  }
  
  &:active {
    background: var(--color-accent-dark);
    transform: translateY(0);
  }
`;

const NotFound: React.FC = () => {
  return (
    <NotFoundContainer>
      <NotFoundContent
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>404</h1>
        <h2>페이지를 찾을 수 없습니다</h2>
        <p>
          죄송합니다. 요청하신 페이지가 존재하지 않거나<br />
          이동되었을 수 있습니다.
        </p>
        <HomeButton to="/">
          홈으로 돌아가기
        </HomeButton>
      </NotFoundContent>
    </NotFoundContainer>
  );
};

export default NotFound;