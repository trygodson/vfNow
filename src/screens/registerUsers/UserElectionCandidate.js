import React, { useEffect, useState, useCallback } from "react";

import Footer from "../../components/Footer";
import TopHeader from "../../components/TopHeader";
import Loader from "../../components/Loader";
import GeneralElection from "../../components/GeneralElection";

import { useTranslation } from "react-i18next";
import "../../languages/i18n";
import API from "../../services/ApiLists";
import { ApiCall } from "../../services/ApiCall";
import { getUserData } from "../../Functions/Functions";

export default function UserProfileElections() {
  const { t } = useTranslation();

  const [userProfile, setUserProfile] = useState();
  const [elections, setElection] = useState();
  const [loader, setLoader] = useState(false);
  const [user, setUser] = useState();

  useEffect(async () => {
    const userData = await getUserData();
    if (userData) {
      setLoader(true);
      GetUserProfileData(userData);
      setUser(userData);
    }
  }, []);

  function GetUserProfileData(user) {
    var formData = new FormData();

    formData.append("user_id", user?.user_id);
    ApiCall("Post", API.userViewApi, formData, {
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
        console.log("setUserProfile View", resp.data.data);
        setUserProfile(resp.data.data);
        setElection(resp.data.data.elections);
      });
  }

  const [showScroll, setShowScroll] = useState(true);

  const [y, setY] = useState(window.scrollY);

  const handleNavigation = useCallback(
    (e) => {
      const window = e.currentTarget;
      if (y > window.scrollY) {
        // console.log("scrolling up");
        setShowScroll(true);
      } else if (y < window.scrollY) {
        setShowScroll(false);
        // console.log("scrolling down");
      }
      setY(window.scrollY);
    },
    [y]
  );

  useEffect(() => {
    setY(window.scrollY);
    window.addEventListener("scroll", handleNavigation);

    return () => {
      window.removeEventListener("scroll", handleNavigation);
    };
  }, [handleNavigation]);

  return (
    <div class="container-fluid">
      {loader && <Loader />}
      <TopHeader title={t("Header.My Election as Candidate")} />

      {/* <!-- Content Section Starts here --> */}
      <section class="content-sec row">
        {/* <!-- This Gift Section Starts here --> */}
        <div class="product-wrap item-snippet">
          <div className={showScroll ? "fadeIn row" : "fadeOut row"}>
            <div class="col-12 general-filter">
              <button class="btn">
                {t("filter.ORGANIZE")}
                <img src="images/organize-ico.svg" alt="ico" />
              </button>
              <button class="btn">
                {t("filter.FILTER")}
                <img src="images/filter-gray-ico.svg" alt="ico" />
              </button>
            </div>
          </div>
          <div class="row mt-4 pt-3">
            {elections?.map((election, index) => {
              return (
                <GeneralElection
                  items={election}
                  indexs={index}
                  user={user && user}
                  loader={loader}
                  setLoader={setLoader}
                  bottom="userCandidate"
                />
              );
            })}
          </div>
        </div>
        <Footer user={user && user} />
        {/* <!-- This Gift Section Ends here --> */}
      </section>
      {/* <!-- Content Section Ends here --> */}
    </div>
  );
}
