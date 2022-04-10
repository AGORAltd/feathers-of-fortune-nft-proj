import React from "react";
import { useContext } from "react";
import { NftContext } from "../../../context/NftContext";
import NftFilter from "../NftFilters/NftFilter";
import NftCard from "./components/NftCard";

const NftSection = () => {
  const { nftCardData } = useContext(NftContext);

  return (
    <div className="container my-20 mx-auto">
      <NftFilter />
      <div className="grid grid-cols-4 gap-8">
        {nftCardData != undefined &&
          nftCardData.map((item, index) => {
            return (
              <div key={index} className="grid-cols-4">
                <NftCard
                  nftSrc={item.nftImgUrl}
                  campaignId={item.campaignId}
                  creator={item.creator}
                  timeLeft={"20:34:38"}
                  totalEntriesStart={item.totalEntriesStart}
                  totalEntriesEnd={"3"}
                  entryCost={item.entryCost}
                  contractAccount={item.contractAccount}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default NftSection;
