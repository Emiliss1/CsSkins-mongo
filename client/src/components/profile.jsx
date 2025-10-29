import React, { useEffect, useState } from "react";
import { Navbar } from "./navbar";
import Cookies from "js-cookie";
import axios from "axios";
import defaultProfileImg from "../assets/default.jpg";
import { AuthErr } from "./auth/authErr";

function Profile() {
  const [username, setUsername] = useState();
  const [isSettings, setIsSettings] = useState(false);
  const [profileImg, setProfileImg] = useState();
  const [userProfileImg, setUserProfileImg] = useState();
  const [authErr, setAuthErr] = useState();
  const [profilePictureErr, setProfilePictureErr] = useState();
  const [profileImgProp, setProfileImgProp] = useState();
  const [newUsername, setNewUsername] = useState();
  const [usernamePass, setUsernamePass] = useState();
  const [usernameRes, setUsernameRes] = useState();
  const [usernameErr, setUsernameErr] = useState();
  const [updatedUsername, setUpdatedUsername] = useState();
  const [curPassword, setCurPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [confNewPassword, setConfNewPassword] = useState();
  const [newPasswordRes, setNewPasswordRes] = useState();
  const [newPasswordErr, setNewPasswordErr] = useState();

  const token = Cookies.get("token");
  const tokenHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/user/profile",
          tokenHeader
        );
        if (response.status === 200) {
          setUsername(response.data.username);
          if (response.data.image === "") {
            setUserProfileImg(defaultProfileImg);
            console.log("profileimg", userProfileImg);
          } else {
            setUserProfileImg(
              `http://localhost:3000/uploads\\${response.data.image}`
            );
          }
        }
      } catch (err) {
        console.log(err);
        if (err.status === 401) {
          setAuthErr(<AuthErr />);
        }
      }
    };
    getUser();
  }, []);

  const handleChangeImage = async (e) => {
    e.preventDefault();
    console.log(profileImg);
    const formData = new FormData();
    formData.append("file", profileImg);
    try {
      console.log(formData);
      const response = await axios.post(
        "http://localhost:3000/user/picture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response);
      if (response) {
        setUserProfileImg(
          `http://localhost:3000/uploads\\${response.data.file}`
        );
        setProfileImgProp(
          `http://localhost:3000/uploads\\${response.data.file}`
        );
        setProfilePictureErr();
      }
    } catch (err) {
      console.log(err);
      setProfilePictureErr(err.response.data.message);
    }
  };

  const handleNewUsername = async (e) => {
    e.preventDefault();
    const data = {
      username: newUsername,
      password: usernamePass,
    };
    try {
      const response = await axios.patch(
        "http://localhost:3000/user/username",
        data,
        tokenHeader
      );
      console.log(response);
      if (response) {
        const newToken = response.data.responseData.accessToken;
        const expires = 1 / 24;
        Cookies.set("token", newToken, { expires: expires });
        setUsernameRes(response.data.responseData.message);
        setUsername(response.data.responseData.username);
        setUpdatedUsername(response.data.responseData.username);
        setUsernameErr();
        setNewUsername("");
        setUsernamePass("");
      }
    } catch (err) {
      console.log(err);
      setUsernameErr(err.response.data.message);
    }
  };

  const handleNewPassword = async (e) => {
    e.preventDefault();
    const data = {
      password: curPassword,
      newPassword: newPassword,
      confNewPassword: confNewPassword,
    };
    try {
      const response = await axios.patch(
        "http://localhost:3000/user/password",
        data,
        tokenHeader
      );
      if (response) {
        console.log(response);
        setNewPasswordRes(response.data);
        setCurPassword("");
        setNewPassword("");
        setConfNewPassword("");
        setNewPasswordErr();
      }
    } catch (err) {
      console.log(err);
      if (Array.isArray(err.response.data.message)) {
        const errMsg = err.response.data.message.join(" ,");
        setNewPasswordErr(errMsg);
      } else {
        setNewPasswordErr(err.response.data.message);
      }
    }
  };

  return (
    <div>
      <Navbar
        profileImageProp={profileImgProp}
        updatedUsername={updatedUsername}
      />
      {authErr || (
        <div className="w-11/12 xl:w-[1100px] h-max pb-8 bg-zinc-900 mx-auto mt-8 rounded-md">
          <div className="w-full text-white h-52 bg-zinc-950 pt-2 rounded-tl-md  rounded-tr-md">
            <div className="flex justify-end">
              <button
                onClick={() => setIsSettings(!isSettings)}
                className="mr-6 text-lg rounded-sm mt-4 w-32 h-10 border-2 border-white cursor-pointer hover:border-zinc-200 hover:text-zinc-200"
              >
                Settings
              </button>
            </div>
            <div className="flex mt-14 sm:mt-4 items-center">
              <div className="w-28 h-28 sm:w-44 sm:h-44 bg-zinc-800 ml-4 sm:ml-16">
                <img
                  className="w-28 h-28  sm:w-44 sm:h-44  border-1 border-zinc-300"
                  src={userProfileImg}
                  alt=""
                />
              </div>
              <div className="w-24 sm:w-32 h-8 sm:h-10 bg-zinc-800 border-2 border-indigo-500 flex items-center justify-center ml-4 sm:ml-8">
                <p className="text-lg sm:text-2xl">{username}</p>
              </div>
            </div>
          </div>
          <div className="w-11/12 sm:w-10/12 text-white mt-24 mx-auto">
            {isSettings ? (
              <div>
                <h1 className="text-2xl pl-8 pb-4  text-white">Settings</h1>
                <div
                  className="overflow-y-scroll h-96 pb-8 [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-zinc-900
  [&::-webkit-scrollbar-thumb]:bg-zinc-950
  [&::-webkit-scrollbar-thumb]:rounded-xl"
                >
                  {/* profile picture settings */}

                  <h1 className="text-lg pl-8 mt-10 border-b-2 border-zinc-700 text-zinc-300">
                    Profile picture
                  </h1>
                  <p className="mt-6 ml-4 text-zinc-400 text-lg">
                    Change your profile picture
                  </p>
                  {profilePictureErr && (
                    <div
                      className={`py-1 w-68 pr-4 ml-8 border-2 border-red-400 mt-2 rounded-sm mb-4 flex items-center bg-zinc-950`}
                    >
                      <p className={`pl-4 text-red-400`}>
                        ! {profilePictureErr}
                      </p>
                    </div>
                  )}

                  <form
                    className="flex flex-col sm:flex-row mt-2 ml-0 sm:ml-4 items-center gap-4"
                    onSubmit={handleChangeImage}
                  >
                    <div className="w-11/12 sm:w-68 rounded-md flex items-center justify-center h-20 bg-zinc-950">
                      <input
                        onChange={(e) => setProfileImg(e.target.files[0])}
                        className="bg-zinc-900 file:bg-indigo-500 file:h-10 file:px-2 rounded-lg file:cursor-pointer hover:file:bg-indigo-600 w-11/12 sm:w-54 h-10 placeholder-gray-400"
                        type="file"
                      />
                    </div>
                    <button
                      type="subbmit"
                      className="w-32 h-10 border-2 text-indigo-500  rounded-sm border-indigo-500 cursor-pointer hover:border-indigo-600 hover:text-indigo-600"
                    >
                      Change
                    </button>
                  </form>

                  {/* -------------- */}

                  {/* username settings */}

                  <h1 className="text-lg pl-8 mt-10 border-b-2 border-zinc-700 text-zinc-300">
                    Username
                  </h1>
                  {usernameRes ? (
                    <div
                      className={`py-1 w-68 pr-4 ml-4 border-2 border-green-400 mt-4 rounded-sm mb-4 flex items-center bg-zinc-950`}
                    >
                      <p className={`pl-4 text-green-400`}>! {usernameRes}</p>
                    </div>
                  ) : usernameErr ? (
                    <div
                      className={`py-1 w-68 pr-4 ml-4 border-2 border-red-400 mt-4 rounded-sm mb-4 flex items-center bg-zinc-950`}
                    >
                      <p className={`pl-4 text-red-400`}>! {usernameErr}</p>
                    </div>
                  ) : (
                    <div></div>
                  )}
                  <form
                    onSubmit={handleNewUsername}
                    className="flex ml-4 flex-col mt-4"
                  >
                    <label className="text-lg text-zinc-500">
                      New username
                    </label>
                    <input
                      className="w-11/12 sm:w-64 mt-2 h-9 px-4 border-1 border-zinc-700 rounded-sm bg-zinc-800"
                      placeholder="Your new username"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      type="text"
                    />
                    <label className="text-lg mt-2 text-zinc-500">
                      Password
                    </label>
                    <input
                      className="w-11/12 sm:w-64 mt-2 h-9 px-4 border-1 border-zinc-700 rounded-sm bg-zinc-800"
                      placeholder="your password"
                      value={usernamePass}
                      onChange={(e) => setUsernamePass(e.target.value)}
                      type="password"
                    />
                    <button
                      type="submit"
                      className="w-11/12 sm:w-64 border-2 h-10 mt-4 rounded-sm border-indigo-500 text-indigo-500 cursor-pointer hover:border-indigo-600 hover:text-indigo-600"
                    >
                      Change username
                    </button>
                  </form>
                  {/* ------------ */}

                  {/* Password settings */}
                  <h1 className="text-lg pl-8 mt-10 border-b-2 border-zinc-700 text-zinc-300">
                    Password
                  </h1>

                  {newPasswordRes ? (
                    <div
                      className={`py-1 w-68 pr-4 ml-4 border-2 border-green-400 mt-4 rounded-sm mb-4 flex items-center bg-zinc-950`}
                    >
                      <p className={`pl-4 text-green-400`}>
                        ! {newPasswordRes}
                      </p>
                    </div>
                  ) : newPasswordErr ? (
                    <div
                      className={`py-1 w-68 pr-4 ml-4 border-2 border-red-400 mt-4 rounded-sm mb-4 flex items-center bg-zinc-950`}
                    >
                      <p className={`pl-4 text-red-400`}>! {newPasswordErr}</p>
                    </div>
                  ) : (
                    <div></div>
                  )}

                  <form
                    onSubmit={handleNewPassword}
                    className="flex ml-4 flex-col mt-4"
                  >
                    <label className="text-lg text-zinc-500">
                      Current password
                    </label>
                    <input
                      className="w-11/12 sm:w-64 mt-2 h-9 px-4 border-1 border-zinc-700 rounded-sm bg-zinc-800"
                      placeholder="Your current password"
                      value={curPassword}
                      onChange={(e) => setCurPassword(e.target.value)}
                      type="password"
                    />
                    <label className="text-lg mt-2 text-zinc-500">
                      New Password
                    </label>
                    <input
                      className="w-11/12 sm:w-64 mt-2 h-9 px-4 border-1 border-zinc-700 rounded-sm bg-zinc-800"
                      placeholder="your new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      type="password"
                    />
                    <label className="text-lg mt-2 text-zinc-500">
                      Confirm new Password
                    </label>
                    <input
                      className="w-11/12 sm:w-64 mt-2 h-9 px-4 border-1 border-zinc-700 rounded-sm bg-zinc-800"
                      placeholder="Confirm your new password"
                      value={confNewPassword}
                      onChange={(e) => setConfNewPassword(e.target.value)}
                      type="password"
                    />
                    <button
                      type="submit"
                      className="w-11/12 sm:w-64 border-2 h-10 mt-4 rounded-sm border-indigo-500 text-indigo-500 cursor-pointer hover:border-indigo-600 hover:text-indigo-600"
                    >
                      Change Password
                    </button>
                  </form>
                  {/* -------------------- */}
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-lg pl-8 border-b-2 border-zinc-700 text-zinc-300">
                  Recent activity
                </h1>
                <p className="text-center">WIP</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
