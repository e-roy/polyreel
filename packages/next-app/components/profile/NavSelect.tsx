import {
  MailOpenIcon,
  ChatAlt2Icon,
  DocumentDuplicateIcon,
  CollectionIcon,
  PhotographIcon,
} from "@heroicons/react/outline";

type NavSelectProps = {
  select: (select: string) => void;
  profile: any;
};

export const NavSelect = ({ select, profile }: NavSelectProps) => {
  return (
    <div className="flex justify-center">
      <div
        onClick={() => select("POST")}
        className="flex py-2 pl-6 pr-4 border border-stone-400 rounded-l-full text-stone-700 hover:bg-stone-400 cursor-pointer"
      >
        <MailOpenIcon className="h-6 w-6" aria-hidden="true" />
        <span className="pl-1 font-semibold">{profile.stats.totalPosts}</span>
      </div>
      <div
        onClick={() => select("COMMENT")}
        className="flex py-2 px-4 border border-stone-400 text-stone-700 hover:bg-stone-400 cursor-pointer"
      >
        <ChatAlt2Icon className="h-6 w-6" aria-hidden="true" />
        <span className="pl-1 font-semibold">
          {profile.stats.totalComments}
        </span>
      </div>
      <div
        onClick={() => select("COLLECT")}
        className="flex py-2 px-4 border border-stone-400 text-stone-700 hover:bg-stone-400 cursor-pointer"
      >
        <CollectionIcon className="h-6 w-6" aria-hidden="true" />
        <span className="pl-1 font-semibold">
          {profile.stats.totalCollects}
        </span>
      </div>
      <div
        onClick={() => select("MIRROR")}
        className="flex py-2 px-4 border border-stone-400 text-stone-700 hover:bg-stone-400 cursor-pointer"
      >
        <DocumentDuplicateIcon className="h-6 w-6" aria-hidden="true" />
        <span className="pl-1 font-semibold">{profile.stats.totalMirrors}</span>
      </div>
      <div
        onClick={() => select("NFTS")}
        className="flex py-2 pl-4 pr-6 border border-stone-400 rounded-r-full text-stone-700 hover:bg-stone-400 cursor-pointer"
      >
        <PhotographIcon className="h-6 w-6" aria-hidden="true" />
        <span className="pl-1 font-semibold">
          {/* {profile.stats.totalMirrors} */}
        </span>
      </div>
    </div>
  );
};
