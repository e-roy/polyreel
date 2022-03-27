import { useState, useEffect, useContext } from "react";
import { Button, Modal, TextField, Avatar } from "@/components/elements";
import { XIcon } from "@heroicons/react/outline";

import { UserContext } from "@/components/layout";
import { useMutation } from "@apollo/client";
import { UPDATE_PROFILE } from "@/queries/profile/update-profile";

type EditProfileButtonProps = {};

type coverPhotoType = {
  original: {
    url: string;
    mime: string;
  };
};

export const EditProfileButton = ({}: EditProfileButtonProps) => {
  const { currentUser, refechProfiles } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const [updateName, setUpdateName] = useState<string>("");
  const [updateBio, setUpdateBio] = useState<string>("");
  const [updateLocation, setUpdateLocation] = useState<string>("");
  // const [updateWebsite, setUpdateWebsite] = useState<string | null>(null);
  // const [updateTwitterUrl, setUpdateTwitterUrl] = useState<string | null>(null);
  // const [updateCoverPicture, setUpdateCoverPicture] =
  //   useState<coverPhotoType | null>(null);

  const [updateProfile, { data, loading, error }] = useMutation(
    UPDATE_PROFILE,
    {
      variables: {
        request: {
          profileId: currentUser?.id,
          name: updateName,
          bio: updateBio,
          location: updateLocation,
          website: "https://mumbai.polygonscan.com/",
          twitterUrl: "https://twitter.com/",
          coverPicture: null,
        },
      },
    }
  );

  useEffect(() => {
    if (currentUser) {
      if (currentUser?.name) setUpdateName(currentUser?.name as string);
      if (currentUser?.bio) setUpdateBio(currentUser?.bio as string);
      if (currentUser?.location)
        setUpdateLocation(currentUser?.location as string);
      // setUpdateWebsite((currentUser?.website as string) || null);
      // setUpdateTwitterUrl((currentUser?.twitterUrl as string) || null);
      // setUpdateCoverPicture(currentUser.coverPicture as coverPhotoType | any);
    }
  }, [currentUser]);

  const handleButton = () => {
    setIsOpen(true);
  };

  const handleSave = async () => {
    await updateProfile();
    refechProfiles();
    setIsOpen(false);
  };

  // console.log(currentUser);
  // console.log(data);
  // console.log(loading);
  // console.log(error);

  return (
    <>
      <Button className="w-30" onClick={() => handleButton()}>
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
                <span className="pl-4"> Edit Profile</span>
              </div>
            </div>
            <div>
              <Button onClick={() => handleSave()}>save</Button>
            </div>
          </div>
          {currentUser?.coverPicture && currentUser?.coverPicture.original ? (
            <div className="relative h-40 sm:h-56 ">
              <img
                className="absolute h-full w-full object-cover sm:border-2 border-transparent rounded-lg z-20"
                src={currentUser?.coverPicture.original.url}
                alt=""
              />
            </div>
          ) : (
            <div className=" bg-gradient-to-r from-sky-600 via-purple-700 to-purple-500 h-40 sm:h-56 max-h-64 rounded-t shadow-xl"></div>
          )}

          <div className="-mt-8 ml-4">
            <Avatar profile={currentUser} size={"medium"} />
          </div>

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
            {/* <TextField
              className="my-4"
              name="website"
              label="Update Your Website Url"
              value={updateWebsite}
              placeholder="website"
              onChange={(e) => setUpdateWebsite(e.target.value)}
            />
            <TextField
              className="my-4"
              name="twitter"
              label="Update Your Twitter Url"
              value={updateTwitterUrl}
              placeholder="location"
              onChange={(e) => setUpdateTwitterUrl(e.target.value)}
            /> */}
          </div>
        </div>
      </Modal>
    </>
  );
};
