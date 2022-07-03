import { useEffect } from "react";
import NftFilter from "../components/features/NftFilters/NftFilter";
import NftCard from "../components/features/NftSection/NftCard";
import { addCampaignToDb } from "../components/firebase/addCampaign";
import useGetRunningCampaigns from "../components/firebase/useGetRunningCampaigns";
import AppLayout from "../components/layout/AppLayout";

const New = () => {
  const { nftCardData } = useGetRunningCampaigns();

  useEffect(() => {
    addCampaignToDb();
  }, []);

  return (
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
  );
};

export default New;
