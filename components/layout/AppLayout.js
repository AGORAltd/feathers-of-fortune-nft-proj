import React from "react";
import Header from "./Header/Header";
import LandingPageBanner from "./LandingPageBanner/LandingPageBanner";
  
const AppLayout = ({ children }) => {
  return (
    <div>
      <Header />
      <LandingPageBanner />
      {children}
    </div>
  );
};

export default AppLayout;
