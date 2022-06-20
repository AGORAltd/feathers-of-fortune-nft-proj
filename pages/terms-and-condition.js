import React from "react";
import AppLayout from "../components/layout/AppLayout";

const TermsAndCondition = () => {
  return (
    <div>
      <AppLayout showLandingPageBanner={false}>
        <div
          className="container mx-3 sm:mx-auto"
          style={{ maxWidth: "1024px" }}
        >
          <h1
            style={{ color: "#828f99", fontSize: "34px" }}
            className="text-center mt-4"
          >
            Terms And Condition
          </h1>
          <div>
            <p style={{ color: "#686868" }} className="pt-7">
              What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the
              printing and typesetting industry. Lorem Ipsum has been the
              industry's standard dummy text ever since the 1500s, when an
              unknown printer took a galley of type and scrambled it to make a
              type specimen book. now use Lorem Ipsum as their default model
              text, and a search for 'lorem ipsum' will uncover many web sites
              still in
            </p>
            <div className="my-12">
              <h5 style={{ fontSize: "22px", color: "#828f99" }}>1. Title 1</h5>
              <p style={{ color: "#686868" }} className="pt-7 ">
                What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the
                printing and typesetting industry. Lorem Ipsum has been the
                industry's standard dummy text ever since the 1500s, when an
                unknown printer took a galley of type and scrambled it to make a
                type specimen book. now use Lorem Ipsum as their default model
                text, and a search for 'lorem ipsum' will uncover many web sites
                still in
              </p>
            </div>
            <div className="my-12">
              <h5 style={{ fontSize: "22px", color: "#828f99" }}>2. Title 2</h5>
              <p style={{ color: "#686868" }} className="pt-7 ">
                What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the
                printing and typesetting industry. Lorem Ipsum has been the
                industry's standard dummy text ever since the 1500s, when an
                unknown printer took a galley of type and scrambled it to make a
                type specimen book. now use Lorem Ipsum as their default model
                text, and a search for 'lorem ipsum' will uncover many web sites
                still in
              </p>
            </div>

            <div className="my-12">
              <h5 style={{ fontSize: "22px", color: "#828f99" }}>3. Title 3</h5>
              <p style={{ color: "#686868" }} className="pt-7 ">
                What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the
                printing and typesetting industry. Lorem Ipsum has been the
                industry's standard dummy text ever since the 1500s, when an
                unknown printer took a galley of type and scrambled it to make a
                type specimen book. now use Lorem Ipsum as their default model
                text, and a search for 'lorem ipsum' will uncover many web sites
                still in
              </p>
            </div>

            <div className="mt-12 mb-20">
              <h5 style={{ fontSize: "22px", color: "#828f99" }}>4. Title 4</h5>
              <p style={{ color: "#686868" }} className="pt-7 ">
                What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the
                printing and typesetting industry. Lorem Ipsum has been the
                industry's standard dummy text ever since the 1500s, when an
                unknown printer took a galley of type and scrambled it to make a
                type specimen book. now use Lorem Ipsum as their default model
                text, and a search for 'lorem ipsum' will uncover many web sites
                still in
              </p>
            </div>
          </div>
        </div>
      </AppLayout>
    </div>
  );
};

export default TermsAndCondition;
