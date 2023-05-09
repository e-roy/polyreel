import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/elements";

import { Loading } from "@/components/elements";

import { useMutation } from "@apollo/client";
import { UPDATE_PROFILE } from "@/queries/profile/update-profile";
import { uploadIpfsProfile } from "@/lib/ipfs/ipfsProfile";

import { useSignTypedData, useContractWrite } from "wagmi";
import { omit, splitSignature } from "@/lib/helpers";
import LENS_PERIPHERY_ABI from "@/abis/Lens-Periphery.json";
import { LENS_PERIPHERY_CONTRACT } from "@/lib/constants";

import { Profile, Attribute } from "@/types/graphql/generated";

import { SubmitHandler, useForm } from "react-hook-form";

type ProfileInputs = {
  name: string;
  bio: string;
  cover_picture: string;
  attributes: Attribute[];
  location: string;
  website: string;
  twitter_handle: string;
};

const filterAttributes = (attributes: Attribute[], key: string) => {
  return attributes?.filter((attribute: Attribute) => attribute.key === key);
};

type EditProfileProps = {
  profile: Profile;
  refetch: () => void;
};

export const EditProfile = ({ profile, refetch }: EditProfileProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [editProfileImage, setEditProfileImage] = useState<boolean>(false);

  const [updateCoverPicture, setUpdateCoverPicture] = useState<string>("");

  const { signTypedDataAsync } = useSignTypedData();
  const { writeAsync } = useContractWrite({
    address: LENS_PERIPHERY_CONTRACT,
    abi: LENS_PERIPHERY_ABI,
    functionName: "setProfileMetadataURIWithSig",
    mode: "recklesslyUnprepared",
  });

  const [createSetProfileMetadataTypedData, {}] = useMutation(UPDATE_PROFILE, {
    onCompleted({ createSetProfileMetadataTypedData }: any) {
      const { typedData } = createSetProfileMetadataTypedData;
      if (!createSetProfileMetadataTypedData)
        console.log("createSetProfileMetadataTypedData is null");
      const { profileId, metadata } = typedData?.value;

      signTypedDataAsync({
        domain: omit(typedData?.domain, "__typename"),
        types: omit(typedData?.types, "__typename"),
        value: omit(typedData?.value, "__typename"),
      }).then((res) => {
        if (res) {
          const { v, r, s } = splitSignature(res);
          const postARGS = {
            // user: profile.ownedBy,
            profileId,
            metadata,
            sig: {
              v,
              r,
              s,
              deadline: typedData.value.deadline,
            },
          };
          writeAsync({ recklesslySetUnpreparedArgs: [postARGS] }).then(
            (res) => {
              res.wait(1).then(() => {
                refetch();
                setIsUpdating(false);
              });
            }
          );
        }
      });
    },
    onError(error) {
      console.log(error);
      setIsUpdating(false);
    },
  });

  useEffect(() => {
    if (profile) {
      setUpdateCoverPicture((profile.coverPicture as any) || "");
    }
  }, [profile]);

  const checkLocation = () => {
    if (!profile.attributes) return;
    const location = filterAttributes(profile?.attributes, "location");
    if (location && location[0]) return location[0].value;
  };

  const checkWebsite = () => {
    if (!profile.attributes) return;
    const website = filterAttributes(profile.attributes, "website");
    if (website[0]) return website[0].value;
  };

  const checkTwitter = () => {
    if (!profile.attributes) return;
    const twitter = filterAttributes(profile.attributes, "twitter");
    if (twitter[0]) return twitter[0].value;
  };

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
    // console.log("payload", payload);
    const result = await uploadIpfsProfile(payload);
    // console.log("result", result);

    createSetProfileMetadataTypedData({
      variables: {
        request: {
          profileId: profile.id,
          metadata: "https://ipfs.infura.io/ipfs/" + result.path,
        },
      },
    });
  };

  const resetAsyncForm = useCallback(async () => {
    reset({
      name: profile?.name as string,
      bio: profile.bio || "",
      // cover_picture: profile.coverPicture || "",
      location: checkLocation() || "",
      website: checkWebsite() || "",
      twitter_handle: checkTwitter() || "",
    });
  }, [reset]);

  useEffect(() => {
    resetAsyncForm();
  }, [resetAsyncForm]);

  const handleRefetch = async () => {
    refetch();
    setEditProfileImage(!editProfileImage);
  };

  return (
    <>
      {/* {currentUser?.coverPicture && currentUser?.coverPicture ? (
        <div className=" h-40 sm:h-56">
          {currentUser.coverPicture.__typename === "MediaSet" && (
            <img
              className=" max-h-56 w-full sm:border-2 border-transparent rounded-lg"
              src={currentUser.coverPicture.original.url}
              alt=""
            />
          )}
          {currentUser.coverPicture.__typename === "NftImage" && (
            <img
              className=" max-h-56 w-full sm:border-2 border-transparent rounded-lg"
              src={currentUser.coverPicture.uri}
              alt=""
            />
          )}
        </div>
      ) : (
        <div className=" bg-gradient-to-r from-sky-600 via-purple-700 to-purple-500 h-40 sm:h-56 max-h-64 rounded-t shadow-xl"></div>
      )} */}

      {isUpdating ? (
        <div className="py-8 px-4">
          <Loading />
        </div>
      ) : (
        <div className="h-6/10">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="h-1/2 overflow-y-scroll space-y-2 p-1">
              <label
                htmlFor={"name"}
                className={"block text-sm font-medium text-stone-700"}
              >
                Name
              </label>
              <input
                id={"name"}
                type="text"
                {...register("name")}
                className={`block w-full rounded-md border border-stone-200 shadow-sm text-base text-stone-700 py-2 px-3 focus:outline-transparent focus:border-stone-300 focus:ring focus:ring-stone-200 focus:ring-opacity-50`}
              />
              <label
                htmlFor={"bio"}
                className={"block text-sm font-medium text-stone-700"}
              >
                Bio
              </label>
              <input
                id={"bio"}
                type="text"
                {...register("bio")}
                className={`block w-full rounded-md border border-stone-200 shadow-sm text-base text-stone-700 py-2 px-3 focus:outline-transparent focus:border-stone-300 focus:ring focus:ring-stone-200 focus:ring-opacity-50`}
              />
              <label
                htmlFor={"location"}
                className={"block text-sm font-medium text-stone-700"}
              >
                Location
              </label>
              <input
                id={"location"}
                type="text"
                {...register("location")}
                className={`block w-full rounded-md border border-stone-200 shadow-sm text-base text-stone-700 py-2 px-3 focus:outline-transparent focus:border-stone-300 focus:ring focus:ring-stone-200 focus:ring-opacity-50`}
              />
              <label
                htmlFor={"website"}
                className={"block text-sm font-medium text-stone-700"}
              >
                Website
              </label>
              <input
                id={"website"}
                type="text"
                {...register("website")}
                className={`block w-full rounded-md border border-stone-200 shadow-sm text-base text-stone-700 py-2 px-3 focus:outline-transparent focus:border-stone-300 focus:ring focus:ring-stone-200 focus:ring-opacity-50`}
              />
              <label
                htmlFor={"twitter"}
                className={"block text-sm font-medium text-stone-700"}
              >
                Twitter
              </label>
              <input
                id={"twitter"}
                type="text"
                {...register("twitter_handle")}
                className={`block w-full rounded-md border border-stone-200 shadow-sm text-base text-stone-700 py-2 px-3 focus:outline-transparent focus:border-stone-300 focus:ring focus:ring-stone-200 focus:ring-opacity-50`}
              />
            </div>
            <div className="mt-6">
              <Button className="p-2" type={`submit`}>
                update profile
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
