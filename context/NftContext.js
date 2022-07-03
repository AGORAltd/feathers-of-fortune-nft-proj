import axios from "axios";
import { useState, createContext, useEffect } from "react";
import {
  RPC_ENDPOINT,
  WAX_PINK_END_POINT,
} from "../components/constants/constants";
import * as waxjs from "@waxio/waxjs/dist";
import AnchorLink from "anchor-link";
import AnchorLinkBrowserTransport from "anchor-link-browser-transport";
export const NftContext = createContext();

const wax = new waxjs.WaxJS({
  rpcEndpoint: RPC_ENDPOINT,
  tryAutoLogin: true,
});

export function NftContextProvider({ children }) {
  useEffect(() => {
    tryAutoLoginBrowser();
  }, []);

  const [userAccount, setUserAccount] = useState();
  const [authUserData, setAuthUserData] = useState();
  const [isAuthorizedUser, setIsAuthorizedUser] = useState(false);
  const [userLoginProvider, setUserLoginProvider] = useState();
  const [anchorWalletSession, setAnchorWalletSession] = useState(null);

  let chainId =
    "1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4";
  let nodeUrl = "wax.pink.gg";
  const dapp = "PIXELCAMPAIGN";
  const anchorTransport = new AnchorLinkBrowserTransport();

  const anchorLink = new AnchorLink({
    transport: anchorTransport,
    verifyProofs: true,
    chains: [{ chainId: chainId, nodeUrl: `https://${nodeUrl}` }],
  });

  useEffect(() => {
    checkIfAuthorizeduser();
  }, [authUserData]);

  useEffect(() => {
    setUserLoginProvider("");
    userAccountLogin();
  }, [userLoginProvider]);

  const tryAutoLoginBrowser = async () => {
    let cookies = document.cookie;

    let isAutoLoginAvailable = await wax.isAutoLoginAvailable();
    let sessionList = await anchorLink.listSessions(dapp);
    let wallet_session;
    if (sessionList && sessionList.length > 0) {
      wallet_session = await anchorLink.restoreSession(dapp);

      setUserAccount(
        wallet_session
          ? String(wallet_session?.auth)?.split("@")[0]
          : cookies.split("=")[1]
      );
      getAuthUsers();
      setAnchorWalletSession(wallet_session);
      setUserLoginProvider("anchor");
    } else if (
      isAutoLoginAvailable &&
      localStorage.getItem("userLoggedIn") != "false"
    ) {
      setUserAccount(wax.userAccount ? wax.userAccount : cookies.split("=")[1]);
      getAuthUsers();
      setUserLoginProvider("wax");
      localStorage.setItem("userLoggedIn", true);
    }
  };

  const userAccountLogin = () => {
    if (userLoginProvider == "anchor") {
      anchorUserLogin();
    } else if (userLoginProvider == "wax") {
      waxUserLogIn();
    }
  };

  const anchorUserLogin = async () => {
    let sessionList = await anchorLink.listSessions(dapp);
    let wallet_session;

    try {
      if (sessionList && sessionList.length > 0) {
        wallet_session = await anchorLink.restoreSession(dapp);
        setAnchorWalletSession(wallet_session);
      } else {
        wallet_session = (await anchorLink.login(dapp)).session;
        setAnchorWalletSession(wallet_session);
      }
      setUserAccount(String(wallet_session.auth).split("@")[0]);
      document.cookie = `username= ${
        String(wallet_session.auth).split("@")[0]
      }; expires=Thu, 18 Dec 2023 12:00:00 UTC`;
      getAuthUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const waxUserLogIn = async () => {
    try {
      let userAccountFromLogin = await wax.login();
      setUserAccount(userAccountFromLogin);
      document.cookie = `username= ${userAccountFromLogin}; expires=Thu, 18 Dec 4023 12:00:00 UTC`;
      getAuthUsers();
      localStorage.setItem("userLoggedIn", true);
    } catch (err) {
      console.log(err);
    }
  };

  const getAuthUsers = async () => {
    await axios
      .post(`${WAX_PINK_END_POINT}/v1/chain/get_table_rows`, {
        json: true,
        code: "fortunebirds",
        scope: "fortunebirds",
        table: "authusers",
        limit: 200,
      })
      .then((response) => {
        setAuthUserData(response.data.rows);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const checkIfAuthorizeduser = () => {
    authUserData?.forEach((user) => {
      if (user.account == userAccount) {
        setIsAuthorizedUser(true);
      }
    });
  };

  return (
    <NftContext.Provider
      value={{
        setAnchorWalletSession,
        userAccount,
        setUserAccount,
        isAuthorizedUser,
        setIsAuthorizedUser,
        setUserLoginProvider,
        anchorLink,
        setUserAccount,
        anchorWalletSession,
        userAccountLogin,
      }}
    >
      {children}
    </NftContext.Provider>
  );
}
