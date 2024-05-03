"use client";

import { useQuery } from "@apollo/client";
import { GET_PUBLICATION } from "./_graphql/get-publication";

import { Loading } from "@/components/elements/Loading";
import { ErrorComponent } from "@/components/elements/ErrorComponent";
import { StandardPostLayout } from "./_components/StandardPostLayout";
import { VideoPostLayout } from "./_components/VideoPostLayout";

import { logger } from "@/utils/logger";
import { Post as PostType } from "@/types/graphql/generated";

interface Props {
  params: {
    id: string;
  };
}

const PostPage = ({ params }: Props) => {
  const { id } = params;
  const { loading, error, data } = useQuery(GET_PUBLICATION, {
    variables: {
      request: {
        forId: id,
      },
      hasReactedRequest2: {
        type: "UPVOTE",
      },
    },
    skip: !id,
  });

  if (loading) return <Loading />;
  if (error) return <ErrorComponent />;

  if (data) logger("post/[id].tsx", data?.publication);

  if (!data?.publication) return <ErrorComponent />;

  const publication = data.publication as PostType;

  const renderPublicationLayout = () => {
    switch (publication?.metadata?.__typename) {
      case "VideoMetadataV3":
        return <VideoPostLayout publication={publication} />;
      default:
        return <StandardPostLayout publication={publication} />;
    }
  };

  return renderPublicationLayout();
};

export default PostPage;
