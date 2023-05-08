import { useCallback, useContext, useState } from "react";
import { UserContext } from "@/context";
import { useMutation, gql } from "@apollo/client";
import { FaHeart } from "react-icons/fa";
import { Post } from "@/types/graphql/generated";

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
  const { currentUser } = useContext(UserContext);
  const { id, stats, reaction } = publication;
  const [numOfLikes, setNumofLikes] = useState(stats?.totalUpvotes || 0);
  const [userLiked, setUserLiked] = useState(reaction === "UPVOTE");

  const [addReaction, {}] = useMutation(ADD_LIKE, {
    onCompleted() {
      setNumofLikes(numOfLikes + 1);
      setUserLiked(true);
    },
  });

  const [removeReaction, {}] = useMutation(REMOVE_LIKE, {
    onCompleted() {
      setNumofLikes(numOfLikes - 1);
      setUserLiked(false);
    },
  });

  const likeRequest = {
    variables: {
      request: {
        profileId: currentUser?.id,
        reaction: "UPVOTE",
        publicationId: id,
      },
    },
  };

  const handleAddLike = useCallback(() => {
    if (currentUser) addReaction(likeRequest);
  }, [currentUser]);

  const handleRemoveLike = useCallback(() => {
    if (currentUser) removeReaction(likeRequest);
  }, [currentUser]);

  return (
    <div className="flex ml-4 my-auto font-medium text-stone-600 hover:text-stone-700 cursor-pointer">
      {numOfLikes}
      {userLiked ? (
        <button onClick={handleRemoveLike}>
          <FaHeart
            className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 ml-2 text-red-600"
            aria-hidden="true"
          />
        </button>
      ) : (
        <button onClick={handleAddLike}>
          <FaHeart
            className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 ml-2"
            aria-hidden="true"
          />
        </button>
      )}
    </div>
  );
};
