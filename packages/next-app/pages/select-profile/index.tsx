import { useContext } from "react";
import { UserContext } from "@/components/layout";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { CreateProfile } from "@/components/create-profile";
import { Button } from "@/components/elements";
import { Logout } from "@/components/lens/auth";

const SelectProfile: NextPage = () => {
  const router = useRouter();
  const { profiles, setCurrentUser } = useContext(UserContext);
  // console.log(profiles);

  const handleSelectProfile = (profile: any) => {
    localStorage.setItem("polyreel_current_user_profile_id", profile.id);
    setCurrentUser(profile);
    router.push(`/profile/${profile.handle}`);
  };

  const baseClass =
    "flex cursor-pointer py-2 px-2 sm:px-6 rounded-lg uppercase text-stone-700 font-semibold hover:bg-sky-200 transition ease-in-out duration-150";

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-stone-200">
      <Head>
        <title>polyreel</title>
        <meta name="description" content="polyreel" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex justify-end mx-8 mt-4">
        <div>
          <Button className="w-30">
            <Logout />
          </Button>
        </div>
      </div>
      <div className="h-screen flex items-center justify-center text-stone-700">
        <div className="flex flex-col rounded-lg shadow-lg w-1/2 p-10 bg-white">
          <div className="flex justify-center"></div>

          <div>
            <div className="border">
              <div className="py-2 text-center text-2xl font-bold">
                Select A Profile
              </div>
              <div className="h-60 overflow-y-scroll">
                {profiles?.map((profile, index) => (
                  <div
                    key={index}
                    className={`${baseClass}`}
                    onClick={() => handleSelectProfile(profile)}
                  >
                    {profile.picture ? (
                      <div className="h-10 w-10 border-2 rounded-full">
                        <img
                          src={profile.picture.original.url}
                          alt={profile.handle}
                          className="rounded-full"
                        />
                      </div>
                    ) : (
                      <div className="bg-slate-300 rounded-full h-10 w-10 border-2"></div>
                    )}
                    <div className="mt-2 px-4">{profile.handle}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="my-6 text-center font-semibold text-lg">or</div>
          </div>

          <div className={`${baseClass}`}>
            <CreateProfile />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectProfile;