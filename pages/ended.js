import React from "react";
import { useContext } from "react";
import NftFilter from "../components/features/NftFilters/NftFilter";
import NftCardEnded from "../components/features/NftSection/components/NftCardEnded";
import AppLayout from "../components/layout/AppLayout";
import { NftContext } from "../context/NftContext";

const Ended = () => {
  const { nftCardData, isLoadingData } = useContext(NftContext);
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

            <div className="grid grid-cols-4 gap-8">
              {nftCardData != undefined &&
                nftCardData?.map((item, index) => {
                  return (
                    <NftCardEnded
                      key={index}
                      nftSrc={item.nftImgUrl}
                      winner={item.winner}
                      campaignId={item.campaignId}
                    />
                  );
                })}
            </div>
          </div>
        </AppLayout>
      )}
    </>
  );
};

export default Ended;
