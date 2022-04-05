import { useQuery } from "@apollo/client";
import { GET_PUBLICATIONS } from "@/queries/publications/get-publications";

import { Post } from "@/components/post";

import { Loading } from "@/components/elements";

type PostCommentsProps = {
  postId: string;
};

export const PostComments = ({ postId }: PostCommentsProps) => {
  const { loading, error, data } = useQuery(GET_PUBLICATIONS, {
    variables: {
      request: {
        commentsOf: postId,
      },
    },
  });

  if (loading) return <Loading />;
  if (error) return <p>Error :(</p>;

  return (
    <div className="">
      {data.publications.items.map((publication: any, index: number) => (
        <CommentedBranch key={index} publication={publication} />
      ))}
    </div>
  );
};

const CommentedBranch = ({ publication }: any) => {
  return (
    <>
      <div className="pl-2 mt-6 w-full">
        <Post publication={publication} postType="commment" />
      </div>
      {publication.stats.totalAmountOfComments > 0 ? (
        <div className="pl-4 w-full">
          <div className="w-0.5 h-8 ml-10 bg-gray-400 " />
          <div className="-mt-6">
            <Comment postId={publication.id} />
          </div>
        </div>
      ) : null}
    </>
  );
};

type CommentProps = {
  postId: string;
};

const Comment = ({ postId }: CommentProps) => {
  const { loading, error, data } = useQuery(GET_PUBLICATIONS, {
    variables: {
      request: {
        commentsOf: postId,
      },
    },
  });
  if (loading) return <Loading />;
  if (error) return <p>Error :(</p>;

  return (
    <>
      {data.publications.items.map((publication: any, index: number) => (
        <CommentedBranch key={index} publication={publication} />
      ))}
    </>
  );
};
