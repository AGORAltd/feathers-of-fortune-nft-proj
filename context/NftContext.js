import axios from "axios";
import { useState, createContext, useEffect } from "react";
import {
  ATOMIC_ASSETS_END_POINT,
  IPFS_URL,
  RPC_ENDPOINT,
  WAX_PINK_END_POINT,
} from "../components/constants/constants";
import { useRouter } from "next/router";
import * as waxjs from "@waxio/waxjs/dist";

import AnchorLink from "anchor-link";
import AnchorLinkBrowserTransport from "anchor-link-browser-transport";

export const NftContext = createContext();

const wax = new waxjs.WaxJS({
  rpcEndpoint: RPC_ENDPOINT,
  tryAutoLogin: false,
});

export const NftContextProvider = ({ children }) => {
  const { pathname } = useRouter();
  const [userAccount, setUserAccount] = useState();
  const [campaignData, setCampaignData] = useState(null);
  const [nftCardData, setNftCardData] = useState();
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [showPagination, setShowPagination] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(8);
  const [authUserData, setAuthUserData] = useState();
  const [isAuthorizedUser, setIsAuthorizedUser] = useState(false);
  const [isCampaignCreateationSussessful, setIsCampaignCreateationSussessful] =
    useState();
  const [transactionId, setTransactionId] = useState("");
  const [transactionIdFromCreation, setTransactionIdFromCreation] = useState();
  const [erroMsg, setErroMsg] = useState("");
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [userLoginProvider, setUserLoginProvider] = useState();
  const [wonUserOnCampaignExpire, setWonUserOnCampaignExpire] = useState("");
  const [isTransactionSussessful, setIsTransactionSussessful] = useState();

  const [nftDataLoading, setNftDataLoading] = useState(false);

  let pageSize = 8;

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
    checkIfAutoLoginAvailable();
  }, []);

  const checkIfAutoLoginAvailable = async () => {
    let isAutoLoginAvailable = await wax.isAutoLoginAvailable();
    let sessionList = await anchorLink.listSessions(dapp);
    let wallet_session;
    if (sessionList && sessionList.length > 0) {
      wallet_session = await anchorLink.restoreSession(dapp);
      setUserAccount(String(wallet_session?.auth)?.split("@")[0]);
      getAuthUsers();
      setUserLoginProvider("anchor");
    } else if (isAutoLoginAvailable) {
      setUserAccount(wax.userAccount);
      getAuthUsers();
      setUserLoginProvider("wax");
    }
  };

  useEffect(() => {
    checkIfAuthorizeduser();
  }, [authUserData]);

  useEffect(() => {
    switchApiCallAccordingToActiveUserRoute();
  }, [pathname, transactionId]);

  useEffect(() => {
    pushNftCardDataToArray(startIndex, endIndex);
    campaignData?.length <= pageSize || campaignData == null
      ? setShowPagination(false)
      : setShowPagination(true);
  }, [campaignData, startIndex, endIndex, transactionId]);

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
      } else {
        wallet_session = (await anchorLink.login(dapp)).session;
      }
      setUserAccount(String(wallet_session.auth).split("@")[0]);
      getAuthUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const waxUserLogIn = async () => {
    try {
      const userAccountFromLogin = await wax.login();
      setUserAccount(userAccountFromLogin);
      getAuthUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const switchApiCallAccordingToActiveUserRoute = async () => {
    setIsLoadingData(true);
    const runningCampaignsData = [];

    if (pathname == "/" || pathname == "/new") {
      await axios
        .post(`${WAX_PINK_END_POINT}/v1/chain/get_table_rows`, {
          json: true,
          code: "fortunebirds",
          scope: "fortunebirds",
          table: "campaigns",
          limit: 150,
        })
        .then((response) => {
          for (let i = 0; i < response.data.rows?.length; i++) {
            const runningCampaigns = response.data?.rows[i];

            if (runningCampaigns?.asset_ids?.length > 0) {
              runningCampaignsData.push(runningCampaigns);
              setCampaignData(runningCampaignsData);
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
      setIsLoadingData(false);
    } else if (pathname == "/ending-soon") {
      await axios
        .post(`${WAX_PINK_END_POINT}/v1/chain/get_table_rows`, {
          json: true,
          code: "fortunebirds",
          scope: "fortunebirds",
          table: "campaigns",
          limit: 150,
        })
        .then((response) => {
          for (let i = 0; i < response.data.rows?.length; i++) {
            const runningCampaigns = response.data?.rows[i];

            if (runningCampaigns?.asset_ids?.length > 0) {
              runningCampaignsData.push(runningCampaigns);
            }
          }
          const newSortedArray = runningCampaignsData.sort((a, b) => {
            return (
              Date.parse(`${a?.last_roll}Z`) - Date.parse(`${b?.last_roll}Z`)
            );
          });
          setCampaignData(newSortedArray);
        })
        .catch((error) => {
          console.log(error);
        });
      setIsLoadingData(false);
    } else {
      await axios
        .post(`${WAX_PINK_END_POINT}/v1/chain/get_table_rows`, {
          json: true,
          code: "fortunebirds",
          scope: "fortunebirds",
          table: "results",
          limit: 1000,
        })
        .then((response) => {
          setCampaignData(response.data.rows);
        })
        .catch((error) => {
          console.log(error);
        });
      setIsLoadingData(false);
    }
  };

  const pushNftCardDataToArray = async (
    startIndex = startIndex,
    endIndex = endIndex
  ) => {
    const nftCardDataFromApi = [];
    setNftDataLoading(true);
    if (campaignData) {
      if (pathname == "/" || pathname == "/new" || pathname == "/ending-soon") {
        for (let i = startIndex; i < endIndex; i++) {
          await axios
            .get(
              `${ATOMIC_ASSETS_END_POINT}/atomicassets/v1/assets/${campaignData[i]?.asset_ids[0]}`
            )
            .then((response) => {
              nftCardDataFromApi.push({
                joinedAccounts: campaignData[i]?.accounts,
                assetId: response.data?.data?.asset_id,
                contractAccount: campaignData[i]?.contract_account,
                nftImgUrl: `${IPFS_URL}/${response?.data?.data?.data?.img}`,
                videoNftUrl: `${IPFS_URL}/${response?.data?.data?.data?.video}`,
                isVideo:
                  `${IPFS_URL}/${response?.data?.data?.data?.img}` == true
                    ? false
                    : `${IPFS_URL}/${response?.data?.data?.data?.video}` !=
                      `${IPFS_URL}/undefined`
                    ? true
                    : false,
                campaignId: campaignData[i]?.id,
                creator: campaignData[i]?.authorized_account,
                entryCost: campaignData[i]?.entrycost,
                totalEntriesStart: campaignData[i]?.accounts.length,
                totalEntriesEnd: campaignData[i]?.max_users,
                loopTimeSeconds: campaignData[i]?.loop_time_seconds,
                lastRoll: campaignData[i]?.last_roll,
                totalEntriesEnd: campaignData[i]?.max_users,
              });
            })
            .catch((error) => {
              console.error(error);
            });
        }
        setNftCardData(nftCardDataFromApi);
      } else if (pathname == "/ended") {
        for (let i = startIndex; i < endIndex; i++) {
          await axios
            .get(
              `${ATOMIC_ASSETS_END_POINT}/atomicassets/v1/assets/${campaignData[i]?.asset_id}`
            )
            .then((response) => {
              nftCardDataFromApi.push({
                assetId: response.data?.data?.asset_id,
                nftImgUrl: `${IPFS_URL}/${response?.data?.data?.data?.img}`,
                campaignId: campaignData[i]?.campaign_id,
                winner: campaignData[i]?.winner,
              });
            })
            .catch((error) => {
              console.error(error);
            });
        }
        setNftCardData(nftCardDataFromApi);
      }
    }

    setNftDataLoading(false);
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
        { blocksBehind: 3, expireSeconds: 30 }
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
  };

  const joinCampaign = async (contractAccount, campaignId, entryCost) => {
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
        { blocksBehind: 4, expireSeconds: 120 }
      );

      const transactionIdFromSuccess = await result?.transaction_id;
      setTransactionId(transactionIdFromSuccess);
      setIsTransactionSussessful(true);
    } catch (error) {
      const erroMsgFromCatch = await error.message;
      console.log(erroMsgFromCatch);
      setErroMsg(erroMsgFromCatch);
      setIsTransactionSussessful(false);
    }
  };

  return (
    <NftContext.Provider
      value={{
        wonUserOnCampaignExpire,
        nftCardData,
        isLoadingData,
        showPagination,
        startIndex,
        setStartIndex,
        endIndex,
        setEndIndex,
        campaignData,
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
        setNftCardData,
        currentPageIndex,
        setCurrentPageIndex,
        setUserLoginProvider,
        setIsTransactionSussessful,
        setErroMsg,
        isCampaignCreateationSussessful,
        userAccountLogin,
        userLoginProvider,
        transactionIdFromCreation,
        anchorLink,
        nftDataLoading,
      }}
    >
      {children}
    </NftContext.Provider>
  );
};
