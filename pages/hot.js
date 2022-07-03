import { useEffect } from "react";
import NftFilter from "../components/features/NftFilters/NftFilter";
import NftCard from "../components/features/NftSection/NftCard";
import { addCampaignToDb } from "../components/firebase/addCampaign";
import useGetRunningCampaigns from "../components/firebase/useGetRunningCampaigns";
import AppLayout from "../components/layout/AppLayout";

import { NftContext } from "../context/NftContext";

const EndingSoon = () => {
  useEffect(() => {
    addCampaignToDb();
  }, []);

  const { nftCardData } = useGetRunningCampaigns();

  return (
    <>
      <AppLayout>
        <div className="container my-20 mx-auto">
          <NftFilter />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {nftCardData?.length > 0
              ? nftCardData
                  .sort((a, b) => {
                    return b.totalEntriesStart - a.totalEntriesStart;
                  })
                  .map((item, index) => {
                    return (
                      <div key={index} className="grid-cols-4">
                        <NftCard {...item} />
                      </div>
                    );
                  })
              : ""}
          </div>
        </div>
      </AppLayout>
    </>
  );
};

export default EndingSoon;
