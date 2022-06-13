import React from "react";
import { useContext } from "react";
import NftFilter from "../components/features/NftFilters/NftFilter";
import NftCard from "../components/features/NftSection/components/NftCard";
import AppLayout from "../components/layout/AppLayout";
import { NftContext } from "../context/NftContext";
import { onValue, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { StartFirebase } from "../context/firebase-config";
import { startFirebaseAdmin } from "../context/firebase-admin";
import axios from "axios";

const EndingSoon = () => {
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
      )}
    </>
  );
};

export default EndingSoon;
