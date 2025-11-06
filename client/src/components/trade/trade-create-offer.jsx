import React, { useEffect, useState } from "react";
import { Navbar } from "../navbar";
import Cookies from "js-cookie";
import axios from "axios";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { pagination } from "../functions/pagination";
import { useLocation } from "react-router-dom";
import defaultProfilePicture from "../../assets/default.jpg";

function TradeCreateOffer() {
  const [senderSkins, setSenderSkins] = useState([]);
  const [senderSkinsData, setSenderSkinsData] = useState([]);
  const [receiverSkins, setReceiverSkins] = useState([]);
  const [receiverSkinsData, setReceiverSkinsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [lastPage, setLastPage] = useState();
  const [btnForward, setBtnForward] = useState("flex");
  const [btnBack, setBtnBack] = useState("flex");
  const [totalPages, setTotalPages] = useState();
  const [isSenderInventory, setIsSenderInventory] = useState(true);
  const [sender, setSender] = useState();
  const [receiver, setReceiver] = useState();
  const [senderTradeSkins, setSenderTradeSkins] = useState([]);
  const [receiverTradeSkins, setReceiverTradeSkins] = useState([]);
  const [tradeErr, setTradeErr] = useState("");

  const { pathname } = useLocation();

  const urlUsername = pathname.replace("/trade-offer/", "");

  const token = Cookies.get("token");
  const tokenHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const getSender = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/skins",
          tokenHeader
        );

        const userResponse = await axios.get(
          "http://localhost:3000/user/profile",
          tokenHeader
        );

        if (userResponse) {
          setSender(userResponse.data);
        }

        if (response) {
          setSenderSkinsData(response.data);
          setSenderSkins(pagination(response.data, currentPage, 12).pageItems);

          if (isSenderInventory) {
            managePages(
              currentPage,
              pagination(response.data, currentPage, 12).totalPages
            );
            setTotalPages(
              pagination(response.data, currentPage, 12).totalPages
            );
          }

          console.log(response);
        }
      } catch (err) {
        console.log(err);
      }
    };

    const getReceiver = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/trade/getuser?username=${urlUsername}`,
          tokenHeader
        );
        if (response) {
          setReceiver(response.data);
          setReceiverSkinsData(response.data.skins);
          setReceiverSkins(
            pagination(response.data.skins, currentPage, 12).pageItems
          );

          if (!isSenderInventory) {
            managePages(
              currentPage,
              pagination(response.data.skins, currentPage, 12).totalPages
            );
            setTotalPages(
              pagination(response.data.skins, currentPage, 12).totalPages
            );
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    getReceiver();
    getSender();
  }, []);

  useEffect(() => {
    const getSenderInventory = () => {
      if (senderSkins.length > 0) {
        if (isSenderInventory) {
          setSenderSkins(
            pagination(senderSkinsData, currentPage, 12).pageItems
          );
          managePages(
            currentPage,
            pagination(senderSkinsData, currentPage, 12).totalPages
          );
          setTotalPages(
            pagination(senderSkinsData, currentPage, 12).totalPages
          );
        }
      }
    };

    const getReceiverInventory = () => {
      if (receiverSkins.length > 0) {
        if (!isSenderInventory) {
          setReceiverSkins(
            pagination(receiverSkinsData, currentPage, 12).pageItems
          );
          managePages(
            currentPage,
            pagination(receiverSkinsData, currentPage, 12).totalPages
          );
          setTotalPages(
            pagination(receiverSkinsData, currentPage, 12).totalPages
          );
        }
      }
    };

    getReceiverInventory();
    getSenderInventory();
  }, [currentPage, isSenderInventory, senderTradeSkins, receiverTradeSkins]);

  const managePages = (curPage = 0, totalPages) => {
    if (curPage + 1 >= totalPages) setBtnForward("hidden");
    else setBtnForward("flex");

    if (curPage <= 0) setBtnBack("hidden");
    else setBtnBack("flex");

    setLastPage(totalPages);
  };

  const handleAddSkin = (index) => {
    const skinIndex = index + currentPage * 12;
    if (isSenderInventory) {
      setSenderTradeSkins((prev) => [...prev, senderSkinsData[skinIndex]]);
      setSenderSkinsData((prev) => prev.filter((_, i) => i !== skinIndex));
      if (senderSkins.length - 1 <= 0) {
        setCurrentPage((prev) => prev - 1);
      }
    } else {
      setReceiverTradeSkins((prev) => [...prev, receiverSkinsData[skinIndex]]);
      setReceiverSkinsData((prev) => prev.filter((_, i) => i !== skinIndex));
      console.log("ladidaa", receiverSkins);
      if (receiverSkins.length - 1 <= 0) {
        setCurrentPage((prev) => prev - 1);
      }
    }
  };

  const handleRemoveSkin = (index, user) => {
    if (user === "sender") {
      setSenderSkinsData((prev) => [senderTradeSkins[index], ...prev]);
      setSenderTradeSkins((prev) => prev.filter((_, i) => i !== index));
    } else if (user === "receiver") {
      setReceiverSkinsData((prev) => [receiverTradeSkins[index], ...prev]);
      setReceiverTradeSkins((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleCreateTrade = async () => {
    try {
      const data = {
        senderSkins: senderTradeSkins,
        receiverSkins: receiverTradeSkins,
        receiver: receiver._id,
      };

      const response = await axios.post(
        "http://localhost:3000/trade/createtrade",
        data,
        tokenHeader
      );
    } catch (err) {
      console.log(err);
      setTradeErr(err.response.data.message);
    }
  };
  return (
    <div>
      <Navbar />
      <div className="w-[1100px] h-max flex justify-around rounded-sm bg-zinc-900 py-8 mx-auto mt-8">
        <div className="w-[450px] h-116 bg-zinc-800/50">
          <div className="w-full h-max flex text-white text-lg bg-zinc-950">
            <button
              onClick={() => {
                setIsSenderInventory(true);
                !isSenderInventory && setCurrentPage(0);
              }}
              className={`w-full h-16 cursor-pointer ${
                isSenderInventory &&
                "border-b-5 border-indigo-500  text-indigo-500"
              } `}
            >
              Your inventory
            </button>
            <button
              onClick={() => {
                setIsSenderInventory(false);
                isSenderInventory && setCurrentPage(0);
              }}
              className={`w-full h-16 cursor-pointer ${
                !isSenderInventory &&
                "border-b-5 border-indigo-500  text-indigo-500"
              }`}
            >
              Their inventory
            </button>
          </div>
          <div className="w-11/12 h-78 gap-y-4 mx-auto py-2 grid grid-rows-3 grid-cols-4 mt-4  bg-zinc-900">
            {isSenderInventory
              ? senderSkins?.map((skin, index) => (
                  <div
                    onClick={() => handleAddSkin(index)}
                    className="w-22 h-22 cursor-pointer flex items-center justify-center justify-self-center bg-zinc-800/25 hover:bg-zinc-800/75"
                    key={index}
                  >
                    <img className="w-20" src={skin?.image} alt="" />
                  </div>
                ))
              : receiverSkins?.map((skin, index) => (
                  <div
                    onClick={() => handleAddSkin(index)}
                    className="w-22 h-22 cursor-pointer flex items-center justify-center justify-self-center bg-zinc-800/25 hover:bg-zinc-800/75"
                    key={index}
                  >
                    <img className="w-20" src={skin?.image} alt="" />
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
        <div className="w-[550px] h-max pb-4 bg-zinc-800/50">
          <div className="w-full ">
            <div className="w-full h-max py-2 px-4 bg-zinc-950 flex items-center text-white text-lg">
              <img
                className="w-12 h-12"
                src={
                  sender?.image
                    ? `http://localhost:3000/uploads\\${sender.image}`
                    : defaultProfilePicture
                }
              />
              <p className="pl-4">Your items</p>
            </div>
            <div className="w-11/12 gap-y-4 mx-auto py-2 grid grid-cols-4 mt-4 h-52 overflow-y-scroll bg-zinc-900 mt-4">
              {senderTradeSkins?.map((skin, index) => (
                <div
                  onClick={() => handleRemoveSkin(index, "sender")}
                  className="w-22 h-22 cursor-pointer flex items-center justify-center justify-self-center bg-zinc-800/25 hover:bg-zinc-800/75"
                  key={index}
                >
                  <img className="w-20" src={skin?.image} alt="" />
                </div>
              ))}
            </div>
          </div>
          <div className="w-full mt-4">
            <div className="w-full h-max py-2 px-4 bg-zinc-950 flex items-center text-white text-lg">
              <img
                className="w-12 h-12"
                src={
                  receiver?.image
                    ? `http://localhost:3000/uploads\\${receiver.image}`
                    : defaultProfilePicture
                }
              />
              <p className="pl-4">{receiver?.username} items</p>
            </div>
            <div className="w-11/12 gap-y-4 mx-auto py-2 grid grid-cols-4 mt-4 h-52 overflow-y-scroll h-48 bg-zinc-900 mt-4">
              {receiverTradeSkins?.map((skin, index) => (
                <div
                  onClick={() => handleRemoveSkin(index, "receiver")}
                  className="w-22 h-22 cursor-pointer flex items-center justify-center justify-self-center bg-zinc-800/25 hover:bg-zinc-800/75"
                  key={index}
                >
                  <img className="w-20" src={skin?.image} alt="" />
                </div>
              ))}
            </div>
            {tradeErr && (
              <div
                className={`py-1 w-68 pr-4  mx-auto border-2 border-red-400 mt-4 rounded-sm mb-4 flex items-center bg-zinc-950`}
              >
                <p className={`pl-4 text-red-400`}>! {tradeErr}</p>
              </div>
            )}

            <div className="flex justify-center mt-4">
              <button
                onClick={handleCreateTrade}
                className="w-40 h-10 bg-indigo-500 text-white text-lg rounded-lg cursor-pointer hover:bg-indigo-600"
              >
                Make offer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TradeCreateOffer;
