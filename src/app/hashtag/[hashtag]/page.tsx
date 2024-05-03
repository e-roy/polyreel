import { HashtagsList } from "./_components/HashtagsList";

interface Props {
  params: {
    hashtag: string;
  };
}

const HashtagPage = ({ params }: Props) => {
  return <HashtagsList hashtag={params.hashtag} />;
};

export default HashtagPage;
