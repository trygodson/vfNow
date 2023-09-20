import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './UserGiftCollect.css'
import Footer from "../../components/Footer";
import TopHeader from "../../components/TopHeader";
import Loader from "../../components/Loader";
import GeneralElection from "../../components/GeneralElection";
import { useTranslation } from "react-i18next";
import "../../languages/i18n";
import API from "../../services/ApiLists";
import { ApiCall } from "../../services/ApiCall";
import { getUserData } from "../../Functions/Functions";
import { AiOutlineWhatsApp,AiFillFacebook,AiFillInstagram } from 'react-icons/ai';

export default function UserProfileElections() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const [loader, setLoader] = useState(false);
  const [userProfile, setUserProfile] = useState();
  const [elections, setElection] = useState();
  const [user, setUser] = useState();

  useEffect(async () => {
    const userData = await getUserData();
    if (userData) {
      setLoader(true);
      setUser(userData);
      GetUsergiftData(userData);
    }
  }, []);

  function GetUsergiftData(user) {
    var formData = new FormData();

    formData.append("user_id", location.state.user_id);
    ApiCall("Post", API.usercollectGifts, formData, {
      Authorization: `Bearer ` + user.access_token,
      Accept: "application/json",
    })
      .catch((error) => {
        setLoader(false);
        console.log("erorr reponse", error);
        //   reject(error.response);
      })
      .then((resp) => {
        setLoader(false);
        // console.log("setUserProfile View", resp.data.data);
        setUserProfile(resp.data.data);
        setElection(resp.data.data.election_details);
      });
  }
  

  return (
    <div class="container-fluid">
      <TopHeader title={t("Header.My Gift to be Collected")} />

      {/* <!-- Content Section Starts here --> */}
      <section class="content-sec row">
        <div class="col-9 generate-fil">
          <button class="btn">
            {t("filter.ORGANIZE")}
            <img src="images/organize-ico.svg" alt="ico" />
          </button>
          <button class="btn">
            {t("filter.FILTER")}
            <img src="images/filter-gray-ico.svg" alt="ico" />
          </button>
          <div className="d-flex justify-content-between" style={{marginTop:"5px"}} >     
          </div>
        </div>



        <div class="winner-sec mb-minus-max">
          <img
            class="img-fluid top-light"
            src="images/light-top.svg"
            alt="image"
          />
          <div class="winner-img">
            <img src={userProfile?.avatar} alt="username" />
          </div>
          <div class="winner-badge">
            <div class="badge-cont">
              <h6 class="px-5 text-truncate">{userProfile?.username}</h6>
              <p>{t("election.The Winner")}</p>
              <span class="win-place">01</span>
            </div>
            <img class="img-fluid" src="images/winner-badge.svg" alt="image" />
          </div>
        </div>
        {/* <!-- This Gift Section Starts here --> */}
        <div class="product-wrap item-snippet">
          <div class="row mt-4 pt-3">
            <div class="col-12">
              <div class=" mb-4">
                {/* <img class="ico" src="images/fun-ico.svg" alt="" />*/}
                <h3>{t("user_register.MY FREE GIFT")} </h3>
              </div>
            </div>
            {elections?.map((election, index) => {
              return (
                <GeneralElection
                  items={election}
                  indexs={index}
                  user={user && user}
                  loader={loader}
                  setLoader={setLoader}
                  bottom="userGift"
                />
              );
            })}
          </div>
        </div>
        <Footer user={user && user} />
        {loader && <Loader />}
        {/* <!-- This Gift Section Ends here --> */}
      </section>
      {/* <!-- Content Section Ends here --> */}
    </div>
  );
}
