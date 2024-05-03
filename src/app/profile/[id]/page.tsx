"use client";
// pages/profile/[id]/page.tsx

import React from "react";

import { useQuery } from "@apollo/client";
import { GET_PROFILE } from "./_graphql/get-profile";

import { Loading } from "@/components/elements/Loading";
import { Error } from "@/components/elements/Error";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { logger } from "@/utils/logger";

import { ProfileHeader } from "./_components/ProfileHeader";
import { PostFeed } from "./_components/feeds/PostFeed";
import { ReplyFeed } from "./_components/feeds/ReplyFeed";
import { MediaFeed } from "./_components/feeds/MediaFeed";

interface Props {
  params: {
    id: string;
  };
}

const ProfilePage = ({ params }: Props) => {
  const id = `lens/` + params.id;

  const {
    data: profileData,
    loading,
    error,
    refetch,
  } = useQuery(GET_PROFILE, {
    variables: {
      request: { forHandle: id },
    },
    skip: !id,
  });

  if (loading) return <Loading />;
  if (error) return <Error />;

  if (!profileData) return null;

  const { profile } = profileData!;

  // TODO: need a screen for no profile found
  if (!profile) return <>profile not found</>;

  logger("profile/[id].tsx", profile);

  return (
    <div>
      <ProfileHeader profile={profile} loading={loading} refetch={refetch} />

      <Tabs defaultValue="posts" className="">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="replies">Replies</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className={`max-w-3xl mx-auto`}>
          <PostFeed profileId={profile.id} />
        </TabsContent>
        <TabsContent value="replies" className={`max-w-3xl mx-auto`}>
          <ReplyFeed profileId={profile.id} />
        </TabsContent>
        <TabsContent value="media" className={`max-w-3xl mx-auto`}>
          <MediaFeed profileId={profile.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
