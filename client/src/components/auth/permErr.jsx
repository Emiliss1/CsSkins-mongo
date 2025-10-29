import React from "react";
import { Navbar } from "../navbar";

export function PermErr() {
  return (
    <div>
      <div className="w-5/6 lg:w-[600px] h-max pb-8 bg-zinc-900 mx-auto mt-8 rounded-md">
        <h1 className="py-4 bg-zinc-950 text-2xl rounded-tl-md rounded-tr-md text-white text-center">
          Warning
        </h1>
        <p className="text-center text-xl mt-8 text-white">
          You don't have permissions to do that!
        </p>
      </div>
    </div>
  );
}
