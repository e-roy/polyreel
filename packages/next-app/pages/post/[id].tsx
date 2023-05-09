import type { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";

import { useContext } from "react";
import { UserContext } from "@/context";

import { useQuery, gql } from "@apollo/client";

import { PostPostFragment } from "@/queries/fragments/PostPostFragment";
import { PostCommentFragment } from "@/queries/fragments/PostCommentFragment";
import { PostMirrorFragment } from "@/queries/fragments/PostMirrorFragment";

export const GET_PUBLICATION = gql`
  query (
    $request: PublicationQueryRequest!
    $reactionRequest: ReactionFieldResolverRequest
    $profileId: ProfileId
  ) {
    publication(request: $request) {
      ... on Post {
        ...PostPostFragment
      }
      ... on Comment {
        ...PostCommentFragment
      }
      ... on Mirror {
        ...PostMirrorFragment
      }
    }
  }

  ${PostPostFragment}
  ${PostCommentFragment}
  ${PostMirrorFragment}
`;

import { Post, PostComments } from "@/components/post";

import { Loading, Error, Avatar } from "@/components/elements";

const PostPage: NextPage = () => {
  const { currentUser } = useContext(UserContext);

  const router = useRouter();
  const { id } = router.query;
  const { loading, error, data } = useQuery(GET_PUBLICATION, {
    variables: {
      request: {
        publicationId: id,
      },
      reactionRequest: {
        profileId: currentUser?.id || null,
      },
      profileId: currentUser?.id || null,
    },
    skip: !id,
  });

  // if (loading) return <Loading />;
  if (error) return <Error />;
  // console.log(data);
  // const { publication } = data;
  logger("post/[id].tsx", data?.publication);

  if (data?.publication.__typename === "Comment") {
    router.push(`/post/${data.publication.mainPost.id}`);
  }

  if (
    data?.publication.metadata.media[0] &&
    data?.publication.metadata.media[0].original.mimeType === "video/mp4"
  )
    return <VideoPost publication={data?.publication} />;

  return (
    <div className="">
      <Head>
        <title>polyreel</title>
        <meta name="description" content="polyreel" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={`grid grid-cols-12 lg:gap-4 xl:gap-8 2xl:gap-12`}>
        {/* Main Column */}
        <div className="w-full md:mx-2 col-span-12 lg:col-span-9">
          <div className="h-9/10 md:h-98 my-1 overflow-y-scroll sm:border-r sm:border-l border-stone-300">
            <div className="flex flex-1 justify-center w-full">
              <div className="w-full p-6">
                <div className="mb-4">
                  {data && (
                    <Post publication={data?.publication} postType="page" />
                  )}
                </div>
                <div className="pb-12">
                  <PostComments postId={id as string} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="pt-4 hidden lg:block lg:col-span-3">
          <div className={`h-12 flex justify-end`}>
            {/* {!isWalletConnected ? (
              <ConnectButton />
            ) : (
              <>
                {correctNetwork ? (
                  <>{!verified && <Auth />}</>
                ) : (
                  <SwitchNetwork />
                )}
              </>
            )} */}
          </div>

          <div className={`mt-4`}>
            <WhoToFollow />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;

import { LivepeerPlayer } from "@/components/media";
import { LinkItUrl, LinkItProfile, LinkItHashtag } from "@/lib/links";
import { cardFormatDate } from "@/utils/formatDate";
import { VideoComments } from "@/components/post";
import { Mirror, Collect, Like } from "@/components/post";
import { CommentLine } from "@/components/comment";
import { logger } from "@/utils/logger";

import { Post as PostType } from "@/types/graphql/generated";
import Link from "next/link";
import { WhoToFollow } from "@/components/home";

const VideoPost = ({ publication }: { publication: PostType }) => {
  // console.log(publication);
  if (!publication) return null;
  return (
    <div className="lg:flex h-screen">
      <div className="border dark:border-stone-300/30 lg:w-2/3">
        <div className="md:mx-20 lg:mx-0">
          <LivepeerPlayer
            publication={publication}
            playbackId={publication.metadata.media[0]?.original.url}
          />
        </div>
        <div className="p-4">
          <div className="flex justify-between">
            <div className={`flex`}>
              <Link href={`/profile/${publication.profile.handle}`} passHref>
                <div className={`col-span-1`}>
                  <Avatar profile={publication.profile} size={`small`} />
                </div>
              </Link>
              <div className={`flex pl-4 my-auto`}>
                <Link
                  className={`hover:underline`}
                  href={`/profile/${publication.profile.handle}`}
                  passHref
                >
                  <span
                    className={`text-stone-700 dark:text-stone-100 font-medium`}
                  >
                    {publication.profile.name}
                  </span>
                  <span
                    className={`text-stone-500 dark:text-stone-300 font-medium text-xs pl-2 my-auto`}
                  >
                    @{publication.profile.handle}
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
      <div className="border dark:border-stone-300/30 pl-2 lg:pt-8 lg:w-1/3 ">
        <div className="overflow-y-scroll h-90 sm:h-60 lg:h-8/10 w-full">
          <VideoComments postId={publication.id as string} />
        </div>
        <CommentLine publicationId={publication.id} />
      </div>
    </div>
  );
};
