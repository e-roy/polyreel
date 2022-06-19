import { useState, useEffect } from "react";
import { Button, TextField } from "@/components/elements";

import { Loading } from "@/components/elements";

import { useMutation } from "@apollo/client";
import { UPDATE_PROFILE } from "@/queries/profile/update-profile";
import { uploadIpfsProfile } from "@/lib/ipfs/ipfsProfile";

import { useSignTypedData, useContractWrite } from "wagmi";
import { omit, splitSignature } from "@/lib/helpers";
import LENS_PERIPHERY_ABI from "@/abis/Lens-Periphery.json";
import { LENS_PERIPHERY_CONTRACT } from "@/lib/constants";

import { Profile } from "@/types/lenstypes";

const filterAttributes = (attributes: any, key: string) => {
  return attributes?.filter((attribute: any) => attribute.key === key);
};

type EditProfileProps = {
  profile: Profile;
  refetch: () => void;
};

export const EditProfile = ({ profile, refetch }: EditProfileProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [editProfileImage, setEditProfileImage] = useState<boolean>(false);
  const [updateName, setUpdateName] = useState<string>("");
  const [updateBio, setUpdateBio] = useState<string>("");
  const [updateLocation, setUpdateLocation] = useState<string>("");
  const [updateWebsite, setUpdateWebsite] = useState<string>("");
  const [updateTwitterUrl, setUpdateTwitterUrl] = useState<string>("");
  const [updateCoverPicture, setUpdateCoverPicture] = useState<string>("");

  const { signTypedDataAsync } = useSignTypedData();
  const { writeAsync } = useContractWrite(
    {
      addressOrName: LENS_PERIPHERY_CONTRACT,
      contractInterface: LENS_PERIPHERY_ABI,
    },
    "setProfileMetadataURIWithSig"
  );

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
            user: profile.ownedBy,
            profileId,
            metadata,
            sig: {
              v,
              r,
              s,
              deadline: typedData.value.deadline,
            },
          };
          writeAsync({ args: postARGS }).then((res) => {
            res.wait(1).then(() => {
              refetch();
              setIsUpdating(false);
            });
          });
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
      if (profile.name) setUpdateName(profile.name as string);
      if (profile.bio) setUpdateBio(profile.bio as string);
      if (checkLocation()) setUpdateLocation(checkLocation() as string);
      if (checkWebsite()) setUpdateWebsite(checkWebsite() as string);
      if (checkTwitter()) setUpdateTwitterUrl(checkTwitter() as string);
      setUpdateCoverPicture((profile.coverPicture as any) || "");
    }
  }, [profile]);

  const checkLocation = () => {
    const location = filterAttributes(profile.attributes, "location");
    if (location && location[0]) return location[0].value;
  };

  const checkWebsite = () => {
    const website = filterAttributes(profile.attributes, "website");
    if (website[0]) return website[0].value;
  };

  const checkTwitter = () => {
    const twitter = filterAttributes(profile.attributes, "twitter");
    if (twitter[0]) return twitter[0].value;
  };

  const handleSave = async () => {
    setIsUpdating(true);
    const payload = {
      name: updateName,
      bio: updateBio,
      cover_picture: updateCoverPicture,
      attributes: [
        {
          traitType: "string",
          value: updateLocation,
          key: "location",
        },
        {
          traitType: "string",
          value: updateWebsite,
          key: "website",
        },
        {
          traitType: "string",
          value: updateTwitterUrl,
          key: "twitter",
        },
      ],
    };
    const result = await uploadIpfsProfile({ payload });

    createSetProfileMetadataTypedData({
      variables: {
        request: {
          profileId: profile.id,
          metadata: "https://ipfs.infura.io/ipfs/" + result.path,
        },
      },
    });
  };

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
          <div className="h-1/2 overflow-y-scroll">
            <TextField
              className="my-4"
              name="name"
              label="Update Your Name"
              value={updateName}
              placeholder="name"
              onChange={(e) => setUpdateName(e.target.value)}
            />
            <TextField
              className="my-4"
              name="bio"
              label="Update Your Bio"
              value={updateBio}
              placeholder="bio"
              onChange={(e) => setUpdateBio(e.target.value)}
            />
            <TextField
              className="my-4"
              name="location"
              label="Update Your Location"
              value={updateLocation}
              placeholder="location"
              onChange={(e) => setUpdateLocation(e.target.value)}
            />
            <TextField
              className="my-4"
              name="website"
              label="Update Your Website Url"
              value={updateWebsite || ""}
              placeholder="website"
              onChange={(e) => setUpdateWebsite(e.target.value)}
            />
            <TextField
              className="my-4"
              name="twitter"
              label="Update Your Twitter Handle"
              value={updateTwitterUrl || ""}
              placeholder="Twitter Handle"
              onChange={(e) => setUpdateTwitterUrl(e.target.value)}
            />
          </div>
          <div className="mt-6">
            <Button className="p-2" onClick={() => handleSave()}>
              update profile
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
