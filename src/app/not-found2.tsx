"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="p-4 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16">
      <div className="xl:pt-24 w-full xl:w-1/2 relative pb-12 lg:pb-0">
        <div className="relative">
          <div className="">
            <div className="">
              <h1 className="my-2 text-stone-800 dark:text-stone-100 font-bold text-2xl">
                {`Looks like you've found the doorway to the great nothing`}
              </h1>
              <p className="my-2 text-stone-800 dark:text-stone-100">
                Sorry about that! Please visit our hompage to get where you need
                to go.
              </p>
              <Link href={`/`}>
                <button
                  type={`button`}
                  className="sm:w-full lg:w-auto my-2 border rounded md py-4 px-8 text-center bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50"
                >
                  Take me Home!
                </button>
              </Link>
            </div>
          </div>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://i.ibb.co/G9DC8S0/404-2.png" alt={`404 error`} />
          </div>
        </div>
      </div>
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://i.ibb.co/ck1SGFJ/Group.png" alt={`404 error`} />
      </div>
    </div>
  );
}
