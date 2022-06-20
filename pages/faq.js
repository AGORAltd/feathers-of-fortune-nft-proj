import React from "react";
import AppLayout from "../components/layout/AppLayout";

const FAQ = () => {
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
            Frequently Asked Questions
          </h1>

          <div className="grid gap-12 grid-cols-1 sm:grid-cols-2 mt-12">
            <div>
              <h5 style={{ fontSize: "22px", color: "#828f99" }}>
                1. Question 1
              </h5>
              <p style={{ color: "#686868" }}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </p>
            </div>
            <div>
              <h5 style={{ fontSize: "22px", color: "#828f99" }}>
                2. Question 2
              </h5>
              <p style={{ color: "#686868" }}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </p>
            </div>
            <div>
              <h5 style={{ fontSize: "22px", color: "#828f99" }}>
                3. Question 3
              </h5>
              <p style={{ color: "#686868" }}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </p>
            </div>
            <div>
              <h5 style={{ fontSize: "22px", color: "#828f99" }}>
                4. Question4
              </h5>
              <p style={{ color: "#686868" }}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </p>
            </div>
            <div>
              <h5 style={{ fontSize: "22px", color: "#828f99" }}>
                5. Question 5
              </h5>
              <p style={{ color: "#686868" }}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </p>
            </div>
            <div>
              <h5 style={{ fontSize: "22px", color: "#828f99" }}>
                6. Question 6
              </h5>
              <p style={{ color: "#686868" }}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </p>
            </div>
            <div className="mb-24">
              <h5 style={{ fontSize: "22px", color: "#828f99" }}>
                7. Question 7
              </h5>
              <p style={{ color: "#686868" }}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </p>
            </div>

            <div>
              <h5 style={{ fontSize: "22px", color: "#828f99" }}>
                8. Question 8
              </h5>
              <p style={{ color: "#686868" }}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </p>
            </div>
          </div>
        </div>
      </AppLayout>
    </div>
  );
};

export default FAQ;
