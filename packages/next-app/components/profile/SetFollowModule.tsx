import { useState, useEffect, useContext } from "react";
import { UserContext } from "@/components/layout";
import { XIcon } from "@heroicons/react/outline";
import { Button, Modal, Loading } from "@/components/elements";

import { useSignTypedData, useContractWrite } from "wagmi";
import { omit, splitSignature } from "@/lib/helpers";

import { useMutation } from "@apollo/client";
import { CREATE_SET_FOLLOW_MODULE_TYPED_DATA } from "@/queries/follow/set-follow-module";

import LENS_ABI from "@/abis/Lens-Hub.json";
import { LENS_HUB_PROXY_ADDRESS } from "@/lib/constants";

interface SetFollowModuleProps {
  currentFollowModule: any;
}

export const SetFollowModule = ({
  currentFollowModule,
}: SetFollowModuleProps) => {
  const { currentUser } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  const [followType, setFollowType] = useState("anyone");
  const [isProcessing, setIsProcessing] = useState(false);

  const { signTypedDataAsync } = useSignTypedData();
  const { writeAsync } = useContractWrite(
    {
      addressOrName: LENS_HUB_PROXY_ADDRESS,
      contractInterface: LENS_ABI,
    },
    "setFollowModuleWithSig"
  );
  const [createSetFollowModuleTypedData, {}] = useMutation(
    CREATE_SET_FOLLOW_MODULE_TYPED_DATA,
    {
      onCompleted({ createSetFollowModuleTypedData }: any) {
        if (!createSetFollowModuleTypedData)
          console.log("createSetFollowModuleTypedData is null");

        const { typedData } = createSetFollowModuleTypedData;
        const { profileId, followModule, followModuleInitData } =
          typedData?.value;

        signTypedDataAsync({
          domain: omit(typedData?.domain, "__typename"),
          types: omit(typedData?.types, "__typename"),
          value: omit(typedData?.value, "__typename"),
        }).then((res) => {
          const { v, r, s } = splitSignature(res);
          const postARGS = {
            profileId,
            followModule,
            followModuleInitData,
            sig: {
              v,
              r,
              s,
              deadline: typedData.value.deadline,
            },
          };

          writeAsync({ args: postARGS })
            .then((res) => {
              res.wait(1).then(() => {
                // refetch();
                // setIsUpdating(false);
                setIsProcessing(false);
              });
            })
            .catch((error) => {
              console.log("error", error);
              setIsProcessing(false);
            });
        });
      },
      onError(error) {
        console.log(error);
        setIsProcessing(false);
      },
    }
  );

  const handleSetFollowModule = async () => {
    // console.log(followType);
    setIsProcessing(true);
    let followModule = null;
    if (followType === "anyone")
      followModule = {
        freeFollowModule: true, // allow anyone to follow
      };
    else if (followType === "profiles")
      followModule = {
        profileFollowModule: true, // allow only those with profiles to follow
      };
    else if (followType === "nofollow")
      followModule = {
        revertFollowModule: true, // don't allow anyone to follow
      };
    else followModule = null;

    createSetFollowModuleTypedData({
      variables: {
        request: {
          profileId: currentUser?.id,
          followModule: followModule,

          // feeFollowModule: {
          //   amount: {
          //     currency: '0x3C68CE8504087f89c640D02d133646d98e64ddd9',
          //     value: '0.01',
          //   },
          //   recipient: address,
          // },
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
    if (currentFollowModule?.__typename === "ProfileFollowModuleSettings")
      setFollowType("profiles");
    if (currentFollowModule?.__typename === "RevertFollowModuleSettings")
      setFollowType("nofollow");
    if (currentFollowModule?.__typename === "FeeFollowModuleSettings")
      setFollowType("fee");
  }, [currentFollowModule]);

  return (
    <>
      <Button className="p-2 mr-4" onClick={() => setIsOpen(true)}>
        follower settings
      </Button>

      <Modal isOpen={isOpen} onClose={handleClose}>
        <div className="bg-white rounded p-2 sm:p-6">
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
                <span className="pl-4">Follower Settings</span>
              </div>
            </div>
            <div></div>
          </div>
          {isProcessing ? (
            <div className="py-32">
              <Loading type={"Processing"} />
            </div>
          ) : (
            <div>
              <fieldset className="space-y-5 p-4">
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
                      className="focus:ring-sky-500 h-4 w-4 text-sky-600 border-gray-300 rounded"
                      onChange={(e) => setFollowType(e.target.value)}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="anyone"
                      className="font-medium text-gray-700"
                    >
                      Anyone
                    </label>
                    <p id="anyone-description" className="text-gray-500">
                      Allow anyone to follow you
                    </p>
                  </div>
                </div>
                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="profiles"
                      aria-describedby="profiles-description"
                      name="followtype"
                      type="radio"
                      value="profiles"
                      checked={followType === "profiles"}
                      className="focus:ring-sky-500 h-4 w-4 text-sky-600 border-gray-300 rounded"
                      onChange={(e) => setFollowType(e.target.value)}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="profiles"
                      className="font-medium text-gray-700"
                    >
                      Profiles Only
                    </label>
                    <p id="profiles-description" className="text-gray-500">
                      Allow only those with a Lens Profile to follow you
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
                      className="focus:ring-sky-500 h-4 w-4 text-sky-600 border-gray-300 rounded"
                      onChange={(e) => setFollowType(e.target.value)}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="nofollow"
                      className="font-medium text-gray-700"
                    >
                      No Followers
                    </label>
                    <p id="nofollow-description" className="text-gray-500">
                      Don't allow anyone to follow you
                    </p>
                  </div>
                </div>
              </fieldset>
              <div className="m-4">
                <Button className="p-2" onClick={() => handleSetFollowModule()}>
                  update follow settings
                </Button>
              </div>
              {followType === "fee" && (
                <div className="bg-rose-700 m-4 p-2 font-medium text-stone-200 text-lg text-center rounded-2xl">
                  <div>
                    warning: you currently have a fee set to follow you.
                  </div>
                  <div>this app can not set this feature</div>
                  <div>feature coming soon</div>
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};
