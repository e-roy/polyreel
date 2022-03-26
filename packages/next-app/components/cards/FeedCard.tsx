import React from "react";
import Link from "next/link";
import { cardFormatDate } from "@/utils/formatDate";
import { VideoPlayer, Image } from "@/components/media";

import {
  ChatAlt2Icon,
  DocumentDuplicateIcon,
  CollectionIcon,
} from "@heroicons/react/outline";

export const FeedCard = ({ publication }: any) => {
  //   console.log(publication);
  return (
    <div className="p-4 border-t border-b border-stone-300">
      <div className="flex justify-between">
        <div className="flex">
          {publication.profile.picture ? (
            <Link href={`/profile/${publication.profile.handle}`}>
              <div className="h-12 w-12 relative rounded-full border-2 cursor-pointer">
                <img
                  src={publication.profile.picture.original.url}
                  alt=""
                  className="rounded-full h-12"
                />
              </div>
            </Link>
          ) : (
            <Link href={`/profile/${publication.profile.handle}`}>
              <div className="bg-slate-300 rounded-full h-12 w-12 border-2 cursor-pointer"></div>
            </Link>
          )}

          <div className="ml-4 my-auto font-semibold">
            @{publication.profile.handle}
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="font-bold">{publication.__typename}</div>
        <div className="text-xs">{cardFormatDate(publication.createdAt)}</div>
      </div>
      {/* <div className="text-xs italic">id: {publication.id}</div> */}
      <div className="overflow-hidden mb-4">
        {publication.metadata.description}
      </div>
      <div>
        {publication.metadata.media && (
          <div className="flex flex-wrap">
            {publication.metadata.media.map((media: any, index: number) => (
              <div key={index}>
                {media.original.url &&
                  media.original.mimeType !== "video/mp4" && (
                    <Image media={media.original} />
                  )}
                {media.original.url &&
                  media.original.mimeType === "video/mp4" && (
                    <VideoPlayer media={media.original} />
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex text-stone-700 mt-4">
        <div className="flex">
          {publication.stats.totalAmountOfComments}
          <ChatAlt2Icon className="h-6 w-6 ml-2" aria-hidden="true" />
        </div>
        <div className="flex ml-4">
          {publication.stats.totalAmountOfMirrors}
          <DocumentDuplicateIcon className="h-6 w-6 ml-2" aria-hidden="true" />
        </div>
        <div className="flex ml-4">
          {publication.stats.totalAmountOfCollects}
          <CollectionIcon className="h-6 w-6 ml-2" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};
