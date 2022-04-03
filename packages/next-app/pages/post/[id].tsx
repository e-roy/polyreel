import type { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";

import { useQuery } from "@apollo/client";
import { GET_PUBLICATION } from "@/queries/publications/get-publication";

import { Post, PostComments } from "@/components/post";

import { Loading } from "@/components/elements";

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

  if (loading) return <Loading />;
  if (error) return <p>Error :(</p>;
  // console.log(data);

  return (
    <div className="flex flex-1 justify-center h-screen">
      <Head>
        <title>polyreel</title>
        <meta name="description" content="polyreel" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-full sm:w-3/4 xl:w-1/2">
        <Post publication={data.publication} postType="page" />
        <PostComments postId={id as string} />
      </div>
    </div>
  );
};

export default PostPage;
