import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ConnectWallet } from "@/components/wallet";
import { Auth } from "@/components/lens/auth";
import Link from "next/link";

export type HeaderProps = {};

export const Header = ({}: HeaderProps) => {
  return (
    <header className="py-2 px-4  h-16 flex justify-between sticky">
      <Link href={`/me`}>
        <div className="bg-slate-300 rounded-full h-12 w-12 border-2 cursor-pointer"></div>
      </Link>
      <Auth />
      <ConnectWallet />
    </header>
  );
};
