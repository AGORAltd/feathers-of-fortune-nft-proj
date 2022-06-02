import { CreateCampaignBtn } from "../CreateCampaignsForm/CreateCampaignBtn";
import { useRouter } from "next/router";
import { useContext } from "react";
import { NftContext } from "../../../context/NftContext";

const NftFilter = () => {
  const router = useRouter();
  const { pathname } = router;
  const { setStartIndex } = useContext(NftContext);

  const sendToRouteOnClick = (routeName) => {
    setStartIndex(0);
    // window.location.href = routeName;
    router.push(routeName);
  };

  return (
    <>
      <div className="text-white my-4 flex justify-between flex-col md:flex-row">
        <div className="flex justify-between flex-col md:flex-row my-2 md:my-0">
          <button
            onClick={() => {
              sendToRouteOnClick("/");
            }}
            className="filter_button py-2 px-6 mx-2 rounded my-1 md:my-0"
          >
            Hot
          </button>

          <button
            onClick={() => {
              sendToRouteOnClick("new");
            }}
            className="filter_button py-2 px-6 mx-2 rounded my-1 md:my-0"
          >
            New
          </button>

          <button
            onClick={() => {
              sendToRouteOnClick("ending-soon");
            }}
            className="filter_button py-2 px-6 mx-2 rounded my-1 md:my-0"
          >
            Ending Soon
          </button>

          <CreateCampaignBtn />
        </div>
      </div>
    </>
  );
};

export default NftFilter;
