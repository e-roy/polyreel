export const What = () => {
  return (
    <div className="bg-sky-900 py-16 font-medium">
      <h3 className="text-center text-3xl text-stone-100 font-semibold h-24">
        What is Lens Protocol?
      </h3>
      <div className="sm:flex mx-4 sm:mx-16 my-16">
        <div className="sm:w-1/2"></div>
        <div className="sm:w-1/2 border p-4 rounded-xl shadow-xl bg-sky-800/50 text-stone-100">
          The Lens Protocol is a Web3 social graph on the Polygon Proof-of-Stake
          blockchain. It is designed to empower creators to own the links
          between themselves and their community, forming a fully composable,
          user-owned social graph. The protocol is built from the ground up with
          modularity in mind, allowing new features and fixes to be added while
          ensuring immutable user-owned content and social relationships.
        </div>
      </div>
    </div>
  );
};
