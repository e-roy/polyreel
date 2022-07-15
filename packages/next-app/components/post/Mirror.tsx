import { useContext } from "react";
import { UserContext } from "@/components/layout";
import { DocumentDuplicateIcon } from "@heroicons/react/outline";

import { useMutation } from "@apollo/client";
import { CREATE_MIRROR_TYPED_DATA } from "@/queries/publications/mirror";

import { useSignTypedData, useContractWrite } from "wagmi";
import { omit, splitSignature } from "@/lib/helpers";

import LENS_ABI from "@/abis/Lens-Hub.json";
import { LENS_HUB_PROXY_ADDRESS } from "@/lib/constants";

export const Mirror = ({ publication }: any) => {
  const { currentUser } = useContext(UserContext);

  const { stats } = publication;

  const { signTypedDataAsync } = useSignTypedData();
  const { write } = useContractWrite({
    addressOrName: LENS_HUB_PROXY_ADDRESS,
    contractInterface: LENS_ABI,
    functionName: "mirrorWithSig",
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
        write({ args: postARGS });
      });
    },
    onError(error) {
      console.log(error);
    },
  });

  const handleMirror = () => {
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
  };

  return (
    <div
      className="flex ml-4 hover:text-stone-700 cursor-pointer"
      onClick={() => handleMirror()}
    >
      {stats.totalAmountOfMirrors}
      <DocumentDuplicateIcon
        className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 ml-2"
        aria-hidden="true"
      />
    </div>
  );
};
