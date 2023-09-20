import React, { useEffect, useState } from "react";

import API from "../services/ApiLists";
import { ApiCall } from "../services/ApiCall";

import TopHeader from "../components/TopHeader";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import UserViewGift from "../components/UserViewGift";

import TBD from "../images/TBD-img.png";
import profile from "../images/TBD-Profile.png";

import { getUserData } from "../Functions/Functions";

import { useTranslation } from "react-i18next";
import "../languages/i18n";

function Splash() {
  const [winners, setWinners] = React.useState([]);
  const [user, setUser] = useState();
  const [loader, setLoader] = useState(false);

  const { t } = useTranslation();

  useEffect(async () => {
    const userData = await getUserData();
    if (userData) {
      setLoader(true);
      setUser(userData);
      WinnerListApi(userData);
    }
    //passing getData method to the lifecycle method
  }, []);

  function WinnerListApi(userData) {
    var formData = new FormData();
    formData.append("user_id", userData.user_id);
    ApiCall("Post", API.winnerListApi, formData, {
      Authorization: `Bearer ` + userData.access_token,

      Accept: "application/json",
    })
      .catch((error) => {
        setLoader(false);
        console.log("erorr reponse", error);
        //   reject(error.response);
      })
      .then((resp) => {
        setLoader(false);
        // console.log(resp.data);
        setWinners(resp.data.data);
      });
  }

  return (
    <div class="container-fluid p-2">
      {loader && <Loader />}
      <TopHeader title={t("Header.THE MOST HAPPY WINNERS")} />

      <div class="container TBD-IMG p-0">
        <img src={TBD} alt="" class="img-fluid" />
        <div class="row TBD-content">
          <div class="col-4">
            <img src={profile} alt="" />
          </div>
          <div class="col-8 TBD-Text pl-0">
            <h5>
              {t("Header.THE MOST")} <br />{" "}
              <span>{t("Header.HAPPY WINNERs")}</span>
            </h5>
          </div>
        </div>
      </div>

      <div class="container winner-margin p-0">
        {winners?.map((item, index) => {
          return <UserViewGift item={item} index={index} user={user && user} />;
        })}
      </div>
      <Footer user={user && user} />
    </div>
  );
}

export default Splash;
