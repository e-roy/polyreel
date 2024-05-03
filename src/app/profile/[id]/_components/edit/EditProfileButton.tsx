"use client";

import { useState, useCallback } from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { EditProfile } from "./EditProfile";
import { SetFollowModule } from "./SetFollowModule";

import { Profile } from "@/types/graphql/generated";

type EditProfileButtonProps = {
  profile: Profile;
  refetch: () => void;
};

export const EditProfileButton = ({
  profile,
  refetch,
}: EditProfileButtonProps) => {
  const [editProfileImage, setEditProfileImage] = useState<boolean>(false);

  const handleRefetch = useCallback(async () => {
    refetch();
    setEditProfileImage(!editProfileImage);
  }, [refetch, editProfileImage]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className={`bg-stone-800 hover:bg-stone-700 border border-stone-500 text-white rounded-full`}
          type={`button`}
        >
          edit profile
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            {`Make changes to your profile here. Click update when you're done.`}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Tabs defaultValue="profile" className="">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className={`max-w-3xl mx-auto`}>
              <EditProfile profile={profile} refetch={handleRefetch} />
            </TabsContent>
            <TabsContent value="settings" className={`max-w-3xl mx-auto`}>
              <SetFollowModule
                profile={profile}
                currentFollowModule={profile.followModule}
                refetch={handleRefetch}
              />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
