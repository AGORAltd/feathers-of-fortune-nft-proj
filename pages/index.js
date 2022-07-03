import { useEffect } from "react";
import NftFilter from "../components/features/NftFilters/NftFilter";
import NftCard from "../components/features/NftSection/NftCard";
import { addCampaignToDb } from "../components/firebase/addCampaign";
import useGetRunningCampaigns from "../components/firebase/useGetRunningCampaigns";
import AppLayout from "../components/layout/AppLayout";

export default function Home() {
  useEffect(() => {
    addCampaignToDb();
  }, []);

  const { nftCardData } = useGetRunningCampaigns();
  const nowUTCEpochTimeInMilliSec = new Date(Date.now()).getTime();

  return (
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
  );
}
