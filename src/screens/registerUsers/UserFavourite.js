import React, { useEffect, useState } from "react";

import Footer from "../../components/Footer";
import TopHeader from "../../components/TopHeader";
import Loader from "../../components/Loader";
import { useTranslation } from "react-i18next";
import "../../languages/i18n";
import API from "../../services/ApiLists";
import { ApiCall } from "../../services/ApiCall";

import GeneralElection from "../../components/GeneralElection";
import BusinessBox from "../../components/BusinessBox";
import { getUserData } from "../../Functions/Functions";

export default function UserProfileElections() {
  const { t } = useTranslation();

  const [loader, setLoader] = useState(false);
  const [business, setBusiness] = useState();
  const [elections, setElection] = useState();
  const [organize, setOrganize] = useState(false);
  const [filter, setFilter] = useState(false);

  const [user, setUser] = useState();

  useEffect(async () => {
    const userData = await getUserData();
    if (userData) {
      setLoader(true);
      setUser(userData);
      UserFavListApiGet(userData);
    }
  }, []);

  function UserFavListApiGet(user) {
    var formData = new FormData();

    formData.append("user_id", user?.user_id);
    ApiCall("Post", API.UserFavListApi, formData, {
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
        console.log("setUserProfile View", resp.data.data);
        setBusiness(resp.data.data.favourite_business_places);
        setElection(resp.data.data.favourite_elections);
      });
  }

  function UserFavElectionAdd(electionId, status) {
    setLoader(true);
    var formData = new FormData();

    formData.append("user_id", user?.user_id);
    formData.append("election_id", electionId);
    formData.append("status", status);
    ApiCall("Post", API.AddfavElectionApi, formData, {
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
        // alert(resp.data.message);
        console.log("setUserProfile View", resp.data.data);
        UserFavListApiGet(user);
      });
  }

  function AddElectionCandidate(electionId) {
    setLoader(true);
    var formData = new FormData();

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
        // alert(resp.data.message);
        // console.log("join election", resp.data.data);
        UserFavListApiGet(user);
      });
  }

  function UserFavBusinessAdd(businessID, status) {
    setLoader(true);
    var formData = new FormData();

    formData.append("user_id", user?.user_id);
    formData.append("business_id", businessID);
    formData.append("status", status);
    ApiCall("Post", API.AddfavBusinessApi, formData, {
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
        // console.log("userFavADD View", resp.data.data);
        // alert(resp.data.message);
        UserFavListApiGet(user);
      });
  }

  return (
    <div class="container-fluid">
      <TopHeader title={t("Header.FAVOURITE")} />

      {/* <!-- Content Section Starts here --> */}
      <section class="content-sec row">
        {/* <!-- This Product Section Starts here --> */}
        <div class="col-12 general-filter">
          <button
            onClick={() => setOrganize(!organize)}
            class="btn btn-organize"
          >
            {t("filter.ORGANIZE")}
            <img src="images/organize-ico.svg" alt="ico" />
          </button>
          <button onClick={() => setFilter(!filter)} class="btn">
            {t("filter.FILTER")}
            <img src="images/filter-gray-ico.svg" alt="ico" />
          </button>
          {organize && (
            <div class="filter-sidebar head-dd show">
              <div class="filter-hdr">
                <div class="head">
                  <button class="btn close">
                    <img src="images/close-ico.svg" alt="" />
                  </button>
                  <h4> {t("filter.Organize by")}</h4>
                </div>
                <a href="javascript:;"> {t("filter.Reset All")}</a>
              </div>
              <div class="filter-cont">
                <ul class="dropdown-menu">
                  <li>
                    <a class="dropdown-item" href="javascript:;">
                      <span class="d-flex align-items-center">
                        <img
                          class="img-black img-fluid"
                          src="images/dd-down-green-arrow.svg"
                          alt="ico"
                        />
                        <img
                          class="img-fluid"
                          src="images/dd-clock-red-ico.svg"
                          alt="ico"
                        />
                        {t("filter.Ending soon")}
                      </span>
                      <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="javascript:;">
                      <span class="d-flex align-items-center">
                        <img
                          class="img-black img-fluid"
                          src="images/dd-up-green-arrow.svg"
                          alt="ico"
                        />
                        <img
                          class="img-fluid"
                          src="images/dd-clock-red-ico.svg"
                          alt="ico"
                        />
                        {t("filter.Ending Later")}
                      </span>
                      <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="javascript:;">
                      <span class="d-flex align-items-center">
                        <img
                          class="img-fluid"
                          src="images/dd-down-green-arrow.svg"
                          alt="ico"
                        />
                        <img
                          class="img-fluid img-black"
                          src="images/dd-clock-red-ico.svg"
                          alt="ico"
                        />
                        {t("filter.Starting soon")}
                      </span>
                      <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="javascript:;">
                      <span class="d-flex align-items-center">
                        <img
                          class="img-fluid"
                          src="images/dd-up-green-arrow.svg"
                          alt="ico"
                        />
                        <img
                          class="img-fluid img-black"
                          src="images/dd-clock-red-ico.svg"
                          alt="ico"
                        />
                        {t("filter.Starting later")}
                      </span>
                      <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="javascript:;">
                      <span class="d-flex align-items-center">
                        <img
                          class="img-fluid img-black"
                          src="images/dd-down-green-arrow.svg"
                          alt="ico"
                        />
                        <img
                          class="mx-1 img-fluid"
                          src="images/dd-dollor-gray-ico.svg"
                          alt="ico"
                        />
                        {t("filter.Highest value first")}
                      </span>
                      <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="javascript:;">
                      <span class="d-flex align-items-center">
                        <img
                          class="img-fluid img-black"
                          src="images/dd-up-green-arrow.svg"
                          alt="ico"
                        />
                        <img
                          class="mx-1 img-fluid"
                          src="images/dd-dollor-gray-ico.svg"
                          alt="ico"
                        />
                        {t("filter.Lowest value first")}
                      </span>
                      <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="javascript:;">
                      <span class="d-flex align-items-center">
                        <img
                          class="img-fluid"
                          src="images/dd-down-green-arrow.svg"
                          alt="ico"
                        />
                        <img
                          class="img-fluid"
                          src="images/dd-vote-ico.svg"
                          alt="ico"
                        />
                        {t("filter.FILTER")}
                      </span>
                      <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="javascript:;">
                      <span class="d-flex align-items-center">
                        <img
                          class="img-fluid"
                          src="images/dd-down-green-arrow.svg"
                          alt="ico"
                        />
                        <img
                          class="mx-1 img-fluid"
                          src="images/dd-people-ico.svg"
                          alt="ico"
                        />
                        {t("filter.Lowest candidates first")}
                      </span>
                      <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          )}
          {filter && (
            <div class="filter-sidebar ">
              <div class="filter-hdr">
                <div class="head">
                  <button class="btn close">
                    <img src={"images/close-x.svg"} alt="" />
                  </button>
                  <h4>{t("filter.Filter")}</h4>
                </div>
                <a href="javascript:;">{t("filter.Reset All")}</a>
              </div>
              <div class="filter-cont">
                <a class="by-cate" href="javascript:;">
                  {t("filter.Filter by Category")}
                  <img src="images/yellow-arrow.svg" alt="ico" />
                </a>
                <form action="">
                  <div class="group">
                    <h5>{t("filter.Election Status")}</h5>
                    <div class="form-check mb-2">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="status"
                        id=""
                      />
                      <label class="form-check-label" for="">
                        {t("filter.Started")}
                      </label>
                    </div>
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="status"
                        id=""
                      />
                      <label class="form-check-label" for="">
                        {t("filter.To be Started")}
                      </label>
                    </div>
                  </div>
                  <div class="group">
                    <h5>{t("filter.Delivery Option")}</h5>
                    <div class="form-check mb-2">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="status"
                        id=""
                      />
                      <label class="form-check-label" for="">
                        {t("filter.Shipped")}
                      </label>
                    </div>
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="status"
                        id=""
                      />
                      <label class="form-check-label" for="">
                        {t("filter.On-line delivery")}
                      </label>
                    </div>
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="status"
                        id=""
                      />
                      <label class="form-check-label" for="">
                        {t("filter.Self Collection at the place")}
                      </label>
                    </div>
                  </div>
                  <div class="group border-bottom-0">
                    <h5>{t("filter.Distance From you")}</h5>
                    <div class="range-blk">
                      <span>5 km</span>
                      <span class="right">{t("filter.All World")}</span>
                      <input type="range" class="form-range" id="customRange" />
                    </div>
                  </div>
                </form>
              </div>
              <div class="filter-ftr">
                <a href="javascript:;">{t("filter.Apply Filter")}</a>
              </div>
            </div>
          )}
        </div>
        <div class="product-wrap item-snippet" id="election-link">
          <div class="row mt-4 pt-3">
            <div class="col-12">
              <div class=" mb-3">
                {/* <img class="ico" src="images/fun-ico.svg" alt="" />*/}
                <h3>
                  {" "}
                  <span>{t("election.Favourite elections")}</span>
                </h3>
              </div>
            </div>

            {elections?.map((item, index) => {
              return (
                <GeneralElection
                  items={item}
                  indexs={index}
                  user={user && user}
                  loader={loader}
                  setLoader={setLoader}
                />
              );
            })}
          </div>
        </div>
        {/* <!-- This Product Section Ends here -->
            <!-- This Business Section Starts here --> */}

        <div class="product-wrap item-snippet mt-5" id="business-link">
          <div class=" mb-3">
            {/* <img class="ico" src="images/fun-ico.svg" alt="" />*/}
            <h3>{t("election.Favourite Business Places")}</h3>
          </div>
          <div class="row my-3">
            <div class="product-list">
              <div class="" style={{ width: "100%" }}>
                {business?.map((item, index) => {
                  return (
                    <BusinessBox
                      item={item}
                      index={index}
                      user={user && user}
                      loader={loader}
                      style={"business-general"}
                      setLoader={setLoader}
                      HomeFtn={() => {}}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div class="ftr-top dual-btn chat_button">
          <a href="#election-link" class="btn btn-black anchor-link">
            {t("election.ELECTION")}
          </a>
          <a href="#business-link" class="btn btn-black anchor-link">
            {t("election.BUSINESS PLACE")}
          </a>
        </div>
        {/* <!-- This Business Section Ends here --> */}
      </section>

      <Footer user={user && user} />
      {loader && <Loader />}
      {/* <!-- Content Section Ends here --> */}
    </div>
  );
}
