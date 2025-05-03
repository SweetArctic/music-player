import React, { useRef, useState, useCallback } from 'react';
import styled from 'styled-components';
import { Volume, Volume1, Volume2, VolumeX } from 'lucide-react';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Container = styled.div`
  width: 20%;
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
  width: ${({ volume }) => `${volume}%`};
  transition: width 0.05s ease-out;
`;

const Thumb = styled.div`
  position: absolute;
  top: 50%;
  left: ${({ volume }) => `${volume}%`};
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

export default function CustomVolumeControl({ volume, setVolume }) {
  const containerRef = useRef(null);
  const [previousVolume, setPreviousVolume] = useState(volume);
  const [isDragging, setIsDragging] = useState(false);
  const isMuted = volume === 0;

  const updateVolume = useCallback((e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newVolume = Math.min(1, Math.max(0, x / rect.width));
    setVolume(newVolume);
  }, [setVolume]);

  const handleMouseDown = () => {
    setIsDragging(true);

    const handleMove = (e) => requestAnimationFrame(() => updateVolume(e));
    const handleUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(previousVolume || 0.5);
    } else {
      setPreviousVolume(volume);
      setVolume(0);
    }
  };

  const getIcon = () => {
    if (isMuted || volume === 0) return <VolumeX size={20} />;
    if (volume < 0.25) return <Volume size={20} />;
    if (volume < 0.5) return <Volume1 size={20} />;
    return <Volume2 size={20} />;
  };

  return (
    <Wrapper>
      <div onClick={toggleMute} style={{ cursor: 'pointer' }}>
        {getIcon()}
      </div>
      <Container
        ref={containerRef}
        onClick={updateVolume}
        onMouseDown={handleMouseDown}
      >
        <Fill volume={volume * 100} />
        <Thumb volume={volume * 100} isDragging={isDragging} />
      </Container>
    </Wrapper>
  );
}
