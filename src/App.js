import React, { useState } from 'react';
import styled from 'styled-components';
import Player from './components/player';
import PlayerList from './components/PlayerList';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #121212;
`;

const LeftPanel = styled.div`
  width: 30%;
`;

const RightPanel = styled.div`
  width: 70%;
  overflow-y: auto;
`;

const App = () => {
  const [currentSong, setCurrentSong] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <AppContainer>
      <LeftPanel>
        <Player
          currentSong={currentSong}
          setCurrentSong={setCurrentSong}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
        />
      </LeftPanel>
      <RightPanel>
        <PlayerList
          currentSong={currentSong}
          isPlaying={isPlaying}
          setCurrentSong={setCurrentSong}
          setIsPlaying={setIsPlaying}
        />
      </RightPanel>
    </AppContainer>
  );
};

export default App;
