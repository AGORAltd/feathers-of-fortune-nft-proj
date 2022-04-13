import React from "react";
import { useContext } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { useState } from "react";
import { NftContext } from "../../../context/NftContext";

const Header = () => {
  const { waxUserLogIn, userAccount, setUserLoginProvider } =
    useContext(NftContext);

  const [userLoginPopup, setUserLoginPopup] = useState(false);
  const [sideBarOpen, setSideBarOpen] = useState(false);
  return (
    <>
      <SweetAlert
        title={"Connect Wallet"}
        show={userLoginPopup}
        showConfirm={false}
        style={{ color: "white", background: "#1d2228" }}
        onCancel={() => {
          setUserLoginPopup(false);
        }}
      >
        <div className="flex flex-col">
          <button
            style={{ background: "#14181d" }}
            className="flex items-center justify-between px-3 py-1 my-4"
            onClick={() => {
              setUserLoginPopup(false);
              setUserLoginProvider("wax");
            }}
          >
            <p>Wax Cloud Wallet </p>
            <img width={70} src="/media/waxLogoPng.png" />
          </button>
          <button
            style={{ background: "#14181d" }}
            onClick={() => {
              setUserLoginPopup(false);
              setUserLoginProvider("anchor");
            }}
            className="flex items-center justify-between px-3 py-1"
          >
            <p>Anchor </p> <img width={40} src="/media/anchor_logo.svg" />
          </button>
        </div>
      </SweetAlert>
      <div className="app_header h-24 flex items-center justify-between px-24 sticky flex-col md:flex-row">
        <img
          src="/media/logo"
          className="h-16 my-4 md:my-0 cursor-pointer"
          alt="brand_logo"
        />

        <button
          onClick={() => {
            if (sideBarOpen != true) {
              setSideBarOpen(true);
            } else {
              setSideBarOpen(false);
            }
          }}
          className="block md:hidden absolute right-4 top-8 text-white"
        >
          <div
            style={{
              width: "35px",
              height: "5px",
              backgroundColor: "white",
              margin: "6px 0",
            }}
          ></div>
          <div
            style={{
              width: "35px",
              height: "5px",
              backgroundColor: "white",
              margin: "6px 0",
            }}
          ></div>
          <div
            style={{
              width: "35px",
              height: "5px",
              backgroundColor: "white",
              margin: "6px 0",
            }}
          ></div>
        </button>

        <div className="menu_items items-center justify-between hidden md:flex">
          <a className="cursor-pointer px-2">ABOUT</a>
          <a className="cursor-pointer px-2">FAQ</a>
          <a className="cursor-pointer px-2">TERMS AND CONDITIONS</a>
          {!userAccount ? (
            <button
              className="login_button"
              onClick={() => {
                setUserLoginPopup(true);
              }}
            >
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

        {sideBarOpen && (
          <div style={{ background: "#1d2228" }} className="py-14">
            <div className="menu_items items-center justify-between flex-col mx-auto">
              <div className="flex flex-col text-center">
                <a className="cursor-pointer my-2">ABOUT</a>
                <a className="cursor-pointer my-2">FAQ</a>
                <a className="cursor-pointer my-2">TERMS AND CONDITIONS</a>
              </div>
              {!userAccount ? (
                <button
                  className="login_button"
                  onClick={() => {
                    setUserLoginPopup(true);
                  }}
                >
                  LOGIN
                </button>
              ) : (
                <div className="flex-col text-center items-center flex">
                  <div className="user_account_name my-2 mx-4">
                    {userAccount}
                  </div>
                  <button
                    className="login_button mx-4 my-1 my-2"
                    onClick={() => {
                      if (typeof window !== undefined) {
                        window.location.href =
                          "https://all-access.wax.io/logout";
                      }
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
