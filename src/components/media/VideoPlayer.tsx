"use client";

import Plyr from "plyr-react";
import { FC } from "react";
import "plyr-react/dist/plyr.css";

interface Props {
  source: string;
  poster?: string;
  controls?: string[];
  autoPlay?: boolean;
  ratio?: string | undefined;
}

const controlVideo = [
  "play",
  "progress",
  "current-time",
  "mute",
  "volume",
  "captions",
  "settings",
  "pip",
  "airplay",
  "fullscreen",
];

export const VideoPlayer: FC<Props> = ({ source }) => {
  // console.log("video source", source);

  return (
    <div className="overflow-hidden rounded-md">
      <Plyr
        source={{
          type: "video",
          sources: [
            {
              src: checkIpfs(source),
              provider: "html5",
            },
          ],
          poster: checkIpfs(source),
        }}
        options={{
          controls: controlVideo,
          autopause: true,
          tooltips: { controls: true, seek: true },
          ratio: "16:9",
        }}
      />
    </div>
  );
};

import { useIntersectionObserver } from "react-intersection-observer-hook";

const controlsFeed = ["current-time", "captions", "volume"];

export const VideoPlayerFeed: FC<Props> = ({ source }) => {
  const [ref, { entry }] = useIntersectionObserver();
  const isVisible = entry && entry.isIntersecting;
  // console.log("video source", source);

  return (
    <div className="overflow-hidden rounded-lg border" ref={ref}>
      <Plyr
        autoPlay={isVisible}
        source={{
          type: "video",
          sources: [
            {
              src: checkIpfs(source),
              provider: "html5",
            },
          ],
        }}
        options={{
          loop: { active: true },
          muted: true,
          controls: controlsFeed,
          autoplay: isVisible,
          autopause: true,
          ratio: "16:9",
        }}
      />
    </div>
  );
};

const checkIpfs = (url: string) => {
  if (url.startsWith("ipfs://")) {
    const ipfs = url.replace("ipfs://", "");
    return `https://ipfs.infura.io/ipfs/${ipfs}`;
  } else return url;
};
