import React, { useEffect, useState } from "react";

const useUpdateTimeToShow = (finalUTCEpochTimeInMilliSec) => {
  const updateTimeToShow = (finalUTCEpochTimeInMilliSec) => {
    let distance = finalUTCEpochTimeInMilliSec - +new Date(Date.now());

    let timeLeft;

    if (distance > 0) {
      let hours = Math.floor((distance / 1000 / 60 / 60) % 24);
      let minutes = Math.floor((distance / 1000 / 60) % 60);
      let seconds = Math.floor((distance / 1000) % 60);

      timeLeft = `${hours}:${minutes < 10 ? "0" + minutes : minutes}:${
        seconds < 10 ? "0" + seconds : seconds
      }`;
    }

    return timeLeft;
  };

  const [timeToShow, setTimeToShow] = useState(
    updateTimeToShow(finalUTCEpochTimeInMilliSec)
  );

  useEffect(() => {
    if (window.location.pathname != "/reveal-winner") {
      const timer = setTimeout(() => {
        setTimeToShow(updateTimeToShow(finalUTCEpochTimeInMilliSec));
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setTimeToShow("Reveal Winner");
    }
  }, [timeToShow]);

  return { timeToShow };
};

export default useUpdateTimeToShow;
