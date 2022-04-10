import React from "react";
import NftFilter from "../components/features/NftFilters/NftFilter";
import AppLayout from "../components/layout/AppLayout";

const EndingSoon = () => {
  return (
    <>
      <AppLayout>
        <div className="container my-20 mx-auto">
          <NftFilter />
        </div>
        <div>EndingSoon</div>;
      </AppLayout>
    </>
  );
};

export default EndingSoon;
