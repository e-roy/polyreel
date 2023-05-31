"use client";

import { HashtagsList } from "@/components/hashtags";

interface Props {
  params: {
    hashtag: string;
  };
}

const HashtagPage = ({ params }: Props) => {
  return <HashtagsList hashtag={params.hashtag} />;
};

export default HashtagPage;
