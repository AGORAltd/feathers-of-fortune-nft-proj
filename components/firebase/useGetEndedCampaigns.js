import { onValue, orderByChild, query, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { StartFirebase } from "./firebase-config";

const useGetEndedCampaigns = () => {
  const [endedCampaigns, setEndedCampaigns] = useState();
  const firebaseDb = StartFirebase();
  const endedQueryRef = query(
    ref(firebaseDb, "/endedCampaigns"),
    orderByChild("time")
  );

  useEffect(() => {
    const endedCampaignArr = [];

    onValue(
      endedQueryRef,
      (snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach((singularCampaignObj) => {
            endedCampaignArr.push(singularCampaignObj.val());
          });
        }
        setEndedCampaigns(endedCampaignArr);
      },
      { onlyOnce: true }
    );
  }, []);

  return { endedCampaigns };
};

export default useGetEndedCampaigns;
