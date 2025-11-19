import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

interface NavigationProps {
  onLogout: () => void;
}

const Nav = styled.nav`
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 15px 20px;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled.div`
  font-weight: 700;
  font-size: 22px;
  color: #4a90e2;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  letter-spacing: -0.5px;
  
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;
  
  @media (max-width: 768px) {
    gap: 10px;
  }
`;

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  color: #555;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    background-color: #f0f8ff;
    color: #4a90e2;
    transform: translateY(-2px);
  }
  
  &.active {
    color: #4a90e2;
    background-color: #f0f8ff;
    font-weight: 600;
    
    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 40%;
      height: 3px;
      background-color: #4a90e2;
      border-radius: 2px;
    }
  }
  
  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 14px;
  }
`;

const LogoutButton = styled.button`
  background-color: transparent;
  border: 1px solid #d9534f;
  color: #d9534f;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  
  &:hover {
    background-color: #d9534f;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(217, 83, 79, 0.2);
  }
  
  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 14px;
  }
`;

const Navigation: React.FC<NavigationProps> = ({ onLogout }) => {
  return (
    <Nav>
      <NavContainer>
        <Logo>신일교회 초등부</Logo>
        
        <NavLinks>
          <StyledNavLink to="/" end>
            학생 명단
          </StyledNavLink>
          <StyledNavLink to="/memorize">
            암기
          </StyledNavLink>
          <StyledNavLink to="/quiz">
            퀴즈
          </StyledNavLink>
          <StyledNavLink to="/exam">
            시험
          </StyledNavLink>
        </NavLinks>
        
        <LogoutButton onClick={onLogout}>
          로그아웃
        </LogoutButton>
      </NavContainer>
    </Nav>
  );
};

export default Navigation; 