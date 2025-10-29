import React, { useState } from "react";
import { Navbar } from "../navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function SignUp() {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [errMsg, setErrMsg] = useState();

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/auth/signin", {
        username,
        password,
      });
      console.log(response);
      if (response.status === 201) {
        const token = response.data.accessToken;
        const expires = 1 / 24; //1h
        Cookies.set("token", token, { expires: expires });
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      setErrMsg(err.response.data.message);
    }
    console.log(username);
  };

  const handleNavigation = () => {
    navigate("/signup");
  };

  return (
    <div>
      <Navbar />
      <div className="w-5/6 md:w-[600px] mt-44 rounded-sm h-max pb-8 bg-zinc-900 mx-auto">
        <h1 className="text-2xl rounded-tl-sm rounded-tr-sm text-white bg-zinc-950 pt-4 pb-4 text-center">
          Sign In
        </h1>
        {errMsg && (
          <div className="w-108 py-4 rounded-sm flex border-red-400 border items-center bg-zinc-950 mx-auto mt-4">
            <p className="pl-4 text-red-400">{errMsg}</p>
          </div>
        )}
        <form
          onSubmit={handleSignUp}
          className="text-white flex flex-col mt-4 mx-auto w-5/6 md:w-108"
        >
          <label className="text-lg">Username</label>
          <input
            onChange={(e) => setUsername(e.target.value)}
            className="bg-zinc-800 mt-2 p-2 h-10"
          />
          <label className="text-lg mt-4">Password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="bg-zinc-800 mt-2 p-2 h-10"
          />
          <button
            type="submit"
            className="bg-indigo-500 mt-4 h-12 rounded-md font-bold cursor-pointer hover:bg-indigo-600"
          >
            Login
          </button>
        </form>
        <p className="text-white pl-8 sm:pl-21 pt-4">
          Don't have an account?{" "}
          <span
            onClick={handleNavigation}
            className="cursor-pointer text-indigo-500 hover:text-indigo-600 "
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
