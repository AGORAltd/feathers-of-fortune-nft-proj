import axios from "axios";
import { child, get, ref, set } from "firebase/database";
import { StartFirebase } from "./firebase-config";

export async function addCampaignToDb() {
  const firebaseDb = StartFirebase();

  const dataToPost = {
    json: true,
    code: "fortunebirds",
    scope: "fortunebirds",
    table: "campaigns",
    limit: 10000,
  };

  const responseFromPost = await axios.post(
    `https://wax.pink.gg/v1/chain/get_table_rows`,
    dataToPost
  );

  get(child(ref(firebaseDb), "/campaigns")).then((snapshot) => {
    try {
      responseFromPost.data?.rows.forEach((runningCampaigns) => {
        if (
          runningCampaigns?.asset_ids?.length > 0 &&
          snapshot.hasChild(
            `${runningCampaigns?.asset_ids[0]}${runningCampaigns?.id}`
          ) != true
        ) {
          axios
            .get(
              `https://wax.api.atomicassets.io/atomicassets/v1/assets/${runningCampaigns?.asset_ids[0]}`
            )
            .then((response) => {
              const result = response.data?.data;

              const campaignObj = {
                route: result?.asset_id + runningCampaigns?.id,
                joinedAccounts: runningCampaigns?.accounts || [],
                assetId: result?.asset_id,
                contractAccount: runningCampaigns?.contract_account,
                nftSrc: `https://ipfs.io/ipfs/${response?.data?.data?.data?.img}`,
                videoNftUrl: `https://ipfs.io/ipfs/${response?.data?.data?.template?.immutable_data?.video}`,
                isVideo:
                  response?.data?.data?.data?.video != undefined ? true : false,
                campaignId: runningCampaigns?.id,
                creator: runningCampaigns?.authorized_account,
                entryCost: runningCampaigns?.entrycost,
                totalEntriesStart: runningCampaigns?.accounts?.length || 0,
                totalEntriesEnd: runningCampaigns?.max_users,
                loopTimeSeconds: runningCampaigns?.loop_time_seconds,
                lastRoll: runningCampaigns?.last_roll,
                totalEntriesEnd: runningCampaigns?.max_users,
                finalUTCEpochTimeInMilliSec:
                  Date.parse(`${runningCampaigns?.last_roll}Z`) +
                  runningCampaigns?.loop_time_seconds * 1000,
                time: new Date(Date.now()).getTime(),
              };

              set(
                ref(firebaseDb, `/campaigns/${campaignObj.route}`),
                campaignObj
              );
            });
        }
      });
    } catch (error) {
      console.log(error);
    }
  });
}
