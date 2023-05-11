import Head from "next/head";
import { MediaDisplay } from "@/components/media";
import { LinkItUrl, LinkItProfile, LinkItHashtag } from "@/lib/links";
import { cardFormatDate } from "@/utils/formatDate";
import { Mirror, Collect, Like, VideoComments } from "@/components/post";

import { Post as PostType } from "@/types/graphql/generated";
import Link from "next/link";
import { Avatar } from "@/components/elements";

export const VideoPostLayout = ({ publication }: { publication: PostType }) => {
  // console.log(publication);
  if (!publication) return null;
  return (
    <>
      <Head>
        <title>polyreel</title>
        <meta name="description" content="polyreel" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="lg:flex w-full">
        <div className="border dark:border-stone-300/30 lg:w-2/3">
          <div className="md:mx-20 lg:mx-0">
            {publication.metadata && publication.metadata.media && (
              <MediaDisplay publication={publication} />
            )}
          </div>
          <div className="p-4">
            <div className="flex justify-between">
              <div className={`flex`}>
                <div className={`col-span-1`}>
                  <Avatar
                    profile={publication?.profile}
                    size={`small`}
                    href={`/profile/${publication?.profile?.handle}`}
                  />
                </div>
                <div className={`flex pl-4 my-auto`}>
                  <Link
                    className={`hover:underline`}
                    href={`/profile/${publication?.profile?.handle}`}
                    passHref
                  >
                    <span
                      className={`text-stone-700 dark:text-stone-100 font-medium`}
                    >
                      {publication?.profile?.name}
                    </span>
                    <span
                      className={`text-stone-500 dark:text-stone-300 font-medium text-xs pl-2 my-auto`}
                    >
                      @{publication?.profile?.handle}
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
        <div className="border dark:border-stone-300/30 pl-2 lg:h-screen lg:pt-8 lg:w-1/3 ">
          <VideoComments publication={publication} />
        </div>
      </div>
    </>
  );
};
