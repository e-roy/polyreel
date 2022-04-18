export const How = () => {
  return (
    <div className="bg-sky-900 py-16 font-medium">
      <h3 className="text-center text-3xl text-stone-100 font-semibold h-24">
        How is Lens Protocol Different from Existing Social Networks?
      </h3>
      <div className="text-stone-100 mx-4 sm:mx-16">
        <div className="py-8">
          Lens Protocol seeks to solve major issues in existing social media
          networks. Namely, Web2 networks all read from their unique,
          centralized database. There is no portability. Your profile, friends,
          and content are locked to a specific network and owned by the network
          operator.
        </div>
        <div className="py-8">
          Lens Protocol corrects this by being a user-owned, open social graph
          that any application can plug into. Since users own their data, they
          can bring it to any application built on top of Lens Protocol. As the
          true owners of their content, creators no longer need to worry about
          losing their content, audience, and livelihood based on the whims of
          an individual platform's algorithms and policies. Additionally, each
          application using Lens Protocol benefits the whole ecosystem, turning
          the zero-sum game into a collaborative one. Developers can design
          meaningful social experiences without needing to turn to feedback
          mechanisms to lock in a user's attention.
        </div>
      </div>
    </div>
  );
};
