import React from "react";
import { useContext } from "react";
import { NftContext } from "../../../context/NftContext";

const Header = () => {
  const { waxUserLogIn, userAccount } = useContext(NftContext);
  return (
    <div className="app_header h-24 flex items-center justify-between px-24 sticky">
      <img src="/media/logo" className="h-16 cursor-pointer" alt="brand_logo" />

      <div className="menu_items flex items-center justify-between">
        <a className="cursor-pointer px-2">ABOUT</a>
        <a className="cursor-pointer px-2">FAQ</a>
        <a className="cursor-pointer px-2">TERMS AND CONDITIONS</a>
        {!userAccount ? (
          <button className="login_button" onClick={waxUserLogIn}>
            LOGIN
          </button>
        ) : (
          <div className="flex items-center">
            <div className="user_account_name mx-4">{userAccount}</div>
            <button
              className="login_button mx-4"
              onClick={() => {
                if (typeof window !== undefined) {
                  window.location.href = "https://all-access.wax.io/logout";
                }
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
