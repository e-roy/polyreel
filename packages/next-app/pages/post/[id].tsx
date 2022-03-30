import type { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";

import { useQuery } from "@apollo/client";
import { GET_PUBLICATION } from "@/queries/publications/get-publication";

import { Post } from "@/components/post";
import { CommentCard } from "@/components/comment";

const PostPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { loading, error, data } = useQuery(GET_PUBLICATION, {
    variables: {
      request: {
        publicationId: id,
      },
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div className="flex flex-1 justify-center h-screen ">
      <Head>
        <title>polyreel</title>
        <meta name="description" content="polyreel" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-full sm:w-3/4 xl:w-1/2">
        <Post publication={data.publication} />
        <div className="ml-10 my-2 w-0.5 h-8 bg-gray-400" />
        <CommentCard publicationId={id as string} />
      </div>
    </div>
  );
};

export default PostPage;
