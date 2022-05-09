import { useState, useEffect, useContext } from "react";

import { Button, Modal, TextField, Avatar } from "@/components/elements";
import { XIcon, PencilIcon } from "@heroicons/react/outline";

import { UserContext } from "@/components/layout";
import { useMutation } from "@apollo/client";
import { UPDATE_PROFILE } from "@/queries/profile/update-profile";
import { uploadIpfsProfile } from "@/lib/ipfs/ipfsProfile";

import { SetProfileImage } from "@/components/profile";

import { useSignTypedData, useContractWrite } from "wagmi";
import { omit, splitSignature } from "@/lib/helpers";
import LENS_PERIPHERY_ABI from "@/abis/Lens-Periphery.json";

import { LENS_PERIPHERY_CONTRACT } from "@/lib/constants";

type EditProfileButtonProps = {
  refetch: () => void;
};

export const EditProfileButton = ({ refetch }: EditProfileButtonProps) => {
  const { currentUser, refechProfiles } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [editProfileImage, setEditProfileImage] = useState<boolean>(false);
  const handleClose = () => setIsOpen(false);
  const [updateName, setUpdateName] = useState<string>("");
  const [updateBio, setUpdateBio] = useState<string>("");
  const [updateLocation, setUpdateLocation] = useState<string>("");
  const [updateWebsite, setUpdateWebsite] = useState<string>("");
  const [updateTwitterUrl, setUpdateTwitterUrl] = useState<string>("");
  const [updateCoverPicture, setUpdateCoverPicture] = useState<string>("");

  const { signTypedData, signTypedDataAsync } = useSignTypedData();
  const { write, writeAsync } = useContractWrite(
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
      // console.log("HERE WITH TYPE DATA", typedData);
      // console.log(profileId);
      // console.log(metadata);
      signTypedDataAsync({
        domain: omit(typedData?.domain, "__typename"),
        types: omit(typedData?.types, "__typename"),
        value: omit(typedData?.value, "__typename"),
      }).then((res) => {
        if (res) {
          const { v, r, s } = splitSignature(res);
          const postARGS = {
            user: currentUser?.ownedBy,
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
            if (res) {
              // console.log(res.data);
              refechProfiles();
              setIsOpen(false);
              // reset form  and other closing actions
            } else {
              console.log(res);
            }
          });
        }
        // console.log(res);
      });
    },
    onError(error) {
      console.log(error);
    },
  });

  useEffect(() => {
    if (currentUser) {
      if (currentUser?.name) setUpdateName(currentUser?.name as string);
      if (currentUser?.bio) setUpdateBio(currentUser?.bio as string);
      if (currentUser?.location)
        setUpdateLocation(currentUser?.location as string);
      setUpdateWebsite((currentUser?.website as string) || "");
      setUpdateTwitterUrl((currentUser?.twitter as string) || "");
      setUpdateCoverPicture((currentUser?.coverPicture as any) || "");
    }
  }, [currentUser]);

  const handleButton = () => {
    setIsOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      name: updateName,
      bio: updateBio,
      location: updateLocation,
      cover_picture: updateCoverPicture,
      social: [
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
    // console.log("result", result.path);

    createSetProfileMetadataTypedData({
      variables: {
        request: {
          profileId: currentUser?.id,
          metadata: "https://ipfs.infura.io/ipfs/" + result,
          // metadata: "https://ipfs.infura.io/ipfs/" + result.path,
        },
      },
    });
  };

  const handleRefetch = async () => {
    await refetch();
    setEditProfileImage(!editProfileImage);
  };

  return (
    <>
      <Button className="py-2 px-4" onClick={() => handleButton()}>
        edit profile
      </Button>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <div className="bg-white rounded p-2 -z-20">
          <div className="flex justify-between pb-2">
            <div className="pt-2 font-bold text-stone-700 text-lg">
              <div className=" flex h-7 items-center">
                <button
                  type="button"
                  className="rounded-full p-2 bg-white hover:bg-stone-200 text-stone-400 hover:text-stone-500 focus:outline-none"
                  onClick={() => handleClose()}
                >
                  <span className="sr-only">Close panel</span>
                  <XIcon className="h-5 w-5" aria-hidden="true" />
                </button>
                <span className="pl-4">Edit Profile</span>
              </div>
            </div>
            <div>
              <Button className="py-1 px-2" onClick={() => handleSave()}>
                save
              </Button>
            </div>
          </div>
          {currentUser?.coverPicture && currentUser?.coverPicture ? (
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
          )}

          <div className="flex justify-between">
            <div
              className="-mt-8 ml-4 z-20 flex cursor-pointer"
              onClick={() => setEditProfileImage(!editProfileImage)}
            >
              <Avatar profile={currentUser as any} size={"medium"} />
              <div className="mt-10 -ml-4 p-1 rounded-full bg-stone-200">
                <PencilIcon className="h-4 w-4" aria-hidden="true" />
              </div>
            </div>
            <div></div>
          </div>

          {editProfileImage ? (
            <div className="h-1/2 py-8 px-4">
              <SetProfileImage
                profileId={currentUser?.id as string}
                refetch={handleRefetch}
              />
            </div>
          ) : (
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
          )}
        </div>
      </Modal>
    </>
  );
};
