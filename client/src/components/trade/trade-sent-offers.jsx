import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { AuthErr } from "../auth/authErr";
import { PermErr } from "../auth/permErr";
import defaultProfilePicture from "../../assets/default.jpg";
import axios from "axios";

export function TradeSentOffers() {
  const [authErr, setAuthErr] = useState();
  const [trades, setTrades] = useState([]);
  const [tradeErr, setTradeErr] = useState("");

  const token = Cookies.get("token");
  const tokenHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchSentOffers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/trade/getsentoffers",
          tokenHeader
        );
        console.log("gagfa", response);
        if (response) {
          setTrades(response.data);
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
    fetchSentOffers();
  }, []);

  const handleDeclineTrade = async (trade, index) => {
    try {
      const response = await axios.patch(
        "http://localhost:3000/trade/deletetrade",
        { _id: trade._id },
        tokenHeader
      );
      if (response) {
        setTrades((trade) => trade.filter((_, i) => i !== index));
      }
    } catch (err) {
      setTradeErr("This trade offer no longer exists!");
    }
  };

  return (
    <div>
      {authErr || (
        <div className="w-[700px] flex flex-col items-center pb-8 h-120 overflow-y-scroll bg-zinc-800/50">
          {tradeErr && (
            <div className="flex flex-col items-center">
              <div
                className={`py-1 w-68 pr-4 mx-auto border-2  border-red-400 mt-4 rounded-sm mb-4 flex  items-center bg-zinc-950`}
              >
                <p className={`pl-4 text-red-400`}>! {tradeErr}</p>
              </div>
            </div>
          )}
          {trades.length > 0 ? (
            trades.map((trade, index) => (
              <div key={index} className="w-11/12 h-max pb-4 mt-6 bg-zinc-900">
                <div className="flex items-center gap-2 py-2 px-4">
                  <img
                    className="w-10 h-10"
                    src={
                      trade.sender.image
                        ? `http://localhost:3000/uploads\\${trade.sender.image}`
                        : defaultProfilePicture
                    }
                    alt=""
                  />

                  <p className="flex gap-2 items-center">
                    You sent offer to{" "}
                    <span>
                      <img
                        className="w-8 h-8"
                        src={
                          trade.user.image
                            ? `http://localhost:3000/uploads\\${trade.user.image}`
                            : defaultProfilePicture
                        }
                        alt=""
                      />
                    </span>{" "}
                    {trade.user.username}
                  </p>
                </div>
                <p className="pl-8 mt-2">Your Offer</p>
                <div className="w-11/12 min-h-[100px] max-h-[210px] bg-zinc-800  gap-y-4 mx-auto py-2 grid grid-cols-5 overflow-y-scroll mt-2">
                  {trade.senderSkins &&
                    trade.senderSkins.map((skin, index) => (
                      <div
                        className="w-22 h-22 cursor-pointer flex items-center justify-center justify-self-center bg-zinc-900/50"
                        key={index}
                      >
                        <img className="w-20" src={skin?.image} alt="" />
                      </div>
                    ))}
                </div>
                <div className="flex gap-2 py-2 items-center">
                  <p className="pl-8 mt-2">For </p>
                  <img
                    className="w-8 h-8"
                    src={
                      trade.user.image
                        ? `http://localhost:3000/uploads\\${trade.user.image}`
                        : defaultProfilePicture
                    }
                    alt=""
                  />
                  <p>{trade.user.username}</p>
                </div>

                <div className="w-11/12 min-h-[100px] max-h-[210px] bg-zinc-800  gap-y-4 mx-auto py-2 grid grid-cols-5 overflow-y-scroll mt-2">
                  {trade.receiverSkins &&
                    trade.receiverSkins.map((skin, index) => (
                      <div
                        className="w-22 h-22 cursor-pointer flex items-center justify-center justify-self-center bg-zinc-900/50"
                        key={index}
                      >
                        <img className="w-20" src={skin?.image} alt="" />
                      </div>
                    ))}
                </div>
                <div className="flex mt-4 gap-2 justify-end pr-4 items-center">
                  <button
                    onClick={() => handleDeclineTrade(trade, index)}
                    className="w-32 h-9 border-2 border-red-400 text-red-400 cursor-pointer text-lg rounded-sm hover:border-red-400/90 hover:text-red-400/90"
                  >
                    Cancel Trade
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center h-full">
              <p className="text-xl  text-zinc-300">
                You didn't sent any offers
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
