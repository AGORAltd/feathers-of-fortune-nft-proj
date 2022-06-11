import { CreateCampaignBtn } from "../CreateCampaignsForm/CreateCampaignBtn";
import { useRouter } from "next/router";

const NftFilter = () => {
  const router = useRouter();
  const { pathname } = useRouter();
  const sendToRouteOnClick = (routeName) => {
    router.push(routeName);
  };

  return (
    <>
      <div className="text-white my-4 flex justify-between flex-col md:flex-row">
        <div className="flex justify-between flex-col md:flex-row my-2 md:my-0">
          <button
            onClick={() => {
              sendToRouteOnClick("new");
            }}
            className={`py-2 px-6 mx-2 rounded my-1 md:my-0 ${
              pathname == "/new" ? "bg-blue-400" : "filter_button"
            }`}
          >
            New
          </button>

          <button
            onClick={() => {
              sendToRouteOnClick("/hot");
            }}
            className={`py-2 px-6 mx-2 rounded my-1 md:my-0 ${
              pathname == "/hot" ? "bg-blue-400" : "filter_button"
            }`}
          >
            Hot
          </button>

          <button
            onClick={() => {
              sendToRouteOnClick("/");
            }}
            className={`py-2 px-6 mx-2 rounded my-1 md:my-0 ${
              pathname == "/" ? "bg-blue-400" : "filter_button"
            }`}
          >
            Ending Soon
          </button>

          <button
            onClick={() => {
              sendToRouteOnClick("reveal-winner");
            }}
            className={`py-2 px-6 mx-2 rounded my-1 md:my-0 ${
              pathname == "/reveal-winner" ? "bg-blue-400" : "filter_button"
            }`}
          >
            Winner's Circle
          </button>

          <CreateCampaignBtn />
        </div>
      </div>
    </>
  );
};

export default NftFilter;
