import { useContext } from "react";
import { UserContext } from "@/components/layout";
import { DocumentDuplicateIcon } from "@heroicons/react/outline";

import { useMutation } from "@apollo/client";
import { CREATE_MIRROR_TYPED_DATA } from "@/queries/publications/mirror";

import { useSignTypedData, useContractWrite } from "wagmi";
import { omit, splitSignature } from "@/lib/helpers";

import LENS_ABI from "@/abis/Lens.json";

import { LENS_HUB_PROXY_ADDRESS } from "@/lib/constants";

export const Mirror = ({ publication }: any) => {
  const { currentUser } = useContext(UserContext);

  const { stats } = publication;

  const [{}, signTypedData] = useSignTypedData();
  const [{}, write] = useContractWrite(
    {
      addressOrName: LENS_HUB_PROXY_ADDRESS,
      contractInterface: LENS_ABI,
    },
    "mirrorWithSig"
  );

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
      } = typedData?.value;

      signTypedData({
        domain: omit(typedData?.domain, "__typename"),
        types: omit(typedData?.types, "__typename"),
        value: omit(typedData?.value, "__typename"),
      }).then((res) => {
        if (!res.error) {
          const { v, r, s } = splitSignature(res.data);
          const postARGS = {
            profileId,
            profileIdPointed,
            pubIdPointed,
            referenceModule,
            referenceModuleData,
            sig: {
              v,
              r,
              s,
              deadline: typedData.value.deadline,
            },
          };
          write({ args: postARGS }).then((res) => {
            if (!res.error) {
              // console.log(res.data);
              // reset form  and other closing actions
            } else {
              console.log(res.error);
            }
          });
        }
        console.log(res);
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
      <DocumentDuplicateIcon className="h-6 w-6 ml-2" aria-hidden="true" />
    </div>
  );
};
