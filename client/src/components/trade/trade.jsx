import React, { useEffect, useState } from "react";
import { Navbar } from "../navbar";
import { TradeOffers } from "./trade-offers";
import { TradeSearch } from "./trade-search";
import axios from "axios";
import Cookies from "js-cookie";
import { AuthErr } from "../auth/authErr";
import { PermErr } from "../auth/permErr";
import { TradeSentOffers } from "./trade-sent-offers";

function Trade() {
  const [component, setComponent] = useState(<TradeOffers />);
  const [authErr, setAuthErr] = useState();
  console.log(<TradeOffers />);

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
        if (err.status === 401) {
          setAuthErr(<AuthErr />);
        }
        if (err.status === 403) {
          setAuthErr(<PermErr />);
        }
      }
    };

    getUser();
  }, []);

  return (
    <div>
      <Navbar />
      {authErr || (
        <div className="w-[1100px] bg-zinc-900 text-white h-max pb-8 mx-auto mt-8 rounded-sm">
          <div className="w-full bg-zinc-950 h-16 items-center justify-center text-2xl text-center rounded-tl-sm rounded-tr-sm flex">
            <h1>Trade offers</h1>
          </div>
          <div className="flex justify-around mt-4">
            {component ? (
              component
            ) : (
              <div className="w-[700px] flex items-center justify-center h-64 bg-zinc-800/50">
                <p className="text-xl text-zinc-300">Error</p>
              </div>
            )}
            <div className="w-[300px] flex rounded-sm flex-col items-center h-64 bg-zinc-800/50">
              <div className="flex w-11/12 justify-center border-b-2 h-16 items-center border-zinc-700">
                <button
                  onClick={() => setComponent(<TradeSearch />)}
                  className="w-full h-9 cursor-pointer  rounded-md text-lg bg-indigo-500 hover:bg-indigo-600"
                >
                  New Trade Offer
                </button>
              </div>
              <button
                onClick={() => setComponent(<TradeOffers />)}
                className={`${
                  component.type.name === "TradeOffers"
                    ? "border-l-4 border-indigo-500"
                    : ""
                } w-11/12 h-10 cursor-pointer text-lg bg-zinc-900 hover:bg-zinc-900/75 mt-4`}
              >
                Trade offers
              </button>
              <button
                onClick={() => setComponent(<TradeSentOffers />)}
                className={`${
                  component.type.name === "TradeSentOffers"
                    ? "border-l-4 border-indigo-500"
                    : ""
                } w-11/12 h-10 cursor-pointer text-lg bg-zinc-900 hover:bg-zinc-900/75 mt-4`}
              >
                Sent offers
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Trade;
