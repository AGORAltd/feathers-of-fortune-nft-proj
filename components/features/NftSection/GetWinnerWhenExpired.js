import axios from "axios";
import { useEffect, useState } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { WAX_PINK_END_POINT } from "../../constants/constants";
import { imgSrc } from "../imgSrc";

export const GetWinnerWhenExpired = ({
  assetIdToFindWith = "",
  campaignIdToFindWith = "",
  openModal = true,
  timeCountDown,
  handleClose,
}) => {
  const [currentWinnerUser, setCurrentWinnerUser] = useState("");
  const [imgSrcFinal, setImgSrcFinal] = useState("");

  useEffect(() => {
    getWinnerUser();
  }, []);

  useEffect(() => {
    randomImageSelector(imgSrc);
  }, [imgSrcFinal]);

  const getWinnerUser = async () => {
    const response = await axios.post(
      `${WAX_PINK_END_POINT}/v1/chain/get_table_rows`,
      {
        json: true,
        code: "fortunebirds",
        scope: "fortunebirds",
        table: "results",
        limit: 1000,
      }
    );

    let campaignDataOnExpire = await response.data?.rows;

    const currentWinner = campaignDataOnExpire?.filter((item) => {
      return (
        item?.asset_id == assetIdToFindWith &&
        item?.campaign_id == campaignIdToFindWith
      );
    });

    setCurrentWinnerUser(() => currentWinner[0]?.winner);
  };

  const randomImageSelector = (items) => {
    const imgSrcFromArray = items[Math.floor(Math.random() * items.length)];
    setImgSrcFinal(imgSrcFromArray);
  };

  return (
    <>
      <SweetAlert
        custom
        onConfirm={() => {}}
        title=""
        show={openModal}
        style={{ backgroundColor: "#1d2228", color: "white" }}
        customButtons={
          <>
            <button
              onClick={handleClose}
              style={{ backgroundColor: "#5f5dbb" }}
              className=" px-6 py-3 mx-2 rounded-lg"
            >
              OK
            </button>
          </>
        }
      >
        <a href="#" target="_blank" rel="noopener">
          <img src={`${imgSrcFinal}`} />
        </a>

        {timeCountDown <= 0 ? (
          <>
            <p className="pt-5">
              Winner of the contest is
              <span className="font-bold text-2xl text-blue-400">
                <br /> {currentWinnerUser}
              </span>
            </p>
          </>
        ) : (
          <>
            <p className="pt-5">Revealing the winner in {timeCountDown}</p>
          </>
        )}
      </SweetAlert>
    </>
  );
};
