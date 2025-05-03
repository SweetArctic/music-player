import React, { useRef, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  height: 8px;
  background-color: #3a3a3a;
  border-radius: 6px;
  position: relative;
  cursor: pointer;
`;

const Fill = styled.div`
  height: 100%;
  background-color: #cfcfcf;
  border-radius: 6px 0 0 6px;
  width: ${({ progress }) => `${progress}%`};
  transition: width 0.05s ease-out;
`;

const Thumb = styled.div`
  position: absolute;
  top: 50%;
  left: ${({ progress }) => `${progress}%`};
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  background-color: #cfcfcf;
  border-radius: 50%;
  opacity: ${({ isDragging }) => (isDragging ? 0 : 0)};
  pointer-events: none;

  ${Container}:hover & {
    opacity: ${({ isDragging }) => (isDragging ? 0 : 1)};
  }
`;

export default function CustomProgressBar({ currentTime, duration, onChange }) {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const percentage = duration ? (currentTime / duration) * 100 : 0;

  const updateTime = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newTime = (x / rect.width) * duration;
    onChange(newTime);
  };

  const handleMouseDown = () => {
    setIsDragging(true);

    const handleMove = (e) => requestAnimationFrame(() => updateTime(e));
    const handleUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  };

  return (
    <Container
      ref={containerRef}
      onClick={updateTime}
      onMouseDown={handleMouseDown}
    >
      <Fill progress={percentage} />
      <Thumb progress={percentage} isDragging={isDragging} />
    </Container>
  );
}
