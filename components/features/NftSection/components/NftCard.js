import Image from "next/image";
import React from "react";
import { useContext } from "react";
import { NftContext } from "../../../../context/NftContext";
import { useState } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { useEffect } from "react";

const NftCard = ({
  nftSrc,
  campaignId,
  creator,
  loopTimeSeconds,
  totalEntriesStart,
  totalEntriesEnd,
  entryCost,
  contractAccount,
  lastRoll,
  isVideo,
  videoNftUrl,
}) => {
  const { joinCampaign, isTransactionSussessful, erroMsg, transactionId } =
    useContext(NftContext);

  const [showAlert, setShowAlert] = useState(false);
  const [showTransactionMessage, setShowTransactionMessage] = useState();

  const [showErrorMessage, setShowErrorMessage] = useState();

  const [timeToShow, setTimeToShow] = useState("");

  useEffect(() => {
    if (erroMsg !== "") {
      setShowErrorMessage(true);
    }
  }, []);

  useEffect(() => {
    updateTimeToShow(finalUTCEpochTimeInMilliSec);
  }, []);

  const updateTimeToShow = (finalUTCEpochTimeInMilliSec) => {
    let interval = setInterval(() => {
      const nowUTCEpochTimeInMilliSec = new Date(Date.now()).getTime();
      let distance = finalUTCEpochTimeInMilliSec - nowUTCEpochTimeInMilliSec;

      if (distance < 0) distance = 0;
      let hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setTimeToShow(`${hours}:${minutes}:${seconds}`);

      if (distance <= 0) {
        clearInterval(interval);
        setTimeToShow("EXPIRED");
      }
    }, 1000);
  };
  const finalUTCEpochTimeInMilliSec =
    Date.parse(`${lastRoll}Z`) + loopTimeSeconds * 1000;

  return (
    <>
      <SweetAlert
        custom
        show={showAlert}
        style={{ backgroundColor: "#1d2228", color: "white" }}
        customButtons={
          <>
            <button
              onClick={() => {
                joinCampaign(contractAccount, campaignId, entryCost);
                setShowAlert(false);
              }}
              style={{ backgroundColor: "#5f5dbb" }}
              className=" px-6 py-3 mx-2 rounded-lg"
            >
              SEND
            </button>

            <button
              onClick={() => {
                setShowAlert(false);
              }}
              style={{ backgroundColor: "#6e7881" }}
              className=" px-6 py-3 mx-2 rounded-lg"
            >
              CANCEL
            </button>
          </>
        }
      >
        {!isVideo ? (
          <Image
            height={110}
            width={"100%"}
            loading="lazy"
            src={nftSrc}
            objectFit={"fill"}
            layout={"responsive"}
          />
        ) : (
          <video
            className="video_nft object-cover"
            loop
            muted
            autoPlay
            controls=""
          >
            <source src={videoNftUrl} type="video/mp4" />
            <source src={videoNftUrl} type="video/ogg" />
          </video>
        )}

        <p className="pt-5">
          To participate in this Campaign ID : {campaignId} you&apos;re about to
          send {entryCost}
        </p>
      </SweetAlert>

      {isTransactionSussessful && (
        <SweetAlert
          success
          show={showTransactionMessage}
          style={{ color: "white", backgroundColor: "#1d2228" }}
          title="Campaign Created!"
          customButtons={
            <>
              <button
                onClick={() => {
                  setShowTransactionMessage(false);
                }}
                style={{ backgroundColor: "#5f5dbb" }}
                className=" px-6 py-3"
              >
                OK
              </button>
            </>
          }
        >
          <p>Transaction Id : {transactionId} </p>
        </SweetAlert>
      )}

      {erroMsg && (
        <SweetAlert
          danger
          show={showErrorMessage}
          style={{ backgroundColor: "#1d2228", color: "white" }}
          title=""
          customButtons={
            <>
              <button
                onClick={() => {
                  setShowErrorMessage(false);
                }}
                style={{ backgroundColor: "#5f5dbb" }}
                className=" px-6 py-3"
              >
                OK
              </button>
            </>
          }
        >
          <p>{erroMsg}</p>
        </SweetAlert>
      )}
      <div className="rounded nft_card_container">
        {!isVideo ? (
          <Image
            height={110}
            width={"100%"}
            loading="lazy"
            src={nftSrc}
            objectFit={"fill"}
            layout={"responsive"}
          />
        ) : (
          <video
            className="video_nft object-cover"
            loop
            muted
            autoPlay
            controls=""
          >
            <source src={videoNftUrl} type="video/mp4" />
            <source src={videoNftUrl} type="video/ogg" />
          </video>
        )}

        <div className="nft_card_content_container text-center">
          <h2 className="nft_card_campaign_id">Campaign Id: {campaignId}</h2>
          <p className="text-white nft_card_autho_name">by {creator}</p>

          <div className="nft_card_content_time_container text-white mx-1">
            <p className="time_to_role_text">Time to Roll</p>
            <h1 className="nft_card_content_time">{timeToShow}</h1>
          </div>

          <p className="total_entries_container text-white font-normal">
            ✔ Total Entries: {totalEntriesStart}/{totalEntriesEnd}
          </p>

          <p className="entry_cost_container text-white font-normal">
            ✔ Entry Cost: {entryCost}
          </p>

          <button
            onClick={() => {
              setShowAlert(true);
            }}
            className="join_campaign_now_btn my-2.5"
          >
            JOIN NOW
          </button>
          <div className="entrants_container cursor-pointer">
            <p className="entrants_counter font-semibold py-2.5">Entrants</p>
            <p className="py-2 hidden entrants_indicator rounded text-white">
              No Entrants So Far
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default NftCard;
