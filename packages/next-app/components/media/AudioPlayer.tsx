import React, { useState, useRef, useEffect } from "react";
import { FaPlay, FaPause, FaVolumeUp } from "react-icons/fa";

import { checkIpfsUrl } from "@/utils/check-ipfs-url";

import { MetadataOutput, Post as PostType } from "@/types/graphql/generated";

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

interface AudioPlayerProps {
  publication: PostType;
}

export const AudioPlayerCard = ({ publication }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(event.target.value));
  };

  const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(event.target.value);
    setProgress(newProgress);
    if (audioRef.current) {
      const newCurrentTime = (audioRef.current.duration * newProgress) / 100;
      audioRef.current.currentTime = newCurrentTime;
      setRemainingTime(audioRef.current.duration - newCurrentTime);
    }
  };

  const updateProgress = () => {
    if (audioRef.current) {
      const newProgress =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(newProgress);
      setRemainingTime(
        audioRef.current.duration - audioRef.current.currentTime
      );
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setRemainingTime(audioRef.current.duration);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white shadow-lg rounded-lg">
        <div className="md:flex">
          <div>
            <img
              className="w-full rounded-t-lg  md:rounded-l-lg md:rounded-tr-none"
              src={checkIpfsUrl(publication?.metadata.image)}
              alt="Song Pic"
            />
          </div>
          <div className="w-full p-4 md:p-8">
            <div className="flex justify-between">
              <div>
                <h3 className="text-2xl font-medium">
                  {publication.metadata.name}
                </h3>
                <p className="mt-1">{publication.profile.name}</p>
              </div>
              <div className=""></div>
            </div>
            <div className="flex my-8">
              <button
                className="text-stone-700 hover:bg-stone-100 border font-bold p-3 rounded-full mr-2 flex items-center shadow-lg hover:shadow-none"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <FaPause className={`h-8 w-8`} />
                ) : (
                  <FaPlay className={`h-8 w-8`} />
                )}
              </button>
              <audio
                ref={audioRef}
                src={checkIpfsUrl(publication?.metadata.media[0].original.url)}
                onTimeUpdate={updateProgress}
                onLoadedMetadata={handleLoadedMetadata}
              />
            </div>
            <div className="flex items-center space-x-2 text-stone-600 text-xs">
              <div className="flex items-center space-x-2 w-3/4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={progress}
                  onChange={handleProgressChange}
                  className="w-full"
                />
                <span className="">{formatTime(remainingTime)}</span>
              </div>
              <div className="flex items-center space-x-2 w-1/4">
                <span>
                  <FaVolumeUp className={`w-4 h-4`} />
                </span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
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
};
