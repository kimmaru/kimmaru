import React from 'react';
import styled from 'styled-components';

interface CountTextProps {
  count: number;
  total: number;
}

const Container = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
  
  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 10px;
  }
`;

const Text = styled.span`
  font-size: 16px;
  color: #555;
`;

const NumberText = styled.span`
  font-weight: bold;
  color: #4a90e2;
  margin: 0 3px;
`;

const CountText: React.FC<CountTextProps> = ({ count, total }) => {
  return (
    <Container>
      <Text>
        전체 <NumberText>{total}</NumberText>명 중 
        <NumberText>{count}</NumberText>명 표시 중
      </Text>
    </Container>
  );
};

export default CountText; 