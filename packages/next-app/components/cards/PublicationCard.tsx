import React from "react";
import { TwitterIcon, WebIcon } from "@/icons";
import { cardFormatDate } from "@/utils/formatDate";

export const PublicationCard = ({ publication }: any) => {
  return (
    <div className="m-2 p-2  border border-stone-400 shadow-lg rounded">
      <div className="flex justify-between">
        <div className="flex">
          {publication.profile.picture ? (
            <div className="h-12 w-12 relative rounded-full border-2">
              <img
                src={publication.profile.picture.original.url}
                alt=""
                className="rounded-full h-12"
              />
            </div>
          ) : (
            <div className="bg-slate-300 rounded-full h-10 w-10 border-2"></div>
          )}

          <div className="ml-4 my-auto font-semibold">
            {publication.profile.handle}
          </div>
        </div>

        <div className="my-auto flex space-x-4">
          {publication.profile.website && (
            <a
              href={publication.profile.website}
              target="_blank"
              rel="noreferrer noopener"
            >
              <WebIcon size={20} />
            </a>
          )}
          {publication.profile.twitterUrl && (
            <a
              href={publication.profile.twitterUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              <TwitterIcon size={20} />
            </a>
          )}
        </div>
      </div>
      <div className="flex justify-between">
        <div className="font-bold">{publication.__typename}</div>

        <div className="text-xs">{cardFormatDate(publication.createdAt)}</div>
      </div>
      <div className="text-xs italic">id: {publication.id}</div>
      <div className="overflow-hidden">{publication.metadata.description}</div>
      <div>
        {publication.metadata.media && (
          <>
            {publication.metadata.media.map((media: any, index: number) => (
              <div key={index}>
                {media.original.url && (
                  <img
                    src={media.original.url}
                    alt=""
                    className="rounded-lg my-2"
                  />
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
