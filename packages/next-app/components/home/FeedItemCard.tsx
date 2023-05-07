import { FeedItem } from "@/types/graphql/generated";
import { Avatar } from "../elements";

import {
  LinkItUrl,
  LinkItProfile,
  LinkItComment,
  LinkItHashtag,
} from "@/lib/links";

import { Image, LivepeerPlayer } from "@/components/media";

import { Post as PostType } from "@/types/graphql/generated";
import { cardFormatDate } from "@/utils/formatDate";
import { Stats } from "../post";

interface IFeedItemCardProps {
  feedItem: FeedItem;
}

export const FeedItemCard = ({ feedItem }: IFeedItemCardProps) => {
  //   console.log(feedItem);
  return (
    <div className={`border-b my-2 py-4 sm:p-4`}>
      <div className={`grid grid-cols-8 md:grid-cols-12`}>
        <div className={`col-span-1`}>
          <Avatar profile={feedItem.root.profile} size={`small`} />
        </div>
        <div className={`flex flex-col col-span-7 md:col-span-11`}>
          <div className={`flex`}>
            <span className={`text-stone-700 font-medium`}>
              {feedItem.root.profile.name}
            </span>
            <span className={`text-stone-500 font-medium text-xs pl-2 my-auto`}>
              @{feedItem.root.profile.handle}
            </span>
            <span
              className={`text-right w-full text-stone-500 text-xs sm:text-sm my-auto`}
            >
              {cardFormatDate(feedItem.root.createdAt)}
            </span>
          </div>
          <div className={`w-full`}>
            {feedItem.root.metadata && (
              <div className="overflow-hidden my-2 line-clamp-4 text-stone-700 text-xs sm:text-sm md:text-base font-medium">
                <LinkItUrl className="text-sky-600 hover:text-sky-500 z-50">
                  <LinkItProfile className="text-sky-600 hover:text-sky-500 cursor-pointer">
                    <LinkItHashtag className="text-sky-600 hover:text-sky-500 cursor-pointer">
                      <LinkItComment
                        className=" cursor-pointer"
                        publicationId={feedItem.root.id}
                      >
                        {feedItem.root.metadata.content}
                      </LinkItComment>
                    </LinkItHashtag>
                  </LinkItProfile>
                </LinkItUrl>
              </div>
            )}
          </div>
        </div>
        <div className={``}></div>
      </div>
      <div>
        {feedItem.root.metadata && feedItem.root.metadata.media && (
          <MediaDisplay publication={feedItem.root} />
        )}
        <Stats publication={feedItem.root as PostType} />
      </div>
    </div>
  );
};

const MediaDisplay = ({ publication }: any) => {
  const checkImage = (url: string) => {
    if (url.startsWith("ipfs://"))
      return `https://ipfs.io/ipfs/${url.substring(7)}`;
    else return url;
  };

  if (publication.metadata.media[0]?.original.mimeType === "video/mp4")
    return (
      <LivepeerPlayer
        publication={publication}
        playbackId={publication.metadata.media[0]?.original.url}
      />
    );

  if (publication.metadata.image)
    return (
      <div className="relative border rounded-lg shadow-lg">
        <img
          src={checkImage(publication.metadata.image as string)}
          alt=""
          className="rounded-lg"
        />
      </div>
    );

  return (
    <div className="md:flex md:flex-wrap">
      {publication.metadata.media.map((media: any, index: number) => (
        <div key={index}>
          {media.original.url && media.original.mimeType !== "video/mp4" && (
            <Image media={media.original} />
          )}
        </div>
      ))}
    </div>
  );
};
