import React, { useEffect, useState } from "react";
import { Navbar } from "../navbar";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function BanErr() {
  const [banMsg, setBanMsg] = useState();
  const [banTime, setBanTime] = useState();

  const token = Cookies.get("token");
  const tokenHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const navigate = useNavigate();

  useEffect(() => {
    const checkIsBanned = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/user/bantime",
          tokenHeader
        );
        console.log(response);
        if (response) {
          if (response.data === "permanently banned") {
            setBanMsg("Your account is permanently banned");
          } else {
            const leftBanTime = response.data - Date.now();
            const untilUnbanned = new Date(Date.now() + leftBanTime);
            // console.log(untilUnbanned.toLocaleString("lt"));
            setBanTime(untilUnbanned.toLocaleString("lt"));
            setBanMsg(`Your account is banned until`);
          }
        }
      } catch (err) {
        console.log(err);
        if (err.status === 401) navigate("/");
      }
    };
    checkIsBanned();

    const getUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/user/profile",
          tokenHeader
        );
        console.log(response);
        if (response) {
          if (!(response.data.role === "banned")) {
            navigate("/");
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="w-5/6 lg:w-[600px] h-max pb-8 bg-zinc-900 mx-auto mt-8 rounded-md">
        <h1 className="py-4 bg-zinc-950 text-2xl rounded-tl-md rounded-tr-md text-white text-center">
          You are banned!
        </h1>
        <p className="text-center text-xl mt-8 text-white">{banMsg}</p>
        {banTime && (
          <p className="text-center text-lg mt-4 text-red-400">{banTime}</p>
        )}
      </div>
    </div>
  );
}
