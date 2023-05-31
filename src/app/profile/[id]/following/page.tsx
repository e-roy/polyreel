"use client";

import { FollowingList } from "@/components/profile";

interface Props {
  params: {
    id: string;
  };
}

const FollowingPage = ({ params }: Props) => {
  return <FollowingList rawId={params.id} />;
};

export default FollowingPage;
