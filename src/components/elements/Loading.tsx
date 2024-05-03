import { ImSpinner3 } from "react-icons/im";

interface LoadingProps {
  height?: string;
}

export const Loading = ({ height = "h-full" }: LoadingProps) => {
  return (
    <div
      className={`${height} flex justify-center items-center  text-stone-600 dark:text-stone-100`}
    >
      {/* <ImSpinner3 className="inline-block animate-spin h-24 w-24" /> */}
    </div>
  );
};
