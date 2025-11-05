import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { pagination } from "../functions/pagination";
import { AuthErr } from "../auth/authErr";
import { PermErr } from "../auth/permErr";
import { SearchFilter } from "../functions/search-filter";

export function AddSkin() {
  const [skins, setSkins] = useState([]);
  const [selectedSkin, setSelectedSkin] = useState();
  const [price, setPrice] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const [lastPage, setLastPage] = useState();
  const [btnForward, setBtnForward] = useState("flex");
  const [btnBack, setBtnBack] = useState("flex");
  const [skinRes, setSkinRes] = useState("");
  const [skinErr, setSkinErr] = useState("");
  const [authErr, setAuthErr] = useState();
  const [rarityDropdown, setRarityDropdown] = useState(false);
  const [marketSkinsData, setMarketSkinsData] = useState([]);
  const [filterSkins, setFilterSkins] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [skinsData, setSkinsData] = useState([]);

  const token = Cookies.get("token");
  const tokenHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

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

  useEffect(() => {
    const getInventorySkins = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/skins",
          tokenHeader
        );
        if (response) {
          console.log(response);
          setSkins(pagination(response.data, currentPage).pageItems);
          setSkinsData(response.data);
          managePages(
            currentPage,
            pagination(response.data, currentPage).totalPages
          );

          console.log("func skins", skins);
        }
      } catch (err) {
        console.log(err);
        if (err.status === 401) {
          setAuthErr(<AuthErr />);
        }
        if (err.status === 403) {
          setAuthErr(<PermErr />);
        }
      }
    };
    getInventorySkins();
  }, [currentPage, skinRes]);

  const managePages = (curPage = 0, totalPages) => {
    if (curPage + 1 >= totalPages) setBtnForward("hidden");
    else setBtnForward("flex");

    if (curPage <= 0) setBtnBack("hidden");
    else setBtnBack("flex");

    setLastPage(totalPages);
  };

  const handleAddSkinMarket = async (e) => {
    e.preventDefault();
    try {
      const data = {
        skinId: selectedSkin._id,
        inMarket: true,
        price: +price,
      };
      const response = await axios.patch(
        "http://localhost:3000/market/addskin",
        data,
        tokenHeader
      );
      console.log(response);
      if (response) {
        setSkinRes(response.data);
        setSelectedSkin("");
        setSkinErr("");
        setPrice();
      }
    } catch (err) {
      console.log(err);
      setSkinErr(err.response.data.message);
    }
  };

  return (
    <div>
      {authErr || (
        <div>
          <div className="w-11/12 mx-auto mt-8 text-white">
            <div className="flex flex-col sm:flex-row border-b-2 border-zinc-500 px-8 justify-between pb-2 ">
              <h1 className="text-lg mt-2 text-zinc-500">
                Add your skin to the market
              </h1>
              <button
                onClick={() => location.reload()}
                className="w-42 h-10 border-2 border-indigo-500 text-indigo-500 text-lg cursor-pointer hover:border-indigo-600 hover:text-indigo-600 rounded-sm"
              >
                Market
              </button>
            </div>

            {skinRes && (
              <div
                className={`py-1 w-68 pr-4  mx-auto border-2 border-green-400 mt-4 rounded-sm mb-4 flex items-center bg-zinc-950`}
              >
                <p className={`pl-4 text-green-400`}>! {skinRes}</p>
              </div>
            )}

            {selectedSkin ? (
              <div>
                <p className="text-center mt-4 text-lg">Selected skin</p>

                {skinErr && (
                  <div
                    className={`py-1 w-68 pr-4  mx-auto border-2 border-red-400 mt-4 rounded-sm mb-4 flex items-center bg-zinc-950`}
                  >
                    <p className={`pl-4 text-red-400`}>! {skinErr}</p>
                  </div>
                )}

                <div className="mt-4 mx-auto">
                  <img className="w-48 mx-auto" src={selectedSkin.image} />
                  <p
                    className="text-lg text-center"
                    style={{ color: selectedSkin.color }}
                  >
                    {selectedSkin.name}
                  </p>
                </div>
                <form
                  onSubmit={handleAddSkinMarket}
                  className="flex flex-col w-5/6 md:w-[600px] gap-2 mx-auto items-center mt-4"
                >
                  <label className="text-zinc-500 text-lg">
                    Set your skin price
                  </label>
                  <input
                    className="bg-zinc-800 w-11/12 sm:w-64 h-9 text-center rounded-md border-2 border-zinc-500"
                    placeholder="Price"
                    type="number"
                    onChange={(e) => setPrice(e.target.value)}
                  />
                  <button
                    className="h-8 border-2 border-indigo-500 w-5/6 sm:w-48 rounded-sm text-indigo-500 text-lg cursor-pointer hover:border-indigo-600 hover:text-indigo-600"
                    type="submit"
                  >
                    Add
                  </button>
                </form>
              </div>
            ) : (
              <div className="mx-auto text-center text-lg mt-4">
                <p>Select skin from your inventory</p>
              </div>
            )}

            <h1 className="text-xl border-b-2 text-zinc-500 px-4 mt-4">
              Inventory
            </h1>

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
                      setSkins(
                        SearchFilter(
                          e.target.value,
                          filterSkins.length > 0 ? filterSkins : skinsData,
                          "search"
                        ).skins
                      );
                      setSearchValue(e.target.value);
                      managePages(
                        0,
                        SearchFilter(
                          e.target.value,
                          filterSkins.length > 0 ? filterSkins : skinsData,
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
                          setSkins(
                            SearchFilter(item.name, skinsData, "filter").skins
                          );
                          setFilterSkins(
                            SearchFilter(item.name, skinsData, "filter").skins
                          );
                          setSearchValue("");
                          managePages(
                            0,
                            SearchFilter(item.name, skinsData, "filter").pages
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

            <div className="flex flex-wrap gap-8 mt-8 justify-center">
              {skins.length > 0 ? (
                skins.map((skin, index) => (
                  <div
                    onClick={() => {
                      setSelectedSkin(skin);
                      setSkinRes("");
                    }}
                    key={index}
                    className="w-38 h-42 sm:w-52 cursor-pointer sm:h-52 bg-zinc-700/20 rounded-sm hover:scale-101"
                  >
                    <img
                      className="w-32 sm:w-44 mx-auto"
                      src={skin.image}
                      alt=""
                    />
                    <p className="text-white  h-15 text-center mt-2">
                      {skin.name}
                    </p>
                    <div
                      className="w-full h-2 rounded-bl-sm rounded-br-sm "
                      style={{ backgroundColor: skin.color }}
                    ></div>
                  </div>
                ))
              ) : (
                <div>
                  <p>You have no skins in your inventory</p>
                </div>
              )}
            </div>
          </div>
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
  );
}
