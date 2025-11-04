import React, { useEffect, useState } from "react";
import { Navbar } from "../navbar";
import Cookies from "js-cookie";
import axios from "axios";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { pagination } from "../functions/pagination";

function TradeCreateOffer() {
  const [senderSkins, setSenderSkins] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [lastPage, setLastPage] = useState();
  const [btnForward, setBtnForward] = useState("flex");
  const [btnBack, setBtnBack] = useState("flex");
  const [totalPages, setTotalPages] = useState();

  const token = Cookies.get("token");
  const tokenHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const getSenderInventory = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/skins",
          tokenHeader
        );
        if (response) {
          setSenderSkins(pagination(response.data, currentPage, 12).pageItems);
          managePages(
            currentPage,
            pagination(response.data, currentPage, 12).totalPages
          );
          setTotalPages(pagination(response.data, currentPage, 12).totalPages);
          console.log(response);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getSenderInventory();
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
      <div className="w-[1100px] h-max flex justify-around rounded-sm bg-zinc-900 py-8 mx-auto mt-8">
        <div className="w-[450px] h-116 bg-zinc-800/50">
          <div className="w-full h-max flex text-white text-lg bg-zinc-950">
            <button className="w-full h-16 cursor-pointer text-indigo-500  border-b-5 border-indigo-500">
              Your inventory
            </button>
            <button className="w-full h-16 cursor-pointer ">
              Their inventory
            </button>
          </div>
          <div className="w-11/12 h-78 gap-y-4 mx-auto py-2 grid grid-rows-3 grid-cols-4 mt-4  bg-zinc-900">
            {senderSkins.map((skin, index) => (
              <div
                className="w-22 h-22 cursor-pointer flex items-center justify-center justify-self-center bg-zinc-800/25 hover:bg-zinc-800/75"
                key={index}
              >
                <img className="w-20" src={skin.image} alt="" />
              </div>
            ))}
          </div>
          <div className="flex mt-4 justify-center gap-2 mx-auto">
            <button
              onClick={() => {
                currentPage >= 0 && setCurrentPage((prev) => prev - 1);
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
                currentPage + 1 <= totalPages &&
                  setCurrentPage((prev) => prev + 1);
              }}
              className={`w-10 cursor-pointer hover:bg-zinc-800 rounded-sm text-white text-2xl ${btnForward} justify-center items-center h-10 bg-zinc-950`}
            >
              <IoIosArrowForward />
            </button>
          </div>
        </div>
        <div className="w-[550px] h-68 bg-zinc-800/50"></div>
      </div>
    </div>
  );
}

export default TradeCreateOffer;
