"use client";

import { FollowersList } from "@/components/profile/FollowersList";

interface Props {
  params: {
    id: string;
  };
}

const FollowersPage = ({ params }: Props) => {
  return <FollowersList rawId={params.id} />;
};

export default FollowersPage;
