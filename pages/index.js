import axios from "axios";
import { onValue, ref, set } from "firebase/database";
import { useContext } from "react";
import NftFilter from "../components/features/NftFilters/NftFilter";
import NftCard from "../components/features/NftSection/components/NftCard";
import AppLayout from "../components/layout/AppLayout";
import { startFirebaseAdmin } from "../context/firebase-admin";
import { NftContext } from "../context/NftContext";

export default function Home() {
  const { isLoadingData, nftCardData, addMoreData, setAddMoreData } =
    useContext(NftContext);

  const nowUTCEpochTimeInMilliSec = new Date(Date.now()).getTime();

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
              <div className="grid grid-col-1 lg:grid-cols-4 gap-8">
                {nftCardData?.length > 0 &&
                  nftCardData
                    .sort((a, b) => {
                      return (
                        Date.parse(`${a.lastRoll}Z`) +
                        a.loopTimeSeconds * 1000 -
                        nowUTCEpochTimeInMilliSec -
                        (Date.parse(`${b.lastRoll}Z`) +
                          b.loopTimeSeconds * 1000 -
                          nowUTCEpochTimeInMilliSec)
                      );
                    })
                    .map((item, index) => {
                      return (
                        <div key={index} className="grid-cols-4 ">
                          <NftCard {...item} />
                        </div>
                      );
                    })}
              </div>
            </div>
          </AppLayout>
        </>
      )}
    </>
  );
}

export async function getStaticProps() {
  const adminDb = startFirebaseAdmin();

  // const addCampaign = async () => {
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
          nftSrc: `https://ipfs.io/ipfs/${response?.data?.data?.data?.img}`,
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

        onValue(ref(adminDb, `/campaigns/${campaignObj.route}`), (snapshot) => {
          if (snapshot.exists() == false) {
            set(ref(adminDb, `/campaigns/${campaignObj.route}`), campaignObj);
          } else {
            null;
          }
        });
      });
  });
  // };

  // addCampaign();
  return {
    props: {},
    revalidate: 10,
  };
}

// export async function getStaticProps() {
//   const adminDb = startFirebaseAdmin();

//   const responseFromPost = await axios.post(
//     `${WAX_PINK_END_POINT}/v1/chain/get_table_rows`,
//     {
//       json: true,
//       code: "fortunebirds",
//       scope: "fortunebirds",
//       table: "campaigns",
//       limit: 150,
//     }
//   );

//   onValue(ref(adminDb), async (snapshot) => {
//     try {
//       for (let i = 0; i < responseFromPost?.data?.rows?.length; i++) {
//         const runningCampaigns = responseFromPost.data?.rows[i];
//         if (
//           runningCampaigns?.asset_ids?.length > 0 &&
//           snapshot
//             .child("campaigns")
//             .hasChild(runningCampaigns?.asset_ids[0]) == false
//         ) {
//           const response = await axios.get(
//             `${ATOMIC_ASSETS_END_POINT}/atomicassets/v1/assets/${runningCampaigns?.asset_ids[0]}`
//           );

//           const runningCampaign = {
//             joinedAccounts: runningCampaigns?.accounts || [],
//             assetId: response.data?.data?.asset_id,
//             contractAccount: runningCampaigns?.contract_account,
//             nftImgUrl: `${IPFS_URL}/${response?.data?.data?.data?.img}`,
//             videoNftUrl: `${IPFS_URL}/${response?.data?.data?.template?.immutable_data?.video}`,
//             isVideo:
//               `${IPFS_URL}/${response?.data?.data?.data?.img}` == true
//                 ? false
//                 : `${IPFS_URL}/${response?.data?.data?.data?.video}` !=
//                   `${IPFS_URL}/undefined`
//                 ? true
//                 : false,
//             campaignId: runningCampaigns?.id,
//             creator: runningCampaigns?.authorized_account,
//             entryCost: runningCampaigns?.entrycost,
//             totalEntriesStart: runningCampaigns?.accounts?.length || 0,
//             totalEntriesEnd: runningCampaigns?.max_users,
//             loopTimeSeconds: runningCampaigns?.loop_time_seconds,
//             lastRoll: runningCampaigns?.last_roll,
//             totalEntriesEnd: runningCampaigns?.max_users,
//           };

//           set(ref(adminDb, `/campaigns/${runningCampaigns?.asset_ids[0]}`), {
//             runningCampaign,
//           });
//         }
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   });

//   return {
//     props: {},
//     revalidate: 10,
//   };
// }
