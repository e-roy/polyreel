import {
  ChatAlt2Icon,
  DocumentDuplicateIcon,
  CollectionIcon,
} from "@heroicons/react/outline";

type StatsProps = {
  stats: {
    totalAmountOfCollects: number;
    totalAmountOfComments: number;
    totalAmountOfMirrors: number;
  };
};

export const Stats = ({ stats }: StatsProps) => {
  return (
    <div className="flex text-stone-700 mt-4">
      <div className="flex cursor-pointer">
        {stats.totalAmountOfComments}
        <ChatAlt2Icon className="h-6 w-6 ml-2" aria-hidden="true" />
      </div>
      <div className="flex ml-4 cursor-pointer">
        {stats.totalAmountOfMirrors}
        <DocumentDuplicateIcon className="h-6 w-6 ml-2" aria-hidden="true" />
      </div>
      <div className="flex ml-4 cursor-pointer">
        {stats.totalAmountOfCollects}
        <CollectionIcon className="h-6 w-6 ml-2" aria-hidden="true" />
      </div>
    </div>
  );
};
