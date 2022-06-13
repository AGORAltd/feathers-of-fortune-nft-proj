import React from "react";
import Header from "./Header/Header";
import LandingPageBanner from "./LandingPageBanner/LandingPageBanner";

const AppLayout = ({ children, showLandingPageBanner = true }) => {
  return (
    <div>
      <Header />
      {showLandingPageBanner && <LandingPageBanner />}

      {children}
    </div>
  );
};

export default AppLayout;
