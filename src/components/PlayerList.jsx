import React from 'react';
import styled from 'styled-components';
import { Play, Pause } from 'lucide-react';
import { songList } from '../data/SongList';
import AnimatedGradientText from '../components/animata/text/animated-gradient-text';

const Container = styled.div`
  padding: 20px;
  color: white;
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  background-color: ${({ $active }) => ($active ? '#FACB4D' : '#F6644F')};
  padding: 10px;
  border-radius: 8px;
  position: relative;
  color: black;
`;

const CoverWrapper = styled.div`
  position: relative;
  width: 50px;
  height: 50px;
  margin-right: 15px;
`;

const Cover = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s;
  border-radius: 4px;

  ${CoverWrapper}:hover & {
    opacity: 1;
  }
`;

const Wave = styled.div`
  width: 40px;
  height: 40px;
  background-image: url('/animated/audiograma.gif');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  opacity: ${({ $isPlaying }) => ($isPlaying ? 1 : 0)};
  transition: opacity 0.4s ease;
`;

const Info = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Title = styled.span`
  font-weight: bold;
`;

const PlayButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.2);
  }
`;

const PlayerList = ({ currentSong, setCurrentSong, isPlaying, setIsPlaying }) => {
  const handleToggle = (index) => {
    if (currentSong === index) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(index);
      setIsPlaying(true);
    }
  };

  return (
    <Container>

    <AnimatedGradientText className="text-6xl" style={{ marginBottom: '20px' }}>
        Player Max
    </AnimatedGradientText>

      {songList.map((song, index) => (
        <ListItem key={index} $active={currentSong === index}>
          <CoverWrapper>
            <Cover src={song.cover} alt={song.title} />
            <Overlay>
              <PlayButton onClick={() => handleToggle(index)}>
                {currentSong === index && isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </PlayButton>
            </Overlay>
          </CoverWrapper>
          <Info>
            <Title>{song.title}</Title>
          </Info>
          {currentSong === index && <Wave $isPlaying={isPlaying} />}
        </ListItem>
      ))}
    </Container>
  );
};

export default PlayerList;
