import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const FooterContainer = styled.footer`
  background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-variant) 50%, var(--color-surface-elevated) 100%);
  color: var(--color-primary);
  padding: clamp(1.5rem, 4vw, 2rem) 0 0.5rem;
  margin-top: auto;
  position: relative;
  overflow: hidden;
  border-top: 1px solid var(--border-color);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F5F5F5' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
    opacity: 0.5;
  }
`;

const FooterContent = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(1rem, 4vw, 2rem);
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: clamp(1rem, 3vw, 2rem);
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    text-align: center;
  }
`;

const FooterSection = styled.div`
  h3 {
    font-size: clamp(1rem, 2.5vw, 1.1rem);
    margin-bottom: clamp(0.5rem, 2vw, 1rem);
    color: var(--color-primary);
    font-weight: 700;
    letter-spacing: -0.01em;
    font-family: var(--font-primary);
  }
  
  p {
    color: var(--color-secondary);
    line-height: 1.6;
    margin-bottom: clamp(0.25rem, 1vw, 0.5rem);
    font-size: clamp(0.8rem, 2vw, 0.9rem);
    font-weight: 400;
  }
  
  a {
    color: var(--color-secondary);
    transition: var(--transition-fast);
    
    &:hover {
      color: var(--color-accent);
      text-decoration: underline;
    }
  }
`;

const ServiceTimeSection = styled(FooterSection)`
  .service-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(0.25rem, 1vw, 0.5rem);
    
    @media (max-width: 480px) {
      grid-template-columns: 1fr;
      gap: 0.25rem;
    }
  }
  
  p {
    font-size: clamp(0.9rem, 2.2vw, 1.1rem);
    margin-bottom: clamp(0.2rem, 0.8vw, 0.4rem);
    
    strong {
      color: var(--color-primary);
      font-weight: 600;
      display: block;
      margin-bottom: 2px;
    }
  }
`;

const ChurchInfo = styled(FooterSection)`
  h3 {
    font-size: clamp(1.2rem, 3vw, 1.4rem);
    margin-bottom: clamp(0.5rem, 1.5vw, 0.75rem);
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .slogan {
    font-size: clamp(0.8rem, 2vw, 0.95rem);
    color: var(--color-secondary);
    font-style: italic;
    margin-bottom: clamp(0.5rem, 2vw, 1rem);
    line-height: 1.5;
    font-family: var(--font-primary);
  }
  
  .denomination {
    display: inline-block;
    padding: clamp(0.3rem, 1vw, 0.4rem) clamp(0.6rem, 2vw, 0.8rem);
    background: var(--color-surface-variant);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    font-size: clamp(0.7rem, 1.8vw, 0.8rem);
    font-weight: 600;
    letter-spacing: 0.5px;
    backdrop-filter: blur(10px);
    margin-top: clamp(0.5rem, 1.5vw, 0.75rem);
    color: var(--color-accent);
    transition: var(--transition-fast);
    
    &:hover {
      background: var(--color-accent);
      color: var(--color-white);
      transform: translateY(-1px);
    }
  }
`;

const ContactInfo = styled(FooterSection)`
  .contact-item {
    margin-bottom: clamp(0.8rem, 2vw, 1.2rem);
    transition: var(--transition-fast);
    
    .content {
      strong {
        color: var(--color-accent);
        font-size: clamp(0.9rem, 2.2vw, 1.1rem);
        font-weight: 600;
        display: block;
        margin-bottom: 0.5rem;
      }
      
      p {
        font-size: clamp(0.85rem, 2vw, 1rem);
        line-height: 1.5;
        margin: 0;
      }
      
      a {
        color: var(--color-primary);
        text-decoration: none;
        transition: var(--transition-fast);
        
        &:hover {
          color: var(--color-accent);
        }
        
        p {
          margin: 0;
        }
      }
    }
    
    @media (max-width: 768px) {
      text-align: left;
    }
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid var(--border-color);
  margin-top: clamp(0.5rem, 2vw, 1rem);
  padding-top: clamp(0.4rem, 1.5vw, 0.8rem);
  text-align: center;
  color: var(--color-tertiary);
  font-size: clamp(0.6rem, 1.5vw, 0.7rem);
  position: relative;
  z-index: 2;
  min-height: clamp(20px, 5vw, 24px);
  line-height: 1.2;
  
  .footer-links {
    display: flex;
    justify-content: center;
    gap: clamp(0.5rem, 2vw, 1rem);
    margin-bottom: clamp(0.1rem, 0.5vw, 0.2rem);
    flex-wrap: wrap;
    
    a {
      color: var(--color-secondary);
      font-size: clamp(0.65rem, 1.8vw, 0.75rem);
      transition: var(--transition-fast);
      padding: clamp(0.05rem, 0.5vw, 0.1rem) clamp(0.2rem, 1vw, 0.3rem);
      border-radius: var(--border-radius);
      
      &:hover {
        color: var(--color-accent);
        background: var(--color-hover);
        transform: translateY(-1px);
      }
    }
    
    @media (max-width: 768px) {
      flex-direction: row;
      gap: clamp(0.2rem, 1vw, 0.4rem);
      margin-bottom: clamp(0.05rem, 0.3vw, 0.15rem);
    }
  }
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <ChurchInfo>
                         <h3>김포 구원의감격교회</h3>
          <div className="slogan">
            "구원의 감격이 식어버린 시대에,<br />
            우리는 다시 복음 앞에 섭니다."
          </div>
          <p>
            이곳은 처음 예수님을 만났던 그 벅찬 감동을 다시 회복하고,<br />
            그 감격을 삶으로 살아내는 사람들의 공동체입니다.
          </p>
          <div className="denomination">대한예수교장로회 합동</div>
        </ChurchInfo>
        
        <ServiceTimeSection>
          <h3>예배시간</h3>
          <div className="service-grid">
            <p><strong>주일예배</strong>오전 11시</p>
          </div>
        </ServiceTimeSection>
        
        <ContactInfo>
          <div className="contact-item">
            <div className="content">
              <strong>YouTube :</strong>
              <a href="https://www.youtube.com/@Joy_of_salvation_kp/featured" target="_blank" rel="noopener noreferrer">
                <p>김포 구원의감격교회 채널</p>
              </a>
            </div>
          </div>
          <div className="contact-item">
            <div className="content">
              <strong>위치 :</strong>
              <p>경기 김포시 김포한강11로255번길 97 2층</p>
            </div>
          </div>
        </ContactInfo>
      </FooterContent>
      
      <FooterBottom>
        <div className="footer-links">
          <a href="/about">교회소개</a>
          <a href="/sermon">설교</a>
          <a href="/media">미디어</a>
          <a href="/contact">연락처</a>
        </div>
                     <p>&copy; 2025 김포 구원의감격교회. All rights reserved.</p>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;