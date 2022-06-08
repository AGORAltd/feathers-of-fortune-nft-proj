import { ref, set } from "firebase/database";
import Head from "next/head";
import { useContext } from "react";

import NftFilter from "../components/features/NftFilters/NftFilter";
import NftCard from "../components/features/NftSection/components/NftCard";
import AppLayout from "../components/layout/AppLayout";
import { NftContext } from "../context/NftContext";

export default function Home() {
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
                {nftCardData?.length > 0
                  ? nftCardData
                      .sort((a, b) => {
                        return b.totalEntriesStart - a.totalEntriesStart;
                      })
                      .map((item, index) => {
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
              {/* {nftCardData?.length > 0 && (
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
              )} */}
            </div>
          </AppLayout>
        </>
      )}
    </>
  );
}
