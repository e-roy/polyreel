import { useContext, useState } from "react";
import { UserContext } from "@/components/layout";
import { useMutation, gql } from "@apollo/client";
import { HeartIcon } from "@heroicons/react/solid";

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

export const Like = ({ publication }: any) => {
  const { currentUser } = useContext(UserContext);
  const { id, stats, reaction } = publication;
  const [numOfLikes, setNumofLikes] = useState(stats.totalUpvotes);
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

  return (
    <div className="flex ml-4 font-medium text-stone-600 hover:text-stone-700 cursor-pointer">
      {numOfLikes}
      {userLiked ? (
        <HeartIcon
          className="h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6 ml-2 text-red-600"
          aria-hidden="true"
          onClick={() => {
            if (currentUser) removeReaction(likeRequest);
          }}
        />
      ) : (
        <HeartIcon
          className="h-5 w-5 sm:h-5 sm:w-5 md:h-5 md:w-5 ml-2"
          aria-hidden="true"
          onClick={() => {
            if (currentUser) addReaction(likeRequest);
          }}
        />
      )}
    </div>
  );
};
