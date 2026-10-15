"use client";
import { useEffect, useState } from 'react';

const ParticleBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Reduced to 4 for a much cleaner/less busy look
  const containerCount = 4;

  return (
    <div className="advanced-neon-container">
      {Array.from({ length: containerCount }, (_, i) => (
        <div
          key={i}
          className="glowing"
          style={{
            position: 'absolute',
            left: `${(i * 20) % 100}%`,
            top: `${(i * 15) % 100}%`,
            transform: `scale(${0.4 + (i % 3) * 0.2})`, // Vary sizes
          } as React.CSSProperties}
        >
          <span style={{ "--i": 1 } as React.CSSProperties}></span>
          <span style={{ "--i": 2 } as React.CSSProperties}></span>
          <span style={{ "--i": 3 } as React.CSSProperties}></span>
        </div>
      ))}

      <style jsx>{`
        .advanced-neon-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
          background: transparent;
        }

        .glowing {
          position: relative;
          min-width: 400px;
          min-height: 400px;
          transform-origin: right;
          animation: colorChange 12s linear infinite; /* Slightly slower even */
          opacity: 0.45; /* Increased for better visibility on white */
        }

        .glowing:nth-child(even) {
          transform-origin: left;
        }

        @keyframes colorChange {
          0% {
            filter: hue-rotate(0deg) saturate(1); /* Full saturation for visibility */
            transform: rotate(0deg);
          }
          100% {
            filter: hue-rotate(360deg) saturate(1);
            transform: rotate(360deg);
          }
        }

        .glowing span {
          position: absolute;
          top: calc(70px * var(--i));
          left: calc(70px * var(--i));
          bottom: calc(70px * var(--i));
          right: calc(70px * var(--i));
        }

        .glowing span::before {
          content: "";
          position: absolute;
          top: 50%;
          left: -6px;
          width: 12px; /* Bigger particles for better visibility */
          height: 12px;
          background: #fff;
          border-radius: 50%;
        }

        .glowing span:nth-child(3n + 1)::before {
          background: rgba(134, 255, 0, 1);
          box-shadow: 0 0 15px rgba(134, 255, 0, 0.8),
            0 0 30px rgba(134, 255, 0, 0.4);
        }

        .glowing span:nth-child(3n + 2)::before {
          background: rgba(255, 214, 0, 1);
          box-shadow: 0 0 15px rgba(255, 214, 0, 0.8),
            0 0 30px rgba(255, 214, 0, 0.4);
        }

        .glowing span:nth-child(3n + 3)::before {
          background: rgba(0, 226, 255, 1);
          box-shadow: 0 0 15px rgba(0, 226, 255, 0.8),
            0 0 30px rgba(0, 226, 255, 0.4);
        }

        /* Much slower animation durations for a calm experience */
        .glowing span:nth-child(3n + 1) {
          animation: animate 20s alternate infinite;
        }

        .glowing span:nth-child(3n + 2) {
          animation: animate-reverse 15s alternate infinite;
        }

        .glowing span:nth-child(3n + 3) {
          animation: animate 25s alternate infinite; 
        }

        @keyframes animate {
          0% {
            transform: rotate(180deg);
          }
          50% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes animate-reverse {
          0% {
            transform: rotate(360deg);
          }
          50% {
            transform: rotate(180deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }
      `}</style>
    </div>
  );
};

export default ParticleBackground;