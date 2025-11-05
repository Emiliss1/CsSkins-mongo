import React, { useEffect, useRef, useState } from "react";
import { Navbar } from "./navbar";
import { useLocation, useNavigate } from "react-router-dom";
import FetchData from "./fetchData";
import rareItem from "../assets/rareItem.png";
import Cookies from "js-cookie";
import axios from "axios";
import { AuthErr } from "./auth/authErr";
import { BanErr } from "./auth/banErr";
import { PermErr } from "./auth/permErr";

function openCase() {
  const { pathname } = useLocation();
  const caseId = pathname.replace("/case/", "");

  const [skins, setSkins] = useState();
  const [crate, setCrate] = useState();
  const [rollPosition, setRollPosition] = useState(0);
  const [transitionDuration, setTransitionDuration] = useState(8);
  const rollerRef = useRef(null);
  const [unlockedSkin, setUnlockedSkin] = useState();
  const [randomSkins, setRandomSkins] = useState([]);
  const [unlockBtn, setUnlockBtn] = useState("block");
  const [unlockedScreen, setUnlockedScreen] = useState(false);
  const [blurred, setBlurred] = useState("");
  const [authErr, setAuthErr] = useState();
  const [balance, setBalance] = useState();
  const [balanceErr, setBalanceErr] = useState();

  const data = FetchData();

  useEffect(() => {
    const authUser = async () => {
      const token = Cookies.get("token");
      const tokenHeader = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await axios.get(
          "http://localhost:3000/user/profile",
          tokenHeader
        );
      } catch (err) {
        setAuthErr(<AuthErr />);
        console.log(err);
        if (err.status === 403) setAuthErr(<PermErr />);
      }
    };
    authUser();
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/cases");
        if (response) {
          const matchedCase = response.data.find(
            (item) => item.caseId === caseId
          );
          if (data) {
            const findSkins = data?.find((skin) => skin.id === caseId);
            setSkins(findSkins?.contains || []);

            findSkins.price = matchedCase?.price;
            setCrate(findSkins);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, [data, caseId]);

  console.log(skins);

  // console.log("test", randomSkins);

  useEffect(() => {
    if (rollerRef.current) {
      rollerRef.current.style.transition = `all ${transitionDuration}s cubic-bezier(.08,.6,0,1)`;
      rollerRef.current.style.marginLeft = `${rollPosition}px`;
    }
  }, [rollPosition, transitionDuration]);

  const pushGoldRarity = () => {
    skins.push({
      id: "skin-rare",
      image: rareItem,
      name: "★ Rare Special Item ★",
      rarity: {
        color: "#f4d111",
        name: "Exceedingly Rare",
      },
    });
  };

  const loadSkins = () => {
    const generatedSkins = [];

    const generateSkins = (rarity) => {
      const raritySkins = skins.filter((skin) => skin.rarity.name === rarity);
      const randomIndex = Math.trunc(Math.random() * raritySkins.length);
      generatedSkins.push(raritySkins[randomIndex]);
    };

    for (let i = 0; i <= 60; i++) {
      const rarityNumber = Math.trunc(Math.random() * 1000) + 1;
      if (rarityNumber <= 799) {
        generateSkins("Mil-Spec Grade");
      }
      if (rarityNumber <= 958 && rarityNumber > 799) {
        generateSkins("Restricted");
      }
      if (rarityNumber <= 990 && rarityNumber > 958) {
        generateSkins("Classified");
      }
      if (rarityNumber <= 997 && rarityNumber > 990) {
        generateSkins("Covert");
      }
      if (rarityNumber <= 1000 && rarityNumber > 997) {
        generateSkins("Exceedingly Rare");
      }
    }
    setRandomSkins(generatedSkins);
  };

  useEffect(() => {
    if (skins?.length > 0) {
      pushGoldRarity();
      loadSkins();
    }
  }, [skins]);

  const startRolling = async () => {
    const token = Cookies.get("token");
    const tokenHeader = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const balanceData = {
      balance: crate.price,
      status: "BUY",
    };
    try {
      const response = await axios.patch(
        "http://localhost:3000/user/balance",
        balanceData,
        tokenHeader
      );
      if (response.status === 200) {
        setBalance(response.data.newBalance);
        console.log("balance", response);
        setTransitionDuration(8);
        console.log(crate);
        const randomPos = Math.trunc(Math.random() * 100);
        let skinData;
        if (randomSkins[49].rarity.name === "Exceedingly Rare") {
          const randomGoldSkinIndex = Math.trunc(
            Math.random() * crate.contains_rare.length
          );
          setUnlockedSkin(crate.contains_rare[randomGoldSkinIndex]);
          skinData = crate.contains_rare[randomGoldSkinIndex];
        } else {
          setUnlockedSkin(randomSkins[49]);
          skinData = randomSkins[49];
        }
        //animation always stops at index 49
        setRollPosition(-6770 - randomPos);
        setUnlockBtn("hidden");
        setTimeout(() => {
          setBlurred("blur-lg");
          setUnlockedScreen(!unlockedScreen);
        }, 9 * 1000);

        console.log("skinas", unlockedSkin);

        const data = {
          name: skinData.name,
          image: skinData.image,
          color: skinData.rarity.color,
          rarity: skinData.rarity.name,
        };

        try {
          await axios.post("http://localhost:3000/skins", data, tokenHeader);
        } catch (err) {
          console.log("error", err);

          setAuthErr(<AuthErr />);
        }
      }
    } catch (err) {
      if (err.status === 412) {
        return setBalanceErr(err.response.data.message);
      }
    }
  };

  const handleReopen = () => {
    setTransitionDuration(0);
    setRollPosition(0);
    if (skins?.length > 0) {
      loadSkins();
      setUnlockBtn("block");
      setUnlockedScreen(!unlockedScreen);
      setBlurred("");
    }
  };
  // console.log("skinnnn", unlockedSkin);

  // console.log("debug", OpenerSkins());

  return (
    <div>
      <Navbar balanceData={balance} />
      {authErr || (
        <div className="w-11/12 xl:w-[1100px] h-124  bg-zinc-900 mx-auto mt-8 rounded-lg">
          <div className="h-14 rounded-tr-lg rounded-tl-lg flex items-center justify-center bg-zinc-950">
            <h1 className="text-white text-center text-xl ">{crate?.name}</h1>
          </div>

          {unlockedScreen && (
            <div className="w-11/12 xl:w-[800px]  rounded-lg  h-96 absolute z-30  left-1/2 transform -translate-x-1/2 ">
              <div className=" w-max mx-auto rounded-lg">
                <img
                  className="w-64 sm:w-88 pr-8 mt-8 mx-auto"
                  src={unlockedSkin?.image}
                  alt=""
                />
              </div>

              <h2
                className={`text-lg sm:text-2xl text-center font-bold text-white`}
              >
                You unlocked
                <span style={{ color: unlockedSkin?.rarity.color }}>
                  {" "}
                  {unlockedSkin?.name}
                </span>
              </h2>

              <div className={`flex justify-center mt-4`}>
                <button
                  onClick={handleReopen}
                  className="w-40 h-12 border-2 border-indigo-500 text-indigo-500 text-lg cursor-pointer rounded hover:border-indigo-600 hover:text-indigo-600"
                >
                  Open again
                </button>
              </div>
            </div>
          )}

          <div className={`bg-zinc-900 ${blurred}`}>
            <div className="mx-auto mb-8 mt-20 relative w-11/12 xl:w-[1000px] h-[200px]  rounded-sm overflow-hidden">
              <div
                ref={rollerRef}
                className=" w-[99999px] h-[200px] flex items-center bg-zinc-800 transition-all duration-10000 ease-in-out"
              >
                {randomSkins?.map((skin, index) => (
                  <div
                    key={index}
                    className={`item inline-block  mr-1 mb-1 w-36 h-32 bg-cover bg-center bg-zinc-950/25 rounded-sm`}
                  >
                    <img className="h-26 mx-auto" src={skin?.image} alt="" />
                    <div
                      className="h-1 rounded-br-sm mt-5 rounded-bl-sm bg-white"
                      style={{ backgroundColor: skin?.rarity.color }}
                    ></div>
                  </div>
                ))}
              </div>

              <div className="absolute left-1/2 top-0 transform -translate-x-1/2 h-full w-1 bg-indigo-500 z-10"></div>
            </div>
            <div
              className={`w-20 h-8 border-2 mx-auto  flex items-center justify-center border-white ${unlockBtn}`}
            >
              <p className="text-white text-lg text-center">{crate?.price}€</p>
            </div>

            {balanceErr ? (
              <div className={`flex justify-center mt-4 ${unlockBtn}`}>
                <p className="text-white text-lg">{balanceErr}</p>
              </div>
            ) : (
              <div className={`flex justify-center mt-4 ${unlockBtn}`}>
                <button
                  onClick={startRolling}
                  className="w-40 h-12 border-2 border-indigo-500 text-indigo-500 text-lg cursor-pointer rounded hover:border-indigo-600 hover:text-indigo-600"
                >
                  Unlock
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="w-11/12 xl:w-[1100px] mb-24 h-max bg-zinc-900 mx-auto mt-8 pb-8 rounded-lg">
        <h1 className="bg-zinc-950 pt-4 pb-4 pl-8 rounded-tl-lg rounded-tr-lg text-2xl text-white">
          Contains
        </h1>

        <div className="mt-4 flex  flex-wrap pl-0 sm:pl-18  gap-4">
          {skins?.map((skin, index) => (
            <div
              key={index}
              className="w-56 rounded-md pt-2 flex flex-col mx-auto sm:mx-0 text-white h-44 mt-4 bg-zinc-950"
            >
              <img className="w-32 mx-auto" src={skin.image} alt="" />
              <p className="text-center pl-2 pt-2 pr-2 flex-grow">
                {skin.name}
              </p>
              <div
                className="h-2 rounded-bl-md rounded-br-md"
                style={{ backgroundColor: skin.rarity.color }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default openCase;
