import { FollowNotification } from "@/types/graphql/generated";
import { Avatar } from "@/components/elements/Avatar";
import { Label } from "@/components/ui/label";

interface INewFollowerCardProps {
  item: FollowNotification;
}

export const NewFollowerCard = ({ item }: INewFollowerCardProps) => {
  const uniqueFollowers = item.followers.reduce((acc, follower) => {
    if (follower && follower.handle) {
      acc.set(follower.handle.id, follower);
    }
    return acc;
  }, new Map<string, (typeof item.followers)[number]>());

  const totalCount = uniqueFollowers.size;

  return (
    <div className={`flex flex-col space-y-2 py-2`}>
      <Label>{totalCount} New Followers</Label>
      <div className={`space-x-2`}>
        {Array.from(uniqueFollowers.values()).map((follower) => (
          <Avatar
            key={follower.handle!.id}
            profile={follower}
            size="xs"
            href={`/profile/${follower.handle!.localName}`}
          />
        ))}
      </div>
    </div>
  );
};
