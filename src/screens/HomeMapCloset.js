import React, { useEffect, useState } from "react";

import { useNavigate, useLocation } from "react-router-dom";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import mapboxgl from "mapbox-gl";
import yellow from "../images/yellow-arrow.svg";
import close from "../images/close-x.svg";
import gps from "../images/gps-ico.svg";
import filter from "../images/filter-ico.svg";
import {
  getUserData,
  getUserLatitude,
  getUserLongitude,
  storeUserLatitude,
  storeUserLongitude,
  getBoundsForPoints,
} from "../Functions/Functions";

import { useTranslation } from "react-i18next";
import "../languages/i18n";
import API from "../services/ApiLists";
import { ApiCall } from "../services/ApiCall";

import BusinessBox from "../components/BusinessBox";
import Footer from "../components/Footer"; 
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

export default function HomeMap() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const [categories, setCategories] = useState();
  const [subcategories, setsubCategories] = useState();
  const [selectCategories, setSelectCategories] = useState();
  const [loader, setLoader] = useState(false);

  const [show, setshow] = React.useState(true);
  const [user, setUser] = useState();
  const [menuShow, setMenuShow] = useState(false);
  const [menuShowCategory, setMenuShowCategory] = useState(false);

  const [searchShow, setsearchShow] = useState(false);
  const [businessPlaces, setbusinessPlaces] = useState(
    location.state?.businessPlaces
  );
  const [viewport, setViewport] = React.useState({
    latitude: parseFloat(location.state.latitude),
    longitude: parseFloat(location.state.longitude),
    zoom: 12,
  });
  const [latitude, setLatitude] = useState("34.0151");
  const [longitude, setLongitude] = useState("71.5249");

  useEffect(async () => {
    const userData = await getUserData();
    if (userData) {
      setUser(userData);
    }
  }, []);

  useEffect(async () => {
    setLoader(true);
    const userData = await getUserData();
    if (userData) {
      setUser(userData);
      getGeoInfo(userData);
      CateforyList(userData);
    }
  }, []);

  useEffect(() => {
    if (show) {
      setViewport({
        ...viewport,
        latitude: viewport.latitude - 0.5,
        height: 910,
        width: 700,
        // zoom: 12,
        maxPitch: 85,
        maxZoom: 24,
        minPitch: 0,
        minZoom: 0,
        pitch: 0,
        transitionDuration: 300,
        transitionInterruption: 1,
        zoom: 7.729598339374477,
      });
    } else {
      setViewport({
        ...viewport,
        latitude: viewport.latitude + 0.5,
        height: 910,
        width: 700,
        // zoom: 12,
        maxPitch: 85,
        maxZoom: 24,
        minPitch: 0,
        minZoom: 0,
        pitch: 0,
        transitionDuration: 300,
        transitionInterruption: 1,
        zoom: 7.729598339374477,
      });
    }
    console.log("viewport useefect : ", viewport);
  }, [show]);

  function CateforyList(user) {
    var formData = new FormData();

    ApiCall("Post", API.categoryBusinessListApi, formData, {
      Authorization: `Bearer ` + user.access_token,
      Accept: "application/json",
    })
      .catch((error) => {
        console.log("erorr reponse", error);
      })
      .then((resp) => {
        setCategories(resp.data.data);
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
      zoom: 6,
    });
    BusinessList(userData, userlatitude, userlongitude);
  };

  function BusinessList(user, latitude, longitude, filterShow) {
    setLoader(true);
    var formData = new FormData();
    if (filterShow == "category") {
      formData.append("category", selectCategories);
    }

    // formData.append("user_latitude", `${34.0066304}`);
    // formData.append("user_longitude", `${71.5620352}`);
    formData.append("user_latitude", `${latitude}`);
    formData.append("user_longitude", `${longitude}`);
    formData.append("user_id", user?.user_id);
    formData.append("batch_number", 0);
    formData.append("list_ids", "0");

    ApiCall("Post", API.MapBusinessApi, formData, {
      Authorization: `Bearer ` + user.access_token,
      Accept: "application/json",
    })
      .catch((error) => {
        console.log("erorr reponse", error);
        setLoader(false);
        //   reject(error.response);
      })
      .then((resp) => {
        setLoader(false);
        setMenuShow(false);
        setMenuShowCategory(false);
        const bounds = getBoundsForPoints(
          resp.data.data,
          longitude,
          latitude,
          "business"
        );
        console.log("bounds", bounds, "resp", resp);
        setViewport({
          ...bounds,
        });
        setbusinessPlaces(resp.data.data);
      });
  }

  function userCurrentLocationStartSoonFtn() {
    console.log("current logcation : ");
    setsearchShow(false);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        // console.log(
        //   "user current location reload elections or shops and reset the view on user",
        //   position
        // );
        BusinessList(user, position.coords.latitude, position.coords.longitude);
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

  return (
    <div class="container-fluid">
      <section class="content-sec row mt-0 pb-0 ">
        <div class="map-wrap fullscreen">
          <ReactMapGL
            touchAction="pan-y"
            mapStyle="mapbox://styles/mapbox/streets-v10"
            mapboxApiAccessToken="pk.eyJ1IjoieGFpbmlraGFuMjAiLCJhIjoiY2tkdmswZjU5MXU4YjJ3cGJkYmpleGhnciJ9.Hn_L5hXdjR4zALA01O_aqQ"
            {...viewport}
            width="100%"
            height={!show ? "100%" : "100%"}
            onViewportChange={(viewport) => {
              console.log("viewport mapcloset:", viewport);
              setViewport(viewport);
            }}
            onTouchMove={() => setsearchShow(true)}
          >
            <Marker
              anchor="center"
              latitude={parseFloat(location.state.latitude)}
              longitude={parseFloat(location.state.longitude)}
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
            {businessPlaces?.map((item, index) => {
              return (
                <Marker
                  anchor="center"
                  key={index}
                  latitude={parseFloat(item.latitude)}
                  longitude={parseFloat(item.longitude)}
                  draggable
                  className="business-pin-marker"
                >
                  <button
                    class="btn btn-link"
                    onClick={() => {
                      navigate("/businessDetail", {
                        state: {
                          business: item,
                        },
                      });
                    }}
                  >
                    <img
                      class="img-fluid"
                      src={"images/businessPin.png"}
                      width="20px"
                      height="20px"
                      alt=""
                    />
                  </button>
                </Marker>
              );
            })}
          </ReactMapGL>
          <div class="map-head">
            <button class="btn btn-back" onClick={() => navigate(-1)}>
              <img src={yellow} alt="ico" />
            </button>

            {searchShow && (
              <button
                class="btn btn-black map-btn-search align-center text-uppercase  m-0"
                onClick={() => {
                  setsearchShow(false);
                }}
              >
                {t("Buttons.Search in this area")}
              </button>
            )}

            <button
              class="btn btn-back btn-filter"
              onClick={() => setMenuShow(!menuShow)}
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
                    }}
                  >
                    {t("filter.Reset All")}
                  </a>
                </div>
                <div class="filter-cont">
                  {!menuShowCategory &&
                    categories?.map((item, index) => {
                      return (
                        <>
                          <a
                            key={index}
                            class="by-cate"
                            style={{
                              fontWeight:
                                selectCategories == item.id ? "bold" : "normal",
                            }}
                            onClick={() => {
                              setSelectCategories(item.id);
                              setMenuShowCategory(true);
                              setsubCategories(item.sub_categories);
                            }}
                          >
                            {item?.name}
                            <img src="images/yellow-arrow.svg" alt="ico" />
                          </a>
                        </>
                      );
                    })}
                </div>
                <div class="filter-cont">
                  {menuShowCategory &&
                    subcategories &&
                    subcategories?.map((item, index) => {
                      return (
                        <>
                          <a
                            class="by-cate"
                            style={{
                              fontWeight:
                                selectCategories == item.id ? "bold" : "normal",
                            }}
                            onClick={() => {
                              setSelectCategories(item.id);
                              BusinessList(
                                user,
                                latitude,
                                longitude,
                                "category"
                              );
                            }}
                          >
                            {item?.name}
                            <img src="images/yellow-arrow.svg" alt="ico" />
                          </a>
                        </>
                      );
                    })}
                </div>
                {/* <div class="filter-ftr border-0">
                  <a
                    onClick={() =>
                      BusinessList(user, latitude, longitude, "category")
                    }
                  >
                    {t("filter.Apply Filter")}
                  </a>
                </div> */}
              </div>
            )}
          </div>
        </div>

        <div class={`product-wrap overlap mb-5 ${!show && "d-flex"} `}>
          {/* {searchShow && (
            <button
              class="btn btn-black map-btn-search align-end text-uppercase business-places"
              onClick={() => {
                setsearchShow(false);
              }}
            >
              {t("Buttons.Search in this area")}
            </button>
          )} */}
          <button
            class={`"btn gps-btn ${!show ? "position-absolute" : ""}`}
            onClick={() =>
              setViewport({
                latitude: parseFloat(
                  location.state.latitude - (show ? 0.5 : 0)
                ),
                longitude: parseFloat(location.state.longitude),
                // zoom: 12,
                zoom: 7.729598339374477,
              })
            }
          >
            <img class="img-fluid" src={gps} alt="ico" />
          </button>
          <button class="btn btn-sh" onClick={() => setshow(!show)}>
            {show ? t("Buttons.Hide") : t("Buttons.Show")}
          </button>
          {/* <input
            class="btn btn-sh"
            value="Hide"
            type="button"
            id="businessBox"
            // onClick="businessBox()"
          /> */}

          {/* {show && ( */}
          <div
            className={show ? "fadeIn row my-3" : "fadeOut row my-3"}
            // className="row my-3 show"
            id="BoxItem"
          >
            <div class={show ? "product-list " : "product-list fadeOut "}>
              {/* {show && ( */}
              <div class="product-overflow">
                <div class="product-list desk-justify-center map-product-list">
                  {businessPlaces?.map((item, index) => {
                    return (
                      <BusinessBox
                        item={item}
                        index={index}
                        user={user && user}
                      />
                    );
                  })}
                </div>
              </div>
              {/* )} */}
            </div>
          </div>
          {/* )} */}
        </div>
      </section>
      {show && <Footer user={user && user} />}
    </div>
  );
}
