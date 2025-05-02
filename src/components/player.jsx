import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { songList } from '../data/SongList';

const Container = styled.div`
  padding: 20px;
  text-align: center;
  max-width: 500px;
  margin: auto;
  color: white;
  background-color: #121212;
  border-radius: 16px;
`;

const Cover = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
`;

const Title = styled.h2`
  margin: 15px 0;
`;

const Slider = styled.input.attrs({ type: 'range' })`
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  background: #facb4d;
  border-radius: 2px;
  outline: none;
  margin: 10px 0;
  transition: background 0.3s;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 14px;
    width: 14px;
    border-radius: 50%;
    background: white;
    transition: transform 0.2s;
  }

  &:hover::-webkit-slider-thumb {
    transform: scale(1.3);
  }

  &::-moz-range-thumb {
    height: 14px;
    width: 14px;
    border-radius: 50%;
    background: white;
    transition: transform 0.2s;
  }

  &:hover::-moz-range-thumb {
    transform: scale(1.3);
  }
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 15px 0;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: white;
`;

const VolumeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
`;

const formatTime = (seconds) => {
  if (isNaN(seconds)) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${secs}`;
};

const Player = ({ currentSong, setCurrentSong, isPlaying, setIsPlaying }) => {
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [dragTime, setDragTime] = useState(null);
  const song = songList[currentSong];

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    setCurrentSong((prev) => (prev + 1) % songList.length);
  };

  const handlePrev = () => {
    setCurrentSong((prev) => (prev - 1 + songList.length) % songList.length);
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => setProgress(audio.currentTime);
    const handleEnded = () => handleNext();

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    audio.load();
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSong, isPlaying]);

  return (
    <Container>
      <audio ref={audioRef} src={song.file} />
      <Cover src={song.cover} alt="Portada" />
      <Title>{song.title}</Title>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ width: 40, fontSize: '14px' }}>
          {formatTime(dragTime !== null ? dragTime : progress)}
        </span>

        <Slider
          min="0"
          max={audioRef.current?.duration || 0}
          value={dragTime !== null ? dragTime : progress}
          onChange={(e) => setDragTime(Number(e.target.value))}
          onMouseUp={(e) => {
            const value = Number(e.target.value);
            audioRef.current.currentTime = value;
            setProgress(value);
            setDragTime(null);
          }}
          onTouchEnd={(e) => {
            const value = Number(e.target.value);
            audioRef.current.currentTime = value;
            setProgress(value);
            setDragTime(null);
          }}
        />

        <span style={{ width: 40, textAlign: 'right', fontSize: '14px' }}>
          {formatTime(audioRef.current?.duration || 0)}
        </span>
      </div>

      <Controls>
        <IconButton onClick={handlePrev}>
          <motion.div whileTap={{ scale: 0.8 }}>
            <SkipBack size={36} />
          </motion.div>
        </IconButton>

        <IconButton onClick={handlePlayPause}>
          <AnimatePresence mode="wait">
            {isPlaying ? (
              <motion.div
                key="pause"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Pause size={36} />
              </motion.div>
            ) : (
              <motion.div
                key="play"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Play size={36} />
              </motion.div>
            )}
          </AnimatePresence>
        </IconButton>

        <IconButton onClick={handleNext}>
          <motion.div whileTap={{ scale: 0.8 }}>
            <SkipForward size={36} />
          </motion.div>
        </IconButton>
      </Controls>

      <VolumeContainer>
        <Volume2 size={20} />
        <Slider
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
        />
      </VolumeContainer>
    </Container>
  );
};

export default Player;
