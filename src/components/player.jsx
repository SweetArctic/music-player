import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Play, Pause, SkipForward, SkipBack, Volume2, Repeat, Shuffle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { songList } from '../data/SongList';
import CustomProgressBar from './CustomProgressBar';
import CustomVolumeControl from './CustomVolumeControl';

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
  width: 100%;
  height: 6px;
  background: #3a3a3a;
  border-radius: 3px;
  appearance: none;
  outline: none;
  cursor: pointer;
  position: relative;

  &::-webkit-slider-runnable-track {
    height: 6px;
    background: #3a3a3a;
    border-radius: 3px;
  }

  &::-webkit-slider-thumb {
    appearance: none;
    background: #cfcfcf;
    border: none;
    border-radius: 50%;
    width: 12px;
    height: 12px;
    margin-top: -3px; /* Centra el thumb verticalmente */
    transition: transform 0.2s ease;
    opacity: 0;
  }

  &:hover::-webkit-slider-thumb {
    opacity: 1;
  }

  &::-moz-range-track {
    height: 6px;
    background: #3a3a3a;
    border-radius: 3px;
  }

  &::-moz-range-progress {
    background: #cfcfcf;
    height: 6px;
    border-radius: 3px;
  }

  &::-moz-range-thumb {
    background: #cfcfcf;
    border: none;
    border-radius: 50%;
    width: 12px;
    height: 12px;
    transition: transform 0.2s ease;
    opacity: 0;
  }

  &:hover::-moz-range-thumb {
    opacity: 1;
  }

  &::-ms-fill-lower {
    background: #cfcfcf;
    border-radius: 3px;
  }

  &::-ms-fill-upper {
    background: #3a3a3a;
    border-radius: 3px;
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
  const [isLoop, setIsLoop] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  const song = songList[currentSong];

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    if (isShuffle) {
      let next;
      do {
        next = Math.floor(Math.random() * songList.length);
      } while (next === currentSong);
      setCurrentSong(next);
    } else {
      setCurrentSong((prev) => (prev + 1) % songList.length);
    }
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

    audio.loop = isLoop;

    const updateProgress = () => setProgress(audio.currentTime);
    const handleEnded = () => {
      if (!audio.loop) handleNext();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    // Solo se hace play si isPlaying es true, pero no se hace load()
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSong, isPlaying, isLoop]);

  return (
    <Container>
      <audio ref={audioRef} src={song.file} />
      <Cover src={song.cover} alt="Portada" />
      <Title>{song.title}</Title>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ width: 40, fontSize: '14px' }}>
          {formatTime(dragTime !== null ? dragTime : progress)}
        </span>

        <CustomProgressBar
        currentTime={progress}
        duration={audioRef.current?.duration || 0}
        onChange={(time) => {
            audioRef.current.currentTime = time;
            setProgress(time);
        }}
        />

        <span style={{ width: 40, textAlign: 'right', fontSize: '14px' }}>
          {formatTime(audioRef.current?.duration || 0)}
        </span>
      </div>

      <Controls>
        <IconButton onClick={() => setIsLoop(!isLoop)} title="Bucle">
          <Repeat size={24} color={isLoop ? '#FACB4D' : 'white'} />
        </IconButton>

        <IconButton onClick={handlePrev}>
          <motion.div whileTap={{ scale: 0.8 }}>
            <SkipBack size={36} />
          </motion.div>
        </IconButton>

        <IconButton onClick={handlePlayPause}>
          <AnimatePresence mode="wait">
            {isPlaying ? (
              <motion.div key="pause" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Pause size={36} />
              </motion.div>
            ) : (
              <motion.div key="play" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.2 }}>
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

        <IconButton onClick={() => setIsShuffle(!isShuffle)} title="Aleatorio">
          <Shuffle size={24} color={isShuffle ? '#FACB4D' : 'white'} />
        </IconButton>
      </Controls>

      <CustomVolumeControl volume={volume} setVolume={(v) => {
        setVolume(v);
        audioRef.current.volume = v;
        }} />
    </Container>
  );
};

export default Player;
