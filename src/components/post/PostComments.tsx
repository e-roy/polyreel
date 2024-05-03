"use client";

import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_PUBLICATIONS } from "@/graphql/publications/get-publications";

import { Post } from "@/components/post/Post";

import { Loading } from "@/components/elements/Loading";
import { Error } from "@/components/elements/Error";

import { Post as PostType } from "@/types/graphql/generated";
import { useEffect, memo } from "react";

type PostCommentsProps = {
  postId: string;
};

export const PostComments = memo(function PostComments({
  postId,
}: PostCommentsProps) {
  const { loading, error, data } = useQuery(GET_PUBLICATIONS, {
    variables: {
      request: {
        where: {
          commentOn: {
            id: postId,
          },
        },
      },
      hasReactedRequest2: {
        type: "UPVOTE",
      },
    },
    skip: !postId,
    fetchPolicy: "no-cache",
  });

  if (loading) return <Loading />;
  if (error) return <Error />;

  if (!data || !data.publications.items) return null;

  return (
    <>
      {data.publications.items.map((publication: PostType) => (
        <CommentedBranch key={publication.id} publication={publication} />
      ))}
    </>
  );
});

const CommentedBranch = memo(function CommentedBranch({
  publication,
}: {
  publication: PostType;
}) {
  return (
    <>
      <div className="w-full">
        <Post publication={publication} />
      </div>
      {publication?.stats?.comments > 0 && (
        <div className="pt-2 pl-8 w-full">
          <div className="w-0.5 h-8 ml-10 bg-gray-400" />
          <div className="-mt-4 pl-1">
            <Comment postId={publication.id} />
          </div>
        </div>
      )}
    </>
  );
});

type CommentProps = {
  postId: string;
};

const Comment = memo(function Comment({ postId }: CommentProps) {
  const [getPublications, { loading, error, data }] =
    useLazyQuery(GET_PUBLICATIONS);

  useEffect(() => {
    getPublications({
      variables: {
        request: {
          where: {
            commentOn: {
              id: postId,
            },
          },
        },
        hasReactedRequest2: {
          type: "UPVOTE",
        },
      },
      fetchPolicy: "no-cache",
    });
  }, [postId, getPublications]);

  if (loading) return <Loading />;
  if (error) return <Error />;

  if (!data || !data.publications.items) return null;

  return (
    <>
      {data.publications.items.map((publication: PostType) => (
        <div key={publication.id} className="w-full">
          <Post publication={publication} />
        </div>
      ))}
    </>
  );
});
