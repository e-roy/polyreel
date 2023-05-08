import { useCallback, useContext, useState } from "react";
import { UserContext } from "@/context";
import { FaRegCopy, FaRetweet } from "react-icons/fa";
import { AiOutlineRetweet } from "react-icons/ai";

import { useMutation } from "@apollo/client";
import { CREATE_MIRROR_TYPED_DATA } from "@/queries/publications/mirror";

import { useSignTypedData, useContractWrite } from "wagmi";
import { omit, splitSignature } from "@/lib/helpers";

import LENS_ABI from "@/abis/Lens-Hub.json";
import { LENS_HUB_PROXY_ADDRESS } from "@/lib/constants";

import { Post } from "@/types/graphql/generated";

interface IMirrorProps {
  publication: Post;
}

export const Mirror = ({ publication }: IMirrorProps) => {
  const { currentUser } = useContext(UserContext);
  const [isMirrored, setIsMirrored] = useState(false);

  const { stats, mirrors } = publication;

  const checkMirrors = useCallback(() => {
    if (mirrors) {
      return mirrors.some((mirror) => mirror.includes(currentUser?.id));
    }
  }, [mirrors, currentUser]);

  const { signTypedDataAsync } = useSignTypedData();
  const { writeAsync } = useContractWrite({
    address: LENS_HUB_PROXY_ADDRESS,
    abi: LENS_ABI,
    functionName: "mirrorWithSig",
    mode: "recklesslyUnprepared",
  });

  const [createMirrorTypedData, {}] = useMutation(CREATE_MIRROR_TYPED_DATA, {
    onCompleted({ createMirrorTypedData }: any) {
      const { typedData } = createMirrorTypedData;
      if (!createMirrorTypedData) console.log("createMirrorTypedData is null");
      const {
        profileId,
        profileIdPointed,
        pubIdPointed,
        referenceModule,
        referenceModuleData,
        referenceModuleInitData,
      } = typedData?.value;

      signTypedDataAsync({
        domain: omit(typedData?.domain, "__typename"),
        types: omit(typedData?.types, "__typename"),
        value: omit(typedData?.value, "__typename"),
      }).then((res) => {
        const { v, r, s } = splitSignature(res);
        const postARGS = {
          profileId,
          profileIdPointed,
          pubIdPointed,
          referenceModule,
          referenceModuleData,
          referenceModuleInitData,
          sig: {
            v,
            r,
            s,
            deadline: typedData.value.deadline,
          },
        };
        // write({ recklesslySetUnpreparedArgs: [postARGS] });
        writeAsync({ recklesslySetUnpreparedArgs: [postARGS] }).then((res) => {
          res.wait(1).then(() => {
            setIsMirrored(true);
            // console.log("res", res);
          });
        });
      });
    },
    onError(error) {
      console.log(error);
    },
  });

  const handleMirror = useCallback(() => {
    createMirrorTypedData({
      variables: {
        request: {
          profileId: currentUser?.id,
          publicationId: publication.id,
          referenceModule: {
            followerOnlyReferenceModule: false,
          },
        },
      },
    });
  }, [createMirrorTypedData, currentUser, publication]);

  return (
    <>
      {checkMirrors() || isMirrored ? (
        <button
          className="flex ml-4 text-green-500 hover:text-green-600"
          type={`button`}
          onClick={handleMirror}
        >
          {isMirrored
            ? stats?.totalAmountOfMirrors + 1
            : stats?.totalAmountOfMirrors}
          <AiOutlineRetweet
            className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 ml-2"
            aria-hidden="true"
          />
        </button>
      ) : (
        <button
          className="flex ml-4 hover:text-stone-700"
          type={`button`}
          onClick={handleMirror}
        >
          {stats?.totalAmountOfMirrors}
          <AiOutlineRetweet
            className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 ml-2"
            aria-hidden="true"
          />
        </button>
      )}
    </>
  );
};
