"use client";

import { VideoDisplay } from "@/components/media/VideoDisplay";
import { LinkItUrl, LinkItProfile, LinkItHashtag } from "@/lib/links";
import { cardFormatDate } from "@/utils/formatDate";

import { Like } from "@/components/post/Like";
import { VideoComments } from "./VideoComments";

import { Post as PostType, VideoMetadataV3 } from "@/types/graphql/generated";
import Link from "next/link";
import { Avatar } from "@/components/elements/Avatar";

export const VideoPostLayout = ({ publication }: { publication: PostType }) => {
  if (!publication) return null;
  return (
    <>
      <div className="lg:flex w-full">
        <div className="border dark:border-stone-300/30 lg:w-2/3">
          <div className="md:mx-20 lg:mx-0">
            {publication.metadata && (
              <VideoDisplay
                metadata={publication.metadata as VideoMetadataV3}
              />
            )}
          </div>
          <div className="p-4">
            <div className="flex justify-between">
              <div className={`flex`}>
                <div className={`col-span-1`}>
                  <Avatar
                    profile={publication?.by}
                    size={`small`}
                    href={`/profile/${publication?.by?.handle?.localName}`}
                  />
                </div>
                <div className={`flex pl-4 my-auto`}>
                  <Link
                    className={`hover:underline`}
                    href={`/profile/${publication?.by?.handle?.localName}`}
                    passHref
                  >
                    <span
                      className={`text-stone-700 dark:text-stone-100 font-medium`}
                    >
                      {publication?.by?.metadata?.displayName}
                    </span>
                    <span
                      className={`text-stone-500 dark:text-stone-300 font-medium text-xs pl-2 my-auto`}
                    >
                      @{publication?.by?.handle?.localName}
                    </span>
                  </Link>
                </div>
              </div>

              <Like publication={publication} />

              <div className="text-xs my-auto font-medium text-stone-800 dark:text-stone-300">
                {cardFormatDate(publication.createdAt)}
              </div>
            </div>
            <div className="mt-4 text-stone-700 dark:text-stone-200 text-xs sm:text-sm md:text-base font-medium overflow-y-scroll h-56">
              <LinkItUrl className="text-sky-600 hover:text-sky-500 z-50">
                <LinkItProfile className="text-sky-600 hover:text-sky-500 cursor-pointer">
                  <LinkItHashtag className="text-sky-600 hover:text-sky-500 cursor-pointer">
                    {publication.metadata.content}
                  </LinkItHashtag>
                </LinkItProfile>
              </LinkItUrl>
            </div>
          </div>
        </div>
        <div className="pl-2 lg:h-screen lg:pt-8 lg:w-1/3 ">
          <VideoComments publication={publication} />
        </div>
      </div>
    </>
  );
};
