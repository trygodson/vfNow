import React, { useState, useEffect } from "react";

import { useNavigate, Link, useLocation } from "react-router-dom";
import API from "../services/ApiLists";
import { ApiCall } from "../services/ApiCall";

import thumb from "../images/business-thumb.jpg";
import logo from "../images/logo-dummy.png";
import share from "../images/share-ico.svg";
import triangle from "../images/business-triangle.svg";

import { useTranslation } from "react-i18next";
import "../languages/i18n";

import TopHeader from "../components/TopHeader";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import UserViewGift from "../components/UserViewGift";

import { getUserData } from "../Functions/Functions";
import StarRatings from "react-star-ratings";

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loader, setLoader] = useState(false);
  const [feedback, setFeedback] = useState("");

  const { t, i18n } = useTranslation();
  const [users, setUsers] = useState();
  const [user, setUser] = useState(location.state.user);

  useEffect(async () => {
    const userData = await getUserData();
    if (userData) {
      setUsers(userData);
      setLoader(true);
      FeedbackBusinessApi(location.state.user, userData);
    }
  }, []);

  function FeedbackBusinessApi(user, userToken) {
    var formData = new FormData();

    formData.append("user_id", user?.id ? user?.id : user?.user_id);
    formData.append("business_id", user?.business_id);

    ApiCall("Post", API.feedbackApi, formData, {
      Authorization: "Bearer " + userToken?.access_token,
      Accept: "application/json",
    })
      .catch((error) => {
        setLoader(false);
        console.log("erorr reponse", error);
        //   reject(error.response);
      })
      .then((resp) => {
        setLoader(false);
        setFeedback(resp.data.data);
        // console.log(resp.data);
      });
  }

  function UserFavBusinessAdd(businessID, status) {
    var formData = new FormData();
    setLoader(true);
    formData.append("user_id", user?.user_id);
    formData.append("business_id", businessID);
    formData.append("status", status);
    ApiCall("Post", API.AddfavBusinessApi, formData, {
      Authorization: `Bearer ` + users?.access_token,
      Accept: "application/json",
    })
      .catch((error) => {
        setLoader(false);
        console.log("erorr reponse", error);
        //   reject(error.response);
      })
      .then((resp) => {
        setLoader(false);
        FeedbackBusinessApi(location.state.user, users);
        // console.log("userFavADD View", resp.data.data);
        // alert(resp.data.message);
      });
  }

  return (
    <div class="container-fluid">
      <TopHeader title={t("Header.feedback")} />
      {loader && <Loader />}
      <section class="content-sec row">
        <div class="shop-img">
          <img
            class="img-fluid"
            src={
              feedback?.business_place_images?.[0]?.picture
                ? feedback?.business_place_images?.[0]?.picture
                : thumb
            }
            alt="Thumbnail"
          />
        </div>
        <div class="business-tri">
          <img class="tri-bg" src={triangle} alt="ico" />
          <div class="cont">
            <div
              class="logo-sec"
              onClick={() => {
                navigate("/businessDetail", {
                  state: {
                    business: feedback,
                  },
                });
              }}
            >
              <img
                class="img-fluid"
                src={feedback?.avatar ? feedback?.avatar : logo}
                alt="logo"
              />
            </div>
            <h4 class="text-truncate text-uppercase">
              {feedback?.business_name}
            </h4>
            <div class="share">
              <button
                onClick={() =>
                  UserFavBusinessAdd(
                    feedback?.business_id,
                    feedback?.favourite ? 0 : 1
                  )
                }
                class={`link bg-transparent border-0 yellow-ellipse ${
                  feedback?.favourite == true ? "yellow-ellipse-feedback" : ""
                }`}
              >
                <img class="img-fluid" src="images/heart-ico.svg" alt="" />
              </button>
              <a class="link">
                <img class="img-fluid" src={share} alt="" />
              </a>
            </div>
          </div>
          <div class="rating-row">
            <div class="rate">
              <h2>{feedback?.ratings?.toFixed(1)}</h2>
              <div class="rating">
                <StarRatings
                  rating={feedback?.ratings}
                  starRatedColor="#FFD306"
                  numberOfStars={5}
                  name="rating"
                  starDimension="20px"
                  starSpacing="2px"
                />
                <p>
                  {t("Week_Days.from")} {feedback?.from_people}{" "}
                  {t("business_preview_screen.people")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="container winner-margin">
          {feedback?.feedbacks?.map((item, index) => {
            return (
              <UserViewGift item={item} index={index} user={users && users} />
            );
          })}
          {feedback?.feedbacks?.length == 0 && (
            <div class="row TBD_Card my-2 mx-0">
              <div class="col-9 TBD_Card-right py-2">
                <p> {t("alerts.No Feedback found")}</p>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer user={user && user} />
    </div>
  );
}
