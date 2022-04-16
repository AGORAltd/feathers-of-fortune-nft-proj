import React from "react";
import { useContext } from "react";
import NftFilter from "../components/features/NftFilters/NftFilter";
import NftCard from "../components/features/NftSection/components/NftCard";
import AppLayout from "../components/layout/AppLayout";
import { NftContext } from "../context/NftContext";

const EndingSoon = () => {
  const { nftCardData, isLoadingData, nftDataLoading } = useContext(NftContext);

  return (
    <>
      {isLoadingData ? (
        <div className="flex items-center justify-center h-screen w-screen">
          <img src="/media/logo" className="loader_img" />
        </div>
      ) : (
        <AppLayout>
          <div className="container my-20 mx-auto">
            <NftFilter />
            <div className="grid grid-col-1 md:grid-cols-4 gap-8">
              {nftDataLoading ? (
                <div className="flex items-center justify-center w-screen">
                  <div className="nft_data_loader" />
                </div>
              ) : nftCardData !== undefined ? (
                nftCardData
                  .map((item, index) => {
                    return (
                      <>
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
                          />
                        </div>
                      </>
                    );
                  })
                  .reverse()
              ) : (
                ""
              )}
            </div>
          </div>
        </AppLayout>
      )}
    </>
  );
};

export default EndingSoon;
