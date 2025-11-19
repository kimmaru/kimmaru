import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {} from '../styles/GlobalStyles';

const PastorContainer = styled.div`
  min-height: 100vh;
  background: var(--color-bg);
  padding-top: 80px;
`;



const MainContent = styled.section`
  padding: 8rem 0;
  background: var(--color-bg);
  position: relative;
`;

const ContentContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const PastorInfo = styled(motion.div)`
  text-align: center;
  margin-bottom: 4rem;
  
  .pastor-title {
    font-family: var(--font-primary);
    font-size: 1.5rem;
    font-weight: 500;
    color: var(--color-primary);
    margin-bottom: 0.5rem;
  }
  
  .pastor-name {
    font-size: 1.2rem;
    color: var(--color-accent);
    font-weight: 600;
  }
`;

const GreetingContent = styled(motion.div)`
  background: var(--color-surface-variant);
  padding: 4rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-medium);
  transition: var(--transition);
  border: 1px solid var(--border-color);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-strong);
    border-color: var(--color-accent);
  }
  
  .greeting-text {
    line-height: 1.8;
    
    p {
      font-size: 1.1rem;
      margin-bottom: 2rem;
      color: var(--color-secondary);
      
      &.greeting-highlight {
        background: var(--color-surface-elevated);
        padding: 1.5rem;
        border-left: 4px solid var(--color-accent);
        border-radius: 0 var(--border-radius) var(--border-radius) 0;
        font-weight: 500;
        color: var(--color-primary);
        font-style: italic;
        box-shadow: var(--shadow-soft);
      }
      
      &.greeting-emphasis {
        font-weight: 600;
        color: var(--color-accent);
        text-align: center;
        font-size: 1.2rem;
        background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-light) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }
  }
  
  .signature {
    margin-top: 3rem;
    text-align: right;
    padding-top: 2rem;
    border-top: 1px solid var(--border-color);
    
    .name {
      font-family: var(--font-primary);
      font-size: 1.3rem;
      font-weight: 500;
      color: var(--color-primary);
    }
    
    .title {
      font-size: 1rem;
      color: var(--color-secondary);
      margin-top: 0.5rem;
    }
  }
`;

const PastorGreeting: React.FC = () => {
  return (
    <PastorContainer>
      {/* Main Content */}
      <MainContent>
        <ContentContainer>
          <PastorInfo
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="pastor-title">김포 구원의감격교회 담임목사</div>
            <div className="pastor-name">조현수 목사</div>
          </PastorInfo>

          <GreetingContent
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="greeting-text">
              <p>안녕하세요!</p>
              
              <p>김포 구원의감격교회를 섬기고 있는 담임목사 조현수입니다.</p>

              <p>우선, 저희 교회 홈페이지를 방문해 주신 여러분을 주님의 사랑과, 따뜻한 마음으로 환영합니다.</p>

              <p>저희 교회의 이름은 좀 길지만, 이유가 분명합니다. "구원의 감격"—이 단어 하나면, 교회의 존재 이유가 설명됩니다.</p>

              <p>누구나 처음 예수님을 만났을 때 가슴 벅찬 감동이 있었을 겁니다. 처음 예수님을 만났을 때 그 벅찬 감격, 요즘은 잘 느껴지시나요? 혹시 그 감격이 일상 속 바쁨에 살짝 묻혀 있지는 않으신가요?</p>

              <p className="greeting-highlight">
                김포 구원의감격교회는 그 감격을 다시 회복하고, 또 새롭게 발견하는 교회입니다.
              </p>

              <p>하나님의 말씀 속에서, 예배의 자리에서, 삶의 구석구석에서 잊고 지내던 그 놀라운 은혜를 "다시 느끼게" 하고 "다시 뜨겁게" 해 드리는 게 저희 교회의 사명입니다.</p>

              <p>예배는 딱딱하지 않지만, 진지하고<br />
              성도들은 조용하지만, 따뜻하며<br />
              목회자는 완벽하지 않지만, 말씀을 전할 때만큼은 언제나 진심입니다.</p>

              <p>혹시 요즘 신앙생활이 건조하고 무미건조하셨다면, 이곳에서 다시 한번 성령의 단비와 구원의 떨림을 느껴보세요.</p>

              <p className="greeting-emphasis">
                "다시 복음으로, 다시 감격으로!"<br />
                김포 구원의감격교회는 여러분을 기다리고 있습니다.
              </p>

              <p>늘 주님의 은혜와 감격이 여러분의 삶 속에 충만하길 축복합니다.</p>
            </div>

            <div className="signature">
              <div className="name">담임목사 조현수 드림</div>
              <div className="title">하나님의 은혜 안에서</div>
            </div>
          </GreetingContent>
        </ContentContainer>
      </MainContent>
    </PastorContainer>
  );
};

export default PastorGreeting;