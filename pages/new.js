import React from "react";
import { useContext } from "react";
import NftSection from "../components/features/NftSection/NftSection";
import AppLayout from "../components/layout/AppLayout";
import { NftContext } from "../context/NftContext";

const New = () => {
  const { isLoadingData } = useContext(NftContext);

  return (
    <>
      {isLoadingData ? (
        <div className="flex items-center justify-center h-screen w-screen">
          <img src="/media/logo" className="loader_img" />
        </div>
      ) : (
        <>
          <AppLayout>
            <NftSection />
          </AppLayout>
        </>
      )}
    </>
  );
};

export default New;
