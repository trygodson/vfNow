import * as React from "react";
import ReactMapGL, { Marker } from "react-map-gl";

import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getBoundsForPoints } from "../Functions/Functions";
import "../languages/i18n";
import { CopyToClipboard } from "react-copy-to-clipboard";

export default function Map() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const [viewport, setViewport] = React.useState({
    latitude: location?.state?.userlatitude
      ? location?.state?.userlatitude
      : location.state?.business_details?.latitude,
    longitude: location?.state?.userlongitude
      ? location?.state?.userlongitude
      : location.state?.business_details?.longitude,
    zoom: 9,
  });

  // React.useEffect(() => {
  //   const bounds = getBoundsForPoints(
  //     [
  //       {
  //         latitude: location.state?.business_details?.latitude,
  //         longitude: location.state?.business_details?.longitude,
  //       },
  //     ],
  //     location?.state?.userlatitude
  //       ? location?.state?.userlatitude
  //       : location.state?.business_details?.latitude,
  //     location?.state?.userlongitude
  //       ? location?.state?.userlongitude
  //       : location.state?.business_details?.longitude
  //   );
  //   console.log("bounds", bounds, "resp", resp);
  //   setViewport({
  //     ...bounds,
  //   });
  // }, []);
  // console.log(location?.state, "location?.state");
  // function ClipBoardFtn() {
  //   navigator.clipboard.writeText(
  //     location.state?.business_details.street_address +
  //       " " +
  //       location.state?.business_details.zip_code +
  //       " " +
  //       location.state?.business_details.city +
  //       " " +
  //       location.state?.business_details.region
  //   );
  // }

  return (
    <div class="container-fluid">
      {/* <!-- Content Section Starts here --> */}
      <section class="content-sec row mt-0 pb-0">
        {/* <!-- Map Wrap Starts here --> */}
        <div class="map-wrap fullscreen">
          <ReactMapGL
            mapStyle="mapbox://styles/mapbox/streets-v10"
            mapboxApiAccessToken="pk.eyJ1IjoieGFpbmlraGFuMjAiLCJhIjoiY2tkdmswZjU5MXU4YjJ3cGJkYmpleGhnciJ9.Hn_L5hXdjR4zALA01O_aqQ"
            {...viewport}
            width="100%"
            height="100%"
            onViewportChange={(viewport) => {
              setViewport(viewport);
            }}
            touchAction="pan-y"
          >
            <Marker
              latitude={
                location.state?.business_details?.latitude
                  ? parseFloat(location.state?.business_details?.latitude)
                  : 34.0151
              }
              longitude={
                location.state?.business_details?.longitude
                  ? parseFloat(location.state?.business_details?.longitude)
                  : 71.5249
              }
              anchor="center"
              className="business-pin-marker"
              draggable
            >
              <div class="map-location-contain">
                <div class="map-location-wrap">
                  <div class="location-logo">
                    <img
                      src={location.state?.business_details?.avatar}
                      class="location-logo-img"
                    />
                  </div>
                  <div class="location-content">
                    <h4> {location.state?.business_details?.business_name}</h4>
                    <p>
                      {location.state?.business_details.street_address + " "}

                      <br />
                      {location.state?.business_details.city +
                        " " +
                        location.state?.business_details.region}
                    </p>
                  </div>
                </div>
              </div>
              <button class="btn btn-link">
                <img
                  class="img-fluid"
                  src={"images/businessPin.png"}
                  width="20px"
                  height="20px"
                  alt=""
                />
              </button>
            </Marker>

            <Marker
              latitude={
                location.state?.userlatitude
                  ? parseFloat(location.state?.userlatitude)
                  : 34.0151
              }
              longitude={
                location.state?.userlongitude
                  ? parseFloat(location.state?.userlongitude)
                  : 71.5249
              }
              anchor="center"
              className="user-icon-marker"
              draggable
            >
              <button class="btn btn-link map-btn">
                <img
                  class="img-fluid user-map-img"
                  src={
                    location.state?.user?.picture
                      ? location.state?.user?.picture
                      : "images/VFAlien.png"
                  }
                  width="30px"
                  height="30px"
                  alt=""
                />
              </button>
            </Marker>
          </ReactMapGL>
          <div class="map-head">
            <button class="btn btn-back" onClick={() => navigate(-1)}>
              <img
                class="img-white img-fluid"
                src="images/yellow-arrow.svg"
                alt="ico"
              />
            </button>
          </div>
          <div class="map-btm">
            <button
              class="btn gps-btn"
              onClick={() =>
                setViewport({
                  latitude: location?.state?.userlatitude,
                  longitude: location?.state?.userlongitude,
                  zoom: 8,
                })
              }
            >
              <img
                class="img-white img-fluid"
                src="images/gps-ico.svg"
                alt="ico"
              />
            </button>
            <div class="btn-sec">
              <button class="btn btn-black fs-14 mb-4">
                {t("Buttons.Contact")}
              </button>
              <CopyToClipboard
                text={
                  location.state?.business_details.street_address +
                  " " +
                  location.state?.business_details.zip_code +
                  " " +
                  location.state?.business_details.city +
                  " " +
                  location.state?.business_details.region
                }
                onCopy={() => console.log("Copied!")}
              >
                <button
                  class="btn btn-black fs-14 m-0"
                  data-bs-toggle="modal"
                  data-bs-target="#copy-address"
                  // onClick={() => ClipBoardFtn()}
                >
                  {t("Buttons.Copy Address")}
                </button>
              </CopyToClipboard>
            </div>
          </div>
        </div>
        {/* <!-- Map Wrap Ends here --> */}
      </section>
      <div class="modal bg-blur" id="copy-address">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content minh-unset" data-bs-dismiss="modal">
            <div class="alert-bubble-img">
              <img
                class="img-fluid"
                src="images/alert-msg-bubble.png"
                alt="ico"
              />
              <div class="cont">
                <p className="text-white text-center mt-5">
                  {t("alerts.Address copied successfully")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Content Section Ends here --> */}
    </div>
  );
}
