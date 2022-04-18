import Image from "next/image";
import imageSrc from "@/images/lens-logo-sky.png";

export const Hero = () => {
  const repeat = 50;
  const images = [];

  for (let i = 1; i <= repeat; i++) {
    const image = (
      <div key={i} className="overflow-hidden flex max-h-48 bg-stone-700/40">
        <div className="w-6 h-full border-r border-l border-stone-400/50"></div>

        <Image
          src={imageSrc}
          width={175}
          height={185}
          layout="fixed"
          className="object-cover rounded-lg my-8"
          priority={true}
        />
        <div className="w-6 h-full border-r border-l border-stone-400/50"></div>
      </div>
    );
    images.push(image);
  }
  return (
    <div className="flex flex-col w-full mx-auto -mt-20 overflow-hidden bg-gradient-to-r from-sky-900 to-sky-900">
      <div className="relative z-10 flex w-full px-5 pt-20 mx-auto sm:px-12  max-w-7xl sm:pt-0 lg:px-0">
        <div className="w-full md:w-2/3">
          <div className="flex flex-col items-start justify-center w-full h-full pb-20">
            <div className="relative w-full lg:pl-10">
              <div className="flex items-center justify-center rounded-lg w-12 h-12 sm:rounded-xl"></div>
              <h1
                className="relative z-0 w-full max-w-md py-2 text-4xl font-black text-left text-stone-100 sm:py-5 sm:text-6xl"
                data-unsp-sanitized="clean"
              >
                Polyreel <span className="text-3xl pl-12 italic">(beta)</span>
              </h1>
            </div>

            <div className="flex flex-col items-start my-4 text-left lg:pl-10">
              <p className="max-w-md my-2 text-base text-stone-200 font-semibold sm:text-lg lg:text-xl dark:text-dark-200">
                A Social Network built with Lens Protocol
              </p>
              <p className="max-w-md mb-10 text-base text-stone-200 font-semibold sm:text-lg lg:text-xl dark:text-dark-200">
                Currently in BETA on the Mumbai Testnet
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-0 left-0 z-0 flex items-start justify-center w-full h-screen overflow-hidden opacity-75">
        <div className="relative z-20 w-1/2">
          <div className="absolute top-0 left-0 w-full h-screen bg-gradient-to-r from-sky-900 to-sky-800"></div>
        </div>
        <div className="relative z-10 w-1/2">
          <div className="absolute top-0 right-0 hidden w-full h-full sm:block">
            <div className="flex items-center justify-center w-screen h-screen transform scale-75 -rotate-12 -translate-x-80 sm:-translate-x-64 sm:scale-125 md:scale-125 min-w-persp md:-translate-x-24 ">
              <div className="flex flex-col flex-wrap items-start justify-start w-full h-screen space-x-5 transformPerspective">
                {images}
              </div>
            </div>
          </div>
          <div className="absolute top-0 left-0 z-50 w-full h-screen bg-gradient-to-r from-sky-800 t to-transparent"></div>
        </div>
      </div>
    </div>
  );
};
