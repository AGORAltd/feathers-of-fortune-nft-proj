import axios from "axios";
import { onValue, ref, set } from "firebase/database";
import { useContext } from "react";
import NftFilter from "../components/features/NftFilters/NftFilter";
import NftCard from "../components/features/NftSection/components/NftCard";
import AppLayout from "../components/layout/AppLayout";
import { startFirebaseAdmin } from "../context/firebase-admin";
import { StartFirebase } from "../context/firebase-config";
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
                  ? endedCampaigns
                      .map((item, index) => {
                        return (
                          <div key={index} className="grid-cols-4">
                            <NftCard {...item} />
                          </div>
                        );
                      })
                      .reverse()
                  : ""}
              </div>
            </div>
          </AppLayout>
        </>
      )}
    </>
  );
};

export default RevealWinner;
