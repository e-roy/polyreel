import React, { useState, MouseEvent, FormEvent } from "react";
import { useMutation } from "@apollo/client";

import { UPDATE_PROFILE } from "@/queries/profile/update-profile";
import { Button, TextField } from "@/components/elements";

export type UpdateProfileProps = {
  profileId: string;
};

export const UpdateProfile = ({ profileId }: UpdateProfileProps) => {
  //   const profileId = "0x45";
  // const profileId = "0xA0"; // ryan
  // const profileId = "0x45"; // number
  // const profileId = "0x4A"; // waxy
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateProfile();
  };

  if (loading) return <p>Submitting...</p>;
  if (error) return <p>Submission error! {error.message}</p>;
  // console.log(data);
  return (
    <div className="p-2 border rounded">
      <h1 className="text-xl font-bold text-center cursor-pointer">
        Update Profile - {profileId}
      </h1>

      <form onSubmit={(e) => handleSubmit(e)}>
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
          label="Update Your Website"
          value={updateWebsite}
          placeholder="website"
          onChange={(e) => setUpdateWebsite(e.target.value)}
        />
        <TextField
          className="my-4"
          name="twitterUrl"
          label="Update Your Twitter Url"
          value={updateTwitterUrl}
          placeholder="twitter"
          onChange={(e) => setUpdateTwitterUrl(e.target.value)}
        />
        <TextField
          className="my-4"
          name="coverPicture"
          label="Update Your Cover Picture"
          value={updateCoverPicture}
          placeholder="cover picture"
          onChange={(e) => setUpdateCoverPicture(e.target.value)}
        /> */}

        <Button type="submit">Update Profile</Button>
      </form>
    </div>
  );
};
