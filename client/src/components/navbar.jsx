import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { IoIosArrowDown } from "react-icons/io";
import defaultProfilePicture from "../assets/default.jpg";
import { RxHamburgerMenu } from "react-icons/rx";

export function Navbar({ balanceData, profileImageProp, updatedUsername }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState();
  const [balance, setBalance] = useState();
  const [userTab, setUserTab] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileImage, setProfileImage] = useState();
  const [burgerToggle, setBurgerToggle] = useState(false);
  const [mobileUserTab, setMobileUserTab] = useState(false);

  const navigate = useNavigate();

  const token = Cookies.get("token");
  const tokenHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        console.log(token);

        if (!token) return;

        const response = await axios.get(
          "http://localhost:3000/user/profile",
          tokenHeader
        );
        console.log("data data", response);
        if (response.status === 200) {
          console.log("logged data", response);
          setUser(response.data.username);
          setBalance(response.data.balance);
          setIsLoggedIn(true);
          if (!response.data.image) {
            setProfileImage(defaultProfilePicture);
          } else {
            setProfileImage(
              `http://localhost:3000/uploads\\${response.data.image}`
            );
          }
          if (response.data.role === "admin") setIsAdmin(true);
          if (response.data.role === "banned") navigate("/banned");
        }
      } catch (err) {
        console.log(err);
      }
    };
    getUser();

    const unbanUsers = async () => {
      if (!token) return;
      try {
        await axios.get("http://localhost:3000/user/unbanusers", tokenHeader);
      } catch (err) {
        console.log(err);
      }
    };
    unbanUsers();
  }, []);

  const handleNavbarNavigation = (route) => {
    navigate(route);
  };

  const handleLogOut = () => {
    Cookies.remove("token");
    window.location.reload();
  };

  return (
    <div>
      <div className="bg-zinc-900 hidden md:flex w-11/12 xl:w-[1100px]  mx-auto mt-8 h-16 items-center rounded-lg">
        <h2 className="text-indigo-500 text-xl font-bold pl-4 pr-8">CsSkins</h2>
        <div className="flex w-64 text-white text-base items-center font-bolder justify-around">
          <p
            data-route="/"
            className="cursor-pointer hover:text-gray-200"
            onClick={(e) => {
              handleNavbarNavigation(e.target.getAttribute("data-route"));
            }}
          >
            Cases
          </p>
          <p
            data-route="/market"
            className="cursor-pointer hover:text-gray-200"
            onClick={(e) => {
              handleNavbarNavigation(e.target.getAttribute("data-route"));
            }}
          >
            Market
          </p>
          <p
            data-route="/trade"
            className="cursor-pointer hover:text-gray-200"
            onClick={(e) => {
              handleNavbarNavigation(e.target.getAttribute("data-route"));
            }}
          >
            Trade
          </p>
        </div>
        {isLoggedIn ? (
          <div className="flex w-max items-center ml-auto mr-8">
            <div className="bg-zinc-950 border-1 border-indigo-500 rounded-lg mr-4">
              <p className="text-white pr-2 pl-2 text-center text-lg">
                {balanceData <= balance ? balanceData : balance} €
              </p>
            </div>

            <div className="w-8 h-8  mr-2">
              <img
                className="w-8 h-8 rounded-full border-2 border-zinc-300"
                src={profileImageProp ? profileImageProp : profileImage}
                alt=""
              />
            </div>
            <p className="text-white text-lg">
              {updatedUsername ? updatedUsername : user}
            </p>
            <button
              onClick={() => setUserTab(!userTab)}
              className="cursor-pointer hover:text-zinc-200 text-white text-xl"
            >
              <IoIosArrowDown />
            </button>
            {userTab && (
              <div className="w-42 absolute mt-48 ml-12 border-1 rounded-md border-zinc-700 h-min bg-zinc-900">
                <div className="w-full h-8 flex mt-1 justify-center items-center text-white text-lg">
                  <p
                    data-route="/profile"
                    className="cursor-pointer hover:text-gray-200"
                    onClick={(e) => {
                      handleNavbarNavigation(
                        e.target.getAttribute("data-route")
                      );
                    }}
                  >
                    Profile
                  </p>
                </div>
                <div className="w-full h-8 flex mt-1 justify-center items-center text-white text-lg">
                  <p
                    data-route="/inventory"
                    className="cursor-pointer hover:text-gray-200"
                    onClick={(e) => {
                      handleNavbarNavigation(
                        e.target.getAttribute("data-route")
                      );
                    }}
                  >
                    Inventory
                  </p>
                </div>

                {isAdmin && (
                  <div className="w-full h-8 mt-1 flex justify-center items-center text-white text-lg">
                    <p
                      data-route="/admin"
                      className="cursor-pointer hover:text-gray-200"
                      onClick={(e) => {
                        handleNavbarNavigation(
                          e.target.getAttribute("data-route")
                        );
                      }}
                    >
                      Admin Panel
                    </p>
                  </div>
                )}

                <button
                  onClick={handleLogOut}
                  className="bg-indigo-500 w-full mt-1 h-8 rounded-br-md rounded-bl-md text-white text-lg hover:bg-indigo-600 cursor-pointer"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex w-32 items-center ml-auto">
            <button
              data-route="/signin"
              onClick={(e) => {
                handleNavbarNavigation(e.target.getAttribute("data-route"));
              }}
              className="bg-indigo-500 w-24 h-8 rounded-sm font-bold text-white cursor-pointer hover:bg-indigo-600"
            >
              Login
            </button>
          </div>
        )}
      </div>
      <div className="bg-zinc-900 flex md:hidden w-11/12  mx-auto mt-8 h-16 items-center rounded-lg">
        <h2 className="text-indigo-500 text-xl font-bold pl-4 pr-8">CsSkins</h2>
        <RxHamburgerMenu
          onClick={() => setBurgerToggle(!burgerToggle)}
          className="text-4xl cursor-pointer text-white ml-auto mr-8 hover:text-zinc-200"
        />
      </div>
      {burgerToggle && (
        <div className="absolute -mt-2 block md:hidden z-20 w-full">
          <div className="w-11/12 mx-auto flex flex-col rounded-br-lg border-2 border-t-0 border-indigo-500 rounded-bl-lg bg-zinc-900 h-max pb-4">
            <div className="w-full h-14 flex flex-col justify-center bg-zinc-950">
              {isLoggedIn ? (
                <div className="flex items-center justify-between text-white">
                  <div className="flex gap-4 items-center">
                    <img
                      className="w-12 h-12 ml-2 rounded-full border-2 border-zinc-300"
                      src={profileImageProp ? profileImageProp : profileImage}
                      alt=""
                    />
                    <p className="text-xl">
                      {updatedUsername ? updatedUsername : user}
                    </p>
                    <div className="bg-zinc-950 border-2 border-indigo-500 rounded-lg ">
                      <p className="text-white px-6 py-1  text-center text-lg">
                        {balanceData <= balance ? balanceData : balance} €
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setMobileUserTab(!mobileUserTab)}
                    className="cursor-pointer hover:text-zinc-200 text-white mr-4 text-4xl"
                  >
                    <IoIosArrowDown />
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex justify-center">
                    <button
                      data-route="/signin"
                      onClick={(e) => {
                        handleNavbarNavigation(
                          e.target.getAttribute("data-route")
                        );
                      }}
                      className="bg-indigo-500 w-5/6 h-10 rounded-sm font-bold text-white cursor-pointer hover:bg-indigo-600"
                    >
                      Login
                    </button>
                  </div>
                </div>
              )}
            </div>
            {mobileUserTab && (
              <div className="w-full h-max text-xl text-white flex flex-col gap-4 bg-zinc-950">
                <div className="w-full h-8 flex mt-1 justify-center items-center">
                  <p
                    data-route="/profile"
                    className="cursor-pointer hover:text-gray-200"
                    onClick={(e) => {
                      handleNavbarNavigation(
                        e.target.getAttribute("data-route")
                      );
                    }}
                  >
                    Profile
                  </p>
                </div>
                <div className="w-full h-8 flex mt-1 justify-center items-center ">
                  <p
                    data-route="/inventory"
                    className="cursor-pointer hover:text-gray-200"
                    onClick={(e) => {
                      handleNavbarNavigation(
                        e.target.getAttribute("data-route")
                      );
                    }}
                  >
                    Inventory
                  </p>
                </div>

                {isAdmin && (
                  <div className="w-full h-8 mt-1 flex justify-center items-center ">
                    <p
                      data-route="/admin"
                      className="cursor-pointer hover:text-gray-200"
                      onClick={(e) => {
                        handleNavbarNavigation(
                          e.target.getAttribute("data-route")
                        );
                      }}
                    >
                      Admin Panel
                    </p>
                  </div>
                )}

                <button
                  onClick={handleLogOut}
                  className="bg-indigo-500 w-full mt-1 h-12 border-b-2 border-indigo-900  text-white text-xl hover:bg-indigo-600 cursor-pointer"
                >
                  Log out
                </button>
              </div>
            )}
            <div className="flex flex-col items-center justify-center text-white text-2xl gap-4">
              <p
                data-route="/"
                className="cursor-pointer bg-zinc-800 w-11/12 text-center rounded-md py-2   mt-4 hover:text-gray-200"
                onClick={(e) => {
                  handleNavbarNavigation(e.target.getAttribute("data-route"));
                }}
              >
                Cases
              </p>
              <p
                data-route="/market"
                className="cursor-pointer bg-zinc-800 w-11/12 text-center rounded-md py-2  hover:text-gray-200"
                onClick={(e) => {
                  handleNavbarNavigation(e.target.getAttribute("data-route"));
                }}
              >
                Market
              </p>
              <p className="cursor-pointer bg-zinc-800 w-11/12 text-center rounded-md py-2  hover:text-gray-200">
                Trade
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
