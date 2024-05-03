"use client";

import { VideoDisplay } from "@/components/media/VideoDisplay";
import { LinkItUrl, LinkItProfile, LinkItHashtag } from "@/lib/links";
import { cardFormatDate } from "@/utils/formatDate";

import { Like } from "@/components/post/Like";
import { VideoComments } from "./VideoComments";

import { Post as PostType, VideoMetadataV3 } from "@/types/graphql/generated";
import Link from "next/link";
import { Avatar } from "@/components/elements/Avatar";

interface VideoPostLayoutProps {
  publication: PostType;
}

export const VideoPostLayout: React.FC<VideoPostLayoutProps> = ({
  publication,
}) => {
  if (!publication) return null;

  const { metadata, by, createdAt } = publication;
  const displayName = by?.metadata?.displayName;
  const handle = by?.handle?.localName;

  return (
    <div className="lg:flex w-full">
      <div className="border dark:border-stone-300/30 lg:w-2/3">
        <div className="md:mx-20 lg:mx-0">
          {metadata && <VideoDisplay metadata={metadata as VideoMetadataV3} />}
        </div>
        <div className="p-4">
          <div className="flex justify-between">
            <div className="flex">
              <Avatar profile={by} size="small" href={`/profile/${handle}`} />
              <div className="flex pl-4 my-auto">
                <Link
                  className="hover:underline"
                  href={`/profile/${handle}`}
                  passHref
                >
                  <span className="text-stone-700 dark:text-stone-100 font-medium">
                    {displayName}
                  </span>
                  <span className="text-stone-500 dark:text-stone-300 font-medium text-xs pl-2 my-auto">
                    @{handle}
                  </span>
                </Link>
              </div>
            </div>

            <Like publication={publication} />

            <div className="text-xs my-auto font-medium text-stone-800 dark:text-stone-300">
              {cardFormatDate(createdAt)}
            </div>
          </div>
          <div className="mt-4 text-stone-700 dark:text-stone-200 text-xs sm:text-sm md:text-base font-medium overflow-y-scroll h-56">
            <LinkItUrl className="text-sky-600 hover:text-sky-500 z-50">
              <LinkItProfile className="text-sky-600 hover:text-sky-500 cursor-pointer">
                <LinkItHashtag className="text-sky-600 hover:text-sky-500 cursor-pointer">
                  {metadata?.content}
                </LinkItHashtag>
              </LinkItProfile>
            </LinkItUrl>
          </div>
        </div>
      </div>
      <div className="pl-2 lg:h-screen lg:pt-8 lg:w-1/3">
        <VideoComments publication={publication} />
      </div>
    </div>
  );
};
