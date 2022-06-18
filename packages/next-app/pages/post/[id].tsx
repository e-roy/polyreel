import type { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";

import { useContext } from "react";
import { UserContext } from "@/components/layout";

import { useQuery, gql } from "@apollo/client";

import { PostPostFragment } from "@/queries/fragments/PostPostFragment";
import { PostCommentFragment } from "@/queries/fragments/PostCommentFragment";
import { PostMirrorFragment } from "@/queries/fragments/PostMirrorFragment";

export const GET_PUBLICATION = gql`
  query (
    $request: PublicationQueryRequest!
    $requestRequest: ReactionFieldResolverRequest
  ) {
    publication(request: $request) {
      ... on Post {
        ...PostPostFragment
        reaction(request: $requestRequest)
      }
      ... on Comment {
        ...PostCommentFragment
        reaction(request: $requestRequest)
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

import { Loading, Error } from "@/components/elements";

const PostPage: NextPage = () => {
  const { currentUser } = useContext(UserContext);

  const router = useRouter();
  const { id, comment } = router.query;
  const { loading, error, data } = useQuery(GET_PUBLICATION, {
    variables: {
      request: {
        publicationId: id,
      },
      requestRequest: { profileId: currentUser?.id },
    },
  });

  if (loading) return <Loading />;
  if (error) return <Error />;
  // console.log(data);
  // console.log(data.publication.metadata.media[0].original.mimeType);
  // console.log(comment);
  if (data.publication.__typename === "Comment") {
    // router.push(
    //   `/post/${data.publication.mainPost.id}?comment=${data.publication.id}`
    // );
    router.push(`/post/${data.publication.mainPost.id}`);
  }

  if (
    data.publication.metadata.media[0] &&
    data.publication.metadata.media[0].original.mimeType === "video/mp4"
  )
    return <VideoPost publication={data} />;

  return (
    <div className="h-9/10">
      <Head>
        <title>polyreel</title>
        <meta name="description" content="polyreel" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-1 justify-center w-full h-9/10 overflow-y-hidden">
        <div className="w-full sm:w-3/4 xl:w-1/2">
          <div className="mb-4 h-2/10">
            <Post publication={data.publication} postType="page" />
          </div>
          <div className="overflow-y-scroll h-7/10 pb-12">
            <PostComments postId={id as string} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;

import { VideoPlayer } from "@/components/media";
import { ProfileHeader } from "@/components/post";
import { LinkItUrl, LinkItProfile, LinkItHashtag } from "@/lib/links";
import { cardFormatDate } from "@/utils/formatDate";
import { VideoComments } from "@/components/post";
import { Mirror, Collect, Like } from "@/components/post";
import { CommentLine } from "@/components/comment";

const VideoPost = ({ publication }: any) => {
  // console.log(publication);
  if (!publication) return null;
  return (
    <div className="lg:flex xl:px-8 2xl:px-32 h-9/10 overflow-y-hidden">
      <div className="border lg:w-2/3">
        <div className="md:mx-20 lg:mx-0">
          <VideoPlayer
            source={
              publication.publication.metadata.media[0]?.original.url ||
              publication.publication.metadata.media[1]?.original.url
            }
          />
        </div>
        <div className="p-4">
          <div className="flex justify-between">
            <ProfileHeader
              profile={publication.publication.profile}
              appId={publication.publication.appId}
            />
            <Like publication={publication.publication} />

            <div className="text-xs font-medium text-stone-800">
              {cardFormatDate(publication.publication.createdAt)}
            </div>
          </div>
          <div className="mt-4 text-stone-700 text-xs sm:text-sm md:text-base font-medium overflow-y-scroll h-32">
            <LinkItUrl className="text-sky-600 hover:text-sky-500 z-50">
              <LinkItProfile className="text-sky-600 hover:text-sky-500 cursor-pointer">
                <LinkItHashtag className="text-sky-600 hover:text-sky-500 cursor-pointer">
                  {publication.publication.metadata.content}
                </LinkItHashtag>
              </LinkItProfile>
            </LinkItUrl>
          </div>
        </div>
      </div>
      <div className="border lg:w-1/3 ">
        <div className=" overflow-y-scroll h-80 sm:h-60 lg:h-8/10 w-full">
          <VideoComments postId={publication.publication.id as string} />
        </div>
        <CommentLine publicationId={publication.publication.id} />
      </div>
    </div>
  );
};
