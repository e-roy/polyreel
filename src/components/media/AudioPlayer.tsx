"use client";
// components/media/AudioPlayer.tsx

import React, { useState, useRef, useEffect, useCallback } from "react";
import { FaPlay, FaPause, FaVolumeUp } from "react-icons/fa";

import { checkIpfsUrl } from "@/utils/check-ipfs-url";

import { AudioMetadataV3 } from "@/types/graphql/generated";

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

interface AudioPlayerProps {
  metadata: AudioMetadataV3;
}

export const AudioPlayerCard = React.memo(function AudioPlayerCard({
  metadata,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = useCallback(() => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  }, []);

  const handleVolumeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setVolume(parseFloat(event.target.value));
    },
    []
  );

  const handleProgressChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newProgress = parseFloat(event.target.value);
      setProgress(newProgress);
      if (audioRef.current) {
        const newCurrentTime = (audioRef.current.duration * newProgress) / 100;
        audioRef.current.currentTime = newCurrentTime;
        setRemainingTime(audioRef.current.duration - newCurrentTime);
      }
    },
    []
  );

  const updateProgress = useCallback(() => {
    if (audioRef.current) {
      const newProgress =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(newProgress);
      setRemainingTime(
        audioRef.current.duration - audioRef.current.currentTime
      );
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;

    const handleLoadedMetadata = () => {
      if (audio) {
        setRemainingTime(audio.duration);
      }
    };

    if (audio) {
      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
      audio.volume = volume;
    }

    return () => {
      if (audio) {
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      }
    };
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      if (isPlaying) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  }, [isPlaying]);

  return (
    <div className="w-full">
      <div className="bg-white dark:bg-transparent shadow dark:shadow dark:shadow-stone-100/30 rounded-lg">
        <div className="md:grid md:grid-cols-2">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="w-full rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
              src={checkIpfsUrl(metadata.asset.cover?.optimized?.uri)}
              alt="Song Pic"
            />
          </div>
          <div className="w-full p-4 md:p-8">
            <div className="flex justify-between">
              <div>
                <h3 className="text-2xl font-medium">
                  {metadata.asset.artist}
                </h3>
                <p className="mt-1">{metadata.title}</p>
              </div>
            </div>
            <div className="flex my-8">
              <button
                className="text-stone-700 hover:bg-stone-100 dark:text-stone-200 dark:border-stone-300 dark:hover:bg-stone-800 border font-bold p-3 rounded-full mr-2 flex items-center shadow-lg hover:shadow-none"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <FaPause className="h-8 w-8" />
                ) : (
                  <FaPlay className="h-8 w-8" />
                )}
              </button>
              <audio
                ref={audioRef}
                src={checkIpfsUrl(metadata.asset.audio.optimized?.uri)}
                onTimeUpdate={updateProgress}
              />
            </div>
            <div className="flex items-center space-x-2 text-stone-600 dark:text-stone-300 text-xs">
              <div className="flex items-center space-x-2 w-3/4">
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={0.1}
                  value={progress}
                  onChange={handleProgressChange}
                  className="w-full"
                />
                <span>{formatTime(remainingTime)}</span>
              </div>
              <div className="flex items-center space-x-2 w-1/4">
                <span>
                  <FaVolumeUp className="w-4 h-4" />
                </span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
