import React, { useEffect, useState } from "react";
import {
  onValue,
  ref,
  set,
  query,
  orderByChild,
  remove,
} from "firebase/database";
import { StartFirebase } from "./firebase-config";

const useGetRunningCampaigns = () => {
  const firebaseDb = StartFirebase();
  const [snapVal, setSnapVal] = useState();
  const [nftCardData, setNftCardData] = useState([]);
  const nowUTCEpochTimeInMilliSec = new Date(Date.now()).getTime();
  const queryRef = query(ref(firebaseDb, "/campaigns"), orderByChild("time"));

  useEffect(() => {
    const singularCampaignArr = [];
    onValue(queryRef, (snapshot) => {
      setSnapVal(snapshot.val());
      if (snapshot.exists()) {
        snapshot.forEach((singularCampaign) => {
          const singularCampaignObj = singularCampaign.val();

          if (
            Date.parse(`${singularCampaignObj.lastRoll}Z`) +
              singularCampaignObj.loopTimeSeconds * 1000 -
              nowUTCEpochTimeInMilliSec >
              0 &&
            singularCampaignObj.totalEntriesStart !=
              singularCampaignObj.totalEntriesEnd
          ) {
            singularCampaignArr.push(singularCampaignObj);
          } else if (singularCampaignObj.totalEntriesStart > 0) {
            remove(ref(firebaseDb, `campaigns/${singularCampaignObj.route}`));
            set(
              ref(firebaseDb, `endedCampaigns/${singularCampaignObj?.route}`),
              { ...singularCampaignObj, time: new Date(Date.now()).getTime() }
            );
          }

          let interval = setInterval(() => {
            const distance =
              Date.parse(`${singularCampaignObj.lastRoll}Z`) +
              singularCampaignObj.loopTimeSeconds * 1000 -
              new Date(Date.now()).getTime();

            if (distance <= 0 && singularCampaignObj.totalEntriesStart <= 0) {
              remove(ref(firebaseDb, `campaigns/${singularCampaignObj.route}`));
              clearInterval(interval);
            } else if (
              distance <= 0 &&
              singularCampaignObj.totalEntriesStart > 0
            ) {
              remove(ref(firebaseDb, `campaigns/${singularCampaignObj.route}`));
              clearInterval(interval);
              set(
                ref(firebaseDb, `endedCampaigns/${singularCampaignObj?.route}`),
                {
                  ...singularCampaignObj,
                  time: new Date(Date.now()).getTime(),
                }
              );
            }
          }, 1000);
        });
      }
      setNftCardData(singularCampaignArr);
    });
  }, [JSON.stringify(snapVal)]);

  return { nftCardData };
};

export default useGetRunningCampaigns;
