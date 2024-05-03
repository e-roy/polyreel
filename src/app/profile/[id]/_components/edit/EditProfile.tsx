"use client";

import { useState, useEffect, useCallback } from "react";

import { Loading } from "@/components/elements/Loading";
import { Avatar } from "@/components/elements/Avatar";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { useMutation } from "@apollo/client";
import { UPDATE_PROFILE } from "@/graphql/profile/update-profile";

import { useSignTypedData, useWriteContract } from "wagmi";
import { omit } from "@/lib/helpers";

import { LensHub } from "@/abis/LensHub";
import { LENS_HUB_PROXY_ADDRESS } from "@/lib/constants";

import {
  Profile,
  MetadataAttribute,
  CreateOnchainSetProfileMetadataBroadcastItemResult,
} from "@/types/graphql/generated";

import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";

type ProfileArgs = {
  args: string[];
};

type ProfileInputs = {
  name: string;
  bio: string;
  cover_picture: string;
  attributes: MetadataAttribute[];
  location: string;
  website: string;
  twitter_handle: string;
};

interface CreateOnchainProfileTypedDataResult {
  createOnchainSetProfileMetadataTypedData: CreateOnchainSetProfileMetadataBroadcastItemResult;
}

const filterAttributes = (attributes: MetadataAttribute[], key: string) => {
  return attributes?.filter(
    (attribute: MetadataAttribute) => attribute.key === key
  );
};

type EditProfileProps = {
  profile: Profile;
  refetch: () => void;
};

export const EditProfile = ({ profile, refetch }: EditProfileProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const { signTypedDataAsync } = useSignTypedData();

  const { writeContractAsync } = useWriteContract({
    mutation: {
      onError: (error) => {
        console.log("error", error);
        setIsUpdating(false);
      },
    },
  });

  const write = async (args: ProfileArgs) => {
    return await writeContractAsync({
      abi: LensHub,
      address: LENS_HUB_PROXY_ADDRESS,
      args: args.args,
      functionName: "setProfileMetadataURI",
    });
  };

  const [createSetProfileMetadataTypedData] = useMutation(UPDATE_PROFILE, {
    onCompleted({
      createOnchainSetProfileMetadataTypedData,
    }: CreateOnchainProfileTypedDataResult) {
      const { typedData } = createOnchainSetProfileMetadataTypedData;
      if (!createOnchainSetProfileMetadataTypedData)
        console.log("createOnchainSetProfileMetadataTypedData is null");

      const { profileId, metadataURI } = typedData.value;

      signTypedDataAsync({
        domain: omit(typedData?.domain, "__typename"),
        types: omit(typedData?.types, "__typename"),
        primaryType: "SetProfileMetadataURI",
        message: omit(typedData?.value, "__typename"),
      }).then((res) => {
        if (res) {
          const profileARGS: ProfileArgs = {
            args: [profileId, metadataURI],
          };

          write(profileARGS).then((res) => {
            refetch();
            setIsUpdating(false);
          });
        }
      });
    },
    onError(error) {
      console.log(error);
      setIsUpdating(false);
    },
  });

  const getAttribute = useCallback(
    (key: string) => {
      if (!profile.metadata?.attributes) return;
      const attribute = filterAttributes(profile.metadata?.attributes, key);
      return attribute?.[0]?.value;
    },
    [profile.metadata?.attributes]
  );

  const { register, handleSubmit, reset } = useForm<ProfileInputs>();
  const onSubmit: SubmitHandler<ProfileInputs> = async (data) => {
    setIsUpdating(true);
    const payload = {
      name: data.name,
      bio: data.bio,
      cover_picture: data.cover_picture,
      attributes: [
        {
          traitType: "string",
          value: data.location,
          key: "location",
        },
        {
          traitType: "string",
          value: data.website,
          key: "website",
        },
        {
          traitType: "string",
          value: data.twitter_handle,
          key: "twitter",
        },
      ],
    };

    try {
      const res = await axios.post("/api/ipfs-profile", payload);
      const { hash } = res.data;
      createSetProfileMetadataTypedData({
        variables: {
          request: {
            metadataURI: "https://ipfs.infura.io/ipfs/" + hash,
          },
        },
      });
    } catch (err) {
      console.log("ERROR =====> ", err);
      setIsUpdating(false);
    }
  };

  const resetAsyncForm = useCallback(async () => {
    reset({
      name: profile.metadata?.displayName as string,
      bio: profile.metadata?.bio || "",
      // cover_picture: profile.coverPicture || "",
      location: getAttribute("location") || "",
      website: getAttribute("website") || "",
      twitter_handle: getAttribute("twitter") || "",
    });
  }, [
    getAttribute,
    profile.metadata?.bio,
    profile.metadata?.displayName,
    reset,
  ]);

  useEffect(() => {
    resetAsyncForm();
  }, [resetAsyncForm]);

  return (
    <>
      {isUpdating ? (
        <div className="py-8 px-4 h-[60vh]">
          <div>
            Verify the wallet transaction to finish updating your profile.
          </div>
          <Loading />
        </div>
      ) : (
        <div className="h-[60vh]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="h-[50vh] overflow-y-scroll space-y-2 p-1">
              <div className={`relative mb-10`}>
                <div className="w-full">
                  {profile.metadata?.coverPicture?.optimized?.uri ? (
                    <div className="h-40 sm:h-56">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className=" max-h-56 w-full sm:border-2 border-transparent rounded-lg"
                        src={profile.metadata?.coverPicture?.optimized?.uri}
                        alt=""
                      />
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-sky-600 via-purple-700 to-purple-500 h-32 sm:h-48 max-h-56 rounded-t shadow-xl"></div>
                  )}
                </div>

                <div className="absolute -bottom-8 left-4 flex">
                  <Avatar profile={profile} size={"medium"} hoverable={false} />
                </div>
              </div>

              <div className={`space-y-4`}>
                <div>
                  <Label htmlFor={"name"}>Name</Label>
                  <Input id={"name"} type="text" {...register("name")} />
                </div>
                <div>
                  <Label htmlFor={"bio"}>Bio</Label>
                  <Textarea
                    id={"bio"}
                    className={`resize-none`}
                    {...register("bio")}
                  />
                </div>
                <div>
                  <Label htmlFor={"location"}>Location</Label>
                  <Input
                    id={"location"}
                    type="text"
                    {...register("location")}
                  />
                </div>
                <div>
                  <Label htmlFor={"website"}>Website</Label>
                  <Input id={"website"} type="text" {...register("website")} />
                </div>
                <div>
                  <Label htmlFor={"twitter"}>Twitter</Label>
                  <Input
                    id={"twitter"}
                    type="text"
                    {...register("twitter_handle")}
                  />
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Button className={`w-full uppercase`} type={`submit`}>
                update profile
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
