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
          <div className="container">
            <div className="row justify-center">
              <div className="copyright">
                <p>
                  Copyright © 2022. All rights reserved. Design by,
                  <a className="hakkav_autor"> Hakkav</a>
                </p>
                <ul className="social justify-center">
                  <li>
                    <a style={{ margin: "0px 2px" }} href="#" target="_blank">
                      <img
                        style={{ height: "30px" }}
                        src="/media/img/twitter.svg"
                      />
                    </a>
                  </li>
                  <li>
                    <a style={{ margin: "0px 2px" }} href="#" target="_blank">
                      <img
                        style={{ height: "30px" }}
                        src="/media/img/discord.svg"
                      />
                    </a>
                  </li>
                  <li>
                    <a style={{ margin: "0px 2px" }} href="#" target="_blank">
                      <img
                        className="mx-auto"
                        style={{ width: "32px" }}
                        src="/media/img/atomic.png"
                      />
                    </a>
                  </li>
                  <li>
                    <a style={{ margin: "0px 2px" }} href="#" target="_blank">
                      <img
                        style={{ height: "30px" }}
                        src="/media/img/email.svg"
                      />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <a
        id="mt_boxsocial"
        className="hidden sm:flex text-white"
        target="_blank"
        href="#"
      >
        <img className="mt-social" src="/media/img/twitter_icon.svg" />
        <span>Twitter </span>
      </a>
    </div>
  );
};

export default AppLayout;
