import { useContext, useState } from "react";
import { NftContext } from "../../context/NftContext";
import { RPC_ENDPOINT } from "../constants/constants";
import * as waxjs from "@waxio/waxjs/dist";

const wax = new waxjs.WaxJS({
  rpcEndpoint: RPC_ENDPOINT,
});

const useCreateCampaign = () => {
  const { userAccount, anchorWalletSession, anchorLink } =
    useContext(NftContext);
  const [transactionIdFromCreation, setTransactionIdFromCreation] = useState();
  const [erroMsg, setErroMsg] = useState("");

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
      } catch (error) {
        setErroMsg(error.message != "" && error.message);
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
      } catch (error) {
        setErroMsg(error.message != "" && error.message);
        console.log(error?.message);
      }
    }
  };

  return { createCampaign, transactionIdFromCreation, erroMsg };
};

export default useCreateCampaign;
