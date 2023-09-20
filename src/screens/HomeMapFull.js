import React, { useEffect, useState } from "react";

import { useNavigate, Link, useLocation } from "react-router-dom";
import ReactMapGL, { Marker, WebMercatorViewport } from "react-map-gl";

import Loader from "../components/Loader";
import ElectionBox from "../components/EelectionBox";
import { useTranslation } from "react-i18next";
import "../languages/i18n";

import API from "../services/ApiLists";
import { ApiCall } from "../services/ApiCall";

import blackpin from "../images/black.png";
import yellowpin from "../images/yellow.png";
import vote from "../images/vote-ico.svg";
import yellow from "../images/yellow-arrow.svg";
import filter from "../images/filter-ico.svg";
import close from "../images/close-x.svg";

import {
  getUserData,
  getUserLatitude,
  getUserLongitude,
  storeUserLatitude,
  storeUserLongitude,
  getBoundsForPoints,
} from "../Functions/Functions";

// import ReactSimplyCarousel from "react-simply-carousel";
import { Carousel } from "react-responsive-carousel";
import * as geolib from "geolib";

export default function HomeMap() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState();
  const [selectCategories, setSelectCategories] = useState();
  const [startSoon, setStartSoon] = useState();
  const [startSoonFilter, setStartSoonFilter] = useState();
  const [loader, setLoader] = useState(false);
  const [started, setStarted] = useState(true);
  const [notStarted, setNntStarted] = useState(true);
  const [shipped, setShipped] = useState(true);
  const [delivery, setDelivery] = useState(true);
  const [selfCollection, setSelfCollection] = useState(true);
  const [menuShowCategory, setMenuShowCategory] = useState(false);
  const [searchShow, setsearchShow] = useState(false);
  const [menuShow, setMenuShow] = useState(false);
  const [viewport, setViewport] = React.useState({
    latitude: 30.3753,
    longitude: 69.3451,
    zoom: 10,
  });
  const [isfilter, setIsFilter] = useState("");
  const [position, setPosition] = useState();
  const [latitude, setLatitude] = useState("34.0151");
  const [longitude, setLongitude] = useState("71.5249");
  const [user, setUser] = useState();
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [locationID, setLocationID] = useState();

  const [electionStatus, setElectionStatus] = useState([
    "started",
    "not_started",
  ]);
  const [deliveryOption, setDeliveryOption] = useState(["1", "2", "3"]);

  useEffect(async () => {
    setLoader(true);
    const userData = await getUserData();
    if (userData) {
      setUser(userData);
      getGeoInfo(userData);
      CateforyList(userData);
    }
  }, []);
  function CateforyList(user) {
    var formData = new FormData();

    ApiCall("Post", API.categoryListApi, formData, {
      Authorization: `Bearer ` + user.access_token,
      Accept: "application/json",
    })
      .catch((error) => {
        console.log("erorr reponse", error);
      })
      .then((resp) => {
        setCategories(resp.data.data);
        // console.log("resp.data.data catgeiurs resp.data.data", resp.data.data);
      });
  }
  const getGeoInfo = async (userData) => {
    const userlongitude = await getUserLongitude();
    const userlatitude = await getUserLatitude();
    setLongitude(userlongitude);
    setLatitude(userlatitude);

    setViewport({
      latitude: userlatitude,
      longitude: userlongitude,

      // height: 910,
      // width: 700,
      // maxPitch: 85,
      // // maxZoom: 4,
      // minPitch: 0,
      // minZoom: 0,
      // pitch: 40,
      // transitionDuration: 200,
      // transitionInterruption: 1,
      zoom: 10,
    });
    ElectionsList(userData, userlatitude, userlongitude);
  };

  function ElectionsList(user, latitude, longitude, filterShow) {
    setLoader(true);
    var formData = new FormData();
    if (filterShow == "category") {
      formData.append("category", selectCategories);
    }
    if (filterShow == "noncategory") {
      if (electionStatus) {
        formData.append("election_status", electionStatus.toString());
      }

      if (deliveryOption)
        formData.append("delivery_option", deliveryOption.toString());
    }
    // formData.append("user_latitude", `${"34.0066304"}`);
    // formData.append("user_longitude", `${"71.5620352"}`);
    formData.append("user_latitude", `${latitude}`);
    formData.append("user_longitude", `${longitude}`);
    formData.append("user_id", user?.user_id);
    formData.append("batch_number", 0);
    formData.append("list_ids", "0");

    ApiCall("Post", API.MapElectionsApi, formData, {
      Authorization: `Bearer ` + user.access_token,
      Accept: "application/json",
    })
      .catch((error) => {
        console.log("erorr reponse", error);
        setLoader(false);
        //   reject(error.response);
      })
      .then((resp) => {
        console.log("formDataformData", formData);
        if (resp.data.data?.length > 0) {
          const bounds = getBoundsForPoints(
            resp.data.data,
            longitude,
            latitude
          );

          setViewport({
            ...bounds,
          });
        }

        setLoader(false);
        setMenuShowCategory(false);
        setMenuShow(false);
        setStartSoon(resp.data.data);
        setStartSoonFilter(resp.data.data);
      });
  }

  function userCurrentLocationStartSoonFtn() {
    setsearchShow(false);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        // console.log(
        //   "user current location reload elections or shops and reset the view on user",
        //   position
        // );
        ElectionsList(
          user,
          position.coords.latitude,
          position.coords.longitude
        );
        storeUserLatitude(position.coords.latitude);
        storeUserLongitude(position.coords.longitude);
        setViewport({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          zoom: 12,
        });
      });
    }
  }

  function Filter(text) {
    console.log(text);
    if (text == "Not Started" || text == "Started") {
      const newData = startSoonFilter.filter((item) => {
        const itemData = `${item.election_status.toUpperCase()}`;
        const textData = text.toUpperCase();

        return itemData != textData && item;
      });
      setStartSoon(newData);
    } else {
      setStartSoon(startSoonFilter);
    }
    // if (text == "Started" && notStarted) {
    //   setNntStarted(false);
    // }
    // if (text == "Started" && value == notStarted) {
    //   setStartSoon(startSoonFilter);
    // } else if (text == "Not Started" && value == started) {
    //   setStartSoon(startSoonFilter);
    // } else {
    //   const newData = startSoonFilter.filter((item) => {
    //     const itemData = `${item.election_status.toUpperCase()}`;
    //     const textData = text.toUpperCase();

    //     return !value
    //       ? itemData == textData && item
    //       : itemData != textData && item;
    //   });

    //   if (value && newData.length == 0) {
    //     setStartSoon(startSoonFilter);
    //   } else {
    //     setStartSoon(newData);
    //   }
    // }
  }
  // console.log("viewport?.latitude", viewport, longitude, latitude);
  return (
    <div class="container-fluid">
      <section class="content-sec row mt-0 pb-0">
        {loader && <Loader />}
        <div class="map-wrap fullscreen">
          {viewport?.longitude && (
            <ReactMapGL
              mapStyle="mapbox://styles/mapbox/streets-v10"
              mapboxApiAccessToken="pk.eyJ1IjoieGFpbmlraGFuMjAiLCJhIjoiY2tkdmswZjU5MXU4YjJ3cGJkYmpleGhnciJ9.Hn_L5hXdjR4zALA01O_aqQ"
              {...viewport}
              width="100%"
              height="100%"
              style={{ padding: 0 }}
              onTouchMove={() => setsearchShow(true)}
              onViewportChange={(viewport) => {
                setViewport(viewport);
                // setsearchShow(true);
                // console.log("viewport changex", viewport);
              }}
            >
              <Marker
                anchor="center"
                latitude={parseFloat(latitude ? latitude : 30.3753)}
                longitude={parseFloat(longitude ? longitude : 69.3451)}
                draggable
                className="user-icon-marker"
              >
                <button class="btn btn-link">
                  <img
                    class="img-fluid user-map-img"
                    src={user?.picture ? user?.picture : "images/VFAlien.png"}
                    width="30px"
                    height="30px"
                    alt=""
                  />
                </button>
              </Marker>
              {startSoon?.map((item, index) => {
                return (
                  <Marker
                    anchor="center"
                    index={index}
                    latitude={parseFloat(item.business_details.latitude)}
                    longitude={parseFloat(item.business_details.longitude)}
                    className="election-pin-marker"
                  >
                    <button
                      class="btn btn-link"
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
                        class="img-fluid img-fit"
                        src={
                          item?.election_status == "Not Started"
                            ? blackpin
                            : yellowpin
                        }
                        width={locationID == item.election_id ? "40px" : "20px"}
                        height={
                          locationID == item.election_id ? "40px" : "20px"
                        }
                        alt=""
                      />
                    </button>
                  </Marker>
                );
              })}
            </ReactMapGL>
          )}
          <div class="map-head">
            <Link class="btn btn-back" to={"/home"}>
              <img src={yellow} alt="ico" />
            </Link>
            <button
              class="btn btn-yellow m-0"
              style={{ opacity: isfilter == "Started" ? 0.3 : 1 }}
              onClick={() => {
                setStarted(!started);
                if (isfilter == "Started") {
                  setIsFilter("");
                  Filter("");
                } else {
                  setIsFilter("Started");
                  Filter("Started");
                }
              }}
            >
              <img src={vote} alt="ico" />
              {t("filter.Started")}
            </button>
            <button
              class="btn btn-yellow black m-0"
              style={{ opacity: isfilter == "Not Started" ? 0.3 : 1 }}
              onClick={() => {
                setNntStarted(!notStarted);
                if (isfilter == "Not Started") {
                  setIsFilter("");
                  Filter("");
                } else {
                  setIsFilter("Not Started");
                  Filter("Not Started");
                }
              }}
            >
              {t("election.Not Started")}
            </button>
            <button
              class="btn btn-back btn-filter"
              onClick={() => {
                setMenuShow(!menuShow);
              }}
            >
              <img src={filter} alt="ico" />
            </button>
            {menuShow && (
              <div class="filter-sidebar show">
                <div class="filter-hdr">
                  <div class="head">
                    <button
                      class="btn close"
                      onClick={() => {
                        if (menuShowCategory) {
                          setMenuShowCategory(false);
                        } else setMenuShow(!menuShow);
                      }}
                    >
                      <img src="images/close-ico.svg" alt="" />
                    </button>
                    <h4>{t("filter.Filter")}</h4>
                  </div>
                  <a
                    onClick={() => {
                      userCurrentLocationStartSoonFtn();
                      setMenuShow(!menuShow);
                      setSelectCategories();
                      setElectionStatus();
                      // setdelivery();
                    }}
                  >
                    {t("filter.Reset All")}
                  </a>
                </div>
                <div class="filter-cont">
                  <a
                    class="by-cate"
                    onClick={() => setMenuShowCategory(!menuShowCategory)}
                  >
                    {t("filter.Filter by Category")}
                    <img
                      src="images/yellow-arrow.svg"
                      className={menuShowCategory ? "rotation" : ""}
                      alt="ico"
                    />
                  </a>
                  {menuShowCategory ? (
                    categories?.map((item, index) => {
                      return (
                        index > 2 && (
                          <a
                            key={index}
                            class="by-cate margin-category"
                            style={{
                              fontWeight:
                                selectCategories == item.category_id
                                  ? "bold"
                                  : "normal",
                            }}
                            onClick={() => {
                              setSelectCategories(item.category_id);
                              ElectionsList(
                                user,
                                latitude,
                                longitude,
                                "category"
                              );
                            }}
                          >
                            {item.name}
                            <img src="images/yellow-arrow.svg" alt="ico" />
                          </a>
                        )
                      );
                    })
                  ) : (
                    <form>
                      <div class="group">
                        <h5>{t("filter.Election Status")}</h5>
                        <div class="form-check mb-2 p-0">
                          {/* <input
                            class={`form-check-input ${
                              electionStatus == 1 ? "checked" : ""
                            }`}
                            type="radio"
                            name="status"
                            checked={electionStatus == 1 ? true : false}
                            onChange={() => {
                              setElectionStatus(1);
                            }}
                          /> */}
                          <label class="switch2">
                            <input
                              type="checkbox"
                              checked={started}
                              onClick={() => {
                                setStarted(!started);
                                if (!started) {
                                  setElectionStatus([
                                    ...electionStatus,
                                    "started",
                                  ]);
                                } else {
                                  const result = electionStatus.filter(
                                    (itemID) => itemID != "started"
                                  );
                                  setElectionStatus(result);
                                }
                                if (isfilter == "Started") {
                                  setIsFilter("");
                                  Filter("");
                                } else {
                                  // setStarted(true);
                                  setIsFilter("Started");
                                  Filter("Started");
                                }
                              }}
                            />
                            <span class="slider round"></span>
                          </label>
                          <label class="form-check-label" for="">
                            {t("filter.Started")}
                          </label>
                        </div>
                        <div class="form-check p-0">
                          {/* <input
                            class={`form-check-input ${
                              electionStatus == 2 ? "checked" : ""
                            }`}
                            type="radio"
                            name="status"
                            checked={electionStatus == 2 ? true : false}
                            onChange={() => {
                              setElectionStatus(2);
                            }}
                          /> */}

                          <label class="switch2">
                            <input
                              type="checkbox"
                              checked={notStarted}
                              onClick={() => {
                                setNntStarted(!notStarted);
                                if (!notStarted) {
                                  setElectionStatus([
                                    ...electionStatus,
                                    "not_started",
                                  ]);
                                } else {
                                  const result = electionStatus.filter(
                                    (itemID) => itemID != "not_started"
                                  );
                                  setElectionStatus(result);
                                }
                                if (isfilter == "Not Started") {
                                  setIsFilter("");
                                  Filter("");
                                } else {
                                  setIsFilter("Not Started");
                                  Filter("Not Started");
                                }
                              }}
                            />
                            <span class="slider round"></span>
                          </label>

                          <label class="form-check-label" for="">
                            {t("filter.Not Started")}
                          </label>
                        </div>
                      </div>
                      <div class="group">
                        <h5>{t("filter.Delivery Option")}</h5>
                        <div class="form-check mb-2">
                          <input
                            class={`form-check-input ${shipped ? "" : ""}`}
                            type="radio"
                            checked={shipped ? true : false}
                            onClick={() => {
                              setShipped(!shipped);
                              if (!shipped) {
                                setDeliveryOption([...deliveryOption, "1"]);
                              } else {
                                const result = deliveryOption.filter(
                                  (itemID) => itemID != "1"
                                );
                                setDeliveryOption(result);
                              }
                            }}
                          />

                          <label class="form-check-label" for="">
                            {t("filter.Shipped")}
                          </label>
                        </div>
                        <div class="form-check">
                          <input
                            class={`form-check-input ${delivery ? "" : ""}`}
                            type="radio"
                            checked={delivery ? true : false}
                            onClick={() => {
                              setDelivery(!delivery);
                              if (!delivery) {
                                setDeliveryOption([...deliveryOption, "2"]);
                              } else {
                                const result = deliveryOption.filter(
                                  (itemID) => itemID != "2"
                                );
                                setDeliveryOption(result);
                              }
                            }}
                          />

                          <label class="form-check-label" for="">
                            {t("filter.On-line delivery")}
                          </label>
                        </div>
                        <div class="form-check">
                          <input
                            class={`form-check-input ${
                              selfCollection ? "" : ""
                            }`}
                            type="radio"
                            checked={selfCollection ? true : false}
                            onClick={() => {
                              setSelfCollection(!selfCollection);
                              if (!selfCollection) {
                                setDeliveryOption([...deliveryOption, "3"]);
                              } else {
                                const result = deliveryOption.filter(
                                  (itemID) => itemID != "3"
                                );
                                setDeliveryOption(result);
                              }
                            }}
                          />

                          <label class="form-check-label" for="">
                            {t("filter.Self Collection at the place")}
                          </label>
                        </div>
                      </div>
                      {/* <div class="group border-bottom-0">
                      <h5>{t("filter.Distance From you")}</h5>
                      <div class="range-blk">
                        <span>5 km</span>
                        <span class="right">{t("filter.All World")}</span>
                        <input
                          type="range"
                          class="form-range"
                          id="customRange"
                        />
                      </div>
                    </div> */}
                    </form>
                  )}
                </div>
                {!menuShowCategory && (
                  <div class="filter-ftr border-0">
                    <a
                      onClick={() =>
                        ElectionsList(
                          user,
                          latitude,
                          longitude,
                          menuShowCategory ? "category" : "noncategory"
                        )
                      }
                    >
                      {t("filter.Apply Filter")}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div class="product-wrap overlap">
          <div className="d-flex justify-content-between">
            <button
              class="btn gps-btn my-2"
              onClick={() => userCurrentLocationStartSoonFtn()}
            >
              <img class="img-fluid" src={"images/gps-ico.svg"} alt="ico" />
            </button>
            {searchShow && (
              <button
                class="btn btn-black map-btn-search align-end text-uppercase"
                onClick={() => {
                  setsearchShow(false);
                  ElectionsList(user, viewport?.latitude, viewport?.longitude);
                  // console.log(
                  //   "You are ",
                  //   geolib.getDistance(
                  //     { latitude, longitude },
                  //     {
                  //       latitude: viewport?.latitude,
                  //       longitude: viewport?.longitude,
                  //     }
                  //   ),
                  //   "meters away from 51.525, 7.4575"
                  // );
                }}
              >
                {t("Buttons.Search in this area")}
              </button>
            )}
          </div>
          <div class="row">
            <div class="product-list pb-4">
              <div class="product-overflow">
                {startSoon?.map((item, index) => {
                  return (
                    <ElectionBox
                      item={item}
                      index={index}
                      user={user && user}
                      loader={loader}
                      setLoader={setLoader}
                      HomeFtn={() => {}}
                      mapClickftn={() => setLocationID(item.election_id)}
                      mapClick={true}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
