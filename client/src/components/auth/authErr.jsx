import React from "react";
import { useNavigate } from "react-router-dom";

export function AuthErr() {
  const navigate = useNavigate();
  return (
    <div className="w-5/6 lg:w-[800px] mx-auto flex rounded-lg flex-col text-white mt-8 h-64 mb-8 bg-zinc-900">
      <h1 className="bg-zinc-950 rounded-tl-lg rounded-tr-lg pt-4 pb-4 text-center text-xl">
        You are not logged in
      </h1>
      <p className="mt-8 text-lg text-center">Please sign in to proceed</p>
      <div className="flex justify-center mt-8 items-center">
        <button
          onClick={() => navigate("/signin")}
          className="bg-indigo-500 rounded-md text-lg w-64 h-10 cursor-pointer hover:bg-indigo-600"
        >
          Log in
        </button>
      </div>
    </div>
  );
}
