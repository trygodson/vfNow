import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import "../languages/i18n";
import StarRatings from "react-star-ratings";

const UserGift = ({ item, index, user }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  console.log("item", item);
  return (
    <div key={index} class="row TBD_Card my-2 mx-1">
      <div class="col-3 ">
        <div
          class="TBD-Card-left"
          onClick={() => {
            navigate("/VoteUser", {
              state: {
                user_id: item?.feedback_id ? item?.feedback_id : item?.user_id,
              },
            });
          }}
        >
          <img
            src={item.avatar ? item.avatar : user}
            class="img-fluid TBD-Card-left-img image-winner"
          />
        </div>
      </div>
      <div class="col-9 TBD_Card-right py-2">
        <div class="d-flex justify-content-between">
          <h5>{item.username}</h5>
          <StarRatings
            rating={item.ratings}
            starRatedColor="#FFD306"
            numberOfStars={5}
            name="rating"
            starDimension="18px"
            starSpacing="1px"
          />
        </div>

        <p>{item.review}</p>
        <Link
          to={"/electionDetail"}
          state={{
            electionStatus: "Ended",
            election: item,
            election_date_time: item?.election_date_time,
          }}
          class="btn Card-btn"
        >
          {t("Buttons.VIEW GIFT")}
        </Link>
      </div>
    </div>
  );
};

export default UserGift;
