import { useCallback, useContext } from "react";
import { UserContext } from "@/context";
import { FaRegCopy } from "react-icons/fa";

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

  const { stats } = publication;

  const { signTypedDataAsync } = useSignTypedData();
  const { write } = useContractWrite({
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
        write({ recklesslySetUnpreparedArgs: [postARGS] });
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
    <button
      className="flex ml-4 hover:text-stone-700"
      type={`button`}
      onClick={handleMirror}
    >
      {stats?.totalAmountOfMirrors}
      <FaRegCopy
        className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 ml-2"
        aria-hidden="true"
      />
    </button>
  );
};
