import React from "react";
import { PostBody } from "@/components/post/PostBody";
import { Stats } from "@/components/post/Stats";

import {
  ExplorePublication,
  PrimaryPublication,
  Post as PostType,
  Quote,
  VideoMetadataV3,
  AnyPublication,
} from "@/types/graphql/generated";
import { logger } from "@/utils/logger";
import { AudioPlayerCard } from "../media/AudioPlayer";
import { ImageDisplay } from "../media/ImageDisplay";
import { VideoDisplay } from "../media/VideoDisplay";

type PostProps = {
  publication: AnyPublication;
};

type PublicationProps = {
  publication: ExplorePublication | PrimaryPublication;
  ifComment?: boolean;
};

export const Post = ({ publication }: PostProps) => {
  switch (publication.__typename) {
    case "Post":
      return (
        <>
          <PostComponent publication={publication} />
          <Stats publication={publication as PostType} />
        </>
      );

    case "Quote":
      return (
        <>
          <QuoteComponent publication={publication} />
          <Stats publication={publication as PostType} />
        </>
      );

    case "Comment":
      return (
        <>
          <PostComponent publication={publication.commentOn} ifComment />

          <PostComponent publication={publication} />
          <Stats publication={publication as PostType} />
        </>
      );

    case "Mirror":
      return (
        <>
          <div className={`text-sm text-primary/60 font-medium pl-4 italic`}>
            Mirrored by @{publication.by.handle?.localName}
          </div>
          <PostComponent publication={publication.mirrorOn} />
          <Stats publication={publication.mirrorOn as PostType} />
        </>
      );

    default:
      return <div className={`uppercase text-xl`}>Unknown publication</div>;
  }
};

const PostComponent = ({ publication, ifComment }: PublicationProps) => {
  const renderMedia = () => {
    switch (publication?.metadata?.__typename) {
      case "TextOnlyMetadataV3":
        return null;
      case "ImageMetadataV3":
        return publication.metadata.asset.image.optimized ? (
          <ImageDisplay
            media={publication.metadata.asset.image.optimized}
            alt={publication.metadata.asset.altTag}
          />
        ) : null;
      case "VideoMetadataV3":
        return (
          <VideoDisplay metadata={publication.metadata as VideoMetadataV3} />
        );
      case "AudioMetadataV3":
        return <AudioPlayerCard metadata={publication.metadata} />;
      case "ArticleMetadataV3":
        return <div className={`uppercase text-xl`}>Article media type</div>;
      default:
        return <div className={`uppercase text-xl`}>Unknown media type</div>;
    }
  };
  return (
    <div>
      <PostBody publication={publication as PostType} />
      <div className={`grid grid-cols-8 md:grid-cols-12`}>
        <div className={`col-span-1 relative`}>
          {ifComment && (
            <div
              className={`border-r-2 border-stone-500 absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2`}
              style={{ height: "calc(100%)" }}
            />
          )}
        </div>
        <div className={`col-span-7 md:col-span-11`}>{renderMedia()}</div>
      </div>
    </div>
  );
};

interface QuoteProps {
  publication: Quote;
}

const QuoteComponent = ({ publication }: QuoteProps) => {
  return (
    <div className={``}>
      <PostComponent publication={publication} />
      <div className={`border p-2 rounded-lg ml-20`}>
        <PostComponent publication={publication?.quoteOn} />
      </div>
    </div>
  );
};
