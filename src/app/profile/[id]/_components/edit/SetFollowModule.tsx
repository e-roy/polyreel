"use client";

import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/elements/Loading";

import { UserContext } from "@/context/UserContext/UserContext";

import { useAccount, useSignTypedData, useWriteContract } from "wagmi";
import { omit, splitSignature } from "@/lib/helpers";

import { gql, useMutation } from "@apollo/client";
import { CREATE_SET_FOLLOW_MODULE_TYPED_DATA } from "../../_graphql/set-follow-module";

import { LensHub } from "@/abis/LensHub";
import { LENS_HUB_PROXY_ADDRESS } from "@/lib/constants";

import {
  Maybe,
  Profile,
  Scalars,
  CreateSetFollowModuleBroadcastItemResult,
  FollowModuleInput,
} from "@/types/graphql/generated";

const CREATE_SET_DEFAULT_PROFILE_TYPED_DATA = gql`
  mutation SetDefaultProfile($request: SetDefaultProfileRequest!) {
    setDefaultProfile(request: $request)
  }
`;

interface FollowArgs {
  profileId: string;
  followModule: any;
  followModuleInitData: any;
  signature: {
    signer: string;
    v: number;
    r: string;
    s: string;
    deadline: string;
  };
}

interface CreateSetFollowModuleResult {
  createSetFollowModuleTypedData: CreateSetFollowModuleBroadcastItemResult;
}

interface SetFollowModuleProps {
  profile: Profile;
  currentFollowModule: any;
  refetch: () => void;
}

