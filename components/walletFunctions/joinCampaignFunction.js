import { useContext, useState } from "react";
import { NftContext } from "../../context/NftContext";
import * as waxjs from "@waxio/waxjs/dist";
import { RPC_ENDPOINT } from "../constants/constants";
import { StartFirebase } from "../firebase/firebase-config";
import { ref, update } from "firebase/database";

const wax = new waxjs.WaxJS({
  rpcEndpoint: RPC_ENDPOINT,
});

const useJoinCampaign = () => {
  const { userAccount, anchorWalletSession, anchorLink } =
    useContext(NftContext);
  const firebaseDb = StartFirebase();
  const [joinErrorMessage, setJoinErrorMessage] = useState();
  const [isTransactionSussessful, setIsTransactionSussessful] = useState();
  const [transactionId, setTransactionId] = useState("");

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
        const transactionIdFromSuccess = await result?.resolved;

        setIsTransactionSussessful(true);

        if (transactionIdFromSuccess) {
          joinedAccountsArr.push(userAccount);
          update(ref(firebaseDb, `/campaigns/${route}`), {
            joinedAccounts: joinedAccountsArr,
            totalEntriesStart: totalUsersEntered + 1,
          });
        }
      } catch (error) {
        const erroMsgFromCatch = await error.message;
        console.log(erroMsgFromCatch);
        setJoinErrorMessage(erroMsgFromCatch);
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
        if (transactionIdFromSuccess) {
          joinedAccountsArr.push(userAccount);
          update(ref(firebaseDb, `/campaigns/${route}`), {
            joinedAccounts: joinedAccountsArr,
            totalEntriesStart: totalUsersEntered + 1,
          });
        }
      } catch (error) {
        const erroMsgFromCatch = await error.message;
        console.log(erroMsgFromCatch);
        setJoinErrorMessage(erroMsgFromCatch);
        setIsTransactionSussessful(false);
      }
    }
  };

  return {
    joinCampaign,
    joinErrorMessage,
    isTransactionSussessful,
    setIsTransactionSussessful,
    transactionId,
  };
};

export default useJoinCampaign;
