import React, { useEffect, useState } from "react";
import { Navbar } from "./navbar";
import { Navigate, useNavigate } from "react-router-dom";
import FetchData from "./fetchData";
import axios from "axios";
import Cookies from "js-cookie";
import { FaTrash } from "react-icons/fa";
import { BanErr } from "./auth/banErr";
import { AuthErr } from "./auth/authErr";
import { PermErr } from "./auth/permErr";

function Main() {
  const cases = FetchData();
  const [isAdmin, setIsAdmin] = useState(false);
  const [casePanel, setCasePanel] = useState(false);
  const [selectedCase, setSelectedCase] = useState();
  const [casePrice, setCasePrice] = useState();
  const [activeCases, setActiveCases] = useState([]);
  const [caseErr, setCaseErr] = useState(false);
  const [caseErrMsg, setCaseErrMsg] = useState();
  const [authErr, setAuthErr] = useState();

  const token = Cookies.get("token");
  const tokenHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const checkIsAdmin = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/user/profile",
          tokenHeader
        );
        if (response.data.role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.log(err);
      }
    };
    checkIsAdmin();

    const fetchCases = async () => {
      try {
        const response = await axios.get("http://localhost:3000/cases");
        console.log("fetched cases", response);
        if (response) setActiveCases(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCases();
  }, []);

  // console.log(FetchData)

  const navigate = useNavigate();

  console.log(cases);

  const handleCaseNavigation = (index) => {
    const caseDataId = activeCases[index].caseId || activeCases[index].id;
    const urlId = caseDataId;
    navigate(`/case/${urlId}`);
  };

  const handleAddCase = async (e) => {
    e.preventDefault();

    if (casePrice < 0) return;

    selectedCase.price = casePrice;
    const { id, image, name, price } = selectedCase;
    const caseId = id;
    const caseData = {
      caseId,
      image,
      name,
      price,
    };
    try {
      const response = await axios.post(
        "http://localhost:3000/cases",
        caseData,
        tokenHeader
      );
      if (response) {
        setActiveCases((prev) => [...prev, selectedCase]);
        setCaseErr(false);
      }
    } catch (err) {
      console.log(err);
      if (err.status === 400) {
        setCaseErr(true);
        setCaseErrMsg(err.response.data.message[0]);
      }
      if (err.status === 409) {
        setCaseErr(true);
        setCaseErrMsg(err.response.data.message);
      }
      if (err.status === 401) {
        setAuthErr(<AuthErr />);
      }
      if (err.status === 403) {
        setAuthErr(<PermErr />);
      }
    }

    console.log(activeCases);
  };

  const handleRemoveCase = async (item, index) => {
    const caseData = item.caseId || item.id;
    try {
      console.log(item);
      const response = await axios.delete(
        `http://localhost:3000/cases/${caseData}`,
        tokenHeader
      );
      if (response) {
        const removedCases = activeCases.filter((_, i) => i !== index);
        setActiveCases(removedCases);
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

  return (
    <div>
      <Navbar />
      {authErr ? (
        authErr
      ) : (
        <div className="w-11/12 xl:w-[1100px] bg-zinc-900 mt-16 mb-8 mt-4rounded-lg mx-auto h-max pb-8">
          <div className="text-white flex itmes-center w-full rounded-tl-lg rounded-tr-lg bg-zinc-950">
            <h1 className="pt-4 text-2xl  pb-4 pl-8">Cases</h1>
            {isAdmin && (
              <div className="flex items-center ml-auto mr-4">
                <button
                  onClick={() => setCasePanel(!casePanel)}
                  className="bg-indigo-500 rounded-md text-lg h-9 cursor-pointer hover:bg-indigo-600 w-32"
                >
                  Edit cases
                </button>
              </div>
            )}
          </div>
          {/* admin case panel */}

          {casePanel ? (
            <div className="h-max ">
              <div className="flex-col flex mx-auto lg:flex-row mt-4 gap-8">
                <div className="w-11/12 mx-auto lg:w-1/2 h-max lg:ml-4 rounded-md bg-zinc-800">
                  <h1 className="text-white bg-zinc-950 text-center py-2 rounded-tl-md rounded-tr-md text-2xl">
                    Select case
                  </h1>
                  <div
                    className="overflow-y-auto pb-4 h-84 [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-zinc-950
  [&::-webkit-scrollbar-thumb]:bg-zinc-900"
                  >
                    {" "}
                    {cases?.map((item, index) => (
                      <div
                        onClick={() => setSelectedCase(item)}
                        className="flex flex-col sm:flex-row cursor-pointer  text-white mx-auto justify-center items-center pt-4 pb-4 rounded-xl mt-8 w-max sm:w-108 hover:bg-zinc-900"
                        key={index}
                      >
                        <img
                          className="h-24 mx-auto  w-36"
                          src={item.image}
                        ></img>
                        <p className="mx-auto text-lg">{item.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-11/12 mx-auto mt-4 lg:mt-0 lg:w-1/2 h-max  h-max lg:mr-4 rounded-md bg-zinc-800">
                  <h1 className="text-white bg-zinc-950 text-center py-2 rounded-tl-md rounded-tr-md text-2xl">
                    Active cases
                  </h1>

                  <div
                    className="overflow-y-auto pb-4 h-84 [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-zinc-950
  [&::-webkit-scrollbar-thumb]:bg-zinc-900"
                  >
                    {" "}
                    {activeCases?.map((item, index) => (
                      <div
                        className="flex flex-col sm:flex-row text-white justify-center mx-auto items-center pt-4 pb-4 rounded-xl mt-8 w-max sm:w-108 hover:bg-zinc-900"
                        key={index}
                      >
                        <img
                          className="h-24 mx-auto w-36"
                          src={item.image}
                        ></img>
                        <p className="mx-auto text-lg">{item.name}</p>
                        <button
                          onClick={() => handleRemoveCase(item, index)}
                          className="w-5/6 sm:w-10 cursor-pointer h-8 mr-2 bg-white text-black rounded-md"
                        >
                          <FaTrash className="mx-auto" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <h1 className="text-center mt-8 text-white text-xl">
                Selected case
              </h1>
              {selectedCase && (
                <div>
                  {caseErr && (
                    <div className="h-8 w-64 mt-4 mx-auto border-2 border-red-400 rounded-sm mb-4 flex items-center bg-zinc-950">
                      <p className="text-red-400 pl-4 ">! {caseErrMsg}</p>
                    </div>
                  )}

                  <div className="w-82 h-24 mx-auto flex items-center text-white mt-2 rounded-md bg-zinc-950">
                    <img
                      className="h-20 mx-auto "
                      src={selectedCase?.image}
                    ></img>
                    <p className="mx-auto text-lg">{selectedCase?.name}</p>
                  </div>
                  <form
                    onSubmit={handleAddCase}
                    className="mx-auto flex justify-center mt-4 flex-col w-64"
                  >
                    <label className="text-white text-lg">Price</label>
                    <input
                      onChange={(e) => setCasePrice(e.target.value)}
                      className="bg-zinc-800 h-9 rounded-md text-white pl-4"
                      type="number"
                    />
                    <button
                      type="submit"
                      className="w-28 rounded-md mt-2 mx-auto cursor-pointer text-lg h-10 bg-white "
                    >
                      Add case
                    </button>
                  </form>
                </div>
              )}
            </div>
          ) : (
            //  ---------------
            <div className="flex gap-4 pl-3  flex-wrap">
              {activeCases.length > 0 ? (
                activeCases?.map((item, index) => (
                  <div
                    className="flex flex-col text-white mx-auto md:mx-0 pt-4 pb-4 rounded-xl mt-8 w-64"
                    key={index}
                  >
                    <img
                      className="sm:h-24 mx-auto sm:w-36 h-32 w-44"
                      src={item.image}
                    ></img>
                    <p className="mx-auto pt-4">{item.name}</p>
                    <div className="flex justify-center">
                      <button
                        className="w-40 rounded-sm h-10 mt-2 text-lg text-white border-2 border-white font-bold cursor-pointer hover:border-gray-300 hover:text-gray-300"
                        onClick={() => {
                          handleCaseNavigation(index);
                        }}
                      >
                        {item.price}€
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="mx-auto mt-6">
                  <p className="text-white text-xl">
                    There is no cases at the moment
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Main;
