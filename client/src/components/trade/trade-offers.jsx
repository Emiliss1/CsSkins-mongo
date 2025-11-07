import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import defaultProfilePicture from "../../assets/default.jpg";

export function TradeOffers() {
  const [trades, setTrades] = useState([]);

  const token = Cookies.get("token");
  const tokenHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/trade/gettrades",
          tokenHeader
        );

        if (response) {
          console.log(response);
          setTrades(response.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchTrades();
  }, []);

  return (
    <div className="w-[700px] flex flex-col items-center pb-8 h-120 overflow-y-scroll bg-zinc-800/50">
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
              <p>{trade.sender.username} sent you a trade offer</p>
            </div>
            <p className="pl-8 mt-2">{trade.sender.username} Offer</p>
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
            <p className="pl-8 mt-2">For your's </p>
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
              <button className="w-32 h-9 border-2 border-indigo-500 text-indigo-500 cursor-pointer text-lg rounded-sm hover:border-indigo-500/90 hover:text-indigo-500/90">
                Accept Trade
              </button>
              <button className="w-32 h-9 border-2 border-red-400 text-red-400 cursor-pointer text-lg rounded-sm hover:border-red-400/90 hover:text-red-400/90">
                Decline Trade
              </button>
            </div>
          </div>
        ))
      ) : (
        <div>
          <p className="text-xl text-zinc-300">
            You have no trade offers at this time
          </p>
        </div>
      )}
    </div>
  );
}
