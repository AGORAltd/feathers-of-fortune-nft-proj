import axios from "axios";
import { onValue, ref, set } from "firebase/database";
import Head from "next/head";
import { useContext } from "react";
import { useEffect, useState, useCallback } from "react";

import NftFilter from "../components/features/NftFilters/NftFilter";
import NftCard from "../components/features/NftSection/components/NftCard";
import AppLayout from "../components/layout/AppLayout";
import { StartFirebase } from "../context/firebase-config";
import { NftContext } from "../context/NftContext";

export default function Home() {
  const { isLoadingData } = useContext(NftContext);
  const firebaseDb = StartFirebase();
  const nowUTCEpochTimeInMilliSec = new Date(Date.now()).getTime();

  const [nftCardData, setNftCardData] = useState();
  const [nftCardDataEnded, setNftCardDataEnded] = useState();

  useEffect(() => {
    const singularCampaignArr = [];
    const endedCampaignArr = [];
    onValue(ref(firebaseDb), (snapshot) => {
      if (snapshot.exists()) {
        snapshot.child("campaigns").forEach((singularCampaign) => {
          const singularCampaignObj = singularCampaign
            .child("runningCampaign")
            .val();
          if (
            Date.parse(`${singularCampaignObj.lastRoll}Z`) +
              singularCampaignObj.loopTimeSeconds * 1000 -
              nowUTCEpochTimeInMilliSec >
              0 &&
            singularCampaignObj.totalEntriesStart !=
              singularCampaignObj.totalEntriesEnd
          ) {
            singularCampaignArr.push(singularCampaignObj);
          } else {
            endedCampaignArr.push(singularCampaignObj);
          }
        });
      }
    });

    singularCampaignArr.sort((a, b) => {
      return b.totalEntriesStart - a.totalEntriesStart;
    });

    setNftCardData(singularCampaignArr);
    setNftCardDataEnded(endedCampaignArr);
  }, [nftCardData]);

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
                  ? nftCardData.map((item, index) => {
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
                          />
                        </div>
                      );
                    })
                  : ""}

                {nftCardDataEnded?.length > 0
                  ? nftCardDataEnded.map((item, index) => {
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
                          />
                        </div>
                      );
                    })
                  : ""}
              </div>
            </div>
          </AppLayout>
        </>
      )}
    </>
  );
}
