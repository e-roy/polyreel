import React, { useState } from "react";
import { useAccount } from "wagmi";
import { useMutation } from "@apollo/client";

import { CREATE_PROFILE } from "@/queries/profile/create-profile";
import { Button, TextField } from "@/components/elements";

export const CreateProfile = () => {
  const [handle, setHandle] = useState("");
  const [createProfile, { data, loading, error }] = useMutation(
    CREATE_PROFILE,
    {
      variables: {
        request: { handle: handle },
      },
    }
  );

  if (loading) return <p>Submitting...</p>;
  if (error) return <p>Submission error! {error.message}</p>;
  // console.log(data);
  return (
    <div className="p-2 border rounded">
      <h1 className="text-xl font-bold text-center cursor-pointer">
        Create Profile
      </h1>
      <form onSubmit={() => createProfile()}>
        <TextField
          className="my-4"
          name="handle"
          label="Enter Your Handle"
          value={handle}
          placeholder="Handle"
          required
          onChange={(e) => setHandle(e.target.value)}
        />
        <Button disabled={handle === ""} type="submit">
          Create Profile
        </Button>
      </form>
    </div>
  );
};
