import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import defaultProfilePicture from "../../assets/default.jpg";
import { useNavigate } from "react-router-dom";
import { AuthErr } from "../auth/authErr";
import { PermErr } from "../auth/permErr";

export function TradeSearch() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState("");
  const [authErr, setAuthErr] = useState();

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

  const handleSearchUser = async (e, search) => {
    e.preventDefault();

    if (search.trim("") === "") return setUsers("");

    try {
      const response = await axios.get(
        `http://localhost:3000/trade/searchuser?search=${search}`,
        tokenHeader
      );

      if (response) {
        setUsers(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleUserNavigation = (index) => {
    const usernameUrl = users[index].username;
    console.log(usernameUrl);
    navigate(`/trade-offer/${usernameUrl}`);
  };

  return (
    <div className="w-[700px] h-96  bg-zinc-800/50">
      {authErr || (
        <div>
          <form
            onSubmit={(e) => handleSearchUser(e, search)}
            className="flex justify-center mt-4"
          >
            <input
              className="w-11/12 bg-zinc-950/50 h-10 rounded-lg px-4"
              onChange={(e) => {
                setSearch(e.target.value);
                handleSearchUser(e, e.target.value);
              }}
              type="text"
              placeholder="Search for user"
            />
          </form>
          <div
            className="flex flex-col gap-2 overflow-y-scroll items-center mt-4 [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-zinc-900
  [&::-webkit-scrollbar-thumb]:bg-zinc-900"
          >
            {users.length > 0 ? (
              users.map((user, index) => (
                <div
                  className="w-11/12 flex items-center px-2 bg-zinc-900 text-lg h-max py-2"
                  key={index}
                >
                  <img
                    className="w-10"
                    src={
                      user.image
                        ? `http://localhost:3000/uploads\\${user.image}`
                        : defaultProfilePicture
                    }
                    alt=""
                  />
                  <p className="pl-4">{user.username}</p>
                  <button
                    onClick={() => handleUserNavigation(index)}
                    className="w-32 bg-indigo-500 ml-auto rounded-sm h-8 cursor-pointer hover:bg-indigo-600"
                  >
                    Make Offer
                  </button>
                </div>
              ))
            ) : users ? (
              <div className="text-xl mt-4">
                <p>User was not found</p>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
