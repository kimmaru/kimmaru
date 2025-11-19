import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@200;300;400;500;600;700;900&display=swap');
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css');
  
  :root {
    --font-primary: 'Noto Serif KR', 'Pretendard', serif;
    --font-secondary: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    
    /* Dark Theme Color System - Black & Purple Website Design */
    --color-primary: #FFFFFF;        /* Pure white text for maximum contrast */
    --color-secondary: #B0B0B0;      /* Secondary text with softer contrast */
    --color-tertiary: #808080;       /* Subtle text and disabled states */
    
    --color-bg: #000000;             /* Pure black background */
    --color-surface: #0D0D0D;        /* Slightly elevated dark surface */
    --color-surface-variant: #1A1A1A; /* Card backgrounds and UI elements */
    --color-surface-elevated: #262626; /* Highest elevation surfaces */
    
    --color-accent: #6C3483;         /* Primary purple accent */
    --color-accent-light: #8E44AD;   /* Lighter purple for hover states */
    --color-accent-dark: #4A235A;    /* Darker purple for pressed states */
    
    --color-white: #FFFFFF;          /* Pure white for high contrast */
    --color-black: #000000;          /* Pure black background */
    --color-gray: #666666;           /* Medium gray */
    --color-light-gray: #1A1A1A;     /* Light surfaces in dark theme */
    
    /* Status Colors - Dark Theme Optimized */
    --color-success: #4CAF50;        /* Success green */
    --color-warning: #FF9800;        /* Warning orange */
    --color-error: #F44336;          /* Error red */
    
    /* Interactive States */
    --color-hover: rgba(108, 52, 131, 0.12);   /* Purple hover overlay */
    --color-pressed: rgba(108, 52, 131, 0.16); /* Purple pressed state overlay */
    --color-focus: rgba(108, 52, 131, 0.20);   /* Purple focus state overlay */
    
    /* Dark Theme Shadows - Elevated surfaces */
    --shadow-soft: 0 4px 20px rgba(0, 0, 0, 0.4);
    --shadow-medium: 0 8px 30px rgba(0, 0, 0, 0.5);
    --shadow-strong: 0 20px 60px rgba(0, 0, 0, 0.6);
    --shadow-key: 0 1px 3px rgba(0, 0, 0, 0.6), 0 8px 24px rgba(0, 0, 0, 0.4);
    
    /* Borders and Dividers */
    --border-color: rgba(245, 245, 245, 0.08);  /* Subtle borders */
    --border-color-strong: rgba(245, 245, 245, 0.16); /* More visible borders */
    
    --border-radius: 12px;
    --border-radius-lg: 20px;
    --border-radius-xl: 28px;
    
    --transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
    --transition-fast: all 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: var(--font-secondary);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.7;
    background: var(--color-bg);
    color: var(--color-primary);
    font-weight: 400;
    overflow-x: hidden;
    font-size: clamp(14px, 2.5vw, 16px);
  }

  a {
    text-decoration: none;
    color: inherit;
    transition: var(--transition);
  }

  button {
    border: none;
    background: none;
    cursor: pointer;
    font-family: inherit;
    transition: var(--transition);
    
    &:focus {
      outline: 2px solid var(--color-accent);
      outline-offset: 2px;
    }
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-primary);
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: -0.02em;
    color: var(--color-primary);
  }

  h1 {
    font-size: clamp(2.5rem, 5vw, 4.5rem);
    font-weight: 700;
    letter-spacing: -0.04em;
  }

  h2 {
    font-size: clamp(2rem, 4vw, 3.5rem);
    font-weight: 600;
    letter-spacing: -0.03em;
  }

  h3 {
    font-size: clamp(1.5rem, 3vw, 2.25rem);
    font-weight: 600;
  }

  h4 {
    font-size: clamp(1.25rem, 2.5vw, 1.75rem);
    font-weight: 500;
  }

  p {
    font-family: var(--font-secondary);
    line-height: 1.8;
    color: var(--color-secondary);
    font-weight: 400;
  }

  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 clamp(1rem, 4vw, 2rem);
  }

  .section {
    padding: clamp(4rem, 10vw, 8rem) 0;
  }

  .text-gradient {
    background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-light) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Custom scrollbar - Dark Theme */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--color-bg);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--color-surface-elevated);
    border-radius: 4px;
    border: 2px solid transparent;
    background-clip: content-box;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--color-accent);
    background-clip: content-box;
  }

  /* Selection - Dark Theme */
  ::selection {
    background: var(--color-accent);
    color: var(--color-white);
  }

  /* Focus styles - Dark Theme */
  :focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
    border-radius: 4px;
  }

  /* Enhanced responsive breakpoints */
  @media (max-width: 1200px) {
    html {
      font-size: 15px;
    }
  }

  @media (max-width: 768px) {
    html {
      font-size: 14px;
    }
    
    h1 {
      font-size: clamp(2rem, 6vw, 3.5rem);
    }
    
    h2 {
      font-size: clamp(1.5rem, 5vw, 2.5rem);
    }
    
    h3 {
      font-size: clamp(1.25rem, 4vw, 1.75rem);
    }
  }

  @media (max-width: 480px) {
    html {
      font-size: 13px;
    }
    
    body {
      line-height: 1.6;
    }
    
    h1 {
      font-size: clamp(1.75rem, 7vw, 2.5rem);
    }
    
    h2 {
      font-size: clamp(1.5rem, 6vw, 2rem);
    }
  }

  @media (max-width: 360px) {
    html {
      font-size: 12px;
    }
  }
