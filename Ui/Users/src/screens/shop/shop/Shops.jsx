const BASE_URL = import.meta.env.VITE_API_URL;
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import PropTypes from "prop-types";
import { setShopId } from "../../../reducers/OrderReducer";

import StarIcon from "@mui/icons-material/Star";
import shopsStyles from "./shops.module.css";


const getShopStatusInfo = (status) => {
  let statusText, statusColor;

  switch (status) {
    case 0:
      statusText = "Closed";
      statusColor = "red";
      break;
    case 1:
      statusText = "Open";
      statusColor = "green";
      break;
    case 2:
      statusText = "Temporarily Closed";
      statusColor = "orange";
      break;
    default:
      statusText = "Unknown";
      statusColor = "black";
  }

  return { statusText, statusColor }; // Return the status info
};

function Shops({ resturants }) {
  const [isHovering, setIsHovering] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const order = (id) => {
    dispatch(setShopId(id));
    navigate("/dashboard/Dishes")

  }



  return (
    <>
      {resturants.length > 0 ? resturants?.map((shop, key) => (
        <div key={shop?.id} className={shopsStyles.details}
          onClick={() => order(shop?.id)}>
          <div
            className={shopsStyles.imageContainer}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={`${BASE_URL}${shop.shopImage}`}
              alt="Shop"
              className={shopsStyles.shpImg}
            />
            {isHovering && (
              <div key={key} className={shopsStyles.showDiv}>
                <p className="select-none">{shop.shopName}</p>
              </div>
            )}
          </div>
          <p className={shopsStyles.shopName}>{shop.shopName}</p>
          <div style={{ display: "flex", gap: "8%" }}>
            <div className={shopsStyles.raitings}>
              2 <StarIcon className={shopsStyles.raitingStar} />
            </div>
            {(() => {
              const { statusText, statusColor } = getShopStatusInfo(shop?.shopStatus);
              return (
                <p style={{ color: statusColor }}>{statusText}</p>
              );
            })()}
          </div>
          <div className={shopsStyles.shopDlt}>
            <p className={shopsStyles.shpDltname}>Phone:</p>
            <p> {shop?.phoneNumber}</p>
          </div>
          <div className={shopsStyles.shopDlt}>
            <p className={shopsStyles.shpDltname}>Email:</p>
            <p>{shop?.email}</p>
          </div>
          <p>{shop.address}</p>
        </div>
      ))
        : <img
          src="/assets/noOrder.gif"
          className="h-260 mx-auto my-5 xs:my-10 sm:my-10"
          alt="404 Not Found Illustration"
        />}

    </>
  );
}

Shops.propTypes = {
  resturants: PropTypes.arrayOf(
    PropTypes.shape({
      shopImage: PropTypes.string.isRequired,
      shopName: PropTypes.string.isRequired,
      raiting: PropTypes.number.isRequired,
      shopStatus: PropTypes.number.isRequired,
      phoneNumber: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Shops;
