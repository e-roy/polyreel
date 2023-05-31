import { ImSpinner3 } from "react-icons/im";

export const LoadingMore = () => {
  return (
    <div className="text-center text-stone-700 dark:text-stone-100 font-medium text-lg uppercase py-4">
      <ImSpinner3 className="inline-block animate-spin mr-2 h-8 w-8" />
      loading more...
    </div>
  );
};
