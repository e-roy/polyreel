"use client";

import { FollowingList } from "@/components/profile/FollowingList";

interface Props {
  params: {
    id: string;
  };
}

const FollowingPage = ({ params }: Props) => {
  return <FollowingList rawId={params.id} />;
};

export default FollowingPage;
