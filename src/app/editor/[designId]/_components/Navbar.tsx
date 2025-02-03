import { Logo } from "@/components/Logo";
import React from "react";

export const Navbar = () => {
  return (
    <nav className="flex h-[68px] w-full items-center gap-x-8 border-b p-4 lg:pl-[34px]">
      <Logo />
      <div className="flex h-full w-full items-center gap-x-1">
        <p>header</p>
      </div>
    </nav>
  );
};
