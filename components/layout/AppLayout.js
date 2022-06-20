import React from "react";
import Header from "./Header/Header";
import LandingPageBanner from "./LandingPageBanner/LandingPageBanner";

const AppLayout = ({ children, showLandingPageBanner = true }) => {
  return (
    <div>
      <Header />
      {showLandingPageBanner && <LandingPageBanner />}

      {children}

      <footer className="fixed bottom-0 w-full">
        <div className="inf-area-bottom">
          <div className="row justify-center">
            <div className="social">
              <a style={{ margin: "0px 2px" }} href="#" target="_blank">
                <img style={{ height: "30px" }} src="/media/img/twitter.svg" />
              </a>
              <a style={{ margin: "0px 2px" }} href="#" target="_blank">
                <img style={{ height: "30px" }} src="/media/img/discord.svg" />
              </a>
              <a style={{ margin: "0px 2px" }} href="#" target="_blank">
                <img
                  className="mx-auto"
                  style={{ width: "32px" }}
                  src="/media/img/atomic.png"
                />
              </a>
              <a style={{ margin: "0px 2px" }} href="#" target="_blank">
                <img style={{ height: "30px" }} src="/media/img/email.svg" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
