import { CommentNotification } from "@/types/graphql/generated";
import { Avatar } from "@/components/elements/Avatar";
import { Label } from "@/components/ui/label";

interface INewCommentCardProps {
  item: CommentNotification;
}

export const NewCommentCard = ({ item }: INewCommentCardProps) => {
  return (
    <div className={`flex flex-col space-y-2 py-2`}>
      <Label>New Comment</Label>
      <div className={`flex space-x-4`}>
        <Avatar
          profile={item.comment.by}
          size={"xs"}
          href={`/profile/${item.comment.by.handle?.localName}`}
        />
        <div className={`text-sm`}>
          <div>{item.comment.by.metadata?.displayName}</div>
          <div>@{item.comment.by.handle?.localName}</div>
        </div>
      </div>
      <div>{item.comment.metadata.content}</div>
    </div>
  );
};
