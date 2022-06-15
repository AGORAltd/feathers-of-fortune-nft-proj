import axios from "axios";
import { onValue, ref, set } from "firebase/database";
import { useContext } from "react";
import NftFilter from "../components/features/NftFilters/NftFilter";
import NftCard from "../components/features/NftSection/components/NftCard";
import AppLayout from "../components/layout/AppLayout";
import { startFirebaseAdmin } from "../context/firebase-admin";
import { NftContext } from "../context/NftContext";

const New = () => {
  const { isLoadingData, nftCardData, addMoreData, setAddMoreData } =
    useContext(NftContext);

  return (
    <>
      {isLoadingData ? (
        <div className="flex items-center justify-center h-screen w-screen">
          <img src="/media/logo" className="loader_img" />
        </div>
      ) : (
        <>
          <AppLayout>
            <div className="container my-20 mx-auto">
              <NftFilter />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {nftCardData?.length > 0
                  ? nftCardData
                      .map((item, index) => {
                        return (
                          <div key={index} className="grid-cols-4">
                            <NftCard {...item} />
                          </div>
                        );
                      })
                      .reverse()
                  : null}
              </div>
            </div>
          </AppLayout>
        </>
      )}
    </>
  );
};

export default New;

export async function getStaticProps() {
  const adminDb = startFirebaseAdmin();

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

  onValue(ref(adminDb), async (snapshot) => {
    try {
      responseFromPost.data?.rows.forEach((runningCampaigns, index) => {
        if (
          runningCampaigns?.asset_ids?.length > 0 &&
          snapshot
            .child("campaigns")
            .hasChild(runningCampaigns?.asset_ids[0] + index) == false
        ) {
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
                nftSrc: `https://ipfs.io/ipfs/${response?.data?.data?.data?.img}`,
                videoNftUrl: `https://ipfs.io/ipfs/${response?.data?.data?.template?.immutable_data?.video}`,
                isVideo:
                  `https://ipfs.io/ipfs/${response?.data?.data?.data?.img}` ==
                  true
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

              set(ref(adminDb, `/campaigns/${campaignObj.route}`), campaignObj);
            });
        }
      });
    } catch (error) {
      console.log(error);
    }
  });

  return {
    props: {},
    revalidate: 6,
  };
}
