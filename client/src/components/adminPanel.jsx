import React, { useEffect, useState } from "react";
import { Navbar } from "./navbar";
import axios from "axios";
import Cookies from "js-cookie";
import { AuthErr } from "./auth/authErr";
import { BanErr } from "./auth/banErr";
import { PermErr } from "./auth/permErr";

function AdminPanel() {
  const [searchValue, setSearchValue] = useState();
  const [isSearching, setIsSearching] = useState(false);
  const [users, setUsers] = useState([]);
  const [userTab, setUserTab] = useState();
  const [balance, setBalance] = useState();
  const [isResponseMsg, setIsResponseMsg] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");
  const [responseStyle, setResponseStyle] = useState("");
  const [tabType, setTabType] = useState("");
  const [authErr, setAuthErr] = useState();
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [searchValueAfter, setSearchValueAfter] = useState();

  const token = Cookies.get("token");
  const tokenHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        await axios.get("http://localhost:3000/user/profile", tokenHeader);
      } catch (err) {
        console.log(err);
        if (err.status === 401) setAuthErr(<AuthErr />);
        if (err.status === 403) setAuthErr(<PermErr />);
      }
    };
    getUser();
  }, []);

  const handleSearchUser = async (e, search) => {
    e.preventDefault();
    if (search?.trim(" ") === "") {
      setIsSearching(false);
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:3000/admin?search=${search}`,
        tokenHeader
      );
      console.log(response);
      if (response) {
        setUsers(response.data);
        setIsSearching(true);
        setSearchValueAfter(search);
        console.log(response);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleUserTab = (type, index) => {
    if (userTab === index) {
      setUserTab("");
      setResponseMsg("");
      setIsResponseMsg(false);
      setTabType("");
    } else {
      setUserTab(index);
      setTabType(type);
    }
  };

  const handleUpdateBalance = async (e, id) => {
    e.preventDefault();
    console.log(id, balance);
    const data = {
      id,
      balance: +balance,
    };
    console.log("balance data", data);
    try {
      const response = await axios.post(
        "http://localhost:3000/admin/updatebalance",
        data,
        tokenHeader
      );
      console.log(response);
      if (response) {
        const findUserIndex = users.findIndex((user) => user._id === id);
        console.log("useriai", users, findUserIndex);
        users[findUserIndex].balance = balance;
        setIsResponseMsg(true);
        setResponseMsg(response.data);
        setResponseStyle("green");
      }
    } catch (err) {
      console.log(err);
      setIsResponseMsg(true);
      setResponseMsg(err.response.data.message);
      setResponseStyle("red");
    }
  };

  const convertBanTime = () => {
    let convertedTime = 0; //all converted seconds sum
    if (days > 0) {
      const convertDays = days * 24 * 60 * 60 * 1000; //converts into miliseconds
      convertedTime += convertDays;
      console.log("days: ", days);
    }
    if (hours > 0) {
      const convertHours = hours * 60 * 60 * 1000;
      convertedTime += convertHours;
      console.log("hours: ", hours);
    }
    if (minutes > 0) {
      const convertMinutes = minutes * 60 * 1000;
      convertedTime += convertMinutes;
      console.log("minutes: ", minutes);
    }
    let banDate;
    if (convertedTime > 0) {
      banDate = Date.now() + convertedTime;
    } else {
      //if ban time is 0, ban is permanent
      banDate = 0;
    }

    return banDate;
  };

  const handleBanUser = async (e, data, index) => {
    e.preventDefault();
    console.log(data);

    const banDate = convertBanTime();

    const userData = {
      id: data.id,
      role: data.role,
      bannedTime: banDate,
    };
    try {
      const response = await axios.post(
        "http://localhost:3000/admin/ban",
        userData,
        tokenHeader
      );
      if (response) {
        console.log("res res res", response);

        handleSearchUser(e, searchValueAfter);
        setIsResponseMsg(true);
        setResponseMsg(response.data);
        setResponseStyle("oklch(79.2% 0.209 151.711)");
      }
    } catch (err) {
      console.log(err);
      setIsResponseMsg(true);
      setResponseMsg(err.response.data.message);
      setResponseStyle("oklch(70.4% 0.191 22.216)");
    }
  };

  return (
    <div>
      <Navbar />
      {authErr ? (
        authErr
      ) : (
        <div className="w-11/12 xl:w-[1100px] h-max pb-8 bg-zinc-900 mx-auto mt-8 rounded-md">
          <h1 className="p-4 bg-zinc-950 text-2xl text-white rounded-tr-md rounded-tl-md">
            Admin Panel
          </h1>
          <form
            onSubmit={(e) => handleSearchUser(e, searchValue)}
            className="mt-4 mx-auto flex flex-col sm:flex-row gap-2 items-center justify-center"
          >
            <input
              className="w-5/6 sm:w-4/6 rounded-md h-10 pl-4 pr-4 bg-zinc-950 text-white"
              placeholder="Search user"
              type="text"
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <button
              type="submit"
              className="w-5/6 sm:w-32 h-10 rounded-md text-white text-lg cursor-pointer bg-indigo-500 hover:bg-indigo-600"
            >
              Search
            </button>
          </form>

          <div className="mt-8 w-5/6 mx-auto">
            {users.length === 0 && isSearching ? (
              <div className="text-center text-white text-lg">
                <p>User not found</p>
              </div>
            ) : !isSearching ? (
              <div></div>
            ) : (
              users.map((user, index) => (
                <div key={index}>
                  <div className="flex flex-col sm:flex-row mt-2 items-center text-lg gap-4 rounded-md h-max py-4 sm:py-2 bg-zinc-950 text-white">
                    <p className="pl-4">{user.username}</p>
                    <p>
                      {" "}
                      <span className="text-indigo-500 text-base">
                        Balance:{" "}
                      </span>{" "}
                      {user.balance} €
                    </p>
                    <button
                      onClick={() => handleUserTab("balance", index)}
                      className="h-8 w-11/12 sm:w-24 text-base border-2 border-white rounded-sm cursor-pointer hover:border-3"
                    >
                      Change
                    </button>
                    <div className="flex justify-center sm:justify-end ml-auto w-full sm:w-36">
                      <button
                        onClick={() => handleUserTab("ban", index)}
                        className={`w-11/12 mx-auto sm:w-32 h-9 text-lg border-2 rounded-sm cursor-pointer  ml-4 sm:ml-auto mr-4 hover:border-3`}
                        style={
                          user.role === "banned"
                            ? {
                                borderColor: "oklch(79.2% 0.209 151.711)",
                                color: "oklch(79.2% 0.209 151.711)",
                              }
                            : {
                                borderColor: "oklch(70.4% 0.191 22.216)",
                                color: "oklch(70.4% 0.191 22.216)",
                              }
                        }
                      >
                        {user.role === "banned" ? "Unban" : "Ban"}
                      </button>
                    </div>
                  </div>
                  {userTab === index && (
                    <div className="bg-zinc-800 h-max pt-4 pb-4">
                      {isResponseMsg && tabType === "balance" && (
                        <div
                          className={`h-8 w-max pr-4 ml-8 border-2 rounded-sm mb-4 flex items-center bg-zinc-950`}
                          style={{ borderColor: responseStyle }}
                        >
                          <p
                            className={`pl-4`}
                            style={{ color: responseStyle }}
                          >
                            ! {responseMsg}
                          </p>
                        </div>
                      )}
                      {tabType === "balance" ? (
                        <div className=" flex flex-col sm:flex-row items-center">
                          <form
                            className="flex w-full items-center flex-col sm:flex-row gap-4 sm:gap-0"
                            onSubmit={(e) => handleUpdateBalance(e, user._id)}
                          >
                            <input
                              defaultValue={user.balance}
                              className="w-5/6 sm:w-32 ml-0 sm:ml-8 border-2 text-white text-lg pl-2 pr-2 text-center border-indigo-500 rounded-sm h-9 bg-zinc-900"
                              type="Number"
                              onChange={(e) => setBalance(e.target.value)}
                            />
                            <button
                              className="w-5/6 sm:w-32 cursor-pointer h-9 bg-indigo-500 text-white rounded-sm ml-0 sm:ml-4 hover:bg-indigo-600"
                              type="submit"
                            >
                              Update Balance
                            </button>
                          </form>
                        </div>
                      ) : tabType === "ban" ? (
                        <div>
                          {isResponseMsg && tabType === "ban" && (
                            <div
                              className={`py-1 w-4/6 sm:w-max pr-4 ml-2 sm:ml-8 border-2 rounded-sm mb-12 flex items-center bg-zinc-950`}
                              style={{ borderColor: responseStyle }}
                            >
                              <p
                                className={`pl-4`}
                                style={{ color: responseStyle }}
                              >
                                ! {responseMsg}
                              </p>
                            </div>
                          )}

                          <form
                            className="flex flex-col lg:flex-row mt-6 items-center"
                            onSubmit={(e) =>
                              handleBanUser(
                                e,
                                {
                                  id: user._id,
                                  role: user.role,
                                },
                                index
                              )
                            }
                          >
                            {user.role === "user" || user.role === "admin" ? (
                              <div className="flex flex-col items-center lg:block">
                                <p className="ml-0 lg:ml-8 -mt-10 pt-2 pb-2  text-indigo-500">
                                  Setting ban time to zero or leaving it blank
                                  bans user permanently
                                </p>
                                <label className="text-white text-lg ml-0 lg:ml-8">
                                  Days
                                </label>
                                <input
                                  className="w-5/6 lg:w-20  border-2 ml-0 lg:ml-2 text-white text-lg pl-2 pr-2 text-center border-indigo-500 rounded-sm h-9 bg-zinc-900"
                                  type="Number"
                                  onChange={(e) => setDays(e.target.value)}
                                />
                                <label className="text-white text-lg ml-0 lg:ml-8">
                                  Hours
                                </label>
                                <input
                                  className="w-5/6 lg:w-20  border-2 ml-0 lg:ml-2 text-white text-lg pl-2 pr-2 text-center border-indigo-500 rounded-sm h-9 bg-zinc-900"
                                  type="Number"
                                  onChange={(e) => setHours(e.target.value)}
                                />
                                <label className="text-white text-lg ml-0 lg:ml-8">
                                  Minutes
                                </label>
                                <input
                                  className="w-5/6 lg:w-20  border-2 ml-0 lg:ml-2 text-white text-lg pl-2 pr-2 text-center border-indigo-500 rounded-sm h-9 bg-zinc-900"
                                  type="Number"
                                  onChange={(e) => setMinutes(e.target.value)}
                                />
                              </div>
                            ) : (
                              <div>
                                <p className="text-lg  text-red-400 ml-8">
                                  User - ({user.username}) is Banned{" "}
                                </p>
                              </div>
                            )}

                            <button
                              className="w-4/6 sm:w-48 lg:w-32 mt-4 lg:mt-0 cursor-pointer h-9 border-2 border-red-500 text-red-400 rounded-sm ml-0 lg:ml-4 hover:border-3"
                              type="submit"
                              style={
                                user.role === "banned"
                                  ? {
                                      borderColor: "oklch(79.2% 0.209 151.711)",
                                      color: "oklch(79.2% 0.209 151.711)",
                                    }
                                  : {
                                      borderColor: "oklch(70.4% 0.191 22.216)",
                                      color: "oklch(70.4% 0.191 22.216)",
                                    }
                              }
                            >
                              {user.role === "banned" ? "Unban" : "Ban"}
                            </button>
                          </form>
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
