import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ImCheckboxChecked } from 'react-icons/im';
import { CLEAR_CONGRATS } from '../../../actions/tasks';

import './style.css';
import audioPlayer from '../../audioPlayer';

const Congratulation = ({ text }) => {
  const { setting } = useSelector(state => state.timer);
  const congratsSound = useRef(audioPlayer({ src: "/sounds/congrats/congrats.mp3", volume: setting?.alarmVolume }));
  const [display, setDisplay] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (display) {
      congratsSound.current.handlePlay();
      const Confettiful = function (el) {
        this.el = el;
        this.containerEl = null;

        this.confettiFrequency = 3;
        this.confettiColors = ['#EF2964', '#00C09D', '#2D87B0', '#48485E', '#EFFF1D'];
        this.confettiAnimations = ['slow', 'medium', 'fast'];

        this._setupElements();
        this._renderConfetti();
      };

      Confettiful.prototype._setupElements = function () {
        const containerEl = document.createElement('div');

        containerEl.classList.add('confetti-container');

        this.el.appendChild(containerEl);

        this.containerEl = containerEl;
      };

      Confettiful.prototype._renderConfetti = function () {
        this.confettiInterval = setInterval(() => {
          const confettiEl = document.createElement('div');
          const confettiSize = (Math.floor(Math.random() * 3) + 7) + 'px';
          const confettiBackground = this.confettiColors[Math.floor(Math.random() * this.confettiColors.length)];
          const confettiLeft = (Math.floor(Math.random() * this.el.offsetWidth)) + 'px';
          const confettiAnimation = this.confettiAnimations[Math.floor(Math.random() * this.confettiAnimations.length)];

          confettiEl.classList.add('confetti', 'confetti--animation-' + confettiAnimation);
          confettiEl.style.left = confettiLeft;
          confettiEl.style.width = confettiSize;
          confettiEl.style.height = confettiSize;
          confettiEl.style.backgroundColor = confettiBackground;

          confettiEl.removeTimeout = setTimeout(function () {
            confettiEl.parentNode.removeChild(confettiEl);
          }, 3000);

          this.containerEl.appendChild(confettiEl);
        }, 25);
      };

      window.confettiful = new Confettiful(document.querySelector('.js-container'));

      setTimeout(() => {
        setDisplay(false);
        dispatch({ type: CLEAR_CONGRATS })
        congratsSound.current.handleStop();
      }, 5000);
    }

    // eslint-disable-next-line
  }, [display, congratsSound]);

  return (
    <div>
      {display && (
        <div className="js-container congrats-container">
          <div className='task-text zoom-out'>
            <ImCheckboxChecked size="100px" color="lime" />
            <h1>{text}</h1>
          </div>
        </div>
      )}
    </div>
  );
};

export default Congratulation;
