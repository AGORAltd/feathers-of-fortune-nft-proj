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
} from "firebase/database";

const wax = new waxjs.WaxJS({
  rpcEndpoint: RPC_ENDPOINT,
  tryAutoLogin: false,
});

export function NftContextProvider({ children }) {
  const firebaseDb = StartFirebase();
  const [nftCardData, setNftCardData] = useState([]);
  const [endedCampaigns, setEndedCampaigns] = useState();
  const queryRef = query(
    ref(firebaseDb, "/campaigns"),
    orderByChild("campaignId")
  );

  const { asPath } = useRouter();

  const [snapVal, setSnapVal] = useState();

  useEffect(() => {
    const singularCampaignArr = [];
    const endedCampaignArr = [];

    onValue(queryRef, (snapshot) => {
      if (snapshot.exists()) {
        setSnapVal(snapshot.val());

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
            endedCampaignArr.push(singularCampaignObj);
          }
        });
      }
      setEndedCampaigns(endedCampaignArr);
      setNftCardData(singularCampaignArr);
    });
  }, [JSON.stringify(snapVal), asPath]);

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
  const nowUTCEpochTimeInMilliSec = new Date(Date.now()).getTime();

  const anchorLink = new AnchorLink({
    transport: anchorTransport,
    verifyProofs: true,
    chains: [{ chainId: chainId, nodeUrl: `https://${nodeUrl}` }],
  });

  const addCampaign = async () => {
    const dataToPost = {
      json: true,
      code: "fortunebirds",
      scope: "fortunebirds",
      table: "campaigns",
      limit: "1000",
    };

    const responseFromPost = await axios.post(
      `https://wax.pink.gg/v1/chain/get_table_rows`,
      dataToPost
    );

    responseFromPost.data?.rows.forEach((runningCampaigns, index) => {
      axios
        .get(
          `https://wax.api.atomicassets.io/atomicassets/v1/assets/${runningCampaigns?.asset_ids[0]}`
        )
        .then((response) => {
          const result = response.data?.data;
          const campaignObj = {
            route: result?.asset_id + index,
            joinedAccounts: runningCampaigns?.accounts || [],
            assetId: result?.asset_id,
            contractAccount: runningCampaigns?.contract_account,
            nftImgUrl: `https://ipfs.io/ipfs/${response?.data?.data?.data?.img}`,
            videoNftUrl: `https://ipfs.io/ipfs/${response?.data?.data?.template?.immutable_data?.video}`,
            isVideo:
              `https://ipfs.io/ipfs/${response?.data?.data?.data?.img}` == true
                ? false
                : `https://ipfs.io/ipfs/${response?.data?.data?.data?.video}` !=
                  `https://ipfs.io/ipfs/undefined`
                ? true
                : false,
            campaignId: runningCampaigns?.id,
            creator: runningCampaigns?.authorized_account,
            entryCost: runningCampaigns?.entrycost,
            totalEntriesStart: runningCampaigns?.accounts?.length || 0,
            totalEntriesEnd: runningCampaigns?.max_users,
            loopTimeSeconds: runningCampaigns?.loop_time_seconds,
            lastRoll: runningCampaigns?.last_roll,
            totalEntriesEnd: runningCampaigns?.max_users,
          };

          onValue(
            ref(firebaseDb, `/campaigns/${campaignObj.route}`),
            (snapshot) => {
              if (snapshot.exists() == false) {
                set(
                  ref(firebaseDb, `/campaigns/${campaignObj.route}`),
                  campaignObj
                );
              } else {
                null;
              }
            },
            { onlyOnce: true }
          );
        });
    });
  };

  if (typeof window != "undefined") {
    window.onload = async () => {
      let isAutoLoginAvailable = await wax.isAutoLoginAvailable();
      let sessionList = await anchorLink.listSessions(dapp);
      let wallet_session;
      if (sessionList && sessionList.length > 0) {
        wallet_session = await anchorLink.restoreSession(dapp);
        setUserAccount(String(wallet_session?.auth)?.split("@")[0]);
        getAuthUsers();
        setAnchorWalletSession(wallet_session);
        setUserLoginProvider("anchor");
      } else if (
        isAutoLoginAvailable &&
        localStorage.getItem("userLoggedIn") != "false"
      ) {
        setUserAccount(wax.userAccount);
        getAuthUsers();
        setUserLoginProvider("wax");
        localStorage.setItem("userLoggedIn", true);
      }

      addCampaign();
    };
  }

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
      getAuthUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const waxUserLogIn = async () => {
    try {
      let userAccountFromLogin = await wax.login();
      setUserAccount(userAccountFromLogin);
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
      }}
    >
      {children}
    </NftContext.Provider>
  );
}
