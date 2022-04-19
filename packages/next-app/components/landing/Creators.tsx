export const Creators = () => {
  return (
    <div className="bg-sky-900 py-16 font-medium text-xl sm:text-2xl">
      <h3 className="text-center text-3xl sm:text-4xl text-stone-100 font-semibold h-24">
        Are you a Creator?
      </h3>
      <div className="sm:flex mx-4 sm:mx-16 my-16">
        <div className="sm:w-1/2"></div>
        <div className="sm:w-1/2 text-center">
          {/* <h3 className="text-3xl text-stone-100 font-semibold h-24">
            What does the mean to YOU the user?
          </h3> */}
          <div className="border p-4 rounded-xl shadow-xl bg-sky-800/50 text-stone-100">
            For Creators, this means that you can bring your content, to any
            application built on top of Lens Protocol.
          </div>
        </div>
      </div>
      <div className="sm:flex mx-4 sm:mx-16 my-16">
        <div className="sm:w-1/2 text-center">
          {/* <h3 className="text-3xl text-stone-100 font-semibold h-24">
            What does the mean to YOU the user?
          </h3> */}
          <div className="border p-4 rounded-xl shadow-xl bg-sky-800/50 text-stone-100">
            As the true owners of your content, creators no longer need to worry
            about losing their content, audience, and livelihood based on an
            individual platform.
          </div>
        </div>
        <div className="sm:w-1/2"></div>
      </div>
    </div>
  );
};
