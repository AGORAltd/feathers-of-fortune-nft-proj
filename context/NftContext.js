import axios from "axios";
import { useState, createContext, useEffect } from "react";
import {
  RPC_ENDPOINT,
  WAX_PINK_END_POINT,
} from "../components/constants/constants";
import * as waxjs from "@waxio/waxjs/dist";
import { StartFirebase } from "./firebase-config";
import AnchorLink from "anchor-link";
import AnchorLinkBrowserTransport from "anchor-link-browser-transport";
export const NftContext = createContext();
import { useRouter } from "next/router";

import {
  onValue,
  ref,
  update,
  set,
  query,
  orderByChild,
  remove,
} from "firebase/database";

const wax = new waxjs.WaxJS({
  rpcEndpoint: RPC_ENDPOINT,
  tryAutoLogin: true,
});

export function NftContextProvider({ children }) {
  useEffect(() => {
    tryAutoLoginBrowser();
  }, []);

  const firebaseDb = StartFirebase();
  const [nftCardData, setNftCardData] = useState([]);
  const [endedCampaigns, setEndedCampaigns] = useState();
  const nowUTCEpochTimeInMilliSec = new Date(Date.now()).getTime();

  const [timeToShow, setTimeToShow] = useState("");

  const queryRef = query(
    ref(firebaseDb, "/campaigns"),
    orderByChild("campaignId")
  );

  const endedQueryRef = query(
    ref(firebaseDb, "/endedCampaigns"),
    orderByChild("time")
  );

  const [snapVal, setSnapVal] = useState();
  const [endedSnapVal, setEndedSnapVal] = useState();

  useEffect(() => {
    const singularCampaignArr = [];

    onValue(queryRef, (snapshot) => {
      setSnapVal(snapshot.val());
      if (snapshot.exists()) {
        snapshot.forEach((singularCampaign) => {
          const singularCampaignObj = singularCampaign.val();

          if (
            Date.parse(`${singularCampaignObj.lastRoll}Z`) +
              singularCampaignObj.loopTimeSeconds * 1000 -
              nowUTCEpochTimeInMilliSec >
              0 &&
            singularCampaignObj.totalEntriesStart !=
              singularCampaignObj.totalEntriesEnd
          ) {
            singularCampaignArr.push(singularCampaignObj);
          } else if (singularCampaignObj.totalEntriesStart > 0) {
            remove(ref(firebaseDb, `campaigns/${singularCampaignObj.route}`));
            set(
              ref(firebaseDb, `endedCampaigns/${singularCampaignObj?.route}`),
              { ...singularCampaignObj, time: new Date(Date.now()).getTime() }
            );
          }
        });
      }
      setNftCardData(singularCampaignArr);
    });
  }, [JSON.stringify(snapVal)]);

  useEffect(() => {
    const endedCampaignArr = [];

    onValue(endedQueryRef, (snapshot) => {
      setEndedSnapVal(snapshot.val());
      if (snapshot.exists()) {
        snapshot.forEach((singularCampaignObj) => {
          endedCampaignArr.push(singularCampaignObj.val());
        });
      }
      setEndedCampaigns(endedCampaignArr);
    });
  }, [JSON.stringify(endedSnapVal)]);

  const [userAccount, setUserAccount] = useState();
  const [authUserData, setAuthUserData] = useState();
  const [isAuthorizedUser, setIsAuthorizedUser] = useState(false);
  const [isCampaignCreateationSussessful, setIsCampaignCreateationSussessful] =
    useState();
  const [transactionId, setTransactionId] = useState("");
  const [transactionIdFromCreation, setTransactionIdFromCreation] = useState();
  const [erroMsg, setErroMsg] = useState("");
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [userLoginProvider, setUserLoginProvider] = useState();
  const [isTransactionSussessful, setIsTransactionSussessful] = useState();
  const [anchorWalletSession, setAnchorWalletSession] = useState(null);
  const [addMoreData, setAddMoreData] = useState(20);

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

  useEffect(() => {
    checkIfAuthorizeduser();
  }, [authUserData]);

  useEffect(() => {
    setUserLoginProvider("");
    userAccountLogin();
  }, [userLoginProvider]);

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

  const createCampaign = async (dataToSend) => {
    if (anchorWalletSession) {
      try {
        const results = await anchorLink.transact(
          {
            actions: [
              {
                account: "fortunebirds",
                name: "create",
                authorization: [
                  {
                    actor: userAccount,
                    permission: "active",
                  },
                ],

                data: dataToSend,
              },
            ],
          },
          { blocksBehind: 3, expireSeconds: 60 }
        );

        setTransactionIdFromCreation(
          results?.transaction_id?.length > 0 && results?.transaction_id
        );
        setIsTransactionSussessful(true);
      } catch (error) {
        setErroMsg(error.message != "" && error.message);
        setIsCampaignCreateationSussessful(false);
        console.log(error?.message);
      }
    } else {
      try {
        const results = await wax.api?.transact(
          {
            actions: [
              {
                account: "fortunebirds",
                name: "create",
                authorization: [
                  {
                    actor: userAccount,
                    permission: "active",
                  },
                ],

                data: dataToSend,
              },
            ],
          },
          { blocksBehind: 3, expireSeconds: 60 }
        );

        setTransactionIdFromCreation(
          results?.transaction_id?.length > 0 && results?.transaction_id
        );
        setIsTransactionSussessful(true);
      } catch (error) {
        setErroMsg(error.message != "" && error.message);
        setIsCampaignCreateationSussessful(false);
        console.log(error?.message);
      }
    }
  };

  const joinCampaign = async (
    contractAccount,
    campaignId,
    entryCost,
    route,
    joinedAccountsArr = [],
    totalUsersEntered
  ) => {
    if (anchorWalletSession) {
      try {
        const result = await anchorLink.transact(
          {
            actions: [
              {
                account: contractAccount,
                name: "transfer",
                authorization: [{ actor: userAccount, permission: "active" }],
                data: {
                  from: userAccount,
                  to: "fortunebirds",
                  quantity: entryCost,
                  memo: campaignId,
                },
              },
            ],
          },
          { blocksBehind: 4, expireSeconds: 620 }
        );
        const transactionIdFromSuccess = await result?.transaction_id;
        setIsTransactionSussessful(true);
        if (result.transaction.id) {
          joinedAccountsArr.push(userAccount);
          update(ref(firebaseDb, `/campaigns/${route}`), {
            joinedAccounts: joinedAccountsArr,
            totalEntriesStart: totalUsersEntered + 1,
          });
        }
      } catch (error) {
        const erroMsgFromCatch = await error.message;
        console.log(erroMsgFromCatch);
        setErroMsg(erroMsgFromCatch);
        setIsTransactionSussessful(false);
      }
    } else {
      try {
        const result = await wax?.api?.transact(
          {
            actions: [
              {
                account: contractAccount,
                name: "transfer",
                authorization: [{ actor: userAccount, permission: "active" }],
                data: {
                  from: userAccount,
                  to: "fortunebirds",
                  quantity: entryCost,
                  memo: campaignId,
                },
              },
            ],
          },
          { blocksBehind: 4, expireSeconds: 620 }
        );

        const transactionIdFromSuccess = await result?.transaction_id;
        setTransactionId(transactionIdFromSuccess);
        setIsTransactionSussessful(true);
        if (result?.transaction_id) {
          joinedAccountsArr.push(userAccount);
          update(ref(firebaseDb, `/campaigns/${route}`), {
            joinedAccounts: joinedAccountsArr,
            totalEntriesStart: totalUsersEntered + 1,
          });
        }
      } catch (error) {
        const erroMsgFromCatch = await error.message;
        console.log(erroMsgFromCatch);
        setErroMsg(erroMsgFromCatch);
        setIsTransactionSussessful(false);
      }
    }
  };

  return (
    <NftContext.Provider
      value={{
        setAnchorWalletSession,
        nftCardData,
        snapVal,
        waxUserLogIn,
        userAccount,
        setUserAccount,
        isAuthorizedUser,
        createCampaign,
        isTransactionSussessful,
        transactionId,
        erroMsg,
        setIsAuthorizedUser,
        joinCampaign,
        currentPageIndex,
        endedCampaigns,
        setCurrentPageIndex,
        setUserLoginProvider,
        setIsTransactionSussessful,
        setErroMsg,
        isCampaignCreateationSussessful,
        userAccountLogin,
        userLoginProvider,
        transactionIdFromCreation,
        anchorLink,
        addMoreData,
        setAddMoreData,
        setUserAccount,
        timeToShow,
      }}
    >
      {children}
    </NftContext.Provider>
  );
}
