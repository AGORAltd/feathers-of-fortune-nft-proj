import { useContext } from "react";
import NftFilter from "../components/features/NftFilters/NftFilter";
import NftCard from "../components/features/NftSection/components/NftCard";
import AppLayout from "../components/layout/AppLayout";
import { NftContext } from "../context/NftContext";

const RevealWinner = () => {
  const { isLoadingData, endedCampaigns, addMoreData, setAddMoreData } =
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
                {endedCampaigns?.length > 0
                  ? endedCampaigns.map((item, index) => {
                      return (
                        <div key={index} className="grid-cols-4">
                          <NftCard
                            nftSrc={item.nftImgUrl}
                            campaignId={item.campaignId}
                            creator={item.creator}
                            loopTimeSeconds={item.loopTimeSeconds}
                            totalEntriesStart={item.totalEntriesStart}
                            totalEntriesEnd={item.totalEntriesEnd}
                            entryCost={item.entryCost}
                            contractAccount={item.contractAccount}
                            lastRoll={item.lastRoll}
                            isVideo={item.isVideo}
                            videoNftUrl={item.videoNftUrl}
                            assetId={item.assetId}
                            joinedAccounts={item.joinedAccounts}
                            route={item.route}
                          />
                        </div>
                      );
                    })
                  : ""}
              </div>
              {endedCampaigns?.length > 0 && (
                <div className="flex align-middle justify-center cursor-pointer mt-4">
                  <h1
                    className="w-24 bg-blue-500 text-center p-2"
                    onClick={() => {
                      setAddMoreData(addMoreData + 8);
                    }}
                  >
                    Load More
                  </h1>
                </div>
              )}
            </div>
          </AppLayout>
        </>
      )}
    </>
  );
};

export default RevealWinner;
