"use client";

import { Player, usePlaybackInfo } from "@livepeer/react";

import Image from "next/image";

// const playbackId =
//   "bafybeida3w2w7fch2fy6rfvfttqamlcyxgd3ddbf4u25n7fxzvyvcaegxy";

// import blenderPoster from "@/images/polygon.png";
import { Post } from "@/types/graphql/generated";

const PosterImage = ({ blenderPoster }: { blenderPoster: string }) => {
  return (
    <Image
      src={blenderPoster}
      layout="fill"
      objectFit="cover"
      priority
      placeholder="blur"
      alt=""
    />
  );
};

interface ILivepeerPlayerProps {
  publication?: Post;
  playbackId: string;
}

export const LivepeerPlayer = ({
  publication,
  playbackId,
}: ILivepeerPlayerProps) => {
  // remove ipfs:// from playbackId
  const Id = playbackId.replace("ipfs://", "");

  const { data: playbackInfo, error } = usePlaybackInfo(Id);

  // console.log("playbackInfo", playbackInfo);
  // console.log("error", error);

  if (!playbackInfo) return null;
  return (
    <Player
      title="Waterfalls"
      playbackId={Id}
      showPipButton
      showTitle={false}
      aspectRatio="16to9"
      //   poster={<PosterImage blenderPoster={publication?.metadata.image} />}
      controls={{
        autohide: 3000,
      }}
      theme={{
        borderStyles: { containerBorderStyle: "solid" },
        radii: { containerBorderRadius: "0.25rem" },
      }}
    />
  );
};
