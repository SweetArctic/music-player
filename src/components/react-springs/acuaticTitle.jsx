import React, { useEffect, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import './styles.module.css';

const AnimFeTurbulence = animated('feTurbulence');
const AnimFeDisplacementMap = animated('feDisplacementMap');

export default function AcuaticTitle() {
  const [toggle, setToggle] = useState(true);

  const [styles, api] = useSpring(() => ({
    factor: 10,
    opacity: 1,
    scale: 1,
    freq: '0.0075, 0.0',
    config: { duration: 3000 },
  }));

  const trigger = () => {
    setToggle((prev) => !prev);
    api.start({
      factor: toggle ? 150 : 10,
      opacity: toggle ? 0 : 1,
      scale: toggle ? 0.9 : 1,
      freq: toggle ? '0.0, 0.0' : '0.0075, 0.0',
      config: { duration: 3000 },
    });
  };

  useEffect(() => {
    trigger();
  }, []);

  return (
    <div className="aqua-container" onClick={trigger}>
      <animated.svg
        className="aqua-svg"
        style={{ scale: styles.scale, opacity: styles.opacity }}
        viewBox="0 0 1000 200"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="water">
            <AnimFeTurbulence
              type="fractalNoise"
              baseFrequency={styles.freq}
              numOctaves="2"
              result="TURB"
              seed="8"
            />
            <AnimFeDisplacementMap
              xChannelSelector="R"
              yChannelSelector="G"
              in="SourceGraphic"
              in2="TURB"
              scale={styles.factor}
            />
          </filter>
        </defs>
        <g filter="url(#water)">
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="100"
            fill="#FACB4D"
            fontFamily="Arial Black"
          >
            Player Max
          </text>
        </g>
      </animated.svg>
    </div>
  );
}
