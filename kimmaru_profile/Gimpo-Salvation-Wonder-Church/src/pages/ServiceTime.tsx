import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Title, Subtitle } from '../styles/GlobalStyles';

const ServiceTimeContainer = styled.div`
  min-height: 100vh;
  background: var(--color-bg);
  padding-top: 80px;
`;



const MainServiceSection = styled.section`
  padding: 8rem 0;
  background: var(--color-bg);
  position: relative;
`;

const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const ServiceCard = styled(motion.div)`
  background: var(--color-white);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.4s ease;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-strong);
  }
`;

const ServiceImageHeader = styled.div<{ bgImage: string }>`
  height: 200px;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%),
              url(${props => props.bgImage}) center/cover;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-white);
  transition: all 0.3s ease;
  
  h3 {
    font-family: var(--font-primary);
    font-size: 1.8rem;
    font-weight: 500;
    text-align: center;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  }
`;

const ServiceContent = styled.div`
  padding: 2rem;
  
  .service-times {
    margin-bottom: 1.5rem;
    
    .time-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid var(--color-light-gray);
      
      &:last-child {
        border-bottom: none;
      }
      
      .time-label {
        font-weight: 500;
        color: var(--color-black);
      }
      
      .time-value {
        color: var(--color-secondary);
        font-size: 0.95rem;
      }
    }
  }
  
  .service-description {
    color: var(--color-secondary);
    line-height: 1.6;
    font-size: 0.95rem;
  }
`;

const WeeklyScheduleSection = styled.section`
  background: var(--color-black);
  color: var(--color-white);
  padding: 8rem 0;
`;

const ScheduleContent = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const ScheduleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const DayCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  h3 {
    font-family: var(--font-primary);
    font-size: 1.5rem;
    font-weight: 500;
    margin-bottom: 1.5rem;
    color: var(--color-white);
  }
  
  .events {
    .event-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      
      &:last-child {
        border-bottom: none;
      }
      
      .event-name {
        color: var(--color-white);
        font-weight: 400;
      }
      
      .event-time {
        color: rgba(255, 255, 255, 0.7);
        font-size: 0.9rem;
      }
    }
  }
`;

const LocationSection = styled.section`
  padding: 8rem 0;
  background: var(--color-light-gray);
`;

const LocationContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const LocationGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const LocationInfo = styled(motion.div)`
  h3 {
    font-family: var(--font-primary);
    font-size: 2rem;
    font-weight: 500;
    margin-bottom: 2rem;
    color: var(--color-black);
  }
  
  .info-item {
    display: flex;
    align-items: center;
    margin-bottom: 1.5rem;
    
    .icon {
      width: 40px;
      height: 40px;
      background: var(--color-black);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 1rem;
      color: var(--color-white);
      font-size: 1.1rem;
    }
    
    .info-text {
      color: var(--color-secondary);
      line-height: 1.6;
    }
  }
`;

const MapPlaceholder = styled(motion.div)`
  background: var(--color-white);
  border-radius: 16px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-secondary);
  font-size: 1.1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
`;

const ContactSection = styled.section`
  padding: 6rem 0;
  background: var(--color-bg);
`;

const ContactContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const ContactCard = styled(motion.div)`
  background: var(--color-white);
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  
  .icon {
    width: 50px;
    height: 50px;
    background: var(--color-black);
    border-radius: 50%;
    margin: 0 auto 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-white);
    font-size: 1.2rem;
  }
  
  h4 {
    font-family: var(--font-primary);
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    color: var(--color-black);
  }
  
  p {
    color: var(--color-secondary);
    font-size: 0.95rem;
  }
