import { useState, useContext } from "react";
import { useMutation, gql } from "@apollo/client";

import { useSignTypedData, useContractWrite } from "wagmi";
import { omit, splitSignature } from "@/lib/helpers";
import { LENS_HUB_PROXY_ADDRESS } from "@/lib/constants";
import LENS_ABI from "@/abis/Lens-Hub.json";

import { Button, Modal, Avatar } from "@/components/elements";
import { XIcon, CameraIcon } from "@heroicons/react/outline";

import { UserContext } from "@/components/layout";

import {
  EditProfile,
  SetProfileImage,
  SetFollowModule,
} from "@/components/profile";
import { Profile } from "@/types/graphql/generated";

const CREATE_SET_DEFAULT_PROFILE_TYPED_DATA = gql`
  mutation ($request: CreateSetDefaultProfileRequest!) {
    createSetDefaultProfileTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          SetDefaultProfileWithSig {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          wallet
          profileId
        }
      }
    }
  }
`;

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type EditProfileButtonProps = {
  profile: Profile;
  refetch: () => void;
};

export const EditProfileButton = ({
  profile,
  refetch,
}: EditProfileButtonProps) => {
  const { currentUser, defaultProfile, refechProfiles } =
    useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editProfileImage, setEditProfileImage] = useState<boolean>(false);
  const [editProfile, setEditProfile] = useState("profile");
  const handleClose = () => setIsOpen(false);

  // console.log(currentUser);
  // console.log(defaultProfile);

  const { signTypedDataAsync } = useSignTypedData();
  const { writeAsync } = useContractWrite({
    addressOrName: LENS_HUB_PROXY_ADDRESS,
    contractInterface: LENS_ABI,
    functionName: "setDefaultProfileWithSig",
  });

  const [createSetDefaultProfileTypedData, {}] = useMutation(
    CREATE_SET_DEFAULT_PROFILE_TYPED_DATA,
    {
      onCompleted({ createSetDefaultProfileTypedData }: any) {
        const { typedData } = createSetDefaultProfileTypedData;
        if (!createSetDefaultProfileTypedData)
          console.log("createSetDefaultProfileTypedData is null");
        const { profileId, wallet } = typedData?.value;

        signTypedDataAsync({
          domain: omit(typedData?.domain, "__typename"),
          types: omit(typedData?.types, "__typename"),
          value: omit(typedData?.value, "__typename"),
        }).then((res) => {
          if (res) {
            const { v, r, s } = splitSignature(res);
            const postARGS = {
              profileId,
              wallet,
              sig: {
                v,
                r,
                s,
                deadline: typedData.value.deadline,
              },
            };
            writeAsync({ args: postARGS }).then((res) => {
              res.wait(1).then(() => {
                console.log("COMPLETE");
                // console.log(res);
                refechProfiles();
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
    }
  );

  const handleButton = () => {
    setIsOpen(true);
  };

  const handleRefetch = async () => {
    await refetch();
    setEditProfileImage(!editProfileImage);
  };

  const handleSetDefault = () => {
    setIsUpdating(true);

    createSetDefaultProfileTypedData({
      variables: {
        request: {
          // options: { overrideSigNonce: 1 },
          profileId: profile.id,
        },
      },
    });
  };

  return (
    <>
      <Button className="p-2" onClick={() => handleButton()}>
        edit profile
      </Button>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <div className="bg-white rounded p-2 -z-20">
          <div className="flex justify-between pb-2">
            <div className="pt-2 font-bold text-stone-700 text-lg">
              <div className=" flex h-7 items-center">
                <span className="pl-4">Edit Profile</span>
              </div>
            </div>
            <button
              type="button"
              className="rounded-full p-2 bg-white hover:bg-stone-200 text-stone-400 hover:text-stone-500 focus:outline-none"
              onClick={() => handleClose()}
            >
              <span className="sr-only">Close panel</span>
              <XIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="flex justify-between">
            <div
              className="ml-4 z-20 flex cursor-pointer"
              onClick={() => setEditProfile("avatar")}
            >
              <Avatar profile={profile} size={"medium"} />
              <div className="mt-10 -ml-4 p-1 rounded-full bg-stone-200">
                <CameraIcon className="h-4 w-4" aria-hidden="true" />
              </div>
            </div>
            <div className="m-auto">
              {isUpdating ? (
                <button
                  disabled
                  className="py-1 px-3 border rounded-xl border-stone-500 font-medium text-stone-700"
                >
                  updating...
                </button>
              ) : (
                <>
                  {currentUser?.id === defaultProfile?.id ? (
                    <button
                      disabled
                      className="py-1 px-3 border rounded-xl text-sky-600 font-medium border-sky-400"
                    >
                      default profile
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSetDefault()}
                      className="py-1 px-3 border-2 border-stone-500 hover:border-stone-700 rounded-xl text-stone-700 hover:text-stone-100 hover:bg-stone-700 hover:shadow-lg font-medium"
                    >
                      set as default
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex m-4">
            <button
              onClick={() => setEditProfile("profile")}
              className={classNames(
                editProfile === "profile"
                  ? "bg-stone-700 text-stone-100"
                  : "text-gray-600 hover:bg-stone-500 hover:text-stone-100 cursor-pointer",
                "text-center  py-2 text-sm font-medium rounded-md w-1/2 border rounded-l-2xl"
              )}
            >
              Profile
            </button>
            <button
              onClick={() => setEditProfile("settings")}
              className={classNames(
                editProfile === "settings"
                  ? "bg-stone-700 text-stone-100"
                  : "text-gray-600 hover:bg-stone-500 hover:text-stone-100 cursor-pointer",
                "text-center  py-2 text-sm font-medium rounded-md w-1/2 border rounded-r-2xl"
              )}
            >
              Settings
            </button>
          </div>
          <div className="h-6/10 px-4">
            {editProfile === "avatar" && (
              <div className="pt-8">
                <SetProfileImage
                  profileId={profile.id}
                  refetch={handleRefetch}
                />
              </div>
            )}
            {editProfile === "profile" && (
              <EditProfile profile={profile} refetch={handleRefetch} />
            )}
            {editProfile === "settings" && (
              <SetFollowModule
                profile={profile}
                currentFollowModule={profile.followModule}
                refetch={handleRefetch}
              />
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};