export const SetFollowModule = ({
  profile,
  currentFollowModule,
  refetch,
}: SetFollowModuleProps) => {
  const { defaultProfile } = useContext(UserContext);
  const { address } = useAccount();

  const [followType, setFollowType] = useState<"anyone" | "nofollow" | "fee">(
    "anyone"
  );

  const [defaultProfileId, setDefaultProfileId] = useState<string>(
    defaultProfile?.id || ""
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const [isUpdating, setIsUpdating] = useState(false);

  const { signTypedDataAsync } = useSignTypedData();

  const { writeContractAsync } = useWriteContract({
    mutation: {
      onError: (error) => {
        console.error("Error writing contract:", error);
        setIsProcessing(false);
      },
    },
  });

  const write = async (args: FollowArgs) => {
    try {
      const res = await writeContractAsync({
        address: LENS_HUB_PROXY_ADDRESS,
        abi: LensHub,
        functionName: "setFollowModuleWithSig",
        args: [
          args.profileId,
          args.followModule,
          args.followModuleInitData,
          args.signature,
        ],
      });
      return res;
    } catch (error) {
      console.error("Error writing contract:", error);
      throw error;
    }
  };

  const [
    createSetFollowModuleTypedData,
    { loading: createSetFollowModuleLoading },
  ] = useMutation<CreateSetFollowModuleResult>(
    CREATE_SET_FOLLOW_MODULE_TYPED_DATA,
    {
      onCompleted({
        createSetFollowModuleTypedData,
      }: CreateSetFollowModuleResult) {
        if (!createSetFollowModuleTypedData) {
          console.error("createSetFollowModuleTypedData is null");
          return;
        }

        const { typedData } = createSetFollowModuleTypedData;
        if (!typedData) {
          console.error("typedData is undefined");
          return;
        }

        const { profileId, followModule, followModuleInitData } =
          typedData.value;

        signTypedDataAsync({
          domain: omit(typedData?.domain, "__typename"),
          types: omit(typedData?.types, "__typename"),
          primaryType: "SetFollowModule",
          message: omit(typedData?.value, "__typename"),
        })
          .then((res) => {
            const { v, r, s } = splitSignature(res);
            const followArgs: FollowArgs = {
              profileId,
              followModule,
              followModuleInitData,
              signature: {
                signer: address!,
                v,
                r,
                s,
                deadline: typedData.value.deadline,
              },
            };

            return write(followArgs);
          })
          .then((res) => {
            console.log("Write result:", res);
            setIsProcessing(false);
          })
          .catch((error) => {
            console.error("Error creating follow typed data:", error);
            setIsProcessing(false);
          });
      },
      onError(error) {
        console.log(error);
        setIsProcessing(false);
      },
    }
  );

  const handleSetFollowModule = async () => {
    setIsProcessing(true);

    const followModule: FollowModuleInput = {};

    if (followType === "anyone") {
      followModule.freeFollowModule = true;
    } else if (followType === "nofollow") {
      followModule.revertFollowModule = true;
    }

    createSetFollowModuleTypedData({
      variables: {
        request: {
          followModule,
        },
      },
    });
  };

  useEffect(() => {
    if (
      !currentFollowModule?.__typename ||
      currentFollowModule?.__typename === "FreeFollowModule"
    )
      setFollowType("anyone");
    if (currentFollowModule?.__typename === "RevertFollowModuleSettings")
      setFollowType("nofollow");
    if (currentFollowModule?.__typename === "FeeFollowModuleSettings")
      setFollowType("fee");
  }, [currentFollowModule]);

  const [setDefaultProfile] = useMutation<{
    setDefaultProfile: Maybe<Scalars["Void"]>;
  }>(CREATE_SET_DEFAULT_PROFILE_TYPED_DATA, {
    onCompleted({ setDefaultProfile }) {
      setDefaultProfileId(profile.id);
      setIsUpdating(false);
    },
    onError(error) {
      console.error("Error setting default profile:", error);
      setIsUpdating(false);
    },
  });

  const handleSetDefault = () => {
    setIsUpdating(true);
    setDefaultProfile({
      variables: {
        request: {
          profileId: profile.id,
        },
      },
    });
  };

  return (
    <>
      {isProcessing || createSetFollowModuleLoading ? (
        <div className="py-8 px-4 h-[60vh]">
          <div>
            Verify the wallet transaction to finish updating your profile.
          </div>
          <Loading />
        </div>
      ) : (
        <div className="h-[60vh]">
          <div className="h-1/2 overflow-y-scroll">
            <div className="m-auto mt-6">
              {isUpdating ? (
                <button
                  disabled
                  className="py-1 px-3 border rounded-xl border-stone-500 font-medium text-stone-700"
                >
                  updating...
                </button>
              ) : (
                <>
                  {profile?.id === defaultProfileId ? (
                    <button
                      disabled
                      className="py-1 px-3 border rounded-xl text-sky-600 font-medium border-sky-400"
                    >
                      default profile
                    </button>
                  ) : (
                    <button
                      onClick={handleSetDefault}
                      className="py-1 px-3 border-2 border-stone-500 hover:border-stone-700 rounded-xl text-stone-700 hover:text-stone-100 hover:bg-stone-700 hover:shadow-lg font-medium"
                    >
                      set as default
                    </button>
                  )}
                </>
              )}
            </div>
            <fieldset className="space-y-5 py-4">
              <legend className="sr-only">Follower Settings</legend>
              <div className="relative flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="anyone"
                    aria-describedby="anyone-description"
                    name="followtype"
                    type="radio"
                    value="anyone"
                    checked={followType === "anyone"}
                    className="focus:ring-sky-500 h-4 w-4 border-gray-300 rounded"
                    onChange={(e) =>
                      setFollowType(
                        e.target.value as "anyone" | "nofollow" | "fee"
                      )
                    }
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="anyone" className="font-medium ">
                    Anyone
                  </label>
                  <p id="anyone-description" className="text-primary/60">
                    Allow anyone to follow you
                  </p>
                </div>
              </div>

              <div className="relative flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="nofollow"
                    aria-describedby="nofollow-description"
                    name="followtype"
                    type="radio"
                    value="nofollow"
                    checked={followType === "nofollow"}
                    className="focus:ring-sky-500 h-4 w-4 border-gray-300 rounded"
                    onChange={(e) =>
                      setFollowType(
                        e.target.value as "anyone" | "nofollow" | "fee"
                      )
                    }
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="nofollow" className="font-medium">
                    No Followers
                  </label>
                  <p id="nofollow-description" className="text-primary/60">
                    {`Don't allow anyone to follow you`}
                  </p>
                </div>
              </div>
            </fieldset>

            {followType === "fee" && (
              <div className="bg-rose-700 m-4 p-2 font-medium text-stone-200 text-lg text-center rounded-2xl">
                <div>warning: you currently have a fee set to follow you.</div>
                <div>this app can not set this feature</div>
                <div>feature coming soon</div>
              </div>
            )}
            <div className="mt-6">
              <Button
                className="uppercase"
                onClick={handleSetFollowModule}
                type="button"
              >
                update follow settings
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
