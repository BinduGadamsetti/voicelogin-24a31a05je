"use client";

import React, { useState, useEffect, useRef } from 'react';

interface WaveformVisualizerProps {
  analyserNode: AnalyserNode;
  isRecording: boolean;
}

const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({ analyserNode, isRecording }) => {
  const [pathD, setPathD] = useState('');
  const animationFrameIdRef = useRef<number>();

  useEffect(() => {
    if (!isRecording || !analyserNode) {
      return;
    }

    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const svgWidth = 300;
    const svgHeight = 96;

    const draw = () => {
      animationFrameIdRef.current = requestAnimationFrame(draw);
      analyserNode.getByteFrequencyData(dataArray);

      const sliceWidth = (svgWidth * 1.0) / bufferLength;
      let x = 0;
      let path = `M0,${svgHeight / 2} `;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * svgHeight) / 2;
        path += `L${x},${svgHeight / 2 - y} `;
        x += sliceWidth;
      }
      path += `L${svgWidth},${svgHeight / 2}`;
      
      setPathD(path);
    };

    draw();

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [isRecording, analyserNode]);

  return (
    <svg width="100%" height="100%" viewBox="0 0 300 96">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 0.8 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 0.2 }} />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>
      </defs>
      <path 
        d={pathD} 
        fill="none" 
        stroke="url(#gradient)" 
        strokeWidth="2"
        filter="url(#glow)"
      />
    </svg>
  );
};

export default WaveformVisualizer;
