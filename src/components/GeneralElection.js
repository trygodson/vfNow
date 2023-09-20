import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useTranslation } from "react-i18next";
import "../languages/i18n";
import { Carousel } from "react-responsive-carousel";
import StarRatings from "react-star-ratings";

import nostart from "../images/not-started-bg.svg";
import logo from "../images/logo-dummy.png";
import startyellow from "../images/yellow-start-bg.svg";
import vote from "../images/vote-ico.svg";

import dollar from "../images/dollar-ico.svg";

import jc from "../images/join-candidate-ico.svg";
import fav from "../images/favorite-ico.svg";
import anounce from "../images/announce-ico.svg";

import ProgressBar from "../components/ProgressBar";
import MessageBox from "../components/MessageBox";
import API from "../services/ApiLists";
import { ApiCall } from "../services/ApiCall";

const GenralElection = ({
  items,
  indexs,
  user,
  setLoader,
  HomeFtn,
  bottom,
  setElectionID,
  setBusinesID,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const calculateTimeLeft = () => {
    if (items.election_date_time != "") {
      let diffTime = Math.abs(
        new Date().valueOf() - new Date(`${items.election_date_time}`).valueOf()
      );
      let days = diffTime / (24 * 60 * 60 * 1000);
      let hours = (days % 1) * 24;
      let minutes = (hours % 1) * 60;
      let secs = (minutes % 1) * 60;
      [days, hours, minutes, secs] = [
        Math.floor(days),
        Math.floor(hours),
        Math.floor(minutes),
        Math.floor(secs),
      ];
      // setDays(days);
      // setHours(hours);
      return days + "d " + hours + "h " + minutes + "m " + secs + "s";
    } else return "";
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [ageLimit, setAgeLimit] = useState(false);
  const [ageLimitDiv, setAgeLimitDiv] = useState(
    items?.age_limitation == 0 ? false : true
  );
  const [item, setItem] = useState(items);
  const [error, setError] = React.useState(false);
  const [error_title, seterror_title] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
  });

  const [days, setDays] = React.useState();
  const [hours, setHours] = React.useState();

  useEffect(() => {
    let diffTime = Math.abs(
      new Date().valueOf() - new Date(`${items.election_date_time}`).valueOf()
    );
    let days = diffTime / (24 * 60 * 60 * 1000);
    let hours = (days % 1) * 24;
    setDays(days);
    setHours(hours);
  }, []);
  function UserFavElectionAdd(electionId, status, item) {
    var formData = new FormData();
    setLoader(true);
    formData.append("user_id", user?.user_id);
    formData.append("election_id", electionId);
    formData.append("status", status);
    ApiCall("Post", API.AddfavElectionApi, formData, {
      Authorization: `Bearer ` + user?.access_token,
      Accept: "application/json",
    })
      .catch((error) => {
        console.log("erorr reponse", error);
        setLoader(false);
      })
      .then((resp) => {
        if (resp.data.success) {
          item.favourite = status;
        } else {
          setError(true);
          seterror_title(resp.data.message);
        }
        setLoader(false);
      });
  }

  function AddElectionCandidate(electionId, item, index) {
    var formData = new FormData();
    setLoader(true);
    formData.append("user_id", user?.user_id);
    formData.append("election_id", electionId);

    ApiCall("Post", API.AddElectionCandidateApi, formData, {
      Authorization: `Bearer ` + user?.access_token,
      Accept: "application/json",
    })
      .catch((error) => {
        setLoader(false);
        console.log("erorr reponse", error);
        //   reject(error.response);
      })
      .then((resp) => {
        setLoader(false);
        if (resp.data.success) {
          item.join_status = true;
        } else {
          setError(true);
          seterror_title(resp.data.message);
        }
      });
  }

  return (
    <div class="product-list" key={indexs}>
      <div class="product-overflow">
        <div class="prod-snip">
          <div
            class="business-name"
            onClick={() => {
              navigate("/businessDetail", {
                state: {
                  business: item?.business_details,
                },
              });
            }}
          >
            <div class="logo-sec">
              <img
                class="img-fluid"
                src={
                  item?.business_details?.avatar
                    ? item?.business_details?.avatar
                    : logo
                }
                alt="logo"
              />
            </div>
            <div class="cont-sec">
              <h4 class="text-truncate text-uppercase">
                {item?.business_name}
              </h4>
              <div class="rating-sec">
                <div class="rating">
                  <StarRatings
                    rating={item?.ratings}
                    starRatedColor="#FFD306"
                    numberOfStars={5}
                    name="rating"
                    starDimension="20px"
                    starSpacing="2px"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="img-wrap">
            <div
              class={`${
                item?.election_status == "Not Started"
                  ? "status"
                  : item?.election_status == "Started"
                  ? "status start"
                  : "status end"
              }`}
            >
              <img
                src={
                  item?.election_status == "Not Started" ? nostart : startyellow
                }
                class={`  ${
                  item?.election_status != "Ended" ? "" : "img-white"
                } `}
                alt=""
              />
              <span>
                {item?.election_status == "Started" && (
                  <img class="ico" src={vote} alt="ico" />
                )}
                {item?.election_status}
              </span>
            </div>
            {/* <span class="img-count">
              <img src={camera} alt="" /> {item?.gift_images?.length}
            </span> */}
            <div className="plus18-container">
              <Carousel
                showArrows={false}
                showThumbs={false}
                showStatus={false}
                preventMovementUntilSwipeScrollTolerance={true}
                swipeScrollTolerance={50}
              >
                {item?.gift_images?.map((itemChild, index) => {
                  return (
                    <div
                      className="carousel-height"
                      key={index}
                      onClick={() =>
                        navigate("/electionDetail", {
                          state: {
                            electionStatus: item?.election_status,
                            election: item,
                            election_date_time: item?.election_date_time,
                          },
                        })
                      }
                    >
                      <img
                        class="img-fluid"
                        src={itemChild?.picture}
                        alt="Thumbnail"
                      />
                    </div>
                  );
                })}
                {item?.video != "" && (
                  <div className="carousel-height">
                    <video
                      src={item?.video}
                      controls="controls"
                      className="carousel-video"
                    />
                  </div>
                )}
              </Carousel>
              {ageLimitDiv && (
                <>
                  {ageLimit ? (
                    <div classname="plus18-image">
                      <p class="plus18-text pt-5 ">
                        {t("election.Are you really more than 18 years old")}{" "}
                        ???
                        <div className="plus18-button">
                          <button
                            className="bg-transparent border-0"
                            onClick={() => {
                              setAgeLimitDiv(false);
                            }}
                          >
                            <p>{t("placeHolders.radio_yes")}</p>
                          </button>
                          <button
                            className="bg-transparent border-0"
                            onClick={() => {
                              setAgeLimit(false);
                            }}
                          >
                            <p> {t("placeHolders.radio_no")}</p>
                          </button>
                        </div>
                      </p>
                    </div>
                  ) : (
                    <img
                      onClick={() => {
                        setAgeLimit(true);
                      }}
                      class="img-fluid plus18-image p-5"
                      src={"images/18+btn.svg"}
                      alt="Thumbnail"
                    />
                  )}
                </>
              )}
            </div>
          </div>
          <div class="cont">
            <h4 class="text-truncate"> {item?.gift_title}</h4>

            <span class="full-desc ">
              <p> {item?.gift_description}</p>
              <span class="opacity-50 ">({item?.unique_number})</span>
            </span>
            <div class="d-flex w-100 pt-2 border-top mt-1">
              <div class="ico-cont text-uppercase">
                <img src={dollar} alt="" /> {item?.gift_value} {item?.currency}
              </div>
              <div class="ico-cont justify-content-end">
                {item?.gift_delivery_option?.value == "1" ? (
                  <>
                    <img
                      src="images/shipped-ico.svg"
                      className="icon-size"
                      alt=""
                    />
                    {t("election.Shipped")}
                  </>
                ) : item?.gift_delivery_option?.value == "2" ? (
                  <>
                    <img src={"images/mail-ico.svg"} alt="" />
                    {t("election.On-line delivery")}
                  </>
                ) : (
                  <>
                    <img src="images/shop-line-ico.svg" alt="" />
                    {t("election.At the place")}
                  </>
                )}
              </div>
            </div>
            <div class="d-flex start flex-row justify-content-between">
              <div
                class={`${
                  item?.election_status == "Not Started" ||
                  item?.election_status == "Ended"
                    ? ""
                    : item?.election_status == "Started" &&
                      parseInt(days) == 0 &&
                      parseInt(hours) <= 12
                    ? "text-danger"
                    : "text-success"
                }`}
              >
                <strong>
                  {item?.election_status == "Not Started"
                    ? t("election.Start in")
                    : item?.election_status == "Started"
                    ? t("election.End in")
                    : t("election.Ended")}
                </strong>{" "}
                {timeLeft}
              </div>
              <div class="ico-cont justify-content-end">
                {item?.election_status == "Not Started" ? (
                  <>
                    <img src={"images/candidate-ico.svg"} alt="ico" />
                    <strong>
                      {item?.candidates_count == ""
                        ? "0"
                        : item?.candidates_count}{" "}
                      {t("election.Candidates")}
                    </strong>
                  </>
                ) : (
                  <>
                    <img
                      src="images/vote-ico.svg"
                      className="icon-size"
                      alt="ico"
                    />
                    <strong>
                      {item?.votes_count == "" ? "0" : item?.votes_count}{" "}
                      {t("election.Votes")}
                    </strong>
                  </>
                )}
              </div>
            </div>
            {bottom == undefined && (
              <>
                {item?.election_status == "Ended" ? (
                  <div class="btm-sec">
                    <a class="link inactive">
                      <img src={jc} alt="ico" />
                      <span>
                        {t("election.Join")}
                        <small> {t("election.as")} </small>
                        {t("election.Candidates")}
                      </span>
                    </a>
                    <a href="javascript:;" class="link inactive">
                      <img src={fav} alt="ico" />
                      <span>{t("election.Favourite")}</span>
                    </a>
                    <a href="javascript:;" class="link inactive">
                      <img src={anounce} alt="ico" />
                      <span>{t("election.Ask for Vote")}</span>
                    </a>
                  </div>
                ) : (
                  <div class="btm-sec">
                    {item?.join_status == false ? (
                      user?.login_as == "visitor" ? (
                        <button
                          data-bs-toggle="modal"
                          data-bs-target="#login-message"
                          class="bg-transparent border-0 link"
                        >
                          <img src="images/join-candidate-ico.svg" alt="ico" />
                          <span>
                            {t("election.Join")}
                            <small> {t("election.as")} </small>
                            {t("election.Candidates")}
                          </span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if (!ageLimitDiv) {
                              AddElectionCandidate(
                                item?.election_id,
                                item,
                                indexs
                              );
                            }
                          }}
                          class="bg-transparent border-0 link"
                        >
                          <img src="images/join-candidate-ico.svg" alt="ico" />
                          <span>
                            {t("election.Join")}
                            <small> {t("election.as")} </small>
                            {t("election.Candidates")}
                          </span>
                        </button>
                      )
                    ) : (
                      <button class="bg-transparent border-0 link">
                        <img src="images/join-candidate-ico.svg" alt="ico" />
                        <span>{t("election.JOINED")}</span>
                      </button>
                    )}

                    <button
                      class={`link bg-transparent border-0 ${
                        item?.favourite == true ? "yellow-ellipse" : ""
                      }`}
                      onClick={() =>
                        UserFavElectionAdd(
                          item?.election_id,
                          item?.favourite ? 0 : 1,
                          item
                        )
                      }
                    >
                      <img
                        class="img-fluid"
                        src="images/heart-ico.svg"
                        alt=""
                      />
                      <span>{t("election.Favourite")}</span>
                    </button>
                    {item?.join_status == false ? (
                      <a class="link inactive">
                        <img src="images/announce-ico.svg" alt="ico" />
                        <span>{t("election.Ask for Vote")}</span>
                      </a>
                    ) : (
                      <Link
                        to="/AskForVote"
                        state={{
                          user_id: user?.user_id,
                          election_id: item?.election_id,
                        }}
                        class="btn btn-empty p-0"
                      >
                        <img
                          class="img-fluid"
                          src="images/ask-for-vote-rect.svg"
                          alt="ico"
                        />
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}

            {bottom == "userCandidate" && (
              <div class="btm-sec">
                <div class="candidate-snippet">
                  <div
                    class="user-img"
                    onClick={() => {
                      navigate("/VoteUser", {
                        state: {
                          user_id: user?.user_id,
                        },
                      });
                    }}
                  >
                    <img src={user?.picture} alt={user?.username} />
                  </div>
                  <div class="avatar-cont">
                    <div class="ac-lft">
                      <div class="vote-count">
                        <img src="images/vote-ico.svg" alt="ico" />
                        {item?.votes_count}
                      </div>
                      <ProgressBar position={item?.position} />
                    </div>
                    <Link
                      to="/AskForVote"
                      state={{
                        user_id: user?.user_id,
                        election_id: item.election_id,
                      }}
                      class="btn btn-empty"
                    >
                      <img
                        class="img-fluid"
                        src="images/ask-for-vote-rect.svg"
                        alt="ico"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            )}
            {bottom == "userGift" && (
              <div class="btm-sec win-rib-sec">
                <div class="candidate-snippet">
                  <div class="user-img">
                    <img src={user?.picture} alt={user?.username} />
                  </div>

                  <div class="avatar-cont ps-4">
                    <Link
                      to={"/DeliveryOptions"}
                      state={{
                        option: item?.gift_delivery_option?.option,
                        user_id: user?.user_id,
                        election: item,
                        userProfile: user,
                      }}
                      class="btn btn-clip"
                    >
                      <span class="mt-1">
                        {t("user_register.Receive the FREE GIFT")}
                      </span>
                      <img
                        class="img-fluid"
                        src="images/arrow-ico.svg"
                        alt="ico"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {bottom == "userfeedback" && (
              <div class="btm-sec win-rib-sec">
                <div class="candidate-snippet">
                  <div class="user-img">
                    <img src={user?.picture} alt={user?.username} />
                  </div>
                  {/* <div class="winner-ribbon">
                              <img
                                class="ico"
                                src="images/winner-badge-small.svg"
                                alt="ico"
                              />
                              <span>01</span>
                            </div> */}
                  <div class="avatar-cont ps-4">
                    <button
                      class="btn star-btn"
                      data-bs-toggle="modal"
                      data-bs-target="#feedback-modal"
                      onClick={() => {
                        setBusinesID(item?.business_details);
                        setElectionID(item);
                      }}
                    >
                      <StarRatings
                        rating={item?.ratings}
                        starRatedColor="#FFD306"
                        numberOfStars={5}
                        name="rating"
                        starDimension="30px"
                        starSpacing="2px"
                      />

                      <img
                        class="img-fluid"
                        src="images/arrow-ico.svg"
                        alt="ico"
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {error && (
        <MessageBox error={error} setError={setError} title={error_title} />
      )}
    </div>
  );
};

export default GenralElection;