`;

export const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'ghost' | 'text' }>`
  padding: 18px 36px;
  border-radius: var(--border-radius);
  font-size: 16px;
  font-weight: 500;
  font-family: var(--font-secondary);
  transition: var(--transition);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-transform: none;
  letter-spacing: 0.3px;
  position: relative;
  overflow: hidden;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: var(--color-accent);
          color: var(--color-white);
          border: none;
          box-shadow: var(--shadow-soft);
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-medium);
            background: var(--color-accent-light);
            filter: brightness(1.1);
          }
          
          &:active {
            transform: translateY(0);
            background: var(--color-accent-dark);
          }
          
          &:focus {
            outline: 2px solid var(--color-accent-light);
            outline-offset: 2px;
          }
        `;
      case 'secondary':
        return `
          background: var(--color-surface);
          color: var(--color-accent);
          border: 1px solid var(--color-accent);
          
          &:hover {
            background: var(--color-accent);
            color: var(--color-white);
            transform: translateY(-2px);
            box-shadow: var(--shadow-soft);
          }
          
          &:active {
            background: var(--color-accent-dark);
          }
        `;
      case 'ghost':
        return `
          background: var(--color-surface-variant);
          color: var(--color-primary);
          border: 1px solid var(--border-color);
          backdrop-filter: blur(10px);
          
          &:hover {
            background: var(--color-surface-elevated);
            border-color: var(--color-accent);
            transform: translateY(-1px);
            box-shadow: var(--shadow-soft);
          }
          
          &:active {
            background: var(--color-surface);
          }
        `;
      case 'text':
        return `
          background: transparent;
          color: var(--color-accent);
          border: none;
          padding: 8px 16px;
          font-size: 14px;
          text-decoration: underline;
          text-underline-offset: 4px;
          
          &:hover {
            color: var(--color-accent-light);
            text-decoration-thickness: 2px;
            background: var(--color-hover);
          }
          
          &:active {
            color: var(--color-accent-dark);
          }
        `;
      default:
        return `
          background: var(--color-accent);
          color: var(--color-white);
          border: none;
          
          &:hover {
            background: var(--color-accent-light);
            transform: translateY(-1px);
            filter: brightness(1.1);
          }
          
          &:active {
            background: var(--color-accent-dark);
          }
        `;
    }
  }}
  
  @media (max-width: 768px) {
    padding: 16px 32px;
    font-size: 14px;
  }
`;

export const Card = styled.div<{ hover?: boolean; variant?: 'default' | 'minimal' | 'glass' | 'elevated' }>`
  background: ${props => {
    switch (props.variant) {
      case 'minimal':
        return 'var(--color-surface)';
      case 'glass':
        return 'rgba(30, 30, 30, 0.8)';
      case 'elevated':
        return 'var(--color-surface-elevated)';
      default:
        return 'var(--color-surface-variant)';
    }
  }};
  backdrop-filter: ${props => props.variant === 'glass' ? 'blur(20px)' : 'none'};
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-soft);
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  color: var(--color-primary);
  
  ${props => props.hover && `
    &:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-strong);
      border-color: var(--border-color-strong);
      background: ${props.variant === 'elevated' ? 'var(--color-surface-elevated)' : 'var(--color-surface)'};
    }
  `}
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: var(--border-radius);
  }
`;

export const Title = styled.h2<{ variant?: 'primary' | 'secondary' | 'accent' }>`
  font-family: var(--font-primary);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 600;
  margin-bottom: 1rem;
  line-height: 1.2;
  letter-spacing: -0.02em;
  text-align: center;
  
  color: ${props => {
    switch (props.variant) {
      case 'secondary':
        return 'var(--color-secondary)';
      case 'accent':
        return 'var(--color-accent)';
      default:
        return 'var(--color-primary)';
    }
  }};
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const Subtitle = styled.p<{ size?: 'sm' | 'md' | 'lg' }>`
  font-family: var(--font-secondary);
  font-size: ${props => {
    switch (props.size) {
      case 'sm':
        return '0.95rem';
      case 'lg':
        return '1.25rem';
      default:
        return '1.125rem';
    }
  }};
  color: var(--color-secondary);
  line-height: 1.8;
  text-align: center;
  margin-bottom: 2rem;
  font-weight: 400;
  
  @media (max-width: 768px) {
    font-size: ${props => {
      switch (props.size) {
        case 'sm':
          return '0.9rem';
        case 'lg':
          return '1.125rem';
        default:
          return '1rem';
      }
    }};
    margin-bottom: 1.5rem;
  }
`;