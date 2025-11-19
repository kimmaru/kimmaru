import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = ({ mobileMenuOpen, toggleMobileMenu }) => {
  // Navigation items
  const navItems = [
    { path: '/', label: '홈' },
    { path: '/about', label: '소개' },
    { path: '/gallery', label: '갤러리' },
    { path: '/ministries', label: '사역' },
    { path: '/contact', label: '문의' }
  ];

  return (
    <>
      {/* Header */}
      <header className="bg-dark bg-opacity-40 backdrop-filter backdrop-blur-sm py-4 sticky top-0 z-40">
        <div className="container-fluid px-6 md:px-8 flex justify-between items-center">
          <NavLink to="/" className="flex items-center">
            <img 
              src="/holssi-logo.jpeg" 
              alt="Holssi Worship Logo" 
              className="h-10 w-10 rounded-full mr-2 object-cover"
            />
            <span className="text-xl font-bold text-white uppercase tracking-wide">HOLSSI WORSHIP</span>
          </NavLink>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              {navItems.map(item => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => 
                      isActive 
                        ? 'text-primary font-extrabold hover:text-primary-light transition duration-300 text-lg' 
                        : 'text-white font-semibold hover:text-primary transition duration-300 text-lg'
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Mobile Menu Button */}
          <button
            id="hamburger-btn"
            className="md:hidden text-white focus:outline-none"
            aria-label="메뉴 열기"
            onClick={toggleMobileMenu}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
      </header>
      
      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 z-50 transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className={`bg-dark w-80 h-full absolute right-0 p-6 transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <img 
                src="/holssi-logo.jpeg" 
                alt="Holssi Worship Logo" 
                className="h-8 w-8 rounded-full mr-2 object-cover"
              />
              <span className="text-lg font-bold text-white uppercase">HOLSSI WORSHIP</span>
            </div>
            <button
              id="mobile-menu-close-btn"
              className="text-white focus:outline-none"
              aria-label="메뉴 닫기"
              onClick={toggleMobileMenu}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414-1.414L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <nav className="block">
            <ul className="space-y-4">
              {navItems.map(item => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => 
                      `block text-xl py-2 ${isActive ? 'text-primary font-extrabold' : 'text-white font-semibold'} hover:text-primary transition duration-300`
                    }
                    onClick={toggleMobileMenu}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;