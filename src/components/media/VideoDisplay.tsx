import { LivepeerPlayer } from "./LivepeerPlayer";
import { VideoPlayer } from "./VideoPlayer";

import { VideoMetadataV3 } from "@/types/graphql/generated";

interface IMediaDisplayProps {
  metadata: VideoMetadataV3;
}

export const VideoDisplay = ({ metadata }: IMediaDisplayProps) => {
  return metadata.asset.video.optimized?.uri.includes("ipfs://") ? (
    <LivepeerPlayer playbackId={metadata.asset.video.optimized?.uri} />
  ) : (
    <VideoPlayer source={metadata.asset.video.optimized?.uri} />
  );
};
