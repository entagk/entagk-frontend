const audioPlayer = ({ src, volume = 50, loop = false }) => {
  const audio = new Audio(src);
  audio.volume = volume / 100;

  audio.loop = loop;
  // console.log(audio.lang);
  // console.log(audio.preload);

  const handlePlay = () => {
    if (audio.paused || !audio.currentTime) {
      audio.play().catch(() => { });
    }
  };

  const handleStop = () => {
    audio.pause();
  }

  const chengeVolume = (value) => (audio.volume = value / 100);

  const changeFile = (src) => {
    audio.pause();
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
