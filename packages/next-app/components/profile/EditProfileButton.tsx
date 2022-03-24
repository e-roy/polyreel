import { useState, useEffect } from "react";
import { Button, Modal, TextField } from "@/components/elements";
import { XIcon } from "@heroicons/react/outline";
import { useMutation } from "@apollo/client";
import { UPDATE_PROFILE } from "@/queries/profile/update-profile";

type EditProfileButtonProps = {
  refetch: () => void;
};

export const EditProfileButton = ({ refetch }: EditProfileButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [profileHandle, setProfileHandle] = useState<string | null>(null);
  const [updateName, setUpdateName] = useState("");
  const [updateBio, setUpdateBio] = useState("");
  const [updateLocation, setUpdateLocation] = useState("");
  const [updateWebsite, setUpdateWebsite] = useState(null);
  const [updateTwitterUrl, setUpdateTwitterUrl] = useState(null);
  const [updateCoverPicture, setUpdateCoverPicture] = useState(null);

  const [updateProfile, { data, loading, error }] = useMutation(
    UPDATE_PROFILE,
    {
      variables: {
        request: {
          profileId,
          name: updateName,
          bio: updateBio,
          location: updateLocation,
          website: updateWebsite,
          twitterUrl: updateTwitterUrl,
          coverPicture: updateCoverPicture,
        },
      },
    }
  );
  useEffect(() => {
    setProfileId(sessionStorage.getItem("polyreel_profile_id"));
    setProfileHandle(sessionStorage.getItem("polyreel_profile_handle"));
    setProfilePicture(sessionStorage.getItem("polyreel_profile_picture"));
  }, []);

  useEffect(() => {
    if (data) {
      setIsOpen(false);
      refetch();
    }
  }, [data]);

  const handleButton = () => {
    setIsOpen(true);
  };

  const handleSave = () => {
    updateProfile();
  };

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
          {/* <div className="relative h-40 sm:h-56 ">
            <img
              className="absolute h-full w-full object-cover sm:border-2 border-transparent rounded-lg z-20"
              src="https://images.unsplash.com/photo-1501031170107-cfd33f0cbdcc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&h=600&q=80"
              alt=""
            />
          </div> */}
          <div className="relative bg-gradient-to-r from-sky-600 via-purple-700 to-purple-500 h-40 sm:h-56 max-h-64 rounded-t shadow-xl"></div>

          <div className="-mt-8 z-30">
            <>
              {/* {profilePicture ? (
                <div className="h-12 w-12 relative rounded-full border-2 shadow-md">
                  <img src={profilePicture} alt="" className="rounded-full" />
                </div>
              ) : ( */}
              <div className="rounded-full h-12 w-12 bg-gray-800 border-2 shadow-md"></div>
              {/* )} */}
            </>
          </div>
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
        </div>
      </Modal>
    </>
  );
};
