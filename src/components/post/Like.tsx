"use client";
// components/post/Like.tsx

import { useCallback, useContext, useMemo, useState } from "react";
import { UserContext } from "@/context/UserContext/UserContext";
import { useMutation, gql } from "@apollo/client";
import { FaHeart } from "react-icons/fa";
import {
  Post,
  PublicationReactionType,
  ReactionRequest,
} from "@/types/graphql/generated";
import { Button } from "@/components/ui/button";

export const ADD_LIKE = gql`
  mutation ($request: ReactionRequest!) {
    addReaction(request: $request)
  }
`;

export const REMOVE_LIKE = gql`
  mutation ($request: ReactionRequest!) {
    removeReaction(request: $request)
  }
`;

interface ILikeProps {
  publication: Post;
}

export const Like = ({ publication }: ILikeProps) => {
  const { currentUser, verified } = useContext(UserContext);
  const { id, stats, operations } = publication;

  const [numOfLikes, setNumOfLikes] = useState(stats?.reactions ?? 0);
  const [userLiked, setUserLiked] = useState(operations?.hasReacted ?? false);

  const [addReaction] = useMutation<
    { addReaction: boolean },
    { request: ReactionRequest }
  >(ADD_LIKE);
  const [removeReaction] = useMutation<
    { removeReaction: boolean },
    { request: ReactionRequest }
  >(REMOVE_LIKE);

  const likeRequest = useMemo(
    () => ({
      variables: {
        request: {
          reaction: PublicationReactionType.Upvote,
          for: id,
        },
      },
    }),
    [id]
  );

  const handleReaction = useCallback(async () => {
    if (currentUser) {
      const mutationFn = userLiked ? removeReaction : addReaction;
      await mutationFn(likeRequest);
      setNumOfLikes((prevLikes) => (userLiked ? prevLikes - 1 : prevLikes + 1));
      setUserLiked((prevLiked) => !prevLiked);
    }
  }, [currentUser, addReaction, removeReaction, likeRequest, userLiked]);

  return (
    <div className="flex ml-4 my-auto">
      <Button
        onClick={handleReaction}
        aria-label={userLiked ? "Unlike" : "Like"}
        variant={`ghost`}
        size={`icon`}
        disabled={!verified}
        className={`font-medium text-stone-600 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-transparent`}
      >
        {numOfLikes}
        <FaHeart
          className={`h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 ml-2 ${
            userLiked ? "text-red-600" : ""
          }`}
          aria-hidden="true"
        />
      </Button>
    </div>
  );
};