`;

const ServiceTime: React.FC = () => {
  return (
    <ServiceTimeContainer>
      {/* Main Services */}
      <MainServiceSection>
        <Title style={{ textAlign: 'center', marginBottom: '1rem' }}>
          주일 예배
        </Title>
        <Subtitle style={{ textAlign: 'center', marginBottom: '4rem' }}>
          매주 주일, 함께 하나님께 예배드립니다
        </Subtitle>

        <ServiceGrid>
          <ServiceCard
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <ServiceImageHeader bgImage="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=300&fit=crop">
              <h3>1부 예배</h3>
            </ServiceImageHeader>
            <ServiceContent>
              <div className="service-times">
                <div className="time-item">
                  <span className="time-label">시간</span>
                  <span className="time-value">오전 9:00</span>
                </div>
                <div className="time-item">
                  <span className="time-label">장소</span>
                  <span className="time-value">본당</span>
                </div>
                <div className="time-item">
                  <span className="time-label">특징</span>
                  <span className="time-value">조용한 분위기</span>
                </div>
              </div>
              <p className="service-description">
                이른 시간에 드리는 예배로, 조용하고 경건한 분위기에서 
                하나님과 깊이 만날 수 있는 시간입니다.
              </p>
            </ServiceContent>
          </ServiceCard>

          <ServiceCard
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <ServiceImageHeader bgImage="https://images.unsplash.com/photo-1511795409831-e13d15efd8a0?w=600&h=300&fit=crop">
              <h3>2부 예배</h3>
            </ServiceImageHeader>
            <ServiceContent>
              <div className="service-times">
                <div className="time-item">
                  <span className="time-label">시간</span>
                  <span className="time-value">오전 11:00</span>
                </div>
                <div className="time-item">
                  <span className="time-label">장소</span>
                  <span className="time-value">본당</span>
                </div>
                <div className="time-item">
                  <span className="time-label">특징</span>
                  <span className="time-value">대예배</span>
                </div>
              </div>
              <p className="service-description">
                가장 많은 성도들이 함께하는 대예배입니다. 
                풍성한 찬양과 말씀으로 하나님께 영광 돌립니다.
              </p>
            </ServiceContent>
          </ServiceCard>

          <ServiceCard
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <ServiceImageHeader bgImage="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=300&fit=crop">
              <h3>온 가족 예배</h3>
            </ServiceImageHeader>
            <ServiceContent>
              <div className="service-times">
                <div className="time-item">
                  <span className="time-label">시간</span>
                  <span className="time-value">매월 첫째 주일</span>
                </div>
                <div className="time-item">
                  <span className="time-label">장소</span>
                  <span className="time-value">본당</span>
                </div>
                <div className="time-item">
                  <span className="time-label">특징</span>
                  <span className="time-value">통합 예배</span>
                </div>
              </div>
              <p className="service-description">
                모든 세대가 함께 드리는 통합 예배입니다. 
                어린이부터 어른까지 함께 하나님께 예배드립니다.
              </p>
            </ServiceContent>
          </ServiceCard>
        </ServiceGrid>
      </MainServiceSection>

      {/* Weekly Schedule */}
      <WeeklyScheduleSection>
        <ScheduleContent>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Title style={{ textAlign: 'center', color: 'var(--color-white)', marginBottom: '1rem' }}>
              주간 예배 일정
            </Title>
            <Subtitle style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0' }}>
              일주일 내내 하나님과 만나는 시간들
            </Subtitle>
          </motion.div>

          <ScheduleGrid>
            <DayCard
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3>월-금</h3>
              <div className="events">
                <div className="event-item">
                  <span className="event-name">새벽기도회</span>
                  <span className="event-time">오전 5:30</span>
                </div>
              </div>
            </DayCard>

            <DayCard
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3>수요일</h3>
              <div className="events">
                <div className="event-item">
                  <span className="event-name">새벽기도회</span>
                  <span className="event-time">오전 5:30</span>
                </div>
                <div className="event-item">
                  <span className="event-name">수요예배</span>
                  <span className="event-time">저녁 8:00</span>
                </div>
              </div>
            </DayCard>

            <DayCard
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3>금요일</h3>
              <div className="events">
                <div className="event-item">
                  <span className="event-name">새벽기도회</span>
                  <span className="event-time">오전 5:30</span>
                </div>
                <div className="event-item">
                  <span className="event-name">금요기도회</span>
                  <span className="event-time">밤 9:00</span>
                </div>
              </div>
            </DayCard>

            <DayCard
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h3>토요일</h3>
              <div className="events">
                <div className="event-item">
                  <span className="event-name">새벽기도회</span>
                  <span className="event-time">오전 6:00</span>
                </div>
                <div className="event-item">
                  <span className="event-name">청소년부 예배</span>
                  <span className="event-time">저녁 7:00</span>
                </div>
              </div>
            </DayCard>

            <DayCard
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <h3>주일</h3>
              <div className="events">
                <div className="event-item">
                  <span className="event-name">1부 예배</span>
                  <span className="event-time">오전 9:00</span>
                </div>
                <div className="event-item">
                  <span className="event-name">2부 예배</span>
                  <span className="event-time">오전 11:00</span>
                </div>
                <div className="event-item">
                  <span className="event-name">대학청년부</span>
                  <span className="event-time">오후 1:00</span>
                </div>
              </div>
            </DayCard>

            <DayCard
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <h3>다음세대</h3>
              <div className="events">
                <div className="event-item">
                  <span className="event-name">유아유치부</span>
                  <span className="event-time">주일 11:00</span>
                </div>
                <div className="event-item">
                  <span className="event-name">유초등부</span>
                  <span className="event-time">주일 11:00</span>
                </div>
                <div className="event-item">
                  <span className="event-name">청소년부</span>
                  <span className="event-time">토요일 19:00</span>
                </div>
              </div>
            </DayCard>
          </ScheduleGrid>
        </ScheduleContent>
      </WeeklyScheduleSection>


    </ServiceTimeContainer>
  );
};

export default ServiceTime;