import type { NextPage } from "next";
import { useRouter } from "next/router";

import { useContext } from "react";
import { UserContext } from "@/context";
import { useQuery, gql } from "@apollo/client";

import { PostPostFragment } from "@/queries/fragments/PostPostFragment";
import { PostCommentFragment } from "@/queries/fragments/PostCommentFragment";
import { PostMirrorFragment } from "@/queries/fragments/PostMirrorFragment";

import { Loading, Error } from "@/components/elements";
import { StandardPostLayout, VideoPostLayout } from "@/components/post";
import { logger } from "@/utils/logger";

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

  if (loading) return <Loading />;
  if (error) return <Error />;

  if (data) logger("post/[id].tsx", data?.publication);

  // TODO: need a if post doesn't exist view
  if (!data?.publication) return <Error />;

  if (data?.publication?.__typename === "Comment") {
    router.push(`/post/${data.publication.mainPost.id}`);
  }

  if (
    data?.publication?.metadata?.media[0] &&
    (data?.publication?.metadata?.media[0].original.mimeType === "video/mp4" ||
      data?.publication?.metadata?.media[0].original.mimeType === "video/webm")
  )
    return <VideoPostLayout publication={data?.publication} />;
  else return <StandardPostLayout publication={data?.publication} />;
};

export default PostPage;
