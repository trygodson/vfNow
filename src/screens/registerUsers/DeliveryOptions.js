import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Footer from "../../components/Footer";
import TopHeader from "../../components/TopHeader";
import Loader from "../../components/Loader";
import GeneralBusiness from "../../components/GeneralBusiness";

import { useTranslation } from "react-i18next";
import "../../languages/i18n";
import API from "../../services/ApiLists";
import { ApiCall } from "../../services/ApiCall";
import StarRatings from "react-star-ratings";
import {
  getUserData,
  getUserLongitude,
  getUserLatitude,
} from "../../Functions/Functions";
import GeneralElection from "../../components/GeneralElection";

export default function Delivery() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const [QRcode, setQRcode] = useState();
  const [userProfile, setUserProfile] = useState(location.state.userProfile);
  const [election, setElection] = useState(location.state.election);
  const [business, setBusiness] = useState(
    location.state.election?.business_details
  );

  const [city, setCity] = useState("");
  const [street_address, setStreet_address] = useState("");
  const [zip_code, setZip_code] = useState("");
  const [streetNO, setStreetNO] = useState("");
  const [other, setOther] = useState("");
  const [isSave, setisSave] = useState(false);

  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [preview, setPreview] = useState();

  const [shippedStatus, setShippedStatus] = useState("");
  const [loader, setLoader] = useState(false);
  const [user, setUser] = useState();

  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");

  useEffect(async () => {
    const userData = await getUserData();
    if (userData) {
      setLoader(true);
      setUser(userData);
      UserQRcode(userData);
      PreviewBusiness(userData);
      getGeoInfo();
    }
  }, []);

  const getGeoInfo = async () => {
    const userlongitude = await getUserLongitude();
    const userlatitude = await getUserLatitude();
    setLongitude(userlongitude);
    setLatitude(userlatitude);
  };

  function PreviewBusiness(user) {
    var formData = new FormData();
    formData.append("user_id", user?.user_id);
    formData.append(
      "business_id",
      location.state.election?.business_details?.business_id
    );

    ApiCall("Post", API.businessPreviewApi, formData, {
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
          setPreview(resp.data.data);
        } else {
        }
      });
  }

  function UserQRcode(user) {
    var formData = new FormData();

    formData.append("user_id", user?.user_id);
    ApiCall("Post", API.UserQR, formData, {
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
        setQRcode(resp.data.data);
      });
  }
  function UsercollectGiftsEMail() {
    setLoader(true);
    var formData = new FormData();
    formData.append("election_id", location.state.election.election_id);
    formData.append("user_id", location.state.user_id);
    ApiCall("Post", API.usercollectGiftsEMail, formData, {
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
        console.log(" reponse email", resp);
        // alert(resp.data.message);
      });
  }

  function reciveFreeGifts(statusValue) {
    setLoader(true);
    var formData = new FormData();

    formData.append("election_id", location.state.election.election_id);
    formData.append("user_id", location.state.user_id);
    formData.append("status", statusValue);

    ApiCall("Post", API.userrecieveGift, formData, {
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
        console.log(" reponse email", resp);
        // alert(resp.data.message);
      });
  }

  function CollectAddAddress() {
    setLoader(true);
    var formData = new FormData();

    formData.append("election_id", location.state.election.election_id);
    formData.append("user_id", location.state.user_id);
    formData.append("ship_to", location.state.userProfile?.username);
    formData.append("city", city);
    formData.append("street_address", street_address);
    formData.append("number", streetNO);
    formData.append("zip_code", zip_code);
    formData.append("other_info", other);
    formData.append("save_address", isSave ? 1 : 0);

    ApiCall("Post", API.addAddressGift, formData, {
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
      });
  }

  function ConfirmFeedback() {
    setLoader(true);
    var formData = new FormData();

    formData.append("election_id", location.state.election.election_id);
    formData.append("user_id", location.state.user_id);
    formData.append(
      "business_id",
      location.state.election?.business_details?.business_id
    );
    formData.append("ratings", rating);
    formData.append("review", review);

    ApiCall("Post", API.addFeedbackGift, formData, {
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
      });
  }

  function ShippedStatusConfirm() {
    setLoader(true);
    var formData = new FormData();

    formData.append("election_id", location.state.election.election_id);
    formData.append("user_id", location.state.user_id);

    ApiCall("Post", API.shipmentStatusGift, formData, {
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
        setShippedStatus(resp.data.data);
      });
  }

  return (
    <div class="container-fluid">
      {loader && <Loader />}
      <TopHeader title={t("Header.Collect your gift")} />
      <section class="content-sec row">
        <div class="at-shop">
          <div class="top-cont">
            <img
              class="img-fluid"
              src="images/at-shop-top-img.svg"
              alt="images"
            />
            <div class="cont">
              <img class="ico" src="images/shop-dark-big.svg" alt="ico" />
              <p>
                {t("user_register.This FREE GIFT shall be")} <br />
                <strong>
                  {t("user_register.collected at the business place")}..
                </strong>
              </p>
            </div>
          </div>
          <div class="btn-sec">
            {location.state.option == "On-line delivery" ? (
              <div class="btn-row">
                <div class="ico-blk">
                  <img
                    class="img-fluid"
                    src="images/at-shop-envelope-ico.svg"
                    alt="ico"
                  />
                </div>
                <div
                  class="btn-wrap"
                  onClick={() => {
                    UsercollectGiftsEMail();
                  }}
                >
                  <div class="btn-clip-parent">
                    <div
                      class="btn-clip"
                      data-bs-toggle="modal"
                      data-bs-target="#check-mail-modal"
                    >
                      <span>{t("user_register.Email")}</span>
                      <a>
                        {t("user_register.CHECK YOUR EMAIL")}{" "}
                        <img
                          class="img-fluid"
                          src="images/arrow-ico.svg"
                          alt="ico"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ) : location.state.option == "Shipped" ? (
              <>
                <div class="btn-row">
                  <div class="ico-blk">
                    <img
                      class="img-fluid"
                      src="images/at-shop-gps-ico.svg"
                      alt="ico"
                    />
                  </div>
                  <div class="btn-wrap">
                    <div class="btn-clip-parent">
                      <div
                        class="btn-clip"
                        data-bs-toggle="modal"
                        data-bs-target="#confirm-address-modal"
                      >
                        <span>{t("user_register.Confirm your address")}</span>
                        <a href="javascript:;">
                          {t("user_register.CONFIRM")}{" "}
                          <img
                            class="img-fluid"
                            src="images/arrow-ico.svg"
                            alt="ico"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="btn-row">
                  <div class="ico-blk">
                    <img
                      class="img-fluid"
                      src="images/at-shop-shipped-ico.svg"
                      alt="ico"
                    />
                  </div>
                  <div class="btn-wrap" onClick={() => ShippedStatusConfirm()}>
                    <div class="btn-clip-parent">
                      <div
                        class="btn-clip"
                        data-bs-toggle="modal"
                        data-bs-target="#shipped-status-modal"
                      >
                        <span>{t("user_register.Shop ship")}</span>
                        <a>
                          {t("user_register.STATUS OF SHIPMENT")}{" "}
                          <img
                            class="img-fluid"
                            src="images/arrow-ico.svg"
                            alt="ico"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div class="btn-row">
                  <div class="ico-blk">
                    <img
                      class="img-fluid"
                      src="images/at-shop-gps-ico.svg"
                      alt="ico"
                    />
                  </div>
                  <div class="btn-wrap">
                    <div class="btn-clip-parent">
                      <div class="btn-clip">
                        <span>Go to the place</span>
                        <a href="javascript:;">
                          OPEN THE MAP{" "}
                          <img
                            class="img-fluid"
                            src="images/arrow-ico.svg"
                            alt="ico"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="btn-row">
                  <div class="ico-blk">
                    <img
                      class="img-fluid"
                      src="images/at-shop-qr-ico.svg"
                      alt="ico"
                    />
                  </div>
                  <div class="btn-wrap">
                    <div class="btn-clip-parent">
                      <div class="btn-clip">
                        <span>Verify your identity</span>
                        <a
                          href="javascript:;"
                          data-bs-toggle="modal"
                          data-bs-target="#free-gift-message"
                        >
                          OPEN QR-CODE{" "}
                          <img
                            class="img-fluid"
                            src="images/arrow-ico.svg"
                            alt="ico"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div> */}
              </>
            ) : (
              <>
                <div class="btn-row">
                  <div class="ico-blk">
                    <img
                      class="img-fluid"
                      src="images/at-shop-gps-ico.svg"
                      alt="ico"
                    />
                  </div>
                  <div class="btn-wrap">
                    <div class="btn-clip-parent">
                      <div class="btn-clip">
                        <span>{t("user_register.Go to the place")}</span>
                        <a
                          onClick={() => {
                            if (preview?.business_details.is_only_online == 0) {
                              navigate("/BusinessMap", {
                                state: {
                                  business_details: preview?.business_details,
                                  userlatitude: latitude,
                                  userlongitude: longitude,
                                },
                              });
                            }
                          }}
                        >
                          {t("user_register.OPEN THE MAP")}{" "}
                          <img
                            class="img-fluid"
                            src="images/arrow-ico.svg"
                            alt="ico"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="btn-row">
                  <div class="ico-blk">
                    <img
                      class="img-fluid"
                      src="images/at-shop-qr-ico.svg"
                      alt="ico"
                    />
                  </div>
                  <div class="btn-wrap">
                    <div class="btn-clip-parent">
                      <div class="btn-clip">
                        <span>{t("user_register.Verify your identity")}</span>
                        <a
                          href="javascript:;"
                          data-bs-toggle="modal"
                          data-bs-target="#free-gift-message"
                        >
                          {t("user_register.OPEN QR-CODE")}{" "}
                          <img
                            class="img-fluid"
                            src="images/arrow-ico.svg"
                            alt="ico"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div class="btn-row">
              <div class="ico-blk">
                <img
                  class="img-fluid"
                  src="images/at-shop-gift-ico.svg"
                  alt="ico"
                />
              </div>
              <div class="btn-wrap">
                <div class="btn-clip-parent">
                  <div class="btn-clip">
                    <span>{t("user_register.Receive FREE GIFT")}</span>
                    <a
                      href="javascript:;"
                      data-bs-toggle="modal"
                      data-bs-target="#gift-received-modal"
                    >
                      {t("user_register.CONFIRM")}{" "}
                      <img
                        class="img-fluid"
                        src="images/arrow-ico.svg"
                        alt="ico"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div class="btn-row">
              <div class="ico-blk">
                <img
                  class="img-fluid"
                  src="images/at-shop-feedback-ico.svg"
                  alt="ico"
                />
              </div>
              <div class="btn-wrap">
                <div class="btn-clip-parent">
                  <div class="btn-clip">
                    <span>{t("user_register.Give your feedback")}</span>
                    <a
                      href="javascript:;"
                      data-bs-toggle="modal"
                      data-bs-target="#feedback-modal"
                    >
                      {t("user_register.GIVE FEEDBACK")}{" "}
                      <img
                        class="img-fluid"
                        src="images/arrow-ico.svg"
                        alt="ico"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="ftr-top dual-btn at-shop-btm">
          <a
            href="javascript:;"
            class="btn btn-black anchor-link"
            data-bs-toggle="modal"
            data-bs-target="#business-modal"
          >
            {election?.business_name}
          </a>
          <a
            href="javascript:;"
            class="btn btn-black anchor-link"
            data-bs-toggle="modal"
            data-bs-target="#free-gift-modal"
          >
            {t("user_register.FREE GIFT")}
          </a>
        </div>
      </section>
      <Footer user={user && user} />
      {/* <!-- Modal Popup Starts here --> */}
      <div class="modal bg-blur product-modal" id="business-modal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content minh-unset" data-bs-dismiss="modal">
            <div class="product-wrap item-snippet">
              <div class=" mb-3">
                {/* <img class="ico" src="images/fun-ico.svg" alt="" />*/}
                <h3>{t("user_register.This gift is given by")}</h3>
              </div>
              {preview && (
                <GeneralBusiness
                  preview={preview}
                  location={location}
                  user={user}
                  setLoader={setLoader}
                />
              )}

              <div class="col-12 mt-4">
                <button
                  class="btn btn-black w-100 py-2"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <small>{t("Buttons.Go_Back")}</small>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Modal Popup Ends here -->
    <!-- Modal Popup Starts here --> */}
      <div class="modal reg-modal bg-blur" id="free-gift-message">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content minh-unset" data-bs-dismiss="modal">
            <div class="free-gift-info">
              <img
                class="img-fluid"
                src="images/alert-finger-ico.png"
                alt="ico"
              />
              <h4 class="text-danger my-4">
                {t("alerts.IMPORTANT")}
                <br />
                {t("alerts.Gift are free!!!")}
              </h4>
              <p class="text-danger">
                {t("alerts.You do not have to pay anything to")}{" "}
                {election?.business_name} {t("user_register.to")} <br />
                {t("alerts.collect your gift!!!")}
              </p>
              <hr class="divider" />
              <h4>
                {election?.business_name} {t("alerts.will recognize you")}{" "}
                <br />
                {t("alerts.scanning your QR-CODE")}{" "}
              </h4>
              <p class="lead">{t("alerts.Show your QR-CODE")}</p>
              <button
                class="btn btn-black py-2 w-100 mt-4"
                data-bs-toggle="modal"
                data-bs-target="#qr-modal"
              >
                {t("user_register.OPEN QR-CODE")}{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Modal Popup Ends here --> */}
      <div class="modal bg-blur" id="qr-modal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content minh-unset" data-bs-dismiss="modal">
            <div class="alert-bubble-img qr-wrap">
              <div class="avatar-img">
                <img
                  src={
                    userProfile?.avatar
                      ? userProfile?.avatar
                      : "images/avatar-big-1.png"
                  }
                  alt="Username"
                />
              </div>
              <h5>{userProfile?.username}</h5>
              <div class="qr-img">
                <img
                  class="img-fluid"
                  src={"data:image/png;base64," + QRcode?.qr_image}
                  alt="image"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal bg-blur" id="free-gift-received-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content minh-unset" data-bs-dismiss="modal">
            <div class="gift-rib min-mt z9">
              <a href="javascript:;" class="gift-ribbon-wrap">
                <img
                  class="img-fluid"
                  src="images/gift-ribbon.png"
                  alt="images"
                />
                <div class="gift-img">
                  <div class="img-wrap">
                    <img
                      src={
                        election?.gift_images[1]
                          ? election?.gift_images[1]?.picture
                          : "images/product-img.jpg"
                      }
                      alt="ProductName"
                    />
                    <span class="img-count">
                      <img class="ico" src="images/camera-ico.svg" alt="" />1
                    </span>
                  </div>
                  <span class="title text-truncate">
                    {election?.gift_title}
                  </span>
                  <span class="gift-title text-truncate text-center">
                    {t("alerts.GIVE THE FREE GIFT")}
                  </span>
                </div>
              </a>
            </div>
            <div class="winner-sec modal-pop">
              <img
                class="img-fluid top-light"
                src="images/light-top.svg"
                alt="image"
              />
              <div class="winner-img">
                <img
                  src={
                    userProfile?.avatar
                      ? userProfile?.avatar
                      : "images/avatar-big-1.png"
                  }
                  alt="username"
                />
              </div>
              <div class="winner-badge">
                <div class="badge-cont">
                  <h6 class="px-5 text-truncate">{userProfile?.username}</h6>
                  <p>{t("user_register.The Winner")}</p>
                  <span class="win-place">01</span>
                </div>
                <img
                  class="img-fluid"
                  src="images/winner-badge.svg"
                  alt="image"
                />
              </div>
              <h6 class="confirm">
                {t("alerts.Confirm that you gave the gift")}
              </h6>
              <div class="px-3 mt-4 mb-4 z9">
                <button
                  class="btn btn-black w-100 mb-4"
                  data-bs-toggle="modal"
                  data-bs-target="#feedback-modal"
                  onClick={() => reciveFreeGifts("received")}
                >
                  <small>{t("user_register.CONFIRM")}</small>
                </button>
                <button
                  class="btn btn-white w-100"
                  onClick={() => reciveFreeGifts("not_received")}
                >
                  <small>{t("user_register.WINNER REFUSED THE GIFT")}</small>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal bg-blur product-modal" id="feedback-modal">
        <div class="modal-dialog">
          <div class="modal-content minh-unset p-4">
            <div class="feedback-pop">
              <div class="fdb-bubble">
                <img
                  class="img-fluid"
                  src="images/feedback-bubble.png"
                  alt="image"
                />
                <p>
                  {t("user_register.You are giving a feedback to")}
                  <br />
                  {election?.business_name}
                </p>
              </div>
              <h4>{t("user_register.Are you happy about your gift?")}</h4>
              <div class="star-row">
                <StarRatings
                  rating={rating}
                  starRatedColor="#FFD306"
                  changeRating={setRating}
                  numberOfStars={5}
                  name="rating"
                />
              </div>
              <h6>{t("user_register.Give your stars")}</h6>
              <div class="mb-4">
                <div class="comment">
                  <textarea
                    name="feedback"
                    placeholder={`Say something about ${election?.business_name}`}
                    onChange={(text) => setReview(text.target.value)}
                    required
                  />
                </div>
              </div>
              <button
                class="btn btn-black w-100 py-2 mt-3"
                data-bs-toggle="modal"
                data-bs-target="#confirm-fdb-modal"
                onClick={() => ConfirmFeedback()}
              >
                {t("user_register.Confirm Feedback")}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal bg-blur" id="confirm-fdb-modal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content minh-unset" data-bs-dismiss="modal">
            <div class="alert-bubble-img">
              <img
                class="img-fluid"
                src="images/alert-msg-bubble.png"
                alt="ico"
              />
              <div class="cont mt-2">
                <h5 class="dark mt-4"> {t("alerts.THANK YOU!!!")}</h5>
                <p class="dark-txt fs-14">
                  {t("alerts.See you at the")} <br />
                  {t("alerts.next gift!!!")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Modal Popup Starts here --> */}
      <div class="modal bg-blur product-modal" id="free-gift-modal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content minh-unset" data-bs-dismiss="modal">
            <div class="product-wrap item-snippet">
              <div class="row mb-0">
                <div class="col-12">
                  <div class=" mb-3">
                    {/* <img class="ico" src="images/fun-ico.svg" alt="" />*/}
                    <h3> {t("alerts.Free gift you are about to receive")}</h3>
                  </div>
                </div>
                <GeneralElection
                  items={election}
                  indexs={19}
                  user={user && user}
                  loader={loader}
                  setLoader={setLoader}
                  bottom={"none"}
                />
                <div class="col-12 mt-4">
                  <button
                    class="btn btn-black w-100 py-2"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    <small>{t("Buttons.Go_Back")}</small>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Modal Popup Ends here -->
    <!-- Modal Popup Starts here --> */}
      <div class="modal bg-blur product-modal" id="business-modal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content minh-unset" data-bs-dismiss="modal">
            <div class="product-wrap item-snippet">
              <div class=" mb-3">
                {/* <img class="ico" src="images/fun-ico.svg" alt="" />*/}
                <h3> {t("alerts.This gift is given by")}</h3>
              </div>
              <div class="product-list">
                <div class="product-overflow">
                  <div class="prod-snip business">
                    <div class="img-wrap">
                      <img
                        class="img-fluid"
                        src="images/business-thumb.jpg"
                        alt="ico"
                      />
                    </div>
                    <div class="cont">
                      <div class="logo-sec">
                        <img
                          class="img-fluid"
                          src="images/logo-dummy.png"
                          alt="logo"
                        />
                      </div>
                      <h4 class="text-truncate">BUSINESS NAME</h4>
                      <div class="rating-sec">
                        <div class="rating">
                          <img
                            class="ico"
                            src="images/star-yellow.svg"
                            alt=""
                          />
                          <img
                            class="ico"
                            src="images/star-yellow.svg"
                            alt=""
                          />
                          <img
                            class="ico"
                            src="images/star-yellow.svg"
                            alt=""
                          />
                          <img
                            class="ico"
                            src="images/star-yellow.svg"
                            alt=""
                          />
                          <img
                            class="ico gray"
                            src="images/star-yellow.svg"
                            alt=""
                          />
                          <span>4.7 (20)</span>
                        </div>
                        <div class="share">
                          <a href="javascript:;" class="link">
                            <img
                              class="img-fluid"
                              src="images/heart-ico.svg"
                              alt=""
                            />
                          </a>
                          <a href="javascript:;" class="link">
                            <img
                              class="img-fluid"
                              src="images/share-ico.svg"
                              alt=""
                            />
                          </a>
                        </div>
                      </div>
                      <div class="motto">
                        <h5>Business motto !!!</h5>
                        <p class="h75-p px-0">
                          Business description Business descriptionBusiness
                          descriptionBusiness descriptionBusiness description
                          Business descriptionBusiness descriptionBusiness
                          descriptionBusiness description Business
                          descriptionBusiness descriptionBusiness
                          descriptionBusiness descriptionBusiness description
                          Business descriptionBusiness descriptionBusiness
                          descriptionBusiness description Business
                          descriptionBusiness descriptionBusiness
                          descriptionBusiness descriptionBusiness description
                          Business descriptionBusiness descriptionBusiness
                          description
                        </p>
                      </div>
                    </div>
                    <div class="shop-carousel">
                      <div class="img-wrap shop-img">
                        <span class="img-count">
                          <img src="images/camera-ico.svg" alt="" />3
                        </span>
                        <div class="img-cover owl-carousel owl-loaded owl-drag">
                          <div class="owl-stage-outer">
                            <div
                              class="owl-stage"
                              //   style="transform: translate3d(0px, 0px, 0px); transition: all 0s ease 0s; width: 1053px;"
                            >
                              <div
                                class="owl-item active"
                                style={{ width: 351 }}
                              >
                                <img
                                  class="img-fluid"
                                  src="images/shop-thumb-1.jpg"
                                  alt="Thumbnail"
                                />
                              </div>
                              <div class="owl-item" style={{ width: 351 }}>
                                <img
                                  class="img-fluid"
                                  src="images/shop-thumb-2.jpg"
                                  alt="Thumbnail"
                                />
                              </div>
                              <div class="owl-item" style={{ width: 351 }}>
                                <img
                                  class="img-fluid"
                                  src="images/shop-thumb-3.jpg"
                                  alt="Thumbnail"
                                />
                              </div>
                            </div>
                          </div>
                          <div class="owl-nav disabled">
                            <button
                              type="button"
                              role="presentation"
                              class="owl-prev"
                            >
                              <span aria-label="Previous">‹</span>
                            </button>
                            <button
                              type="button"
                              role="presentation"
                              class="owl-next"
                            >
                              <span aria-label="Next">›</span>
                            </button>
                          </div>
                          <div class="owl-dots disabled"></div>
                        </div>
                      </div>
                    </div>
                    <div class="map-sec">
                      <iframe
                        width="100%"
                        frameborder="0"
                        scrolling="no"
                        marginheight="0"
                        marginwidth="0"
                        src="https://www.openstreetmap.org/export/embed.html?bbox=103.7975953827845%2C1.2799377991199763%2C103.80660760507456%2C1.2872852075777674&amp;layer=mapnik"
                      ></iframe>
                      <button class="btn btn-black text-uppercase">
                        {t("Buttons.use_Address")}
                      </button>
                    </div>
                    <div class="shop-detail">
                      <div class="p-row">
                        <img src="images/tick-circle-ico.svg" alt="ico" />
                        <p>Business category</p>
                      </div>
                      <div class="p-row">
                        <img src="images/web-ico.svg" alt="ico" />
                        <p>
                          www.business.com{" "}
                          <a href="javascript:;" target="_blank">
                            {t("business_preview_screen.website")}
                          </a>
                        </p>
                      </div>
                      <div class="p-row">
                        <img src="images/call-ico.svg" alt="ico" />
                        <p>
                          +00 123 456 789
                          <a href="tel:+00 123 456 789">
                            {" "}
                            {t("business_preview_screen.Call")}
                          </a>
                        </p>
                      </div>
                      <div class="p-row">
                        <img src="images/clock-ico.svg" alt="ico" />
                        <p>
                          {t("business_preview_screen.closed")} 16:00{" "}
                          <a href="javascript:;">
                            {t("business_preview_screen.Details")}
                          </a>
                        </p>
                      </div>
                      <div class="rating-row">
                        <div class="rate">
                          <h2>4.7</h2>
                          <div class="rating">
                            <img
                              class="ico"
                              src="images/star-yellow.svg"
                              alt=""
                            />
                            <img
                              class="ico"
                              src="images/star-yellow.svg"
                              alt=""
                            />
                            <img
                              class="ico"
                              src="images/star-yellow.svg"
                              alt=""
                            />
                            <img
                              class="ico"
                              src="images/star-yellow.svg"
                              alt=""
                            />
                            <img
                              class="ico gray"
                              src="images/star-yellow.svg"
                              alt=""
                            />

                            <p>
                              {" "}
                              {t("Week_Days.from")} 20
                              {t("business_preview_screen.people")}
                            </p>
                          </div>
                        </div>
                        <h6>
                          <a href="javascript:;" class="view-all">
                            {t("business_preview_screen.feedback")}
                          </a>
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button class="btn btn-black w-100 text-uppercase mb-4">
                <img
                  class="img-fluid me-2"
                  src="images/message-ico.svg"
                  alt="ico"
                />
                <small>{t("Buttons.Contact_Business")}</small>
              </button>

              <div class="col-12 mt-4">
                <button
                  class="btn btn-black w-100 py-2"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <small>{t("Buttons.Go_Back")}</small>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Modal Popup Ends here -->
    <!-- Modal Popup Starts here --> */}
      <div class="modal bg-blur product-modal" id="gift-received-modal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content" data-bs-dismiss="modal">
            <div class="gift-rib">
              <a href="javascript:;" class="gift-ribbon-wrap">
                <img
                  class="img-fluid"
                  src="images/gift-ribbon.png"
                  alt="images"
                />
                <div class="gift-img">
                  <div class="img-wrap">
                    <img
                      src={
                        election?.gift_images[1]
                          ? election?.gift_images[1]?.picture
                          : "images/product-img.jpg"
                      }
                      alt="ProductName"
                    />
                    <span class="img-count">
                      <img class="ico" src="images/camera-ico.svg" alt="" />1
                    </span>
                  </div>
                  <span class="title text-truncate">
                    {election?.gift_title}
                  </span>
                  <span class="gift-title text-truncate text-center">
                    {t("alerts.YOUR FREE GIFT")}
                  </span>
                </div>
              </a>
              <p class="lead">
                {election?.business_details?.business_name}
                {t("alerts.confirmed that the gift has been given to you")}
              </p>
              <h4>{t("alerts.Confirm that you received the gift")}</h4>
            </div>
            <div class="btm-sec px-3 mb-4">
              <button
                class="btn btn-black py-2 w-100 mb-4"
                data-bs-toggle="modal"
                data-bs-target="#feedback-modal"
                onClick={() => reciveFreeGifts("received")}
              >
                {t("user_register.CONFIRM")}{" "}
              </button>
              <button
                class="btn btn-white py-2 w-100"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => reciveFreeGifts("not_received")}
              >
                {t("user_register.NO I DID NOT RECEIVE")}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Modal Popup Ends here -->
    <!-- Modal Popup Starts here --> */}
      <div class="modal bg-blur product-modal" id="confirm-address-modal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="gift-rib px-0">
              <h4 class="mt-0 mb-4">
                {t("user_register.Confirm your address")}
              </h4>
              <form action="#" class="confirm-address mb-5">
                <div class="form-group">
                  <input
                    type="text"
                    class="form-control"
                    placeholder={t("placeHolders.Ship to")}
                    value={location.state?.userProfile?.username}
                    required
                  />
                </div>
                <div class="form-group">
                  <input
                    type="text"
                    class="form-control mb-4"
                    placeholder={t("placeHolders.City")}
                    onChange={(text) => setCity(text.target.value)}
                    required
                  />
                </div>
                <div class="form-group">
                  <input
                    type="text"
                    class="form-control mb-4"
                    placeholder={t("placeHolders.Street Address")}
                    onChange={(text) => setStreet_address(text.target.value)}
                    required
                  />
                </div>
                <div class="form-group">
                  <input
                    type="text"
                    class="form-control mb-2"
                    placeholder={t("placeHolders.Street no")}
                    onChange={(text) => setStreetNO(text.target.value)}
                    required
                  />
                </div>
                <div class="form-group">
                  <input
                    type="text"
                    class="form-control mb-2"
                    placeholder={t("placeHolders.Zip_code")}
                    onChange={(text) => setZip_code(text.target.value)}
                    required
                  />
                </div>
                <div class="form-group mb-0">
                  <input
                    type="text"
                    class="form-control mb-2"
                    placeholder={t("placeHolders.Others")}
                    onChange={(text) => setOther(text.target.value)}
                    required
                  />
                </div>
              </form>
              <hr class="divider mb-4" />
              <h4>
                {election?.business_name}{" "}
                {t(
                  "user_register.will use this address to ship your free gift"
                )}{" "}
              </h4>
            </div>
            <div class="btm-sec px-3 mb-4">
              <button
                class="btn btn-black py-2 w-100 mb-3"
                data-bs-toggle="modal"
                data-bs-target="#check-confirm-address-modal"
              >
                {t("Buttons.CONTINUE")}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Modal Popup Ends here -->
    <!-- Modal Popup Starts here --> */}
      <div class="modal bg-blur product-modal" id="check-confirm-address-modal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content" data-bs-dismiss="modal">
            <div class="gift-rib px-0">
              <h4 class="mt-0 mb-4">{t("user_register.One more check!")}</h4>
              <form action="#" class="confirm-address mb-5">
                <h4 class="fw-300">{t("user_register.ADDRESS")}</h4>
                <div class="data-info">
                  <h4>{location.state.userProfile?.username}</h4>
                  <h4>{city}</h4>
                  <h4>{street_address + " " + streetNO}</h4>
                  <h4>{zip_code}</h4>
                  <h4>{other}</h4>
                </div>
                <button
                  class="btn btn-modify"
                  data-bs-toggle="modal"
                  data-bs-target="#confirm-address-modal"
                >
                  {t("user_register.MODIFY")}
                </button>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    checked={isSave}
                    onChange={() => {
                      setisSave(!isSave);
                    }}
                  />

                  <label class="form-check-label" for="defaultCheck1">
                    {t("user_register.Save address for other gift")}
                  </label>
                </div>
              </form>
              <hr class="divider mb-4" />
              <h4>
                {election?.business_name}
                {t(
                  "user_register.will use this address to ship your free gift"
                )}{" "}
              </h4>
            </div>
            <div class="btm-sec mb-3">
              <div class="alert-sec">
                <img
                  class="alert-ico img-fluid"
                  src="images/alert-finger-ico.png"
                  alt="ico"
                />
                <p class="text-danger">
                  {t(
                    "user_register.Before to confirm your address make sure it is correct. It will not be possible to modify it later"
                  )}
                </p>
              </div>
              <button
                class="btn btn-black py-2 w-100 mb-3"
                data-bs-toggle="modal"
                data-bs-target="#address-final-modal"
                onClick={() => CollectAddAddress()}
              >
                {t("user_register.CONFIRM ADDRESS")}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Modal Popup Ends here -->
    <!-- Modal Popup Starts here --> */}
      <div class="modal bg-blur" id="address-final-modal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content minh-unset" data-bs-dismiss="modal">
            <div class="alert-bubble-img">
              <img
                class="img-fluid"
                src="images/alert-msg-bubble.png"
                alt="ico"
              />
              <div class="cont">
                <h5 class="dark">{t("alerts.THANK YOU!!!")}</h5>
                <p class="dark-txt fs-14">
                  {t("alerts.Your address has been sent to")}{" "}
                  {election?.business_name}
                </p>
              </div>
            </div>
            <div class="button-btm-sec">
              <div class="btm-sec">
                <div class="alert-sec mb-0">
                  <img
                    class="alert-ico img-fluid"
                    src="images/alert-finger-ico.png"
                    alt="ico"
                  />
                  <p class="text-danger">
                    {t("alerts.Give few days to do the shipment.")}
                    <br />
                    {t("alerts.Check progress at the:")}
                    <br />
                    {t("alerts.STATUS OF SHIPMENT")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Modal Popup Ends here -->
    <!-- Modal Popup Starts here --> */}
      <div class="modal bg-blur" id="shipped-status-modal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content minh-unset" data-bs-dismiss="modal">
            <div class="gift-rib minh-unset">
              <h4 class="text-center mb-3">{t("alerts.STATUS OF SHIPMENT")}</h4>
              <hr class="divider my-4" />
            </div>
            <div class="alert-bubble-img">
              <img
                class="img-fluid"
                src="images/alert-msg-bubble.png"
                alt="ico"
              />
              <div class="cont">
                <h5 class="dark">{t("user_register.SHIPPED")}</h5>
                <p class="dark-txt fs-14 mt-3">
                  {t("user_register.Truck number")}
                  <br />
                  {shippedStatus?.shippedStatus
                    ? shippedStatus?.track_number
                    : "xxxx"}
                </p>
              </div>
            </div>
            <div class="button-btm-sec">
              <a
                href={shippedStatus?.track_web_link}
                target="_blank"
                class="btn btn-white w-100 py-2"
              >
                {t("user_register.GO TO TRUCKING WEB")}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="modal bg-blur" id="check-mail-modal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content minh-unset" data-bs-dismiss="modal">
            <div class="alert-bubble-img">
              <img
                class="img-fluid"
                src="images/alert-msg-bubble.png"
                alt="ico"
              />
              <div class="cont">
                <h5 class="dark">{t("user_register.Almost there!")}</h5>
                <p class="dark-txt fs-14">
                  {t("user_register.Check your email")} <br />
                  {t("user_register.or")}
                  <br />
                  {t("user_register.Click on the link below")}
                </p>
              </div>
            </div>
            <div class="button-btm-sec">
              <button
                class="btn btn-black py-2 w-100"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                {t("user_register.GO TO LINK")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
