import React from "react";
import NftFilter from "../components/features/NftFilters/NftFilter";
import AppLayout from "../components/layout/AppLayout";

const New = () => {
  return (
    <>
      <AppLayout>
        <div className="container my-20 mx-auto">
          <NftFilter />
        </div>
        <div>This is new campaign page</div>
      </AppLayout>
    </>
  );
};

export default New;
