"use client";

import { FollowersList } from "@/components/profile";

interface Props {
  params: {
    id: string;
  };
}

const FollowersPage = ({ params }: Props) => {
  return <FollowersList rawId={params.id} />;
};

export default FollowersPage;
