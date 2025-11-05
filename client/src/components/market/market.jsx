import React, { useEffect, useState } from "react";
import { Navbar } from "../navbar";
import axios from "axios";
import Cookies from "js-cookie";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { pagination } from "../functions/pagination";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthErr } from "../auth/authErr";
import { PermErr } from "../auth/permErr";
import defaultProfilePicture from "../../assets/default.jpg";
import { SearchFilter } from "../functions/search-filter";
import { UserMarketSkins } from "./user-market-skins";
import { AddSkin } from "./add-market-skin";

function Market() {
  const [component, setComponent] = useState();
  const [authErr, setAuthErr] = useState(false);
  const [marketSkins, setMarketSkins] = useState([]);
  const [btnForward, setBtnForward] = useState("flex");
  const [btnBack, setBtnBack] = useState("flex");
  const [currentPage, setCurrentPage] = useState(0);
  const [lastPage, setLastPage] = useState();
  const [user, setUser] = useState();
  const [selectedSkin, setSelectedSkin] = useState();
  const [rarityDropdown, setRarityDropdown] = useState(false);
  const [marketSkinsData, setMarketSkinsData] = useState([]);
  const [filterSkins, setFilterSkins] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [buyResponse, setBuyResponse] = useState("");
  const [buyErr, setBuyErr] = useState("");

  const rarities = [
    {
      name: "All",
      color: "white",
    },
    {
      name: "Mil-Spec Grade",
      color: "#4b69ff",
    },
    {
      name: "Restricted",
      color: "#8847ff",
    },
    {
      name: "Classified",
      color: "#d32ce6",
    },
    {
      name: "Covert",
      color: "#eb4b4b",
    },
  ];

  const token = Cookies.get("token");
  const tokenHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/user/profile",
          tokenHeader
        );

        if (response) {
          setUser(response.data.username);
        }
      } catch (err) {
        if (err.status === 401) {
          setAuthErr(true);
        }
      }
    };
    getUser();

    const getMarketSkins = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/market/marketskins",
          tokenHeader
        );
        console.log("market skins", response);
        if (response) {
          setMarketSkins(pagination(response.data, currentPage).pageItems);
          setMarketSkinsData(response.data);
          managePages(
            currentPage,
            pagination(response.data, currentPage).totalPages
          );
        }
      } catch (err) {
        console.log(err);
      }
    };
    getMarketSkins();
  }, [currentPage, buyResponse]);

  const managePages = (curPage = 0, totalPages) => {
    if (curPage + 1 >= totalPages) setBtnForward("hidden");
    else setBtnForward("flex");

    if (curPage <= 0) setBtnBack("hidden");
    else setBtnBack("flex");

    setLastPage(totalPages);
  };

  const handleBuySkin = async () => {
    console.log(selectedSkin);

    try {
      const response = await axios.patch(
        "http://localhost:3000/market/buymarketskin",
        { id: selectedSkin._id },
        tokenHeader
      );

      if (response) {
        console.log(response);
        setBuyResponse(response.data);
      }
    } catch (err) {
      console.log(err);
      setBuyErr(err.response.data.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="w-11/12 xl:w-[1100px] bg-zinc-900 h-max pb-8 mx-auto mt-8 mb-8 rounded-md">
        <div className="py-4 text-white bg-zinc-950 rounded-tl-md rounded-tr-md">
          <h1 className="text-2xl text-center">Skins market</h1>
          {authErr ? (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => navigate("/signin")}
                className="w-64 h-8 rounded-lg bg-indigo-500 text-white text-lg hover:bg-indigo-600 cursor-pointer"
              >
                Login
              </button>
            </div>
          ) : (
            <div className="mt-4 flex flex-col gap-4 sm:gap-0 sm:flex-row justify-around items-center">
              <div className="flex flex-col items-center">
                <p className="text-white opacity-40">
                  Sell your skins in the market
                </p>
                <button
                  onClick={() => setComponent(<AddSkin />)}
                  className="bg-indigo-500 w-36 text-lg mt-2 rounded-sm h-8 cursor-pointer hover:bg-indigo-600"
                >
                  Add skin
                </button>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-white opacity-40">
                  View and edit your placed skins
                </p>
                <button
                  onClick={() => setComponent(<UserMarketSkins />)}
                  className="bg-indigo-500 w-36 text-lg mt-2 rounded-sm h-8 cursor-pointer hover:bg-indigo-600"
                >
                  My skins
                </button>
              </div>
            </div>
          )}
        </div>
        {component ? (
          component
        ) : (
          <div>
            <div className="w-full flex items-center h-max py-4 rounded-tr-lg rounded-tl-lg">
              <div className="w-full flex flex-col-reverse gap-2 sm:gap-0 justify-center sm:flex-row  items-center ">
                <div className="w-full flex justify-center sm:w-64">
                  <button
                    onClick={() => setRarityDropdown(!rarityDropdown)}
                    className="w-11/12 sm:w-48 cursor-pointer pl-2 pr-2 hover:bg-zinc-800  bg-zinc-950 h-8 rounded-md text-white text-lg ml-0 sm:ml-8"
                  >
                    Rarity{" "}
                    <span className="flex justify-end items-center -mt-7">
                      ⮟
                    </span>
                  </button>
                </div>

                <div className="flex w-full items-center justify-center sm:justify-end">
                  <input
                    value={searchValue}
                    placeholder="Search"
                    className="bg-zinc-950 w-11/12 sm:w-60 text-white pl-4 pr-4 rounded-md h-8 mr-0 sm:mr-8"
                    type="text"
                    onChange={(e) => {
                      setMarketSkins(
                        SearchFilter(
                          e.target.value,
                          filterSkins.length > 0
                            ? filterSkins
                            : marketSkinsData,
                          "search"
                        ).skins
                      );
                      setSearchValue(e.target.value);
                      managePages(
                        0,
                        SearchFilter(
                          e.target.value,
                          filterSkins.length > 0
                            ? filterSkins
                            : marketSkinsData,
                          "search"
                        ).pages
                      );
                    }}
                  />
                </div>
              </div>

              {rarityDropdown && (
                <div className="w-11/12 sm:w-48 rounded-sm h-52 bg-zinc-800 absolute mt-78 sm:mt-66 ml-0 sm:ml-4">
                  {rarities &&
                    rarities.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setMarketSkins(
                            SearchFilter(item.name, marketSkinsData, "filter")
                              .skins
                          );
                          setFilterSkins(
                            SearchFilter(item.name, marketSkinsData, "filter")
                              .skins
                          );
                          setSearchValue("");
                          managePages(
                            0,
                            SearchFilter(item.name, marketSkinsData, "filter")
                              .pages
                          );
                        }}
                        className="w-full cursor-pointer text-white text-lg text-center  h-10  rounded-sm hover:bg-zinc-900"
                      >
                        <p className="pt-1">{item.name}</p>
                        <div
                          className="w-full  mt-1 rounded-sm h-1"
                          style={{ backgroundColor: item.color }}
                        ></div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="flex flex-wrap justify-center mt-8 gap-8 items-center">
              {marketSkins.length > 0 ? (
                marketSkins.map((skin, index) => (
                  <div
                    key={index}
                    className="text-white w-56  h-max bg-zinc-700/20 rounded-sm"
                  >
                    <img
                      className="w-32 h-32 sm:w-44 mx-auto"
                      src={skin.image}
                      alt=""
                    />
                    <p className="text-white text-lg h-4 mb-8 text-center mt-2">
                      {skin.name}
                    </p>
                    <div className="flex ml-4 gap-2 mt-5 items-center">
                      <img
                        className="w-10 h-10 rounded-full"
                        src={
                          skin.user.image
                            ? `http://localhost:3000/uploads\\${skin.user.image}`
                            : defaultProfilePicture
                        }
                        alt=""
                      />
                      <p>{skin.user.username}</p>
                    </div>
                    <p className="text-lg border-2 w-max px-4 mb-4 mx-auto  rounded-md text-center">
                      {skin.price} €
                    </p>
                    <div className={`flex justify-center pb-2 items-center`}>
                      {user === skin.user.username ? (
                        <button
                          onClick={() => setComponent(<UserMarketSkins />)}
                          className="w-5/6 h-8 mb-2 border-2 border-indigo-500 text-indigo-500 text-lg cursor-pointer hover:border-indigo-600 hover:text-indigo-600"
                        >
                          My skins
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedSkin(skin)}
                          className="w-5/6 h-8 mb-2 border-2 border-indigo-500 text-indigo-500 text-lg cursor-pointer hover:border-indigo-600 hover:text-indigo-600"
                        >
                          Buy
                        </button>
                      )}
                    </div>

                    <div
                      className="w-full h-2 rounded-bl-sm rounded-br-sm "
                      style={{ backgroundColor: skin.color }}
                    ></div>
                  </div>
                ))
              ) : (
                <div>
                  <p className="text-white text-lg">
                    Currently there's no skins at the market
                  </p>
                </div>
              )}
            </div>
            {selectedSkin && (
              <div className="w-full h-screen bg-zinc-950/50  left-0 top-0 fixed flex items-center justify-center">
                <div className="w-11/12 text-white w-[600px] bg-zinc-800 rounded-md h-max pb-6">
                  {authErr ? (
                    <div className="text-white">
                      <h1 className="text-2xl text-center py-2 rounded-tl-md rounded-tr-md bg-zinc-900">
                        You are not logged in
                      </h1>
                      <p className="text-center mt-6">
                        You have to be logged in to do this. Please log in.
                      </p>
                      <div className="flex justify-center mt-4">
                        <button
                          onClick={() => navigate("/signin")}
                          className="w-48 h-8 rounded-lg bg-indigo-500 text-white text-lg hover:bg-indigo-600 cursor-pointer"
                        >
                          Login
                        </button>
                      </div>
                      <div className="flex justify-center mt-4">
                        <button
                          onClick={() => setSelectedSkin()}
                          className="w-42 h-8 border-2 border-red-400 text-red-400 text-lg rounded-sm cursor-pointer hover:scale-101"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h1 className="text-2xl text-center py-2 rounded-tl-md rounded-tr-md bg-zinc-900">
                        Confirm your buy
                      </h1>
                      <img
                        className="w-56 mx-auto"
                        src={selectedSkin.image}
                        alt=""
                      />
                      <p
                        className="text-center text-xl font-bold mt-4"
                        style={{ color: selectedSkin.color }}
                      >
                        {selectedSkin.name}
                      </p>
                      <p className="text-center mt-2">
                        Are you sure you want to buy this skin?
                      </p>
                      {buyResponse ? (
                        <div className="flex flex-col items-center">
                          <div
                            className={`py-1 w-68 pr-4 mx-auto border-2  border-green-400 mt-4 rounded-sm mb-4 flex  items-center bg-zinc-950`}
                          >
                            <p className={`pl-4 text-green-400`}>
                              ! {buyResponse}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedSkin();
                              setBuyResponse("");
                            }}
                            className="w-32 h-8 border-2 border-red-400 text-red-400 rounded-sm cursor-pointer hover:scale-101"
                          >
                            Close
                          </button>
                        </div>
                      ) : buyErr ? (
                        <div className="flex flex-col items-center">
                          <div
                            className={`py-1 w-68 pr-4 mx-auto border-2  border-red-400 mt-4 rounded-sm mb-4 flex  items-center bg-zinc-950`}
                          >
                            <p className={`pl-4 text-red-400`}>! {buyErr}</p>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedSkin();
                              setBuyErr("");
                            }}
                            className="w-32 h-8 border-2 border-red-400 text-red-400 rounded-sm cursor-pointer hover:scale-101"
                          >
                            Close
                          </button>
                        </div>
                      ) : (
                        <div className="flex mt-4 justify-center gap-8">
                          <button
                            onClick={handleBuySkin}
                            className="w-32 cursor-pointer h-8 border-2 border-indigo-500 text-indigo-500 text-lg rounded-sm hover:scale-101"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setSelectedSkin()}
                            className="w-32 cursor-pointer h-8 border-2 border-red-400 text-red-400 text-lg rounded-sm hover:scale-101"
                          >
                            No
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex mt-8 justify-center gap-2 mx-auto">
              <button
                onClick={() => {
                  setCurrentPage((prev) => prev - 1);
                }}
                className={`w-10 cursor-pointer hover:bg-zinc-800 rounded-sm text-white text-2xl ${btnBack} justify-center items-center h-10 bg-zinc-950`}
              >
                <IoIosArrowBack />
              </button>
              <div className="w-20 h-10 rounded-sm bg-zinc-950 text-white text-lg flex items-center justify-center">
                <p>
                  {currentPage + 1}/{lastPage}
                </p>
              </div>
              <button
                onClick={() => {
                  setCurrentPage((prev) => prev + 1);
                }}
                className={`w-10 cursor-pointer hover:bg-zinc-800 rounded-sm text-white text-2xl ${btnForward} justify-center items-center h-10 bg-zinc-950`}
              >
                <IoIosArrowForward />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Market;
