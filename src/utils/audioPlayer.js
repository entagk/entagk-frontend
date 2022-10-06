const audioPlayer = ({ src, volume = 0.5, loop = false}) => {
  const audio = new Audio();
  audio.src = src;
  audio.volume = volume;

  audio.loop = loop;

  const handlePlay = () => {
    if (audio.paused || !audio.currentTime) {
      audio.play().catch(() => {});
    }
  };

  const handleStop = () => {
    audio.pause();
  }

  const chengeVolume = (value) => (audio.volume = value / 100);

  const changeFile = (src) => {
    audio.src = src;
  }

  const changeLoop = (loop) => {
    audio.loop = loop;
  }

  return {
    handlePlay, 
    handleStop,
    chengeVolume,
    changeFile,
    changeLoop
  }
}

export default audioPlayer;