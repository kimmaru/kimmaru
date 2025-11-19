import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header<{ scrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(32px);
  border-bottom: 1px solid var(--border-color);
  z-index: 1000;
  transition: var(--transition);
  height: 80px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  max-width: 1400px;
  margin: 0 auto;
  height: 100%;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: var(--font-primary);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-primary);
  text-decoration: none;
  transition: var(--transition-fast);
  
  img {
    width: 40px;
    height: 40px;
    object-fit: contain;
    filter: brightness(1.2);
  }
  
  &:hover {
    color: var(--color-accent);
    transform: translateY(-1px);
  }
`;

const NavLinks = styled.div<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    position: fixed;
    top: 80px;
    left: 0;
    right: 0;
    background: var(--color-surface);
    backdrop-filter: blur(20px);
    padding: 2rem;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    border-bottom: 1px solid var(--border-color);
    box-shadow: var(--shadow-strong);
    transform: translateY(${props => props.isOpen ? '0' : '-100%'});
    opacity: ${props => props.isOpen ? '1' : '0'};
    visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
    transition: var(--transition);
  }
`;

const NavItem = styled.div`
  position: relative;
  
  &:hover .dropdown-menu {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    
    &:hover .dropdown-menu {
      visibility: visible;
      opacity: 1;
    }
  }
`;

const NavLink = styled(Link)<{ isActive?: boolean }>`
  font-family: var(--font-secondary);
  font-size: 0.95rem;
  font-weight: 500;
  color: ${props => props.isActive ? 'var(--color-accent)' : 'var(--color-primary)'};
  text-decoration: none;
  padding: 0.75rem 0;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: var(--transition-fast);
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: ${props => props.isActive ? '100%' : '0'};
    height: 2px;
    background: var(--color-accent);
    transition: var(--transition-fast);
  }
  
  &:hover {
    color: var(--color-accent);
    
    &:after {
      width: 100%;
    }
  }
  
  @media (max-width: 768px) {
    padding: 1rem 0;
    border-bottom: 1px solid var(--border-color);
    color: ${props => props.isActive ? 'var(--color-accent)' : 'var(--color-primary)'};
    justify-content: space-between;
    
    &:after {
      display: none;
    }
    
    &:hover {
      background: var(--color-hover);
    }
  }
`;

const DropdownButton = styled.button<{ isActive?: boolean }>`
  font-family: var(--font-secondary);
  font-size: 0.95rem;
  font-weight: 500;
  color: ${props => props.isActive ? 'var(--color-accent)' : 'var(--color-primary)'};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.75rem 0;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: var(--transition-fast);
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: ${props => props.isActive ? '100%' : '0'};
    height: 2px;
    background: var(--color-accent);
    transition: var(--transition-fast);
  }
  
  &:hover {
    color: var(--color-accent);
    
    &:after {
      width: 100%;
    }
  }
  
  @media (max-width: 768px) {
    padding: 1rem 0;
    border-bottom: 1px solid var(--border-color);
    justify-content: space-between;
    width: 100%;
    color: ${props => props.isActive ? 'var(--color-accent)' : 'var(--color-primary)'};
    
    &:after {
      display: none;
    }
    
    &:hover {
      background: var(--color-hover);
    }
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: var(--color-surface-variant);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 0.75rem 0;
  min-width: 200px;
  box-shadow: var(--shadow-medium);
  z-index: 100;
  visibility: hidden;
  opacity: 0;
  transform: translateY(-10px);
  transition: var(--transition);
  
  @media (max-width: 768px) {
    position: static;
    background: var(--color-surface);
    backdrop-filter: none;
    border: none;
    border-radius: 0;
    box-shadow: none;
    padding: 0;
    transform: none;
    visibility: hidden;
    opacity: 0;
    margin-left: 1rem;
    margin-top: 0.5rem;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease, opacity 0.3s ease;
    
    &.active {
      visibility: visible;
      opacity: 1;
      max-height: 300px;
    }
  }
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 0.75rem 1.25rem;
  color: var(--color-secondary);
  font-size: 0.9rem;
  font-weight: 400;
  text-decoration: none;
  transition: var(--transition-fast);
  
  &:hover {
    background: var(--color-hover);
    color: var(--color-primary);
  }
  
  @media (max-width: 768px) {
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--border-color);
    
    &:hover {
      background: var(--color-hover);
      color: var(--color-accent);
    }
  }
`;

const MenuToggle = styled.button`
  display: none;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: var(--border-radius);
  transition: var(--transition-fast);
  
  span {
    width: 24px;
    height: 2px;
    background: var(--color-primary);
    transition: var(--transition-fast);
    transform-origin: left center;
  }
  
  &:hover {
    background: var(--color-hover);
  }
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

const MenuToggleOpen = styled(MenuToggle)<{ isOpen: boolean }>`
  span:nth-child(1) {
    transform: ${props => props.isOpen ? 'rotate(45deg)' : 'none'};
  }
  
  span:nth-child(2) {
    opacity: ${props => props.isOpen ? '0' : '1'};
  }
  
  span:nth-child(3) {
    transform: ${props => props.isOpen ? 'rotate(-45deg)' : 'none'};
  }
`;

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    // 스크롤 이벤트를 제거하여 헤더가 항상 동일하게 유지
    setScrolled(false);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleDropdownToggle = (dropdown: string) => {
    if (window.innerWidth <= 768) {
      setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
    }
  };

  const menuItems = [
    { path: '/', label: '홈' },
    {
      label: '교회소개',
      dropdown: 'about',
      items: [
        { path: '/about', label: '교회소개' },
        { path: '/about/pastor', label: '담임목사 인사말' },
        { path: '/about/service', label: '예배시간' },
        { path: '/about/location', label: '오시는 길' }
      ]
    },
    { path: '/sermon', label: '말씀' },
    { path: '/media', label: '미디어' }
  ];

  return (
    <HeaderContainer scrolled={scrolled}>
      <Nav>
        <Logo to="/">
          <img src="/logo.png" alt="김포 구원의감격교회" />
          김포 구원의감격교회
        </Logo>

        <NavLinks isOpen={isMenuOpen}>
          {menuItems.map((item, index) => (
            <NavItem key={index}>
              {item.dropdown ? (
                <>
                  <DropdownButton
                    onClick={() => handleDropdownToggle(item.dropdown!)}
                    isActive={item.items?.some(subItem => isActive(subItem.path))}
                  >
                    {item.label}
                    <span style={{ 
                      transform: activeDropdown === item.dropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease'
                    }}>
                      ▼
                    </span>
                  </DropdownButton>
                  <DropdownMenu 
                    className={`dropdown-menu ${activeDropdown === item.dropdown ? 'active' : ''}`}
                  >
                    {item.items?.map((subItem, subIndex) => (
                      <DropdownItem
                        key={subIndex}
                        to={subItem.path}
                        onClick={() => setActiveDropdown(null)}
                      >
                        {subItem.label}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </>
              ) : (
                <NavLink to={item.path || '/'} isActive={isActive(item.path || '/')}>
                  {item.label}
                </NavLink>
              )}
            </NavItem>
          ))}
        </NavLinks>

        <MenuToggleOpen
          isOpen={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span />
          <span />
          <span />
        </MenuToggleOpen>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;