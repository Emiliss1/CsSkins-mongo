import React, { useEffect, useState } from "react";
import { Navbar } from "./navbar";
import Cookies from "js-cookie";
import axios from "axios";
import { AuthErr } from "./auth/authErr";
import { data } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { BanErr } from "./auth/banErr";
import { PermErr } from "./auth/permErr";
import { pagination } from "./functions/pagination";
import { SearchFilter } from "./functions/search-filter";

function Inventory() {
  const [skinsData, setSkinsData] = useState([]);
  const [skins, setSkins] = useState([]);
  const [authErr, setAuthErr] = useState();
  const [rarityDropdown, setRarityDropdown] = useState(false);
  const [filterSkins, setFilterSkins] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [lastPage, setLastPage] = useState();
  const [btnForward, setBtnForward] = useState("flex");
  const [btnBack, setBtnBack] = useState("flex");
  const [searchValue, setSearchValue] = useState("");

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
    const getSkins = async () => {
      const token = Cookies.get("token");
      const tokenHeader = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const response = await axios.get(
          "http://localhost:3000/skins",
          tokenHeader
        );

        if (response.status === 200) {
          // setSkins(response.data);
          setSkinsData(pagination(response.data, currentPage).pageItems);

          setSkins(pagination(response.data, currentPage).pageItems);

          managePages(currentPage, pagination(data, currentPage).totalPages);
        }
        console.log("response", response);
      } catch (err) {
        console.log(err);
        setAuthErr(<AuthErr />);
        if (err.status === 403) {
          setAuthErr(<PermErr />);
        }
      }
    };
    getSkins();
  }, [currentPage]);

  const managePages = (curPage = 0, totalPages) => {
    if (curPage + 1 >= totalPages) setBtnForward("hidden");
    else setBtnForward("flex");

    if (curPage <= 0) setBtnBack("hidden");
    else setBtnBack("flex");

    setLastPage(totalPages);
  };

  return (
    <div>
      <Navbar />
      {authErr || (
        <div className="w-11/12 xl:w-[1100px] h-max  pb-10 mb-10  mt-8 bg-zinc-900 mx-auto rounded-lg">
          <div className="w-full flex items-center h-max py-4 rounded-tr-lg rounded-tl-lg bg-zinc-950">
            <div className="w-full flex flex-col-reverse gap-2 sm:gap-0 justify-center sm:flex-row  items-center ">
              <div className="w-full flex justify-center sm:w-64">
                <button
                  onClick={() => setRarityDropdown(!rarityDropdown)}
                  className="w-11/12 sm:w-48 cursor-pointer pl-2 pr-2 hover:bg-zinc-800  bg-zinc-900 h-8 rounded-md text-white text-lg ml-0 sm:ml-8"
                >
                  Rarity{" "}
                  <span className="flex justify-end items-center -mt-7">⮟</span>
                </button>
              </div>

              <div className="flex w-full items-center justify-center sm:justify-end">
                <input
                  value={searchValue}
                  placeholder="Search"
                  className="bg-zinc-900 w-11/12 sm:w-60 text-white pl-4 pr-4 rounded-md h-8 mr-0 sm:mr-8"
                  type="text"
                  onChange={(e) => {
                    setSkins(
                      SearchFilter(
                        e.target.value,
                        filterSkins.length > 0 ? filterSkins : marketSkinsData,
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
          <div className="ml-0 sm:ml-24 justify-center sm:justify-start flex flex-wrap  gap-4 mt-8">
            {skins.length === 0 ? (
              <p className="text-center mx-auto pr-24 text-white text-xl">
                Skins not found
              </p>
            ) : (
              skins.map((skin, index) => (
                <div
                  key={index}
                  className="w-38 h-42 sm:w-52  sm:h-52 bg-zinc-700/20 rounded-sm"
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
            )}
          </div>
          <div className="flex mt-8 justify-center gap-2">
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

export default Inventory;
