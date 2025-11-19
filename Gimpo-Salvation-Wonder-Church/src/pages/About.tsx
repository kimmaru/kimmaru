import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Title, Subtitle } from '../styles/GlobalStyles';

const AboutContainer = styled.div`
  min-height: 100vh;
  background: var(--color-bg);
  padding-top: 80px;
`;



const ContentSection = styled.section`
  padding: 8rem 0;
  background: var(--color-bg);
  position: relative;
`;

const ContentContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
`;

const ChurchDescription = styled(motion.div)`
  background: var(--color-surface-variant);
  padding: 4rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-medium);
  margin: 2rem 0;
  transition: var(--transition);
  border: 1px solid var(--border-color);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-strong);
    border-color: var(--color-accent);
  }
  
  .description-text {
    font-size: 1.2rem;
    line-height: 2;
    color: var(--color-secondary);
    margin-bottom: 2rem;
    font-family: var(--font-secondary);
    
    &.highlight {
      color: var(--color-accent);
      font-weight: 500;
      font-family: var(--font-primary);
      background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-light) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }
`;

const About: React.FC = () => {
  return (
    <AboutContainer>
      {/* Content Section */}
      <ContentSection>
        <ContentContainer>
          <Title style={{ marginBottom: '2rem' }}>
            김포 구원의감격교회
          </Title>
          <Subtitle style={{ marginBottom: '4rem' }}>
            우리는 다시 복음 앞에 섭니다
          </Subtitle>
          
          <ChurchDescription
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="description-text highlight">
              "구원의 감격이 식어버린 시대에, 우리는 다시 복음 앞에 섭니다."
            </p>
            <p className="description-text">
              이곳은 처음 예수님을 만났던 그 벅찬 감동을 다시 회복하고,<br />
              그 감격을 삶으로 살아내는 사람들의 공동체입니다.
            </p>
          </ChurchDescription>
        </ContentContainer>
      </ContentSection>
    </AboutContainer>
  );
};

export default About;