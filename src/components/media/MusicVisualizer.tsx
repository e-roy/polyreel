// components/media/MusicVisualizer.tsx

import React, { useRef, useEffect } from "react";

interface MusicVisualizerProps {
  audioElement: HTMLAudioElement | null;
}

export const MusicVisualizer: React.FC<MusicVisualizerProps> = ({
  audioElement,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (audioElement && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const audioSource = audioContext.createMediaElementSource(audioElement);
      const analyser = audioContext.createAnalyser();

      // Connect the audio source to the analyser and the destination
      audioSource.connect(analyser);
      analyser.connect(audioContext.destination);
      audioSource.connect(audioContext.destination);

      analyser.fftSize = 64;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        const width = canvas.width;
        const height = canvas.height;
        ctx.clearRect(0, 0, width, height);

        analyser.getByteFrequencyData(dataArray);

        const barWidth = (width / bufferLength) * 2.5;
        let posX = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = dataArray[i];
          ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
          ctx.fillRect(posX, height - barHeight, barWidth, barHeight);
          posX += barWidth + 1;
        }

        requestAnimationFrame(draw);
      };

      draw();
    }
  }, [audioElement]);

  return (
    <canvas
      ref={canvasRef}
      width="300"
      height="100"
      className="music-visualizer"
    ></canvas>
  );
};
