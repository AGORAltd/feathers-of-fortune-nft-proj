import Head from "next/head";
import React from "react";
import { useContext } from "react";
import NftFilter from "../components/features/NftFilters/NftFilter";
import NftCardEnded from "../components/features/NftSection/components/NftCardEnded";
import AppLayout from "../components/layout/AppLayout";
import { NftContext } from "../context/NftContext";

const Ended = () => {
  const { nftCardData, isLoadingData, nftDataLoading } = useContext(NftContext);
  return (
    <>
      {isLoadingData ? (
        <div className="flex items-center justify-center h-screen w-screen">
          <img src="/media/logo" className="loader_img" />
        </div>
      ) : (
        <>
          <Head>
            <title>Feathers Of Fortune</title>
            <link rel="icon" href="/favicon.ico" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
              rel="preconnect"
              href="https://fonts.gstatic.com"
              crossOrigin="true"
            />
            <link
              href="https://fonts.googleapis.com/css2?family=Chakra+Petch:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap"
              rel="stylesheet"
            />
          </Head>
          <AppLayout>
            <div className="container my-20 mx-auto">
              <NftFilter />

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {nftDataLoading ? (
                  <div className="flex items-center justify-center w-screen">
                    <div className="nft_data_loader" />
                  </div>
                ) : nftCardData !== undefined ? (
                  nftCardData.map((item, index) => {
                    return (
                      <>
                        <div key={index} className="grid-cols-4">
                          <NftCardEnded
                            key={index}
                            nftSrc={item.nftImgUrl}
                            winner={item.winner}
                            campaignId={item.campaignId}
                            assetId={item.assetId}
                          />
                        </div>
                      </>
                    );
                  })
                ) : (
                  ""
                )}
              </div>
            </div>
          </AppLayout>
        </>
      )}
    </>
  );
};

export default Ended;
