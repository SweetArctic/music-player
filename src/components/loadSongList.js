export const baseSongList = [
    { title: 'The Blonde - Tv Girl', file: '/song1.mp3', cover: '/pics/pic1.png' },
    { title: 'Juliet - Cavetown', file: '/song2.mp3', cover: '/pics/pic2.jpg' },
    { title: 'Rosemary - Deftones', file: '/song3.mp3', cover: '/pics/pic3.png' },
    { title: 'Labyrinth - Miracle Music', file: '/song4.mp3', cover: '/pics/pic4.jpg' },
  ];
  
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
  };
  
  const getDuration = (filePath) =>
    new Promise((resolve) => {
      const audio = new Audio(filePath);
      audio.addEventListener('loadedmetadata', () => {
        resolve(formatDuration(audio.duration));
      });
      audio.addEventListener('error', () => {
        resolve("0:00");
      });
    });
  
  export async function loadSongListWithDuration() {
    const songsWithDurations = await Promise.all(
      baseSongList.map(async (song) => {
        const duration = await getDuration(song.file);
        return { ...song, duration };
      })
    );
    return songsWithDurations;
  }
  