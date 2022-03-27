import Link from "next/link";
import { Mirror, Collect } from "@/components/post";

import { ChatAlt2Icon } from "@heroicons/react/outline";

type StatsProps = {
  publication: any;
  stats?: {
    totalAmountOfCollects: number;
    totalAmountOfComments: number;
    totalAmountOfMirrors: number;
  };
};

export const Stats = ({ publication }: StatsProps) => {
  const { stats } = publication;
  return (
    <div className="flex text-stone-700 mt-4">
      <Link href={`/post/${publication.id}`}>
        <div className="flex cursor-pointer">
          {stats.totalAmountOfComments}
          <ChatAlt2Icon className="h-6 w-6 ml-2" aria-hidden="true" />
        </div>
      </Link>
      <Mirror publication={publication} />
      <Collect publication={publication} />
    </div>
  );
};
